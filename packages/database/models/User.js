import mongoose from 'mongoose';

// Guild Schema for embedded documents
const GuildSchema = new mongoose.Schema(
	{
		id: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		icon: {
			type: String,
			required: false,
			default: null,
		},
		owner: {
			type: Boolean,
			default: false,
		},
		permissions: {
			type: Number,
			default: 0,
		},
		permissions_new: {
			type: String,
			default: '',
		},
	},
	{ _id: false }
);

// User Schema
const UserSchema = new mongoose.Schema(
	{
		_id: String, // Discord User ID
		uniqueName: {
			// discord global_name ? discord username : discord username#discriminator
			type: String,
			required: true,
		},
		name: {
			// discord global_name ?? discord username
			type: String,
			required: true,
		},
		avatar: {
			type: String,
			default: null,
		},
		accessToken: {
			type: String,
			default: null,
		},
		refreshToken: {
			type: String,
			default: null,
		},
		guilds: [GuildSchema],
		isOwner: {
			type: Boolean,
			default: false,
		},
		deletedAt: {
			type: Date,
			default: null,
		},
	},
	{ versionKey: false }
);

UserSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 }); // delete after 30 days

export default mongoose.model('User', UserSchema);
