const addZigzag = require('../../strategy/indicators/zigzag').addZigzag;
const math      = require('../../lib-common/math'); 

module.exports = {init, initAll, scores};

// let collection;
let datastore;

function init(collectionAsync, datastoreAsync) {
  // collection = collectionAsync;
  datastore  = datastoreAsync;
  return module.exports;
}

function scores(cb) {
  cb(null, assetsDefaultList);
}

let assetsDefaultList     = [];

let now          = new Date();
let timeMinus30d = now - 30 * 24 * 3600000;
let timeMinus24h = now -      24 * 3600000;


function initAsset(timeframes, exchange, base, quote, ticker) {
  if (!(timeframes instanceof Array)) {
    timeframes = [];
  }

  let price         = timeframes.length ? timeframes[timeframes.length - 1].close : 0;
  let price30d      = timeframes.length ? timeframes[0].close : 0;
  let price24h      = price;
  let breakouts30d  = 0;
  let timeframes24h = [];

  for (i = 0; ++i < timeframes.length;) {
    addZigzag(timeframes, i);
    let tf = timeframes[i];

    if (tf.date.getTime() > timeMinus30d) {
      if (tf.date.getTime() > timeMinus24h) {

        delete tf.timeStart;
        delete tf.LL;
        delete tf.LLI;
        delete tf.HH;
        delete tf.HHI;
        delete tf.trend;

        timeframes24h.push(tf);

      } else {
        price24h = tf.close;

      }
    }
  }

  for (let tf of timeframes) {
    if (tf.date.getTime() > timeMinus30d && tf.swing) {
      // console.log(tf);
      breakouts30d++;
    }  
  }  

  return {
    exchange, base, quote, ticker,
    icon:         '',
    category:     'Crypto',
    price:        price,
    change24h:    (price - price24h) * 100 / price24h,
    change30d:    (price - price30d) * 100 / price30d,
    minichart24h: timeframes24h,
    breakouts30d: {all: breakouts30d, catched: Math.round(math.random(breakouts30d * 0.4, breakouts30d * 0.8))},
    accuracyRate: math.round(math.random(50, 90), 10),
  };
}


function initAll(cb) {

  datastore.getCandles('BITFINEX', 'ETH', 'USD', '1h', null, null, (err, ohlc1) => {

    if (err) {cb(err); return;}
    assetsDefaultList.push(initAsset(ohlc1, 'BITFINEX', 'ETH', 'USD', 'ETHUSD'));
    console.log('asset1 ok');

    datastore.getCandles('BITFINEX', 'EOS', 'USD', '1h', null, null, (err, ohlc2) => {

      if (err) {cb(err); return;}
      assetsDefaultList.push(initAsset(ohlc2, 'BITFINEX', 'EOS', 'USD', 'EOSUSD'));
      console.log('asset2 ok');

      datastore.getCandles('BITFINEX', 'BTC', 'USD', '1h', null, null, (err, ohlc3) => {
        if (err) {cb(err); return;}
        assetsDefaultList.push(initAsset(ohlc3, 'BITFINEX', 'BTC', 'USD', 'BTCUSD'));
        console.log('asset3 ok');

        cb();
      });
    });
  });
}

