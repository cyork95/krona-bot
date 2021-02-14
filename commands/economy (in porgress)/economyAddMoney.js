/* eslint-disable no-unused-vars */
const EconomyModel = require('../database/model/player');

module.exports = {
	name: 'add-money',
	description: 'Add money to a user (admin only command) for the economy system.',
	aliases: ['addm'],
	permissions: ['ADMINISTRATOR'],
	args: true,
	usage: '<@user> <amount>',
	async execute(message, args) {
		const player = message.mentions.members.first();
		const amount = args[1];

		if (isNaN(amount) || amount < 0) return message.channel.send('Please use a number for the amount!');

		const playerProfile = await EconomyModel.findOne({ playerId: player.id }).catch(err => console.log(err));
		const totalMoney = playerProfile.moneyAmount + parseInt(amount);

		if (!playerProfile) return message.channel.send('This member doesn\'t have a profile!');

		await EconomyModel.findOneAndUpdate({ playerId: player.id }, { moneyAmount: totalMoney }).catch(err => console.log(err));

		return message.channel.send(`Added $${amount.toString()} to ${player}!`);

	},
};