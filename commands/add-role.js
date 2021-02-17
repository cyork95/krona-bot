module.exports = {
	name: 'add-role',
	description: 'Adds specified role tp the specified user.',
	aliases: ['ar', 'add'],
	args: true,
	permissions: 'MANAGE_ROLES_OR_PERMISSIONS',
	usage: '<@user> <role>',
	execute(message, args) {
		const user = message.mentions.users.first();
		const member = message.guild.member(user);
		message.delete({ timeout: 3500 });
		if (user) {
			const roleChosen = message.guild.roles.cache.find(role => role.name === args[1]);
			if (roleChosen) {
				if (member) {
					member.roles.add(roleChosen);
					message.channel.send(`${user} has had the role of ${roleChosen} added!`);
				}
				else {
					message.channel.send(`${user} isn't in this server!`);
				}
			}
			else {
				message.channel.send('You didn\'t give a role that exists!');
			}
		}
		else {
			message.channel.send(`You didn't mention the user to give the ${args[1]} role to!`);
		}
	},
};

