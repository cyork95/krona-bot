module.exports = {
	name: 'say',
	description: 'Have the bot say something.',
	cooldown: 5,
	args: true,
	usage: '<what to say>',
	execute(message, args) {
		message.delete({ timeout: 20 });
		const sentence = args.slice(0).join(' ');
		message.channel.send(`${sentence}`);
	},
};