const weather = require('weather-js');

const Discord = require('discord.js');

module.exports = {
	name: 'weather',
	description: 'Search for the weather by giving a country or city and then F for farenheit or C for celsius.',
	aliases: ['wthr'],
	args: true,
	usage: ' <country/city> <F or C>',
	async execute(message, args) {

		weather.find({ search: args.join(' '), degreeType: `${args[1]}` }, function(error, result) {
			// 'C' can be changed to 'F' for farneheit results
			if(error) return message.channel.send(error);
			if(!args[0]) return message.channel.send('Please specify a location');

			if(result === undefined || result.length === 0) return message.channel.send('**Invalid** location');

			const current = result[0].current;
			const location = result[0].location;
			const weatherinfo = new Discord.MessageEmbed()
				.setDescription(`**${current.skytext}**`)
				.setAuthor(`Weather forecast for ${current.observationpoint}`)
				.setThumbnail(current.imageUrl)
				.setColor(0x111111)
				.addField('Timezone', `UTC${location.timezone}`, true)
				.addField('Degree Type', 'Celsius', true)
				.addField('Temperature', `${current.temperature}°`, true)
				.addField('Wind', current.winddisplay, true)
				.addField('Feels like', `${current.feelslike}°`, true)
				.addField('Humidity', `${current.humidity}%`, true);
			message.channel.send(weatherinfo);
		});
	},
};