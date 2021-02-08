const unirest = require('unirest');
const Discord = require('discord.js');

module.exports = {
	name: 'quote',
	description: 'Get a random Quote',
	execute(message) {
		const req = unirest('GET', 'https://quotes15.p.rapidapi.com/quotes/random/');

		req.query({
			'language_code': 'en',
		});

		req.headers({
			'x-rapidapi-key': '1778879f8amsh45f8f186bcd2bd3p1ab6d3jsn7e7307f05b44',
			'x-rapidapi-host': 'quotes15.p.rapidapi.com',
			'useQueryString': true,
		});


		req.end(function(res) {
			if (res.error) throw new Error(res.error);
			const jsonResponse = res.body;
			const jsonEmbed = new Discord.MessageEmbed()
				.setTitle(`Random Quote from ${jsonResponse['originator']['name']}`)
				.setURL(jsonResponse['url'])
				.setDescription(jsonResponse['content']);
			message.channel.send(jsonEmbed);
		});
	},
};