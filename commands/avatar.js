module.exports = {
	name: 'avatar',
	description: 'Get the Discord Avatar URL your own avatar.',
	execute(message) {
		message.delete({ timeout: 3500 });
		if (!message.mentions.users.size) {
			return message.channel.send(`Your avatar: ${message.author.displayAvatarURL({ dynamic: true })}`);
		}
		const avatarList = message.mentions.users.map(user => {
			return `${user.username}'s avatar: ${user.displayAvatarURL({ dynamic: true })}`;
		});
		message.channel.send(avatarList);
	},
};