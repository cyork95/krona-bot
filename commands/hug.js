module.exports = {
	name: 'hug',
	description: 'Hug Member',
	args: true,
	guildOnly: true,
	usage: '<@user>',
	execute(message) {
		const user = message.mentions.users.first();
		const member = message.guild.member(user);
		message.delete({ timeout: 3500 });
		if (member) {
			message.channel.send(`:hugging: ${user} :hugging: has been hugged by ${message.author.username}!`);
		}
		else {
			message.reply(`${user} isn't in this server!`);
		}
	},
};