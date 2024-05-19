import axios from 'axios';
import log from '@byte-o-bert/shared/services/log';
import { DISCORD_API_BASE_URL } from '../utils/constants.js';

const logMeta = { origin: import.meta.url };

/**
 * Returns the user's unique name, as well as
 * their global name.
 * Discord has changed the way usernames are
 * displayed and used:
 * Legacy users have the discriminator
 * appended to their username to create a
 * unique name, while new users have a unique
 * username, in combination with a global name
 * that can be changed at will and is used as a
 * display name.
 *
 * @param {Object} user 				- User object
 * @param {String} user.username 		- Username (unique for new users)
 * @param {String} user.discriminator	- Discriminator (for legacy users)
 * @param {Boolean} user.global_name	- Global name (display name, changeable)
 * @returns {Object}
 */
export const getUserNames = ({ username, discriminator, global_name }) => {
	return {
		uniqueName: global_name ? username : `${username}#${discriminator}`,
		name: global_name ?? username,
	};
};

export const getUsersByIds = async (ids) => {
	const users = [];

	const userPromises = ids.map((id) => _getUserById(id));
	const userResponses = await Promise.all(userPromises);

	for (const res of userResponses) {
		if (_userValidation(res.data)) {
			users.push(_getAdminData(res.data));
		}
	}

	return users;
};

const _getUserById = (id) => {
	try {
		const user = axios.get(`${DISCORD_API_BASE_URL}/users/${id}`, {
			headers: {
				Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
			},
		});

		return user;
	} catch (err) {
		log.error(err, logMeta);

		return null;
	}
};

const _userValidation = (user) => {
	return user?.id && user?.username && user?.global_name;
};

const _getAdminData = ({
	id: _id,
	global_name,
	discriminator,
	username,
	avatar,
}) => {
	const { uniqueName, name } = getUserNames({
		username,
		discriminator,
		global_name,
	});

	return {
		_id,
		uniqueName,
		name,
		avatar,
	};
};
