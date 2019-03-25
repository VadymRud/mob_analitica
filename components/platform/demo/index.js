module.exports = {init, mainChart, myPortfolios, academy, zoomIn, marketPlace, featuredStrategies};

const addZigzag  = require('../../strategy/indicators/zigzag').addZigzag;
const user       = require('./demo_user');
const demoTrades = require('./demo_strategy').demoTrades;

let datastore;

function init(datastoreAsync) {
  datastore = datastoreAsync;
  return module.exports;
}

function myPortfolios(cb) {
  user.getUserPortfolios(cb);
}

function academy(cb) {
  user.getAcademy(cb);
}

function zoomIn(cb) {
  user.zoomIn(cb);
}

function marketPlace(cb) {
  user.marketPlace(cb);
}

function featuredStrategies(cb) {
  user.featuredStrategies(cb);
}

function chartedTimeframes(timeframes) {
  let ctfs = [];
  for (let tf of timeframes) {
    ctfs.push({
      dateStart: tf.timeStart,           
      open:      tf.open,
      high:      tf.high,
      low:       tf.low,
      close:     tf.close,
    });
  }

  return ctfs;
}

function chartedLine(timeframes) {
  let cl = [];
  for (let tf of timeframes) {
    if (tf.swing != undefined) {
      cl.push({
        date:  tf.timeStart,           
        value: tf.swing,
        // TODO: add "visible"
      });
    }
  }

  return cl;
}

function mainChart(exchange, base, quote, interval, dateStart, dateFinish, cb) {

  // TODO: remove this mock!!!
  exchange = 'BITFINEX';
  base     = 'BTC';
  quote    = 'USD';
  interval = '1h';

  datastore.getCandles(
      exchange, base, quote, interval, dateStart, dateFinish, (err, timeframes) => {
        if (err) {
          cb(err);
          return;
        } 
    
        //let timeframes  = aggregate(ohlcs1m, '1h');
        
        for (i = 0; ++i < timeframes.length;) {   // 
          addZigzag(timeframes, i);
        }
    
        if (showData) {
          showData(timeframes);
        }

        let platformData = {
          timeframes: chartedTimeframes(timeframes),
          line:       chartedLine(timeframes),
          trades:     demoTrades(timeframes, 1, 1, 4),
        };

        cb(null, platformData);
      }      
  );
}  

// DEBUG -------------------------------------------------------------------------------------------

// TODO: remove, it's temporary

const fs = require('fs');

function showData(timeframes) {
  // let lowest = 999999;
  // for (let tf of timeframes) {
  //   if (tf.PriceLow < lowest) {
  //     lowest = tf.PriceLow;
  //   }
  // }
  
  let lowest = 0;

  let report = 'date\thigh\tlow\tzigzag\n';
  for (i = -1; ++i < timeframes.length;) {   
    let tf    = timeframes[i];
    let time  = ('' + tf.TimeStart).substring(0, 33);
    let zz    = (tf.zigzag == undefined) ? '' : (tf.zigzag - lowest);
    let sw    = (tf.swing  == undefined) ? '' : (tf.swing  - lowest);
    let trend = (tf.trend  == undefined) ? '' : tf.trend;
  
    report += time + '\t' + (tf.high - lowest) + '\t' + (tf.low - lowest) + '\t' + zz + '\t' + sw + '\t' + trend + '\n';
  }  
  
  fs.writeFileSync('zigzag.xls', report);
}
