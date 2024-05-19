import path from 'path';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import session from 'express-session';
import Store from 'connect-mongo';
import passport from 'passport';
import { expressMiddleware } from '@apollo/server/express4';

import { connect } from '@byte-o-bert/database';
import log from '@byte-o-bert/shared/services/log';
import { getDirnameEnv } from '@byte-o-bert/shared/utils/helpers';
import { is_prod } from '@byte-o-bert/shared/utils/utils';
import apolloServer from './graphql/index.js';
import routes from './routes/index.js';
import { initializeSettings } from './services/settings.service.js';
import './strategies/discord.js';
import {
	HAS_PROXY,
	MAX_COOKIE_AGE,
	PORT,
	SESSION_NAME,
	VITE_PORT,
} from './utils/constants.js';

const logMeta = { origin: import.meta.url };

// start servers and connect to database
await connect('Express-Server');
await initializeSettings();
const app = express();
await apolloServer.start();

// parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// security middleware
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			scriptSrc: [
				"'self'",
				"'unsafe-inline'",
				...(!is_prod
					? ['https://embeddable-sandbox.cdn.apollographql.com'] // make apollo sandbox available in dev
					: []),
			],
			frameSrc: [
				"'self'",
				...(!is_prod
					? ['https://sandbox.embed.apollographql.com/'] // make apollo sandbox available in dev
					: []),
			],
			'img-src': ["'self'", 'data:', 'https://cdn.discordapp.com'],
		},
	})
);
if (is_prod && !HAS_PROXY) {
	app.use(
		express.static(
			path.join(getDirnameEnv(import.meta.url), '..', 'frontend', 'html')
		)
	);
} else {
	app.use(
		cors({
			origin: [
				`http://localhost:${PORT}`,
				`http://localhost:${VITE_PORT}`, // frontend dev server
				`http://127.0.0.1:${VITE_PORT}`, // frontend dev server
				'https://studio.apollographql.com', // optional, can be removed if not used
			],
			credentials: true,
		})
	);
}

// session middleware
if (is_prod && HAS_PROXY) {
	app.set('trust proxy', 1); // trust first proxy
}
app.use(
	session({
		name: SESSION_NAME,
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: {
			secure: is_prod,
			maxAge: MAX_COOKIE_AGE,
		},
		store: Store.create({
			mongoUrl: process.env.DB_URI,
			crypto: {
				secret: process.env.SESSION_STORE_SECRET,
			},
		}),
	})
);

// authentication middleware
app.use(passport.initialize());
app.use(passport.session());

// routes (API auth & GraphQL entry)
app.use(
	'/graphql',
	expressMiddleware(apolloServer, {
		context: async ({ req, res }) => ({ req, res, user: req.user }),
	})
);
app.use('/', routes);

app.listen(PORT, () => {
	log.info(`Express server running at http://localhost:${PORT}`, logMeta);
	log.info(`GraphQL accessible at http://localhost:${PORT}/graphql`, logMeta);
});
