import log from '@byte-o-bert/shared/services/log';
import Settings from '../../database/models/Settings.js';

const logMeta = { origin: import.meta.url };

/**
 * Initializes the settings in the database by creating a
 * default settings document if none exists.
 */
export const initializeSettings = async () => {
	try {
		const settings = await Settings.findOne();

		if (!settings) {
			await Settings.create({});
		}
	} catch (err) {
		log.error(err, logMeta);
	}
};

/**
 * Returns the isPrivate setting from the database.
 *
 * @returns {Promise}
 */
export const getIsPrivateSetting = async () => {
	try {
		const settings = await Settings.findOne({}, { isPrivate: 1 });

		return settings.isPrivate;
	} catch (err) {
		log.error(err, logMeta);

		return true;
	}
};
