const animals = require('random-animals-api');
module.exports = {
	name: 'bunny',
	description: 'Get a random Bunny picture',
	async execute(message) {
		const bunny_image = await animals.bunny();
		message.channel.send(bunny_image);
	},
};