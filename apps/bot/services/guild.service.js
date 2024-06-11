/**
 * Get the count of text and voice channels
 * for the given guild.
 *
 * @param {Object} channels - Channels of a guild
 * @returns {Object}
 */
export const getChannelCountPerType = (channels) => {
	const gChannels = {
		vChannels: 0,
		tChannels: 0,
	};

	// channels.cache is a Map; can't use array methods
	channels.cache.forEach((channel) => {
		if (channel.type === 0) {
			gChannels.tChannels += 1;
		} else if (channel.type === 2) {
			gChannels.vChannels += 1;
		}
	});

	return gChannels;
};
