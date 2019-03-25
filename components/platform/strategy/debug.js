module.exports = {initOne, doBacktest, debugBacktest};

const algo      = require('../../strategy/algo/algo');
const tools     = require('./tools');

let datastore;

// sync init for the current file used within initAsync()
function initOne(datastoreAsync) {
  datastore = datastoreAsync;
}

// REST API wrapper for debugging & charting with strategy.execute()
function doBacktest(exchange, base, quote, interval, dateStart, dateFinish, strategyItem, fullTable, cb) {
  if (!(strategyItem && (strategyItem instanceof Object))) {
    cb('no strategyItem for platform/strategy.doBacktest()');
    return;
  }

  datastore.getCandles(
      exchange, base, quote, interval, dateStart, dateFinish, (err, timeframes) => {
        if (err) {
          cb(err);
          return;
        }

        // let timeframes = aggregate(ohlcs1m, interval);  // .slice(0, 20)

        let parameters = {exchange, base, quote, interval, dateStart, dateFinish, strategyItem};

        let data = {
          candlestick: tools.chartedCandlestick(timeframes),
          zigzag:      tools.chartedZigzag(timeframes),
          parameters,
        };

        algo.execute(strategyItem, timeframes, true, (err, result) => {
          if (err) {
            cb(err);
            return;
          }

          result.parameters = parameters;
          [data.results, data.trades] = tools.countResults(result.timeframes);
          data.debug   = tools.debug(result.timeframes, fullTable);
          data.debug.debugId = result.debugId;
          data.debugId = result.debugId;

          cb(null, data);
        });
      }
  );
}

// //debugId, date, period, cb
//   /**
//    * @callback GetDebugCallback
//    * @param {string} error - Error
//    * @param {object[]} result - Array of timeframes
//    */
//   /**
//    * Get debug description.
//    * @param {string} debugId - Id of debug
//    * @param {Date} date - Date
//    * @param {string} period - Period
//    * @param {GetDebugCallback} cb - Callback
//    */

function debugBacktest(debugId, date, period, cb) {
  result = algo.getDebug(debugId);
  if (!(result && result.timeframes instanceof Array && result.timeframes.length)) {
    cb('no stored data to get strategy debug: ' + debugId);
    return;
  }
  if (!(date instanceof Date)) {
    date = result.timeframes[result.timeframes.length - 1].date;
  }
  if (!(period > 0)) {
    period = result.timeframes.length;
  }

  let dateMs = date.getTime();

  for (let i = -1; ++i < result.timeframes.length;) {
    let ms = result.timeframes[i].date.getTime();
    if (ms >= dateMs) {
      cb(null, result.timeframes.slice((period > i + 1 ? 0 : i + 1 - period), i + 1), result.parameters);
      return;
    }
  }

  cb('the date (' + date + ') is too late to get strategy debug for ' + debugId);
}
