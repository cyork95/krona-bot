const Discord = require('discord.js');

module.exports = {
	name: 'info',
	description: 'Bot Info',
	guildOnly: true,
	execute(message) {
		const serverInfoEmbed = new Discord.MessageEmbed()
			.setTitle('KronaBot')
			.setDescription('General purpose and moderation bot created for CoYo\'s Discord Servers!')
			.setFooter('Created by CoYoFroYo (2021)');
		message.channel.send(serverInfoEmbed);
	},
};