module.exports = {init, setForStrategy, countIndicator};

let datastore;

function init(datastoreAsync) {
  datastore = datastoreAsync;
  return module.exports;
}

// ------------------------------------------------------------------------------------------------------

const basics     = require('./basics');
const ema        = require('./ema');
const vortex     = require('./vortex');
const bollinger  = require('./bollinger');
const atr        = require('./atr');
const psar       = require('./psar');
const rsi        = require('./rsi');
const adx        = require('./adx');
const cmf        = require('./cmf');
const ichimoku   = require('./ichimoku');
const kvo        = require('./kvo');
const macd       = require('./macd');
// const obv        = require('./obv');
const stochastic = require('./stochastic');

const indicators = {
  hlc:     {func: basics.hlcInd},
  oc:      {func: basics.ocInd},
  sma:     {func: basics.smaInd},
  smaOc:   {func: basics.smaOcInd},
  ema:     {func: ema.emaInd},
  emaOc:   {func: ema.emaOcInd},
  stDev:   {func: basics.stDevInd},
  stDevOc: {func: basics.stDevOcInd},
  
  adx:        {func: adx.adxInd}, 
  atr:        {func: atr.atrInd},
  bands:      {func: bollinger.bandsInd,       values: ['upper', 'lower']},
  bandsOc:    {func: bollinger.bandsOcInd,     values: ['upper', 'lower']},
  bandsSMA:   {func: bollinger.bandsSMAInd,    values: ['upper', 'lower']},
  cmf:        {func: cmf.cmfInd},
  ichimoku:   {func: ichimoku.ichimokuInd,     values: ['turning', 'standard', 'leading']},
  kvo:        {func: kvo.kvoInd,               values: ['ko', 'kos']},
  macd:       {func: macd.macdInd},
  psar:       {func: psar.psarInd},
  rsi:        {func: rsi.rsiInd},
  vortex:     {func: vortex.vortexInd,         values: ['plus',  'minus']},
  stochastic: {func: stochastic.stochasticInd, values: ['sto_k', 'sto_ah', 'sto_d']},
};

function setForStrategy(strategyItem) {
  if (!(strategyItem.indicators && (strategyItem.indicators instanceof Object))) {
    strategyItem.indicators = {};
  }

  if (strategyItem.indicatorsDefinition && (strategyItem.indicatorsDefinition instanceof Object) && Object.keys(strategyItem.indicatorsDefinition).length > 0) {
    for (let key of Object.keys(strategyItem.indicatorsDefinition)) {
      let description = strategyItem.indicatorsDefinition[key];
      if (description instanceof Array) {
        let indicator = indicators[description[0]];
        if (indicator && (indicator instanceof Object) && (indicator.func instanceof Function)) {
          strategyItem.indicators[key] = indicator.func(...description.slice(1));
        }
      }
    }
  }    
}

function countIndicator(id, exchange, base, quote, interval, params, cb) {
  let indicator = indicators[id];
  if (!(indicator && indicator.func instanceof Function)) {
    cb(`no indicator with id "${id}"`, null);
    return;
  }
  
  let ind    = (params instanceof Array) ? indicator.func(...params) : indicator.func(params);
  let values = (indicator.values instanceof Array) ? indicator.values : ['value'];

  datastore.getCandles(exchange, base, quote, interval, null, null, (err, timeframes) => {
    // forXLS(timeframes); // for export data to Exel
    cb(err, applyIndicator(timeframes, ind, values));
  });
}


function applyIndicator(timeframes, ind, values) {
  return {
    columns: ['date', 'open', 'high', 'low', 'close', 'volume', ...values],
    rows: timeframes.map((tf, i) => {
      try {
        let v = ind(tf, timeframes.slice(0, i));
        return [tf.date, tf.open, tf.high, tf.low, tf.close, tf.volume, ...(values.length > 1 ? v : [v])];
      } catch (err) {
        // TODO: check err
        return [tf.date, tf.open, tf.high, tf.low, tf.close, tf.volume];
      }
    }),
  };
}

// for quick test only ---------------------------------------------------------------------
// for (const it of ['hlc', 'vortex']) {
//   let id = it;
//   let indicator = indicators[id];
//   if (!(indicator && indicator.func instanceof Function)) {
//     throw (`no indicator with id "${id}"`);
//   }
//   let param = 13;
//   let ind = indicator.func(param);
//   let values = (indicator.values instanceof Array) ? indicator.values : ['value'];
//   let timeframes = require('../test/data').ohlcs1;
//   console.log('-==-'.repeat(2), it, '-==-'.repeat(9), '\n', JSON.stringify(applyIndicator(timeframes, ind, values)), '\n', '-==-'.repeat(13))
//   console.log('it\'s test output from ~/components/indicators/indes.js, should be removed...');
// }
// for quick test only ---------------------------------------------------------------------

// csv --> xls
// const j2c = require('json2csv').Parser;
// const fs = require('fs');
// const forXLS = (timeframes) => {
//   let fields = Object.keys(timeframes[0]),
//   json2csv = new j2c({ fields });
//   let csv = json2csv.parse(timeframes);

//   fs.writeFile('export.csv', csv, function (err) {
//     if (err) { throw err; }
//     console.log('file saved');
//   });
// };


// countIndicator('bands', 'exchange', 'base', 'quote', 'interval', [1, 2, 3, 4], () => {});
