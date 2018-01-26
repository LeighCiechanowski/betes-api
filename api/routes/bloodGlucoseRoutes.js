'use strict';
module.exports = function(app) {
  var bloodGlucose = require('../controllers/bloodGlucoseController');
  var insights = require('../controllers/insightsController');

  app.route('/insights')
    .post(insights.getInsights);
  app.route('/readings')
    .post(insights.getReadings);
  app.route('/hypos')
    .post(insights.getHypos);
  app.route('/highs')
    .post(insights.getHighs);

  app.route('/bloodGlucose')
    .get(bloodGlucose.getBloodGlucoseReadings)
    .post(bloodGlucose.createBloodGlucose);

    app.route('/chatbot/bloodGlucose')
    .post(bloodGlucose.createChatbotBloodGlucose);

  app.route('/bloodGlucose/:bloodGlucoseId')
    .get(bloodGlucose.getBloodGlucose)
    .put(bloodGlucose.updateBloodGlucose)
    .delete(bloodGlucose.deleteBloodGlucose);
};