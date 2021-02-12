const { mongodbURL_REACTION } = require('./config.json');

const mongoose = require('mongoose');

module.exports = mongoose.createConnection(mongodbURL_REACTION, { useNewUrlParser: true, useUnifiedTopology: true });