const { WELCOME_CHANNEL } = require('../config.json');

module.exports = {
	name: 'bugreport',
	aliases: ['bug', 'reportbug'],
	description: 'let users report bugs',
	args: true,
	usage: '<bug details>',
	cooldown: 5,
	async execute(message, args, client, Discord) {
		const channel = client.channels.cache.get(WELCOME_CHANNEL);

		// look if there is a bug specified
		const query = args.join(' ');
		if(!query) return message.reply('Please specify the bug');

		// create an embed for the bug report
		const reportEmbed = new Discord.MessageEmbed()
			.setTitle('New Bug! <@CoYoFroYo#1132>')
			.addField('Author', message.author.toString(), true)
			.addField('Guild', message.guild.name, true)
			.addField('Report', query)
			.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
			.setTimestamp();
		channel.send(reportEmbed);
		// send the embed to the channel
		message.channel.send('**Bug report has been sent!**');
	},
};