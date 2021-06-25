const animals = require('random-animals-api');
module.exports = {
	name: 'duck',
	description: 'Get a random Duck picture',
	async execute(message) {
		const duck_image = await animals.duck();
		message.channel.send(duck_image);
	},
};