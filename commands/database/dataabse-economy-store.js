const { mongodbURL_ECONOMY_STORE } = require('../../config.json');
const mongoose = require('mongoose');

module.exports = mongoose.createConnection(mongodbURL_ECONOMY_STORE, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });