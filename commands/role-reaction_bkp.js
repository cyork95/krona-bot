const { MessageCollector } = require('discord.js');
const { prefix } = require('../config.json');

const MessageModel = require('./database/model/message');

const msgCollectorFilter = (newMsg, originalMsg) => newMsg.author.id === originalMsg.author.id;

module.exports = {
	name: 'add-rr',
	description: 'Sets up a reaction post.',
	args: true,
	permissions: 'MANAGE_ROLES_OR_PERMISSIONS',
	usage: '<message id>',
	async execute(message, args) {
		try {
			const fetchedMessage = await message.channel.messages.fetch(args[0]);
			if(fetchedMessage) {
				await message.channel.send('Please provide all of the emoji names with the role name, one by one, seperated by a comma. \ne.g <emoji, role_name>');
				const collector = new MessageCollector(message.channel, msgCollectorFilter.bind(null, message));
				const emojiRoleMappings = new Map();
				collector.on('collect', msg => {
					const { cache } = msg.guild.emojis;
					if (msg.content.toLowerCase() === `${prefix}done`) {
						collector.stop('done command was issued');
						return;
					}
					const [emojiName, roleName] = msg.content.split(/,\s+/);
					if (!emojiName && !roleName) return;
					const emojiMsg = cache.find(emoji => emoji.name.toLowerCase() === emojiName.toLowerCase());
					if(!emojiMsg) {
						msg.channel.send('Emoji does not exist. Try again!')
							.then(msge => msge.delete({ timeout: 3500 }))
							.catch(err => console.log(err));
						return;
					}
					const roleMsg = msg.guild.roles.cache.find(role => role.name.toLowerCase() === roleName.toLowerCase());
					if(!roleMsg) {
						msg.channel.send('Role does not exist. Try again!')
							.then(msge => msge.delete({ timeout: 3500 }))
							.catch(err => console.log(err));
						return;
					}
					fetchedMessage.react(emojiMsg)
						.then(emoji => console.log(emoji))
						.catch(err => console.log(err));
					emojiRoleMappings.set(emojiMsg.id, roleMsg.id);
				});
				collector.on('end', async () => {
					const findMsgDocument = await MessageModel.findOne({ messageId: fetchedMessage.id }).catch(err => console.log(err));
					if(findMsgDocument) {
						console.log('The message exists. Don\'t save.');
						message.channel.send('A role reaction already set up for that message.');
					}
					else {
						// eslint-disable-next-line no-unused-vars
						const dbMsgModel = new MessageModel({
							messageId: fetchedMessage.id,
							emojiRoleMappings: emojiRoleMappings,
						}).save().then(msg => console.log(msg)).catch(err => console.log(err));
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

