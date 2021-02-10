/* eslint-disable no-unused-vars */
const { MessageCollector } = require('discord.js');

const msgCollectorFilter = (newMsg, originalMsg) => {
	const { cache } = originalMsg.guild.emojis;
	if(newMsg.author.id !== originalMsg.author.id) return false;
	const [emojiName, roleName] = originalMsg.content.split(/,\s+/);
	if (!emojiName && !roleName) return false;
	const emojiMsg = cache.find(emoji => emoji.name.toLowerCase() === emojiName.toLowerCase());
	if(!emojiMsg) {
		originalMsg.channel.send('Emoji does not exist. Try again!')
			.then(msg => msg.delete({ timeout: 3500 }))
			.catch(err => console.log(err));
		return false;
	}
	const roleMsg = originalMsg.guild.roles.cache.find(role => role.name.toLowerCase() === roleName.toLowerCase());
	if(!roleMsg) {
		originalMsg.channel.send('Role does not exist. Try again!')
			.then(msg => msg.delete({ timeout: 3500 }))
			.catch(err => console.log(err));
		return false;
	}
	return true;
};

module.exports = {
	name: 'add-rr',
	description: 'Enables a message to listen to reactions to give roles.',
	args: true,
	permissions: 'MANAGE_ROLES_OR_PERMISSIONS',
	usage: '<message id>',
	async execute(message, args) {
		try {
			const fetchedMessage = await message.channel.messages.fetch(args[0]);
			if(fetchedMessage) {
				await message.channel.send('Please provide all of the emoji names with the role name, one by one, seperated by a comma. \ne.g <emoji, role_name>');
				const collector = new MessageCollector(message.channel, msgCollectorFilter.bind(null, message));
				collector.on('collect', msg => {
					const { cache } = msg.guild.emojis;
					const [emojiName, roleName] = msg.content.split(/,\s+/);
					const emojiMsg = cache.find(emoji => emoji.name.toLowerCase() === emojiName.toLowerCase());
					const roleMsg = msg.guild.roles.cache.find(role => role.name.toLowerCase() === roleName.toLowerCase());
					if (emojiMsg && roleMsg) {
						fetchedMessage.react(emojiMsg)
							.then(emoji => console.log('Reacted'))
							.catch(err => console.log(err));
					}
				});
			}
		}
		catch(err) {
			const msg = await message.channel.send('Invalid ID! Message was not found!');
			await msg.delete({ timeout: 3500 }).catch(err => console.log(err));
		}
	},
};

