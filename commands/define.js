const unirest = require('unirest');
const Discord = require('discord.js');

module.exports = {
	name: 'define',
	description: 'Find a definition of a word or phrase on Urban Dictionary',
	args: true,
	usage: '<search term>',
	execute(message, args) {
		message.delete({ timeout: 3500 });
		const req = unirest('GET', 'https://mashape-community-urban-dictionary.p.rapidapi.com/define');

		req.query({
			'term': `${args}`,
		});

		req.headers({
			'x-rapidapi-key': '1778879f8amsh45f8f186bcd2bd3p1ab6d3jsn7e7307f05b44',
			'x-rapidapi-host': 'mashape-community-urban-dictionary.p.rapidapi.com',
			'useQueryString': true,
		});


		req.end(function(res) {
			if (res.error) throw new Error(res.error);
			try {
				const jsonResponse = res.body;
				const jsonEmbed = new Discord.MessageEmbed()
					.setTitle(`Urban Dictionary Search for ${jsonResponse.list[0]['word']}`)
					.setDescription(jsonResponse.list[0]['definition'])
					.addField('Example:', jsonResponse.list[0]['example']);
				message.channel.send(jsonEmbed);
			}
			catch (err) {
				message.channel.send(`Hmmmm... Urban Dictionary doesn't like the word ${args}. Maybe try a different one?`);
			}
		});
	},
};