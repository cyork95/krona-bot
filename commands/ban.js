module.exports = {
	name: 'ban',
	description: 'Removes the specified user from the server.',
	args: true,
	guildOnly: true,
	permissions: 'BAN_MEMBERS',
	usage: '<user> <reason>',
	execute(message, args) {
		const user = args[0];
		if (user) {
			const member = message.guild.member(user);
			// If the member is in the guild
			if (member) {
				/**
               * Ban the member
               * Make sure you run this on a member, not a user!
               * There are big differences between a user and a member
               * Read more about what ban options there are over at
               * https://discord.js.org/#/docs/main/master/class/GuildMember?scrollTo=ban
               */
				member.ban({ reason: args[1] }).then(() => {
					// We let the message author know we were able to ban the person
					message.reply(`Successfully banned ${user.tag} for ${args[1]}`);
				})
					.catch(err => {
						message.reply('I was unable to ban the member. Please ask @CoYoFroYo why this didnt work.');
						console.error(err);
					});
			}
			else {
				// The mentioned user isn't in this guild
				message.reply(`${args[0]} isn't in this server!`);
			}
		}
		else {
			// Otherwise, if no user was mentioned
			message.reply('You didn\'t mention the user to ban!');
		}
	},
};