const unirest = require('unirest');
const Discord = require('discord.js');

module.exports = {
	name: 'joke',
	description: 'Get a random Joke',
	execute(message) {
		message.delete({ timeout: 3500 });
		const req = unirest('GET', 'https://joke3.p.rapidapi.com/v1/joke');
		req.headers({
			'x-rapidapi-key': '1778879f8amsh45f8f186bcd2bd3p1ab6d3jsn7e7307f05b44',
			'x-rapidapi-host': 'joke3.p.rapidapi.com',
			'useQueryString': true,
		});
		req.end(function(res) {
			if (res.error) throw new Error(res.error);
			const jsonResponse = res.body;
			const jsonEmbed = new Discord.MessageEmbed()
				.setTitle('Random Joke')
				.setDescription(jsonResponse['content']);
			message.channel.send(jsonEmbed);
		});
	},
};