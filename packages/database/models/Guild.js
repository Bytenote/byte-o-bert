import mongoose from 'mongoose';

const GuildSchema = new mongoose.Schema(
	{
		_id: String, // Discord Guild ID
		name: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			required: false,
		},
		prefix: {
			type: String,
			required: true,
			default: '!',
		},
		members: {
			type: Number,
			required: true,
		},
		roles: {
			type: Number,
			required: true,
		},
		tChannels: {
			type: Number,
			required: true,
		},
		vChannels: {
			type: Number,
			required: true,
		},
		commands: {
			type: Map,
			of: {
				_id: false,
				guildId: {
					type: String,
					required: true,
				},
				name: {
					type: String,
					required: true,
				},
				action: {
					type: String,
					required: true,
				},
				author: {
					type: String,
					required: true,
				},
				updatedBy: {
					type: String,
					required: false,
					default: null,
				},
				active: {
					type: Boolean,
					required: true,
					default: true,
				},
				createdAt: {
					type: Date,
					required: true,
					default: Date.now,
				},
				updatedAt: {
					type: Date,
					required: false,
					default: null,
				},
			},
		},
		deletedAt: {
			type: Date,
			required: false,
			default: null,
		},
	},
	{ versionKey: false }
);

GuildSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 }); // delete after 7 days

export default mongoose.model('Guild', GuildSchema);
