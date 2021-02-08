module.exports = {
	name: 'hug',
	description: 'Hug Member',
	args: true,
	guildOnly: true,
	usage: '<user>',
	execute(message, args) {
		const user = args[0];
		if (user) {
			const member = message.guild.member(user);
			if (member) {
				message.channel.send(`${user.tag} has been hugged by ${message.author.username}`);
			}
			else {
				// The mentioned user isn't in this server
				message.reply(`${args[0]} isn't in this server!`);
			}
		}
		else {
			// Otherwise, if no user was mentioned
			message.reply('You didn\'t mention the user to hug!');
		}
	},
};