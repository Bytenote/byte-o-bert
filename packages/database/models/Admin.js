import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema(
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
	},
	{ versionKey: false }
);

export default mongoose.model('Admin', AdminSchema);
