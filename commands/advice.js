const unirest = require('unirest');
const Discord = require('discord.js');
module.exports = {
	name: 'advice',
	description: 'Get random advice',
	async execute(message) {
		const req = unirest('GET', 'https://api.adviceslip.com/advice');
		req.end(function(res) {
			if (res.error) throw new Error(res.error);
			const jsonResponse = JSON.parse(res.body);
			const jsonEmbed = new Discord.MessageEmbed()
				.setTitle('Helpful Advice')
				.setFooter('Brought to you with love by Krona <3');
			jsonEmbed.addField(`Tip Number: ${jsonResponse.slip.id}`, `${jsonResponse.slip.advice}`);
			message.channel.send(jsonEmbed);
		});
	},
};