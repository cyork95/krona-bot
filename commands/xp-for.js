const Levels = require('discord-xp');

module.exports = {
	name: 'xp-for',
	description: 'Displays xp needed for a certian rank.',
	args: true,
	usage: '<level>',
	async execute(message, args) {
		const xpRequired = Levels.xpFor(args[0]);
		message.guild.channels.cache.find(i => i.name === 'rank').send(`The experince required for level ${args[0]} is ${xpRequired}.`);
	},
};