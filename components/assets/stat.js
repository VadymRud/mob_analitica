module.exports = {init, processList, processDefault, expectedMarketBehaviorCount};

const symbols = require('../data-common/symbols');

let collection;
let datastore;

function init(collectionAsync, datastoreAsync) {
  collection = collectionAsync;
  datastore  = datastoreAsync;
  return module.exports;
}

function processDefault(cb) {
  let assets = [
    {exchange: 'BITFINEX', base: 'BTC', quote: 'USD', interval: '1h'},
    {exchange: 'BITFINEX', base: 'ETH', quote: 'USD', interval: '1h'},
    {exchange: 'BITFINEX', base: 'XRP', quote: 'USD', interval: '1h'},
    {exchange: 'BITFINEX', base: 'EOS', quote: 'USD', interval: '1h'},
    {exchange: 'BITFINEX', base: 'LTC', quote: 'USD', interval: '1h'},
  ];

  processList(assets, null, null, expectedMarketBehaviorCount, cb);
}  

function processOne(asset, dateStart, dateFinish, countFunction, cb) {
  if (!(asset instanceof Object && asset)) {
    cb();
    return;
  }

  console.log(symbols.asset(asset));

  collection.findOne(asset, (err, doc) => {
    if (err) {
      cb(err);
      return;
    }

    datastore.getCandles(asset.exchange, asset.base, asset.quote, asset.interval, dateStart, dateFinish, (err, timeframes) => {
      if (err) {
        cb(err);
        return;
      } 
      
      countFunction(timeframes, (err, result) => {
        if (err) {
          cb(err);
          return;
        } 

        if (doc) {          
          // TODO: check if result fields are correct
          let docNew = Object.assign(doc, result);
          collection.replaceOne({_id: doc._id}, docNew, cb);

        } else {
          let docNew = Object.assign(asset, result);
          collection.insertOne(docNew, cb);

        }        
      });
    });  
  });
}

function processList(assets, dateStart, dateFinish, countFunction, cb) {
  if (!(assets instanceof Array && assets.length)) {
    cb();
    return;
  }
  asset = assets.shift();

  processOne(asset, dateStart, dateFinish, countFunction, err => {
    if (err) {
      console.error(err);
    } 

    processList(assets, dateStart, dateFinish, countFunction, cb);
  });
}

// countFunction ---------------------------------------------------------------------------------------

const addZigzag    = require('../strategy/indicators/zigzag').addZigzag;
const percentZzMin = 3;
const percentZzBrk = 7.5;

const ratioRev     = 0.33;

function expectedMarketBehaviorCount(timeframes, cb) {
  if (!(timeframes instanceof Array)) {
    cb('wrong timeframes data for expectedMarketBehaviorCount():', (typeof timeframes));
    return;
  }
  
  for (i = 0; ++i < timeframes.length;) {
    addZigzag(timeframes, i, percentZzMin);
  }

  let result = {
    scBrk1h: 0,
    scRng1h: 0,
    scRev1h: 0,
  };

  let zzPrev;
  let brkPrev;

  // !!! it must be done in the separate loop, after addZigzag-loop is finished
  for (let tf of timeframes) {
    if (tf.swing) {

      // TODO: check if swing direction is correct!!!

      if (zzPrev) {
        let height = Math.abs(tf.close - zzPrev);
        if (brkPrev) {
          if (height / brkPrev >= ratioRev) {
            
            // ??? is it correct if previous breakout is "reversal" also
            result.scRev1h++;
          }  
        }

        if (100 * height / zzPrev >= percentZzBrk) {
          result.scBrk1h++;
          brkPrev = height;
        } else {
          if (!brkPrev) {
            
            // TODO: count it correctly!!!
            result.scRng1h++;
          }

          brkPrev = undefined;
        } 
      }
      zzPrev = tf.close;
    }  
  }  

  cb(null, result);
}
