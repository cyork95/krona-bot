const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
	messageId: { type: String, required: true },
	emojiRoleMappings: { type: mongoose.Schema.Types.Mixed },
});

// eslint-disable-next-line no-unused-vars
const MessageModel = module.exports = mongoose.model('message', MessageSchema);