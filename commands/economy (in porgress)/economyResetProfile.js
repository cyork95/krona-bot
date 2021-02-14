/* eslint-disable no-unused-vars */
const EconomyModel = require('../database/model/player');

module.exports = {
	name: 'reset-profile',
	description: 'Reset your player profile in the economy system.',
	aliases: ['resetp'],
	async execute(message) {
		const userProfile = await EconomyModel.findOne({ playerId: message.author.id });

		if (userProfile === null) return message.channel.send('You don\'t have a profile!');

		const msg = await message.channel.send('Are you sure you want to reset your profile?');
		await msg.react(':white_check_mark:');
		await msg.react(':x:');

		const filter = (reaction, user) => {
			return (reaction.emoji.name === ':white_check_mark:' || reaction.emoji.name === ':x:') && user.id === message.author.id;
		};

		msg.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
			.then(reaction => {
				if (reaction.first().emoji.name === ':white_check_mark:') {
					EconomyModel.deleteOne({ playerId: message.author.id });
					return message.channel.send('Your profile has been reset. If you want to keep playing create a new one!');
				}
				else if (reaction.first().emoji.name === ':x:') {
					return message.channel.send('Your profile has NOT been reset!');
				}
			}).catch(() => {
				return message.channel.send('You have out of time. Your profile has NOT been reset!');
			});
	},
};