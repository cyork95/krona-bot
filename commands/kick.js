module.exports = {
	name: 'kick',
	description: 'Kicks the specified user from the server (they are allowed to come back with invites).',
	args: true,
	guildOnly: true,
	permissions: 'KICK_MEMBERS',
	usage: '<@user> <reason>',
	execute(message, args) {
		const user = message.mentions.users.first();
		const reason = args.slice(1).join(' ');
		const member = message.guild.member(user);
		message.delete({ timeout: 3500 });
		if (member) {
			const memberToKick = message.guild.members.cache.get(member.id);
			memberToKick.kick({ reason: reason }).then(() => {
				message.reply(`Successfully kicked ${user} for ${reason}!`);
			})
				.catch(err => {
					message.reply('I was unable to kick the member. Please ask <@CoYoFroYo> why this didnt work.');
					console.error(err);
				});
		}
		else {
			message.reply(`${user} isn't in this server or can't be kicked!`);
		}
	},
};