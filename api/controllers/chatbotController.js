'use strict';

var mongoose = require('mongoose'),
BloodGlucose = mongoose.model('BloodGlucose'),
ChatBotMessage = mongoose.model('ChatBotMessage');

exports.saveChatBotMessage = function(req, res) {
  var bloodGlucose = {
    userId: req.user_id,
    glucose: req.incoming_message,
    date: new Date()
  }
  var newReading = new BloodGlucose(bloodGlucose);
  newReading.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
  // var message = new ChatBotMessage(req.body);
  // message.save(function(err, task) {
  //   if (err)
  //     res.send(err);
  //   res.json(task);
  // });
};

exports.getChatBotMessages = function(req, res) {
  ChatBotMessage.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};