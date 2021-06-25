const animals = require('random-animals-api');
module.exports = {
	name: 'koala',
	description: 'Get a random Koala picture',
	async execute(message) {
		const koala_image = await animals.koala();
		message.channel.send(koala_image);
	},
};