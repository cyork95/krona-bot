/* eslint-disable no-unused-vars */
const ShopModel = require('../database/model/player');
const Discord = require('discord.js');

module.exports = {
	name: 'buy',
	description: 'Buy something in the economy system shop.',
	cooldown: 600,
	async execute(message) {
		const listOfItems = [];
		// return message.channel.send(`Your current account balance is: $${playerProfile.moneyAmount.toString()}!`);

	},
};

const shopItems = function(listOfItems) {
	// const playerProfile = await EconomyModel.findOne({ playerId: message.author.id });
};