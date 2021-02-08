const unirest = require('unirest');
const Discord = require('discord.js');

module.exports = {
	name: 'define',
	description: 'Find a definition on Urban Dictionary',
	args: true,
	usage: '<search term>',
	execute(message, args) {
		const req = unirest('GET', 'https://mashape-community-urban-dictionary.p.rapidapi.com/define');

		req.query({
			'term': `${args[0]}`,
		});

		req.headers({
			'x-rapidapi-key': '1778879f8amsh45f8f186bcd2bd3p1ab6d3jsn7e7307f05b44',
			'x-rapidapi-host': 'mashape-community-urban-dictionary.p.rapidapi.com',
			'useQueryString': true,
		});


		req.end(function(res) {
			if (res.error) throw new Error(res.error);
			const jsonResponse = res.body;
			const jsonEmbed = new Discord.MessageEmbed()
				.setTitle(`Urban Dictionary Search for ${jsonResponse.list[0]['word']}`)
				.setURL(jsonResponse.list[0]['permalink'])
				.setDescription(jsonResponse.list[0]['definition'])
				.addField('Example:', jsonResponse.list[0]['example']);
			message.channel.send(jsonEmbed);
		});
	},
};