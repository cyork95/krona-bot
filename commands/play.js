const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const Genius = require('genius-lyrics');
const Client = new Genius.Client();

const queue = new Map();

module.exports = {
	name: 'play',
	aliases: ['skip', 'stop', 'pause', 'unpause', 'queue', 'lyrics', 'set-volume'],
	cooldown: 0,
	description: 'Advanced music bot. !play to play a song, !skip to skip to next song, !pause to pause, !unpause to resume, !queue to veiw the current music queue, !lyrics <optional: song name> type !lyrics to get current playing song lyrics or add the song name you want to search for. ex (!lyrics Rap God - Eminem)',
	permissions: ['CONNECT', 'SPEAK'],
	args: false,
	usage: '!play <keywords to search for song> | !lyrics <song name>',
	async execute(message, args, cmd) {
		const voice_channel = message.member.voice.channel;
		if (!voice_channel) return message.channel.send('You need to be in a voice channel to execute this command!');

		const server_queue = queue.get(message.guild.id);

		if (cmd === 'play') {
			if (!args.length) return message.channel.send('You need to send the second argument!');
			let song = {};

			if (ytdl.validateURL(args[0])) {
				const song_info = await ytdl.getInfo(args[0]);
				song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url };
			}
			else {
				const video_finder = async (query) =>{
					const video_result = await ytSearch(query);
					return (video_result.videos.length > 1) ? video_result.videos[0] : null;
				};

				const video = await video_finder(args.join(' '));
				if (video) {
					song = { title: video.title, url: video.url };
				}
				else {
					message.channel.send('Error finding video.');
				}
			}

			if (!server_queue) {
				const queue_constructor = {
					voice_channel: voice_channel,
					text_channel: message.channel,
					connection: null,
					songs: [],
				};

				queue.set(message.guild.id, queue_constructor);
				queue_constructor.songs.push(song);

				try {
					const connection = await voice_channel.join();
					queue_constructor.connection = connection;
					video_player(message.guild, queue_constructor.songs[0]);
				}
				catch (err) {
					queue.delete(message.guild.id);
					message.channel.send('There was an error connecting!');
					throw err;
				}
			}
			else{
				server_queue.songs.push(song);
				return message.channel.send(`👍 **${song.title}** added to queue!`);
			}
		}

		else if(cmd === 'skip') {skip_song(message, server_queue);}
		else if(cmd === 'stop') {stop_song(message, server_queue);}
		else if(cmd === 'pause') {pause_song(message, server_queue);}
		else if(cmd === 'unpause') {unpause_song(message, server_queue);}
		else if(cmd === 'queue') {show_queue(message, server_queue);}
		else if(cmd === 'lyrics') {show_lyrics(message, server_queue, args, Client);}
		else if(cmd === 'set-volume') {set_volume(message, server_queue, args);}
	},

};

const video_player = async (guild, song) => {
	const song_queue = queue.get(guild.id);
	if (!song) {
		song_queue.voice_channel.leave();
		queue.delete(guild.id);
		return;
	}
	const stream = ytdl(song.url, { filter: 'audioonly' });
	song_queue.connection.play(stream, { seek: 0, volume: 0.5 })
		.on('finish', () => {
			song_queue.songs.shift();
			video_player(guild, song_queue.songs[0]);
		});
	await song_queue.text_channel.send(`🎶 Now playing **${song.title}**`);
};

const skip_song = async (message, server_queue) => {
	try {
		if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
		if(!server_queue) {
			return message.channel.send('There are no songs in queue 😔');
		}
		else if(server_queue.connection.dispatcher.paused) {
			server_queue.connection.dispatcher.resume();
			return server_queue.connection.dispatcher.end();
		}
		server_queue.connection.dispatcher.end();
	}
	catch (err) {
		console.log('Music Execption Skip!');
	}

};

const stop_song = async (message, server_queue) => {
	try {
		if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
		if (!server_queue) {
			return message.channel.send('There are no songs playing!');
		}
		if(server_queue.connection.dispatcher.paused) {
			server_queue.connection.dispatcher.resume();
			server_queue.songs = [];
			server_queue.connection.dispatcher.end();
		}
		server_queue.songs = [];
		await server_queue.connection.dispatcher.end();
	}
	catch (err) {
		console.log('Music Execption Stop!');
	}
};

const pause_song = async (message, server_queue) => {
	try {
		if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
		if(server_queue.connection.dispatcher.paused) return message.channel.send('Song is already paused!');
		server_queue.connection.dispatcher.pause(true);
		message.channel.send('Paused the song!');
	}
	catch (err) {
		console.log('Music Execption Pause!');
	}

};

const unpause_song = async (message, server_queue) => {
	if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
	if(!server_queue.connection.dispatcher.paused) return message.channel.send('Song isn\'t paused!');
	server_queue.connection.dispatcher.resume();
	message.channel.send('Unpaused the song!');
};

const show_queue = (message, server_queue) => {
	try {
		if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
		if(!server_queue) return message.channel.send('There are no songs in the queue!');
		let songQueue = '';
		for(let i = 0; i < server_queue.songs.length; i++) {
			songQueue += `${i + 1}. ${server_queue.songs[i]['title']}\n`;
		}
		message.channel.send(`The current queue is: \n------------------------- \n${songQueue}`);
	}
	catch (err) {
		console.log('Music Execption Queue!');
	}
};

const show_lyrics = async (message, server_queue, args) => {
	if (args != '') {
		const songName = args.slice(0).join(' ');
		try {
			const searches = await Client.songs.search(`${songName}`);
			const firstSong = searches[0];
			const lyrics = await firstSong.lyrics();
			message.channel.send(`Lyrics for ${songName}:\n ${lyrics}`, { split: true });
		}
		catch (err) {
			message.channel.send(`Hmmmm... I am unable to find lyrics for ${songName}}. Maybe try cleaning up the name and searching again?`);
		}
	}
	else {
		const currentSong = server_queue.songs[0]['title'];
		try {
			const searches = await Client.songs.search(`${currentSong}`);
			const firstSong = searches[0];
			const lyrics = await firstSong.lyrics();
			message.channel.send(`Lyrics for ${currentSong}:\n ${lyrics}`, { split: true });
		}
		catch (err) {
			message.channel.send(`Hmmmm... I am unable to find lyrics for ${currentSong}. Maybe try cleaning up the name and searching again?`);
		}
	}
};

const set_volume = (message, server_queue, args) => {
	const volume = parseInt(args[0]) / 100;
	try {
		if (isNaN(volume) || volume > 1 || volume < 0.01) {
			return message.channel.send('You did not send a valid number! Please enter a number between 1 and 100!');
		}
		if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
		if(!server_queue) return message.channel.send('There are no songs in the queue!');
		if (!server_queue) {
			return message.channel.send('There are no songs playing!');
		}
		else {
			server_queue.connection.dispatcher.setVolume(volume);
			message.channel.send('The volume has been changed!');
		}
	}
	catch (err) {
		console.log('Music Execption Volume!');
	}
};