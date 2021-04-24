const Discord = require('discord.js');

module.exports = {
	name: 'info',
	description: 'Retrieve general bot info.',
	guildOnly: true,
	execute(message) {
		message.delete({ timeout: 3500 });
		const serverInfoEmbed = new Discord.MessageEmbed()
			.setTitle('KronaBot')
			.setDescription('General purpose and moderation bot created for CoYo\'s Discord Servers!')
			.setFooter('Created by CoYoFroYo (2021)');
		message.channel.send(serverInfoEmbed);
	},
};