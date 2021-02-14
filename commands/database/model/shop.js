const mongoose = require('mongoose');

const ShopSchema = new mongoose.Schema({
	name: { type: String, required: true },
	cost: { type: Number },
	description: { type: String },
	type: { type: String },
});

// eslint-disable-next-line no-unused-vars
const ShopModel = module.exports = mongoose.model('shop', ShopSchema);