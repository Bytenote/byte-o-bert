import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema(
	{
		isPrivate: {
			type: Boolean,
			default: true,
		},
	},
	{ versionKey: false }
);

export default mongoose.model('Settings', SettingsSchema);
