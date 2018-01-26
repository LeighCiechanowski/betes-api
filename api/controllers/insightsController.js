var moment = require('moment');
var mongoose = require('mongoose'),
BloodGlucose = mongoose.model('BloodGlucose');

// AVG MIN MAX
exports.getInsights = function(req, res) {
    BloodGlucose.aggregate([
    {$match: {userId: req.body.user_id, date: query(req)}},
        {$group: {_id: '$userId', average: {$avg: '$glucose'}, min: {$min: '$glucose'}, max: {$max: '$glucose'}}}
    ], function (err, result) {
        var message = 'No results found';
        if(result.length > 0){
            message = "average: " + result[0].average + " max: " + result[0].max + " min: " + result[0].min + " if you would like to send me a reading now just type it in and send it to me for processing"
        }
        var chatbotResponse = {
            message: message,
            suggested_replies: [],
            blocked_input: null,
            cards: null
        }
        res.json(chatbotResponse);
    });
  };

// LOWS 
exports.getHypos = function(req, res) {
    BloodGlucose.aggregate([
        {$match: {userId: req.body.user_id, date: query(req), glucose: {$lt : 4}}},
        {$group: {_id: '$userId', count: {$sum: 1}}}
    ], function (err, result) {
        var message = 'No hypos found';
        if(result.length > 0){
            message = "You have had: " + result[0].count + "  hypos. If you would like to send me a reading now just type it in and send it to me for processing"
        }
        var chatbotResponse = {
            message: message,
            suggested_replies: [],
            blocked_input: null,
            cards: null
        }
        res.json(chatbotResponse);
    });
  };

  // HIGHS
  exports.getHighs = function(req, res) {
    BloodGlucose.aggregate([
        {$match: {userId: req.body.user_id, date: query(req), glucose: {$gt : 10}}},
        {$group: {_id: '$userId', count: {$sum: 1}}}
    ], function (err, result) {
        var message = 'No highs found';
        if(result.length > 0){
            message = "You have had: " + result[0].count + "  highs. If you would like to send me a reading now just type it in and send it to me for processing"
        }
        var chatbotResponse = {
            message: message,
            suggested_replies: [],
            blocked_input: null,
            cards: null
        }
        res.json(chatbotResponse);
    });
  };

 // Dump of last 24 of readings
  exports.getReadings = function(req, res) {
    BloodGlucose.find(
        { date: {$gte: moment().subtract(30,'days').toDate()}}
    , function (err, result) {
        var message = 'No results found';
        
        if(result.length > 0){
         message = "Here are your readings from last 24hrs: \n";
            for(var i = 0; i < result.length; i++){
                message = message + " " + result[i].date + " " + result[i].glucose +  "\n";  
        }
        var chatbotResponse = {
            message: message,
            suggested_replies: [],
            blocked_input: null,
            cards: null
        }
        res.json(chatbotResponse);
        }
    });
  };

  query = function(req) {
      if(req.body.incoming_message.indexOf('today') !== -1){
        return {$gte: moment().subtract(1,'days').endOf('day').toDate()};
      }
      if(req.body.incoming_message.indexOf('yesterday') !== -1){
        return {$gte: moment().subtract(1,'days').startOf('day').toDate(), $lte: moment().subtract(1,'days').endOf('day').toDate()};
      }
      if(req.body.incoming_message.indexOf('week') !== -1){
        return {$gte: moment().subtract(7,'days').startOf('day').toDate()};
      }
      if(req.body.incoming_message.indexOf('month') !== -1){
        return {$gte: moment().subtract(28,'days').startOf('day').toDate()};
      }
      if(req.body.incoming_message.indexOf('year') !== -1){
        return {$gte: moment().subtract(365,'days').startOf('day').toDate()};
      }
  }
  