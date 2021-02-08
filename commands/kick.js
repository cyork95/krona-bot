module.exports = {
	name: 'kick',
	description: 'Removes the specified user from the server.',
	args: true,
	guildOnly: true,
	permissions: 'KICK_MEMBERS',
	usage: '<user> <reason>',
	execute(message, args) {
		const user = args[0];
		if (user) {
			const member = message.guild.member(user);
			// If the member is in the guild
			if (member) {
				member.kick({ reason: args[1] }).then(() => {
					// We let the message author know we were able to kick the person
					message.reply(`Successfully kicked ${user.tag} for ${args[1]}`);
				})
					.catch(err => {
						message.reply('I was unable to ban the member. Please ask @CoYoFroYo why this didnt work.');
						console.error(err);
					});
			}
			else {
				// The mentioned user isn't in this server
				message.reply(`${args[0]} isn't in this server!`);
			}
		}
		else {
			// Otherwise, if no user was mentioned
			message.reply('You didn\'t mention the user to ban!');
		}
	},
};