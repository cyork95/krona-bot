/* eslint-disable no-unused-vars */
const EconomyModel = require('../database/model/player');

module.exports = {
	name: 'new-profile',
	description: 'Create a new profile for the economy system.',
	aliases: ['newp'],
	async execute(message) {
		const userProfile = await EconomyModel.findOne({ playerId: message.author.id });

		if (userProfile) return message.channel.send('You already have a profile!');

		message.channel.send('Send a message of the business name you would like to use!');

		const filter = (user) => {
			return user.author.id === message.author.id;
		};

		message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
			.then(collected => {
				const name = collected.first().content;
				const regex = !/[^a-zA-Z0-9 ]+/g.test(name);
				if (!regex) return message.channel.send('Your business name can only contain numbers and letters!');

				const dbEconPlayerModel = new EconomyModel({
					playerId: message.author.id,
					businessName: name,
					moneyAmount: 0,
					inventory: [],
				}).save().then(msg => console.log(msg)).catch(err => console.log(err));

				return message.channel.send(`Your profile has been created with the name, **${name}**`);
			}).catch(() => {
				return message.channel.send('You have out of time. Please try again to create your profile!');
			});
	},
};