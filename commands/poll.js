const Discord = require('discord.js');

module.exports = {
	name: 'poll',
	description: 'Create a poll with reacts.',
	args: true,
	usage: '<time in seconds(s) or minutes (m) exp. 30s> <question>',
	async execute(message, args) {
		let time = args[0];
		const question = args.slice(1).join(' ');
		const regex = new RegExp(/^([0-9]{2}|[0-9]{1})[sSmM]$/);
		message.delete({ timeout: 3500 });
		if(regex.test(time)) {
			if (time.toLowerCase().endsWith('s')) {
				time = parseInt(time.substring(0, time.indexOf('s')));
				time *= 1000;
			}
			else if (time.toLowerCase().endsWith('m')) {
				time = parseInt(time.substring(0, time.indexOf('m')));
				time *= 60 * 1000;
			}
			const jsonEmbed = new Discord.MessageEmbed()
				.setTitle(question)
				.setDescription('React with 👍 or 👎 !')
				.setTimestamp();
			try {
				const polls = new Map();
				const userVotes = new Map();
				const filter = (reaction, user) => {
					if(user.bot) return false;
					if(['👍', '👎'].includes(reaction.emoji.name)) {
						if(polls.get(reaction.message.id).get(user.id)) {
							return false;
						}
						else {
							userVotes.set(user.id, reaction.emoji.name);
							return true;
						}
					}
				};
				const msg = await message.channel.send(jsonEmbed);
				await msg.react('👍');
				await msg.react('👎');
				polls.set(msg.id, userVotes);
				const reactions = await msg.awaitReactions(filter, { time: time });
				const thumbsUp = reactions.get('👍');
				const thumbsDown = reactions.get('👎');
				let thumbsUpResults = 0;
				let thumbsDownResults = 0;
				if (thumbsUp) {
					// eslint-disable-next-line no-unused-vars
					thumbsUpResults = thumbsUp.users.cache.filter(u => !u.bot).size;
				}
				if (thumbsDown) {
					// eslint-disable-next-line no-unused-vars
					thumbsDownResults = thumbsDown.users.cache.filter(u => !u.bot).size;
				}
				msg.delete({ timeout: 200 });
				const resultsEmbed = new Discord.MessageEmbed()
					.setTitle(`Results of '${question}' :`)
					.setDescription(`👍 - ${thumbsUpResults} votes.\n\n 👎 - ${thumbsDownResults} votes.`);
				await message.channel.send(resultsEmbed);
			}
			catch(err) {
				console.log(err);
			}
		}
	},
};