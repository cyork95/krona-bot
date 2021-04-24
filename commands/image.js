const Scraper = require('images-scraper');

const google = new Scraper({
	puppeteer: {
		headless: true,
	},
});

module.exports = {
	name: 'image',
	description: 'This sends an image to a discord channel.',
	args: true,
	usage: '<image you want to search for>',
	async execute(message, args) {
		const image_query = args.join(' ');
		const image_results = await google.scrape(image_query, 1);
		message.channel.send(image_results[0].url);
	},
};