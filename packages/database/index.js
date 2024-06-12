import mongoose from 'mongoose';
import log from '@byte-o-bert/logger';

const logMeta = { origin: import.meta.url };
let db = null;

export const connect = async (origin) => {
	if (db) {
		log.debug(`Already connected to MongoDB [${origin}]`, logMeta);

		return db;
	}

	let attempts = 0;
	while (attempts < 7) {
		try {
			db = await mongoose.connect(process.env.DB_URI);
			log.info(`Connected to MongoDB [${origin}]`, logMeta);

			return db;
		} catch (err) {
			log.error(
				`Error connecting to MongoDB [${origin}]: ${err}`,
				logMeta
			);
			attempts++;

			await new Promise((resolve) => setTimeout(resolve, 5000));
		}
	}
};

mongoose.connection.on('error', (err) => {
	log.error(`Mongoose connection error: ${err}`, logMeta);
});

mongoose.connection.on('disconnected', () => {
	log.warn('Mongoose disconnected from MongoDB', logMeta);
});

mongoose.connection.on('reconnected', () => {
	log.info('Mongoose reconnected to MongoDB', logMeta);
});
