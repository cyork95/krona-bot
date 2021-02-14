const levels = require('discord-xp');
const { RANK_CHANNEL } = require('../config.json');

module.exports = {
	name: 'rank',
	description: 'Displays user server rank.',
	async execute(message) {
		const target = message.mentions.users.first() || message.author;
		const user = await levels.fetch(target.id, message.guild.id);
		if (!user) return message.guild.channels.cache.find(i => i.name === 'rank').send('Seems like this user has not earned any xp so far.');
		message.guild.channels.cache.find(i => i.name === RANK_CHANNEL).send(`> **${target.tag}** is currently level ${user.level}.`);
	},
};