const animals = require('random-animals-api');
module.exports = {
	name: 'shiba',
	description: 'Get a random Shiba picture',
	async execute(message) {
		const shiba_image = await animals.shiba();
		message.channel.send(shiba_image);
	},
};