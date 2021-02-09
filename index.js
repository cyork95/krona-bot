// require nodes file system module
const fs = require('fs');
const Discord = require('discord.js');
const { prefix, token, mongodbURL } = require('./config.json');

const Levels = require('discord-xp');
Levels.setURL(mongodbURL);

// create a new Discord client
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	console.log('Ready!');
});

client.on('guildMemberAdd', (member) => {
	console.log(`New User ${member.user.username} has joined ${member.guild.name}!`);
	member.guild.channels.find(c => c.name === 'welcome').send(`${member.user.username} has joined this server! Lets give them a proper welcome!\n Since you are here I would like give you a nice rundown on some important information! Please try to complete each step:\n 1. Please read the rules in #rules and react so that we know you understand\n 2.Please add an introduction if you like to in the #introductions channel.\n 3. Please add your gamertag to #gamertags as well!\n 4. We have many fun roles you are welcome to look over in the #roles channel.\n 5. The #news channel contains a lot of neat knowledge for you as well.\n 6. A director will be with you shortly to get you settled into the server!`);
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type === 'dm') {
		return message.reply('I can\'t execute that command inside DMs!');
	}

	if (command.permissions) {
		const authorPerms = message.channel.permissionsFor(message.author);
		if (!authorPerms || !authorPerms.has(command.permissions)) {
			return message.reply('You can not do this!');
		}
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.on('message', async (message) => {
	if (!message.guild) return;
	if (message.author.bot) return;
	// Min 1, Max 30
	const randomAmountOfXp = Math.floor(Math.random() * 29) + 1;
	const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
	if (hasLeveledUp) {
		const user = await Levels.fetch(message.author.id, message.guild.id);
		message.guild.channels.cache.find(i => i.name === 'rank').send(`${message.author}, congratulations! You have leveled up to **${user.level}**. :tada:`);
	}
});

client.on('channelCreate', function(channel) {
	console.log(`Channel Created: ${channel}`);
});

client.on('channelDelete', function(channel) {
	console.log(`Channel Deleted: ${channel}`);
});

client.on('channelPinsUpdate', function(channel, time) {
	console.log(`Channel Pins Update: ${channel}:${time}`);
});

client.on('channelUpdate', function(oldChannel, newChannel) {
	console.log(`${oldChannel} to ${newChannel} channelUpdate -> a channel is updated - e.g. name change, topic change`);
});

client.on('clientUserGuildSettingsUpdate', function(clientUserGuildSettings) {
	console.log(`${clientUserGuildSettings} clientUserGuildSettingsUpdate -> client user\'s settings update`);
});

client.on(newFunction(), function(clientUserSettings) {
	console.log(`${clientUserSettings} clientUserSettingsUpdate -> client user's settings update`);
});

client.on('emojiCreate', function(emoji) {
	console.log(`${emoji} a custom emoji is created in a guild`);
});

client.on('emojiDelete', function(emoji) {
	console.log(`${emoji} a custom guild emoji is deleted`);
});

client.on('emojiUpdate', function(oldEmoji, newEmoji) {
	console.log(`${oldEmoji} to ${newEmoji} a custom guild emoji is updated`);
});

client.on('guildBanAdd', function(guild, user) {
	console.log(`${user} is banned from ${guild}`);
});

client.on('guildBanRemove', function(guild, user) {
	console.log(`${user} is unbanned from ${guild}`);
});

client.on('guildMemberUpdate', function(oldMember, newMember) {
	console.error(`${oldMember} member changes to ${newMember} - i.e. new role, removed role, nickname.`);
});

client.on('messageDelete', function(message) {
	console.log(`message is deleted -> ${message}`);
});

client.on('messageDeleteBulk', function(messages) {
	console.log(`messages are deleted -> ${messages}`);
});

client.on('roleDelete', function(role) {
	console.error(`${role} is deleted`);
});

client.on('roleUpdate', function(oldRole, newRole) {
	console.error(`${oldRole} is updated to ${newRole}`);
});


// login to Discord with your app's token
client.login(token);

function newFunction() {
	return 'clientUserSettingsUpdate';
}
