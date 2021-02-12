// Libraries required - make sure to run 'npm install' to install them before running
const querystring = require('querystring');
const r2 = require('r2');
const { DOG_API_KEY } = require('../config.json');
const DOG_API_URL = 'https://api.thedogapi.com/';


module.exports = {
	name: 'dog',
	description: 'Get a random Dog picture',
	async execute(message) {
		const images = await loadImage(message.author.username);
		const image = images[0];
		const breed = image.breeds[0];
		message.delete({ timeout: 3500 });
		message.channel.send('***' + breed.name + '*** \r *' + breed.temperament + '*', { files: [ image.url ] });
	},
};

async function loadImage(sub_id) {
	const headers = {
		'X-API-KEY': DOG_API_KEY,
	};
	const query_params = {
		'has_breeds':true,
		'mime_types':'jpg,png',
		'size':'small',
		'sub_id': sub_id,
		'limit' : 1,
	};
	const queryString = querystring.stringify(query_params);
	try {
		const _url = DOG_API_URL + `v1/images/search?${queryString}`;
		const response = await r2.get(_url, { headers }).json;
		return response;
	}
	catch (err) {
		console.log(err);
	}
}