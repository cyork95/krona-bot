module.exports = {
	name: 'ping',
	description: 'Retrieve bot latency.',
	cooldown: 5,
	execute(message) {
		message.delete({ timeout: 3500 });
		message.channel.send(`Pong 🏓. Latency is ${Date.now() - message.createdTimestamp}ms.`);
	},
};