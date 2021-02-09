// Libraries required - make sure to run 'npm install' to install them before running
const querystring = require('querystring');
const r2 = require('r2');
const { CAT_API_KEY } = require('../config.json');
const CAT_API_URL = 'https://api.thecatapi.com/';


module.exports = {
	name: 'cat',
	description: 'Get a random Dog picture',
	async execute(message) {
		const images = await loadImage(message.author.username);
		// get the Image, and first Breed from the returned object.
		const image = images[0];
		const breed = image.breeds[0];
		console.log('message processed', 'showing', breed);
		// use the *** to make text bold, and * to make italic
		message.channel.send('***' + breed.name + '*** \r *' + breed.temperament + '*', { files: [ image.url ] });
		// if you didn't want to see the text, just send the file

	},
};
/**
 * Makes a request to theDogAPI.com for a random dog image with breed info attached.
 */
async function loadImage(sub_id) {
	// you need an API key to get access to all the iamges, or see the requests you've made in the stats for your account
	const headers = {
		'X-API-KEY': CAT_API_KEY,
	};
	const query_params = {
		// we only want images with at least one breed data object - name, temperament etc
		'has_breeds':true,
		// we only want static images as Discord doesn't like gifs
		'mime_types':'jpg,png',
		// get the small images as the size is prefect for Discord's 390x256 limit
		'size':'small',
		// pass the message senders username so you can see how many images each user has asked for in the stats
		'sub_id': sub_id,
		// only need one
		'limit' : 1,
	};
	// convert this obejct to query string
	const queryString = querystring.stringify(query_params);
	try {
		// construct the API Get request url
		const _url = CAT_API_URL + `v1/images/search?${queryString}`;
		// make the request passing the url, and headers object which contains the API_KEY
		const response = await r2.get(_url, { headers }).json;
		return response;
	}
	catch (e) {
		console.log(e);
	}
}