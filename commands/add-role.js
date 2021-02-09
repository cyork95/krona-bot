module.exports = {
	name: 'add-role',
	description: 'Adds specified role to the specified user.',
	args: true,
	permissions: 'ADD_ROLE',
	usage: '<user> <role>',
	execute(message, args) {
		const user = args[0];
		if (user) {
			const roleChosen = message.guild.roles.cache.find(role => role.name === args[1]);
			if (roleChosen) {
				const member = message.guild.member(user);
				if (member) {
					message.member.addRole(roleChosen);
				}
				else {
					message.reply(`${args[0]} isn't in this server!`);
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

