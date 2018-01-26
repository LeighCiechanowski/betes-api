'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var BloodGlucoseSchema = new Schema({
  userId: {
    type: String,
    required: 'Please provide user id'
  },
  glucose: {
    type: Number,
    required: 'Please provide a blood glucose reading'
  },
  date: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String
  },
});

module.exports = mongoose.model('BloodGlucose', BloodGlucoseSchema);