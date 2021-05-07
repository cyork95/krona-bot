const Discord = require('discord.js');


module.exports = {
	name: 'spotifysearch',
	description: 'Searches the Spotify API for a song name.',

	async run(client, message, args) {
		const msglink = args.join('%20');
		const msg = args.join(' ');

		if(!args[0]) return message.channel.send('Please give me a song name to search');

		const embed = new Discord.MessageEmbed()
			.setColor('GREEN')
			.setDescription(`[${msg}](https://open.spotify.com/search/${msglink})`);
		message.channel.send(embed);
	},
};