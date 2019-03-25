const CronJob = require('cron').CronJob;
const YAML    = require('yamljs');


// default values ----------------------------------------------------------------

const allAssets = require('./list_all_msq_own');
const interval  = '1m';
const dbName    = 'data';

const numberOfDaysOfAvailability = {
  'cc':     7,
  'cw':     1,
  'kraken': 1,
};

let cacheActiveComponents = null;
let cacheCollection = null;


// components init --------------------------------------------------------------

const appInit = require('../../components/appinit');

let environment = process.env.ENV || 'local';
const cfg       = YAML.load(`../../environments/${environment}.yaml`);

const components = [
  require('../../components/mongodb'),
  require('../../components/datafeed'),
];
appInit.run(cfg, components, loadAllConnectors);

new CronJob('00 */5 * * * *', function() {
  console.log("\n -------------- \n", 'Checking every 5 minutes', new Date());
  // check starts only after finishing initial start in appInit.run
  if (cacheActiveComponents) {
    loadAllConnectors(cfg, cacheActiveComponents);
  }
}, null, true, 'Etc/UTC');


// the task to be executed------------------------------------------------------

// final callback in appinit.run()-chain
function exit(err) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  process.exit(0);
}

// main callback to use at start and, further, in CronJob
function loadAllConnectors(config, activeComponents) {
  const connectorsCodes = process.argv.slice(2);
  if (connectorsCodes.length < 1) {
    console.error('connectors codes not passed ...');
    exit();
  }

  // cache components values
  if (!cacheActiveComponents) {
    cacheActiveComponents = activeComponents;
  }
  if (!cacheCollection) {
    let db = activeComponents.mongodb.client.db(dbName);
    cacheCollection = db.collection('ohlc_' + interval);
  }

  loadAllAbsent(config, activeComponents, cacheCollection, connectorsCodes, () => {
    //c activeComponents.mongodb.client.close();
    //c console.log('DB connect CLOSE!');
  });
}

// async loop function to iterate over all connectorCodes (sent from ARGV[])
function loadAllAbsent(config, activeComponents, coll, connectorCodes, cb) {
  if (connectorCodes.length < 1) {
    cb();
    return;
  }
  let connectorCode = connectorCodes.shift();

  let connector = activeComponents.datafeed[connectorCode];

  // let assets = { ... allAssets};
  let assets = JSON.parse(JSON.stringify(allAssets));
  loadOne(assets[connectorCode], interval, coll, connector, connectorCode, () => {
    loadAllAbsent(config, activeComponents, coll, connectorCodes, cb)
  });
}

// async loop function to iterate over all assets within some connectorCode
function loadOne(assets, interval, coll, connector, connectorCode, cb) {
  if (assets == null) {
    console.log("assets not found for connector '%s'", connectorCode);
    cb();
    return;
  }
  if (assets.length < 1) {
    cb();
    return;
  }

  let asset = assets.shift();

  let exchange = asset.exchange;
  let base     = asset.base;
  let quote    = asset.quote;

  console.log('\n', connectorCode, ' : ', exchange, base, quote, interval);

  coll.find({Exchange: exchange, Base: base, Quote: quote}).sort({TimeStart: -1}).limit(1).toArray((err, docs) => {
    if (err){
      console.log('DB error: ', err);
      cb(null);
      return;
    }

    let dateStart;
    let now = new Date(); // Today!
    const availableStart = availableDate(now, connectorCode);
    if (docs == null || docs.length < 1) {
      // data not found for current exchange, set dateStart to current time - number of days of availability
      dateStart = availableStart;
      console.log('old data not found ... start from: ', dateStart);
    } else {
      // dateStart = last found date + interval
      console.log('found last date: ', docs[0].TimeStart);
      dateStart = new Date(docs[0].TimeStart.getTime() + 60 * 1000);
      if (dateStart < availableStart) {
        dateStart = availableStart;
        console.log('last date is older than available date, start from available: ', availableStart);
      }
    }
    let dateFinish = null;
    // one request returns data only for 24h or less
    // if dateStart is less than (current time - 1d), then need set dateFinish = dateStart + 1d, else dateFinish = null
    const oneDayAfterDateStart = new Date(dateStart.getTime() + 24 * 3600 * 1000) ;
    if (oneDayAfterDateStart < now) {
      dateFinish = oneDayAfterDateStart;
    }
    console.log('START: ', dateStart, ' FINISH: ', dateFinish);
    load(exchange, base, quote, dateStart, dateFinish, interval, coll, connector, () => {
      loadOne(assets, interval, coll, connector, connectorCode, cb);
    });
  });
}

// async function to load absent data from the one asset
function load(exchange, base, quote, dateStart, dateFinish, interval, coll, connector, cb) {
  connector.getInterval(exchange, base, quote, dateStart, dateFinish, interval, ohlcvs => {
    if (ohlcvs instanceof Array && ohlcvs.length > 0) {
      let source = connector.key();
      for (let ohlcv of ohlcvs) {
        ohlcv.source = source;
      }
  
      coll.insertMany(ohlcvs, {forceServerObjectId: true}, (err, res) => {
        if (err) {
          console.error(err);
          console.log('inserted (%s / %s / %s): %d', exchange, base, quote, (res ? res.insertedCount : 0));
          if (cb) cb();
        } 
  
        console.log('inserted (%s / %s / %s): %d', exchange, base, quote, (res ? res.insertedCount : 0));
        if (cb) cb();
      });

    } else {
      console.error('no ohlcvs (%s / %s / %s) to store in the database:', exchange, base, quote, ohlcvs);
      if (cb) cb();

    }
  });
}

// creating dateStart for connector
// ??? is it correct ??? can we use the same date for all assets for the connector ??? it should be cleared...
function availableDate(now, connectorCode){
  let daysAgo = numberOfDaysOfAvailability[connectorCode];
  if (daysAgo == null) {
    daysAgo = 1;
  }
  let duration = 3600 * 24 * daysAgo * 1000; // in milliseconds
  return new Date(now - duration);
  // let availableStart = new Date(now - duration);
  // availableStart.setUTCHours(0, 0, 0, 0);
  // return availableStart;
}