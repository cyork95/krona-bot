const animals = require('random-animals-api');
module.exports = {
	name: 'panda',
	description: 'Get a random Panda picture',
	async execute(message) {
		const panda_image = await animals.panda();
		message.channel.send(panda_image);
	},
};