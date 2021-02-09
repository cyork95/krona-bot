module.exports = {
	name: 'ping',
	description: 'Ping!',
	cooldown: 5,
	execute(message) {
		message.channel.send(`Pong 🏓. Latency is ${Date.now() - message.createdTimestamp}ms.`);
	},
};