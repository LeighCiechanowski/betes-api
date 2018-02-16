var moment = require('moment');
var mongoose = require('mongoose');
var config = require('../config/index')
BloodGlucose = mongoose.model('BloodGlucose');
var replyMessage = '';

  exports.getChart = function(req, res) {
    BloodGlucose.aggregate([
        {$match: {userId: req.body.user_id, date: query(req)}},
        {$group: group(req)},
        {$project: { _id: 0, x: "$_id", value: "$value", normal: { fill: { $cond: { if: { $gte: ["$value", 10]}, then: '#f43059', else: '#45d1b4' }}, stroke: null}}},
        {$sort: { x: 1}}
        ], function (err, result) {
            genChart(req, result);

            var chatbotResponse = {
                message: 'here you go',
                suggested_replies: [],
                blocked_input: null,
                cards: [
                    {
                        type: "image",
                        value: config.endpoints.betesApi + "/" + req.body.user_id + '.jpg'
                    }
                ]
            }
    
            res.json(chatbotResponse);
        });
  }

genChart = function(req, result){
    // require file system and jsdom
    var fs = require('fs');

    // For jsdom version 10 or higher.
    // Require JSDOM Class.
    var JSDOM = require('jsdom').JSDOM;
    // Create instance of JSDOM.
    var jsdom = new JSDOM('<body><div id="container"></div></body>', {runScripts: 'dangerously'});
    // Get window
    var window = jsdom.window;

    // For jsdom version 9 or lower
    // var jsdom = require('jsdom').jsdom;
    // var document = jsdom('<body><div id="container"></div></body>');
    // var window = document.defaultView;

    // require anychart and anychart export modules
    var anychart = require('anychart')(window);
    var anychartExport = require('anychart-nodejs')(anychart);

    // create and a chart to the jsdom window.
    // chart creating should be called only right after anychart-nodejs module requiring
    var chart = anychart.column(result);
 
    chart.background().stroke(null);
    chart.bounds(0, 0, /*1920, 1080*/ 800, 600);
    chart.container('container');
    chart.labels(true);
 
    var xlabels = chart.xAxis().labels();
    xlabels.fontSize(40);
    xlabels.fontColor('black');
 
    var seriesLabels = chart.labels();
    seriesLabels.fontSize(40);
    seriesLabels.fontColor('black');

    var ylabels = chart.yAxis().labels();
    ylabels.enabled(false);

    var highMarker = chart.lineMarker(0);
    //highMarker.axis(chart.yAxis());
    highMarker.value(10);
    highMarker.stroke({
        color: '#f43059',
        thickness: 4
    })

    var lowMarker = chart.lineMarker(1);
    //lowMarker.axis(chart.yAxis());
    lowMarker.value(4);
    lowMarker.stroke({
        color: '#45d1b4',
        thickness: 4
    })


    // generate JPG image and save it to a file
    anychartExport.exportTo(chart, 'jpg').then(function(image) {
    fs.writeFile('public/' + req.body.user_id + '.jpg', image, function(fsWriteError) {
        if (fsWriteError) {
        console.log(fsWriteError);
        } else {
        console.log('Complete');
        }
    });
    }, function(generationError) {
    console.log(generationError);
    });
}

query = function(req) {
    if(req.body.incoming_message.indexOf('today') !== -1){
      replyMessage = 'Here are your readings for today';
      return {$gte: moment().subtract(1,'days').endOf('day').toDate()};
    }
    if(req.body.incoming_message.indexOf('yesterday') !== -1){
      replyMessage = 'Here are your readings for yesterday';
      return {$gte: moment().subtract(1,'days').startOf('day').toDate(), $lte: moment().subtract(1,'days').endOf('day').toDate()};
    }
    if(req.body.incoming_message.indexOf('week') !== -1){
      replyMessage = 'Here are your daily averages for the week';
      return {$gte: moment().subtract(7,'days').startOf('day').toDate()};
    }
    if(req.body.incoming_message.indexOf('month') !== -1){
      replyMessage = 'Here are your daily averages for the month';
      return {$gte: moment().subtract(28,'days').startOf('day').toDate()};
    }
    if(req.body.incoming_message.indexOf('year') !== -1){
      replyMessage = 'Here are your yearly averages';
      return {$gte: moment().subtract(365,'days').startOf('day').toDate()};
    }
}

group = function(req){
    if(req.body.incoming_message.indexOf('today') !== -1){
        return {_id: { $dateToString: { format: "%H:%M", date: '$date'} }, value: {$avg: '$glucose'}};
      }
      if(req.body.incoming_message.indexOf('yesterday') !== -1){
        return {_id: { $dateToString: { format: "%H:%M", date: '$date'} }, value: {$avg: '$glucose'}};
      }
      if(req.body.incoming_message.indexOf('week') !== -1){
        return {_id: { $dateToString: { format: "%Y-%m-%d", date: '$date'} }, value: {$avg: '$glucose'}};
      }
      if(req.body.incoming_message.indexOf('month') !== -1){
        return {_id: { $dateToString: { format: "%Y-%m-%d", date: '$date'} }, value: {$avg: '$glucose'}};
      }
      if(req.body.incoming_message.indexOf('year') !== -1){
        return {_id: { $dateToString: { format: "%Y", date: '$date'} }, value: {$avg: '$glucose'}};
      }
}