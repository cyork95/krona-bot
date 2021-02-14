const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
	playerId: { type: String, required: true },
	businessName: { type: String },
	moneyAmount: { type: Number },
	inventory: { type: String },
});

// eslint-disable-next-line no-unused-vars
const PlayerModel = module.exports = mongoose.model('player', PlayerSchema);