const animals = require('random-animals-api');
module.exports = {
	name: 'lizard',
	description: 'Get a random Lizard picture',
	async execute(message) {
		const lizard_image = await animals.lizard();
		message.channel.send(lizard_image);
	},
};