/* eslint-disable no-unused-vars */
const EconomyModel = require('../database/model/player');

module.exports = {
	name: 'rm-money',
	description: 'Removes money from a user (admin only command) for the economy system.',
	aliases: ['rmm'],
	permissions: ['ADMINISTRATOR'],
	args: true,
	usage: '<@user> <amount>',
	async execute(message, args) {
		const player = message.mentions.members.first();
		const amount = args[1];

		if (isNaN(amount) || amount < 0) return message.channel.send('Please use a number for the amount!');

		const playerProfile = await EconomyModel.findOne({ playerId: player.id }).catch(err => console.log(err));

		if (!playerProfile) return message.channel.send('This member doesn\'t have a profile!');

		const totalMoney = playerProfile.moneyAmount - parseInt(amount);

		if (totalMoney < 0) return message.channel.send('I cant remove this much money because it will put their account into the negatives!');

		await EconomyModel.findOneAndUpdate({ playerId: player.id }, { moneyAmount: totalMoney }).catch(err => console.log(err));

		return message.channel.send(`Removed $${amount.toString()} from ${player}!`);

	},
};