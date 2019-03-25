module.exports  = {initOne, chart, chartTypeChange};

const algo      = require('../../strategy/algo/algo');
const convertor = require('../../strategy/convertor/convertor_front');
const tools     = require('./tools');

let datastore;

// sync init for the current file used within initAsync()
function initOne(datastoreAsync) {
  datastore = datastoreAsync;
}

// REST API wrapper for charting with strategy.execute()
function chart(exchange, base, quote, interval, dateStart, dateFinish, chartType, strategyDescription, dontConvert, cb) {
  if (!(strategyDescription && (strategyDescription instanceof Object))) {
    cb('no strategyDescription for platform/strategy.chart()');
    return;
  }

  let [err, strategyItem] = dontConvert ? [null, strategyDescription] : convertor.parse(strategyDescription);
  if (err) {
    cb(err);
    return;
  }

  datastore.getCandles(
      exchange, base, quote, interval, dateStart, dateFinish, (err, timeframes) => {
        if (err) {
          cb(err);
          return;
        }

        let parameters = {exchange, base, quote, interval, dateStart, dateFinish, strategyItem};
        if (!dontConvert) {
          parameters.strategyDescription = strategyDescription;
        }

        let data = {
          candlestick: tools.chartedCandlestick(timeframes, chartType),
          zigzag:      tools.chartedZigzag(timeframes),
          parameters,
        };

        algo.execute(strategyItem, timeframes, true, (err, result) => {
          if (err) {
            cb(err, data);
          }

          result.parameters = parameters;
          [data.results, data.trades] = tools.countResults(result.timeframes);
          data.debugId = result.debugId;

          cb(null, data);
        });
      }
  );
}

function chartTypeChange(debugId, chartType, cb) {
  result = algo.getDebug(debugId);
  if (!(result && result.timeframes instanceof Array && result.timeframes.length)) {
    cb('no stored data to get strategy debug: ' + debugId);
    return;
  }

  cb(null, {
    candlestick: tools.chartedCandlestick(result.timeframes, chartType),
    parameters:  result.parameters,
  });
}


// Point {
//   date:   Date
//   order:  {"buy", "sell"}
//   size:   float,
//   price:  float,
//   zigzag: float,
//   signal: {
//     "Breakout Entry", "Breakout Exit",
//     "Take Profit", "Gradual Take Profit", "Stop Loss", "Trailling Stop", "Martingale"
//   },
// };

// Trade {
//   start:      Point,     // чтобы передавать реверсы делаются два трейда подряд
//   end:        Point,
//   pnl:        float,     // Profit&Loss value
//   trade:      {"short", "long"},
//   signalSell: string,    // signalSell == (start.order == "sell" ? start.price : end.price)
//   signalBuy:  string,    // signalBuy  == (start.order == "sell" ? end.signal : start.signal)
//   priceBuy:   float,     // priceBuy  == (start.order == "sell" ? end.price : start.price)
//   priceSell:  float      // priceSell == (start.order == "sell" ? start.price : end.price)
//   // -- size: use start.size
//   timeIn:     duration   // ms
//   leverage:   float,
//   minichart: [{
//     date: Date,
//     pnl:  float,         // Profit&Loss value
//   }];
// }

