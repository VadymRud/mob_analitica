const YAML       = require('yamljs');
const appInit    = require('../../appinit');
const newDateUTC = require('../../utils-common').newDateUTC;
const summaArr   = require('../../data-common/candles').summaArr;

let environment = process.env.ENV || 'local';
const cfg = YAML.load(`../../../environments/${environment}.yaml`);
const components = [
  require('../../mongodb'),
];

appInit.run(cfg, components, action);

const hourDuration = 3600000;
const dayDuration  = 24 * hourDuration;
const dbName       = 'data';

let   mongodb;
let   coll1m, coll1h, coll1m1440;
let   assetsAll;
let   docs1m1440 = 0; 
let   candles1h = 0; 
let   candles1m = 0; 

function action(cfg, interfaces) {
  if (!(interfaces.mongodb && interfaces.mongodb.client)) {
    console.log('no mongodb.client component');
    process.exit(1);
  }
  mongodb    = interfaces.mongodb.client;
  let db     = mongodb.db(dbName);
  coll1m     = db.collection('ohlc_1m');
  coll1m1440 = db.collection('candles_1m1440');
  coll1h     = db.collection('candles_1h');

  let now  = new Date();
  let date = new Date('2019-01-15T00:00:00.000Z');

  getDistinctAssets(coll1m, (err, assets) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    assetsAll = assets;

    let datesAll = [];
    while (date <= now) {
      datesAll.push(date);
      date = newDateUTC(date.getTime() + dayDuration);
    }

    runDate(datesAll);
  });
}  

function runDate(dates) {
  let date = dates.shift();
  if (date) {
    runAssets(date, assetsAll.map(a => a), () => {runDate(dates);});
    return;
  } 

  console.log('stored docs: %d, stored candles: %d', docs1m1440, candles1m);
  mongodb.close();
}

function runAssets(date, assets, cb) {
  let asset = assets.shift();
  if (asset) {
    processAsset(date, asset, () => {runAssets(date, assets, cb)});
    return;
  } 

  cb();
}

function processAsset(date, asset, cb) {
  console.log('');
  
  let dateNext = newDateUTC(date.getTime() + dayDuration);

  asset.$and = [
    {TimeStart: {$gte: date}},
    {TimeStart: {$lt : dateNext}},
  ];

  coll1m.find(asset).sort({TimeStart:1}).toArray((err, docs) => {    
    if (err) {
      console.error(err);
      process.exit(1);
    }

    let iPrev = -1;
    let docNew = {
      date:     dateNext,
      exchange: asset.Exchange,
      base:     asset.Base,
      quote:    asset.Quote,
      candles:  docs.map(d => [
                  Math.round((d.TimeStart - date) / 60000), d.PriceOpen, d.PriceHigh, d.PriceLow, d.PriceClose, d.VolumeTraded || 0, d.source
                ]).filter(d => {
                  if (d[0] > iPrev) {
                    iPrev = d[0];
                    return true;
                  }
                  
                  return false;
                }),
    };

    candles1m += docNew.candles.length;

    delete asset.$and;
    console.log(docNew.date, asset, docNew.candles.length);

    // console.log(docNew.candles.slice(0, 10));
    // console.log(docNew.candles.slice(docNew.candles.length - 10));
    // process.exit(0);

    if (docNew.candles.length) {
      coll1m1440.insertOne(docNew, err => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
  
        docs1m1440++; 
        console.log('stored candles1m1440: %d, stored candles/1m: %d', docs1m1440, candles1m);

        store1h(docNew, date, err => {
          if (err) {
            console.error(err);
            process.exit(1);
          }
          cb();
        });  
      });  
    } else {
      cb();
    }
  });
}

function aggregate1h(exchange, base, quote, dateStart, arr1d) {  
  if (arr1d.length < 1) {
    return [];
  }

  let docs1h = [];

  let date   = dateStart;
  let i      = 0;

  for (let h = 0; ++h <= 24;) {
    date = newDateUTC(date.getTime() + hourDuration);

    let arr1h = [];
    while ((i < arr1d.length) && (arr1d[i][0] < h * 60)) {
      arr1h.push(arr1d[i]);
      ++i;
    }

    let s = summaArr(arr1h);

    if (s) {
      docs1h.push({
        date:     date,
        exchange: exchange,
        base:     base,
        quote:    quote,
        open:     s.open,
        high:     s.high,
        low:      s.low,
        close:    s.close,
      });
    }    
  }

  return docs1h;
}


function store1h(docNew, dateStart, cb) {
  let docs1h = aggregate1h(docNew.exchange, docNew.base, docNew.quote, dateStart, docNew.candles);

  if (docs1h.length > 0) {
    coll1h.insertMany(docs1h, err => {
      if (!err) {
        candles1h += docs1h.length;
        console.log('stored candles1h: %d', candles1h);
      }
      cb(err);
    });
  } else {
    if (docNew.candles.length > 0) {
      console.error(docNew.candles.length, '???');
      process.exit(1);
    }

    cb();
  } 
}


function getDistinctAssets(coll, cb) {
  let pipeline = [
    {
      '$group': {
        _id : {Exchange: '$Exchange', Base: '$Base', Quote: '$Quote'},
      }
    },
  ];

  coll.aggregate(pipeline, (err, res) => {
    if (err) {
      cb(err);
      return;
    }

    res.toArray((err, docs) => {
      if (err) {
        cb(err);
        return;
      }

      cb(null, docs.map(d => d._id));
    });
  });
}

