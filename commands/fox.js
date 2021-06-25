const animals = require('random-animals-api');
module.exports = {
	name: 'fox',
	description: 'Get a random Fox picture',
	async execute(message) {
		const fox_image = await animals.fox();
		message.channel.send(fox_image);
	},
};