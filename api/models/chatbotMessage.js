'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ChatBotMessageSchema = new Schema({
  bot_id: {
    type: String
  },
  user_id: {
    type: String
  },
  module_id: {
    type: String
  },
  channel: {
    type: String
  },
  incoming_message: {
    type: String
  },
});

module.exports = mongoose.model('ChatBotMessage', ChatBotMessageSchema);