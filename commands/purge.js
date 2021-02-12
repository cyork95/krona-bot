module.exports = {
	name: 'purge',
	description: 'Purge up to 99 messages in the current channel.',
	permissions: 'MANAGE_ROLES',
	args: true,
	usage: '<number of messages to purge>',
	execute(message, args) {
		const amount = parseInt(args[0]) + 1;
		if (isNaN(amount)) {
			return message.reply('That doesn\'t seem to be a valid number. Please enter a number between 1 and 99.')
				.then(msge => msge.delete({ timeout: 3500 }))
				.catch(err => console.log(err));
		}
		else if (amount <= 1 || amount > 100) {
			return message.reply('You need to input a number between 1 and 99!')
				.then(msge => msge.delete({ timeout: 3500 }))
				.catch(err => console.log(err));
		}
		message.channel.bulkDelete(amount, true).catch(err => {
			console.error(err);
			message.channel.send('There was an error trying to purge messages in this channel! Contact <@CoYoFroYo> to see whats up.')
				.then(msge => msge.delete({ timeout: 3500 }))
				.catch(err => console.log(err));
		});
	},
};