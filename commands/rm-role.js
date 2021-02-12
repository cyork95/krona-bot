module.exports = {
	name: 'rm-role',
	description: 'Removes specified role from the specified user.',
	args: true,
	permissions: 'MANAGE_ROLES_OR_PERMISSIONS',
	usage: '<@user> <role>',
	execute(message, args) {
		const user = message.mentions.users.first();
		const member = message.guild.member(user);
		if (user) {
			const roleChosen = message.guild.roles.cache.find(role => role.name === args[1]);
			if (roleChosen) {
				if (member) {
					member.roles.remove(roleChosen);
					message.reply(`${user} has had the role of ${roleChosen} removed!`);
				}
				else {
					message.reply(`${user} isn't in this server!`);
				}
			}
			else {
				message.reply('You didn\'t give a role that exists!');
			}
		}
		else {
			message.reply(`You didn't mention the user to give the ${args[1]} role to!`);
		}
	},
};

