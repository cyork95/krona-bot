const levels = require('discord-xp');
const { RANK_CHANNEL } = require('../config.json');

module.exports = {
	name: 'leaderboard',
	description: 'Displays the server leaderboard.',
	async execute(message) {
		const rawLeaderboard = await levels.fetchLeaderboard(message.guild.id, 10);
		if (rawLeaderboard.length < 1) return message.guild.channels.cache.find(i => i.name === 'rank').send('Nobody\'s in leaderboard yet.');
		// We process the leaderboard.
		const leaderboard = await levels.computeLeaderboard(message.client, rawLeaderboard, true);
		// We map the outputs.
		const lb = leaderboard.map(e => `${e.position}. ${e.username}#${e.discriminator}\nLevel: ${e.level}\nXP: ${e.xp.toLocaleString()}`);
		message.guild.channels.cache.find(i => i.name === RANK_CHANNEL).send(`**Leaderboard**:\n\n${lb.join('\n\n')}`);
	},
};