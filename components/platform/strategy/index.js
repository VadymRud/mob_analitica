const chart      = require('./chart');
const debug      = require('./debug');

module.exports = {
  init, zoomIn,
  chart:           chart.chart,
  chartTypeChange: chart.chartTypeChange,
  doBacktest:      debug.doBacktest,
  debugBacktest:   debug.debugBacktest,
};

function init(datastoreAsync) {

  debug.initOne(datastoreAsync);
  chart.initOne(datastoreAsync);
  return module.exports;
}

function zoomIn(cb) {
  cb(null, {});
}


