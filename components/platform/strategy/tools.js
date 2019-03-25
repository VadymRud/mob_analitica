module.exports = {pnl, chartedCandlestick, chartedZigzag, countResults, debug};

const addZigzag  = require('../../strategy/indicators/zigzag').addZigzag;

// ------------------------------------------------------------------------------------------------------

// profit&loss value for the current timeframe
function pnl(tf, price, priceEnter) {
  return tf.enterPosition * tf.enterLots * (price - priceEnter);

}

// chart data for the timeframes list
function chartedCandlestick(timeframes, chartType) {
  let ctfs = [];

  if (chartType === 'none') {
    return ctfs;
  }

  for (let tf of timeframes) {
    ctfs.push(chartType === 'line'
                     ? [tf.date.getTime(), (tf.open + tf.close) * 0.5]
                     : [tf.date.getTime(), tf.open, tf.high, tf.low, tf.close]);
  }

  return ctfs;
}

// zigzag data for the timeframes list
function chartedZigzag(timeframes) {

  for (i = 0; ++i < timeframes.length;) {
    addZigzag(timeframes, i);
  }

  let cl = [];

  // must run it in second, separate loop
  for (let tf of timeframes) {
    delete tf.timeStart;
    delete tf.LL;
    delete tf.LLI;
    delete tf.HH;
    delete tf.HHI;
    delete tf.trend;
    if (tf.swing != undefined) {
      cl.push([tf.date.getTime(), tf.swing]);
    }
  }

  return cl;
}

function debug(timeframes, fullTable) {

  if (!fullTable) {
    timeframes.forEach(tf => {
      tf.details = JSON.stringify({
        enterPosition:  tf.enterPosition,
        enterCapital:   tf.enterCapital,
        indicators:     tf.indicators,
        action: tf.action,
        actionMoney:    tf.actionMoney,
        actionPrice:    tf.actionPrice,
        finalPosition:  tf.finalPosition,
        finalFreeCapital: tf.freeCapitalIfAlone,
      }, null, ' ');

      delete tf.volume;
      delete tf.zigzag;
      delete tf.enterPosition;
      delete tf.enterCapital;
      delete tf.indicators;
      delete tf.action;
      delete tf.actionMoney;
      delete tf.actionPrice;
      delete tf.finalPosition;
      delete tf.freeCapitalIfAlone;
    });
  }

  return {
    columns: ['n', 'date', 'high', 'low', 'close', 'action', 'enterLots', 'actionLots', 'finalLots', 'finalCapital', 'details'],
    rows:    timeframes,
  };
}

function countResults(timeframes) {
  // [data.results, data.trades] = tools.countResults(data1.timeframes);

  let results = {pnlTotal: 0};
  let trades  = [];

  let tradeCurrent;

  for (let tfI = -1; ++tfI < timeframes.length;) {
    let tf = timeframes[tfI];

    if (tf.action === 'buyStrong' || tf.action == 'sellStrong') {
      if (tradeCurrent) {
        tradeCurrent.end = {
          order:  'sell',
          signal: 'Breakout Exit',
          price:  tf.actionPrice,
          size:   tf.enterLots,
          time:   tf.date.getTime(),
          // zigzag: tf.zigzag,
        };

        tradeCurrent.minichart = [];
        for (let i = tradeCurrent.start.i - 1; ++i <= tfI;) {
          tradeCurrent.minichart.push(
              [timeframes[i].date.getTime(), pnl(timeframes[i], timeframes[i].close, tradeCurrent.start.price)]
          );
        }

        tradeCurrent.trade      = (tf.enterPosition > 0) ? 'long' : 'short';
        tradeCurrent.signalBuy  = (tf.enterPosition > 0) ? tradeCurrent.start.signal : tradeCurrent.end.signal;
        tradeCurrent.signalSell = (tf.enterPosition > 0) ? tradeCurrent.end.signal : tradeCurrent.start.signal;
        tradeCurrent.priceBuy   = (tf.enterPosition > 0) ? tradeCurrent.start.price : tf.actionPrice;
        tradeCurrent.priceSell  = (tf.enterPosition > 0) ? tf.actionPrice : tradeCurrent.start.price;
        tradeCurrent.timeIn     = tf.date - tradeCurrent.start.date;
        tradeCurrent.pnl        = pnl(tf, tf.actionPrice,  tradeCurrent.start.price);

        trades.push(tradeCurrent);
        results.pnlTotal += tradeCurrent.pnl;
        tradeCurrent = null;
      }

      if (tf.finalLots > 0) {
        tradeCurrent = {
          start: {
            i:      tfI,
            order:  'buy',
            signal: 'Breakout Entry',
            price:  tf.actionPrice,
            size:   tf.finalLots,
            time:   tf.date.getTime(),
            // zigzag: tf.zigzag,
          },
        };
      }

    }
  }

  if (tradeCurrent) {

    tradeCurrent.minichart = [];

    if (tradeCurrent.start.i < timeframes.length) {
      for (let i = tradeCurrent.start.i - 1; ++i < timeframes.length;) {
        tradeCurrent.minichart.push(
            [timeframes[i].date.getTime(), pnl(timeframes[i], timeframes[i].close, tradeCurrent.start.price)]
        );
      }
      tradeCurrent.pnl = pnl(timeframes[timeframes.length - 1], timeframes[timeframes.length - 1].close, tradeCurrent.start.price);
      results.pnlTotal += tradeCurrent.pnl;
    }

    trades.push(tradeCurrent);
  }

  results.msqScore       = 79.1;
  results.riskReward     = 31.1;
  results.leverageAvg    = 2.4;
  results.percentFromATH = 22;
  results.drawdownMax    = 18.1;
  results.slippageAvg    = 1.2;
  results.winLossRatio   = 1.32;
  results.winLossAvg     = 1.4;

  return [results, trades];
}
