'use strict';


var mongoose = require('mongoose'),
BloodGlucose = mongoose.model('BloodGlucose');

exports.getBloodGlucoseReadings = function(req, res) {
  BloodGlucose.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.createBloodGlucose = function(req, res) {
  var newReading = new BloodGlucose(req.body);
  newReading.save(function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.createChatbotBloodGlucose = function(req, res) {
  var bloodGlucose = {
    userId: req.body.user_id,
    glucose: req.body.incoming_message,
    date: new Date()
  }
console.log(bloodGlucose);
  var newReading = new BloodGlucose(bloodGlucose);
  newReading.save(function(err, task) {
    if (err){
      res.send(err);
    }
    var chatbotResponse = {
      message: "Thank you, would you like to know some insights into your diabetes data?",
      suggested_replies: null,
      blocked_input: null,
      cards: null
    }
    res.json(chatbotResponse);
  });
};


exports.getBloodGlucose = function(req, res) {
  BloodGlucose.findById(req.params.bloodGlucoseId, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.updateBloodGlucose = function(req, res) {
  BloodGlucose.findOneAndUpdate({_id: req.params.bloodGlucoseId}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};


exports.deleteBloodGlucose = function(req, res) {


  BloodGlucose.remove({
    _id: req.params.bloodGlucoseId
  }, function(err, task) {
    if (err)
      res.send(err);
    res.json({ message: 'Blood Glucose successfully deleted' });
  });
};
