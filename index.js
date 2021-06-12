const { prefix, token, mongodbURL_RANK, INTRO_CHANNEL, RULE_CHANNEL, GAMERTAG_CHANNEL, ROLE_CHANNEL, NEWS_CHANNEL, WELCOME_CHANNEL, RANK_CHANNEL, COMMAND_CHANNEL, TRAP_PRIME } = require('./config.json');

const fs = require('fs');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.commands = new Discord.Collection();
client.streams = new Discord.Collection();


const levels = require('discord-xp');
levels.setURL(mongodbURL_RANK);

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

const cooldowns = new Discord.Collection();

function presence() {
	const status = ['my bot life', 'with the secret data', 'with the admin commands', 'with the roles', 'some tunes in voice chat', 'warframe with ordis'];
	const rstatus = Math.floor(Math.random() * status.length);
	client.user.setPresence({
		status: 'online',
		activity: {
			name: `${status[rstatus]}`,
		},
	});
}
setInterval(presence, 30000);


client.once('ready', async () => {
	console.log('Krona is Ready!');
});

client.on('guildMemberAdd', guildMember => {
	console.log(`New User ${guildMember.user.username} has joined ${guildMember.guild.name}!`);
	const ruleChannel = guildMember.guild.channels.cache.find(channel => channel.name === `${RULE_CHANNEL}`);
	const introChannel = guildMember.guild.channels.cache.find(channel => channel.name === `${INTRO_CHANNEL}`);
	const gamertagChannel = guildMember.guild.channels.cache.find(channel => channel.name === `${GAMERTAG_CHANNEL}`);
	const roleChannel = guildMember.guild.channels.cache.find(channel => channel.name === `${ROLE_CHANNEL}`);
	const newsChannel = guildMember.guild.channels.cache.find(channel => channel.name === `${NEWS_CHANNEL}`);
	const botCommandChannel = guildMember.guild.channels.cache.find(channel => channel.name === `${COMMAND_CHANNEL}`);
	const jsonEmbed = new Discord.MessageEmbed()
		.setTitle(`Welcome ${guildMember.user.username}!!!`)
		.setDescription(`Lets give them a proper welcome eveyone!\nSince you are new around here I would like give you a nice rundown on some important information!\n We have a Warframe Bot (Orokin Bot) and a General Purpose Bot (Myself!) you can find the commands in the ${botCommandChannel} channel!\n We also have some build guides in the build guide section! We are alwasys adding more builds and you have some builds to show off just DM @CoYoFroYo. \n We also have some Warframe guides and neat info in the guide section.\n Please try to complete each below task, it will make this bots circuitry spark! :heart: `)
		.addFields(
			{ name: 'Task 1: ', value: `Please read the rules in ${ruleChannel}!` },
			{ name: 'Task 2: ', value: `Please add an introduction, if you like, to in the ${introChannel} channel!` },
			{ name: 'Task 3: ', value: `Please add your gamertags to ${gamertagChannel} as well!` },
			{ name: 'Task 4: ', value: `We have many fun roles you are welcome to look over in the ${roleChannel} channel.` },
			{ name: 'Task 5: ', value: `The ${newsChannel} channel contains a lot of neat knowledge for you as well.` },
		);
	guildMember.guild.channels.cache.find(c => c.name === `${WELCOME_CHANNEL}`).send(jsonEmbed);
});

client.on('message', message => {
	if (message.content.toLowerCase().includes('trap prime')) {
		client.users.fetch(TRAP_PRIME)
			.then(user => {
				const embed = new Discord.MessageEmbed()
					.setTitle('Trap Prime')
					.setDescription(`${user.tag} is officially known as Trap Prime!`)
					.setThumbnail(user.displayAvatarURL({ dynamic: true }));
				message.channel.send(embed);
			})
			.catch(console.error);
	}
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
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
		command.execute(message, args, commandName);
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
	const hasLeveledUp = await levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
	if (hasLeveledUp) {
		const user = await levels.fetch(message.author.id, message.guild.id);
		message.guild.channels.cache.find(i => i.name === `${RANK_CHANNEL}`).send(`${message.author}, congratulations! You have leveled up to **${user.level}**. :tada:`);
	}
});

client.on('roleDelete', function(role) {
	console.error(`${role} is deleted`);
});

client.on('roleUpdate', function(oldRole, newRole) {
	console.error(`${oldRole} is updated to ${newRole}`);
});

client.login(token);
