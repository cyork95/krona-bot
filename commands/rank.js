const Levels = require('discord-xp');

module.exports = {
	name: 'rank',
	description: 'Displays user server rank.',
	async execute(message) {
		// Grab the target.
		const target = message.mentions.users.first() || message.author;
		// Selects the target from the database.
		const user = await Levels.fetch(target.id, message.guild.id);
		// If there isnt such user in the database, we send a message in general.
		if (!user) return message.guild.channels.cache.find(i => i.name === 'rank').send('Seems like this user has not earned any xp so far.');
		// We show the level.
		message.guild.channels.cache.find(i => i.name === 'rank').send(`> **${target.tag}** is currently level ${user.level}.`);
	},
};