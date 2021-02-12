module.exports = {
	name: 'ban',
	description: 'Bans the specified user from the server! (they need to be unbanned to be invited back).',
	args: true,
	guildOnly: true,
	permissions: 'BAN_MEMBERS',
	usage: '<@user> <reason>',
	execute(message, args) {
		const user = message.mentions.users.first();
		const reason = args.slice(1).join(' ');
		const member = message.guild.member(user);
		message.delete({ timeout: 3500 });
		if (member) {
			const memberToKick = message.guild.members.cache.get(member.id);
			memberToKick.kick({ reason: reason }).then(() => {
				message.reply(`Successfully banned ${user} for ${reason}!`);
			})
				.catch(err => {
					message.reply('I was unable to ban the member. Please ask <@CoYoFroYo> why this didnt work.');
					console.error(err);
				});
		}
		else {
			message.reply(`${user} isn't in this server or can't be banned!`);
		}
	},
};