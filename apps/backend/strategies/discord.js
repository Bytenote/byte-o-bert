import passport from 'passport';
import { Strategy as DiscordStrategy } from 'passport-discord';
import config from '@byte-o-bert/config';
import { User } from '@byte-o-bert/database/models';
import { isApplicationOwner } from '@byte-o-bert/shared/services/auth';
import log from '@byte-o-bert/logger';
import { getUserNames } from '@byte-o-bert/shared/services/user';
import { DISCORD_OAUTH_REDIRECT_PARAMS } from '../utils/constants.js';
import { encrypt } from '../utils/helpers.js';

const logMeta = { origin: import.meta.url };

passport.serializeUser((user, done) => {
	return done(null, user._id);
});

passport.deserializeUser(async (_id, done) => {
	try {
		const user = await User.findById(_id, { refreshToken: 0 });

		return done(null, user?._doc ? user._doc : null);
	} catch (err) {
		log.error(err, logMeta);

		return done(err);
	}
});

passport.use(
	new DiscordStrategy(
		{
			clientID: process.env.DISCORD_CLIENT_ID,
			clientSecret: process.env.DISCORD_CLIENT_SECRET,
			callbackURL: DISCORD_OAUTH_REDIRECT_PARAMS,
			scope: config.oauth.scope,
		},
		async (
			accessToken,
			refreshToken,
			{ id: _id, username, discriminator, global_name, avatar, guilds },
			done
		) => {
			try {
				// get uniform user names across legacy and new users
				const { uniqueName, name } = getUserNames({
					username,
					discriminator,
					global_name,
				});

				const user = {
					_id,
					uniqueName,
					name,
					avatar,
					accessToken: encrypt(accessToken),
					refreshToken: encrypt(refreshToken),
					guilds,
					isOwner: isApplicationOwner(_id), // check if user is the application owner (bot owner
					deletedAt: new Date().toISOString(), // used to soft delete users (after TTL)
				};

				// update or create user in db
				const dbUser = await User.findOneAndUpdate({ _id }, user, {
					new: true,
					upsert: true,
				});

				return done(null, dbUser);
			} catch (err) {
				log.error(err, logMeta);

				return done(err);
			}
		}
	)
);
