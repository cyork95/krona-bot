module.exports = {
	name: 'server',
	description: 'Displays server name, total member count, creation data and region.',
	execute(message) {
		message.delete({ timeout: 3500 });
		message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}\nCreation Date: ${message.guild.createdAt}\nCreation Region: ${message.guild.region}`);
	},
};