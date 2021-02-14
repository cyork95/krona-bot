const { mongodbURL_ECONOMY } = require('../../config.json');
const mongoose = require('mongoose');

module.exports = mongoose.createConnection(mongodbURL_ECONOMY, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });