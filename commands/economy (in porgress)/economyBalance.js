/* eslint-disable no-unused-vars */
const EconomyModel = require('../database/model/player');

module.exports = {
	name: 'balance',
	description: 'See how much money you have for the economy system.',
	aliases: ['bal'],
	async execute(message, args) {
		const playerProfile = await EconomyModel.findOne({ playerId: message.author.id });

		if (!playerProfile) return message.channel.send('This member doesn\'t have a profile!');

		return message.channel.send(`Your current account balance is: $${playerProfile.moneyAmount.toString()}!`);

	},
};