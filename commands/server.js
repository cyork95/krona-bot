module.exports = {
	name: 'server',
	description: 'Displays server name, total member count, creation data and region.',
	// eslint-disable-next-line no-unused-vars
	execute(message, args) {
		message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}\nCreation Date: ${message.guild.createdAt}\nCreation Region: ${message.guild.region}`);
	},
};