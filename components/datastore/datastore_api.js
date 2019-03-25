const dateUTC = require('../lib-common/date').dateUTC;

const assetsCollName = 'assets';

module.exports = {
  init,

  assetsCollName,

  getCandles,
  getAssets,

  // DEPRECATED
  getOhlcs, checkOhlcsLastDate, countOhlcs,
};

let dbName = 'data';
let client;

function init(clientAsync) {
  client = clientAsync;
  return module.exports;
}

function candlesDateCondition(dateStart, dateFinish) {
  if (!dateStart && !dateFinish) {
    return {};
  }
  let condition = {};
  if (dateStart instanceof Date) {
    condition['$gte'] = dateUTC(dateStart);
  }
  if (dateFinish instanceof Date) {
    condition['$lt'] = dateUTC(dateFinish);
  }
  return {date: condition};
}

// type Interval string = {"1m","5m","15m","30m","1h","2h","3h","4h","6h","8h","12h","1d","1w"}

// exchange, base, quote: string
// interval             : Interval
// dateStart, dateFinish: Date-object or null
// cb                   : function(err, []ohlc)

function getCandles(exchange, base, quote, interval, dateStart, dateFinish, cb) {

  if (interval !== '1h') {
    cb('wrong interval: ' + interval);
    return;
  }

  let collection = client.db(dbName).collection('candles_1h');

  let condition = Object.assign(
      {exchange: exchange, base: base, quote: quote},
      candlesDateCondition(dateStart, dateFinish)
  );

  collection.find(condition).sort({date: 1}).toArray((err, docs) => {
    if (err) {
      console.log('DB error: ', err);
      cb(err);
    }

    cb(null, docs);
  });

}

function getAssets(cb) {
  let collection = client.db(dbName).collection(assetsCollName);

  collection.find().toArray((err, docs) => {
    if (err) {
      console.log('DB error: ', err);
      cb(err);
    }

    cb(null, docs);
  });

}


// legacy code -----------------------------------------------------------------------------------------

// DEPRECATED
function getOhlcs(exchange, base, quote, interval, dateStart, dateFinish, cb) {
  const collection = getCollection(interval);
  let condition = Object.assign(
      {Exchange: exchange, Base: base, Quote: quote},
      getDateCondition(dateStart, dateFinish)
  );

  collection.find(condition).sort({TimeStart: 1}).toArray((err, docs) => {
    if (err) {
      console.log('DB error: ', err);
      cb(err, null);
    }

    cb(null, docs);
  });

}


// type ohlcLastDate {
//    exchange, base, quote: string
//    interval             : Interval
//    lastDate             : Date-object
// }

// interval: Interval
// cb      : function(err, []ohlcLastDate)
function checkOhlcsLastDate(interval, cb) {
  const collection = getCollection(interval);
  collection.aggregate(
      [
        {
          $group:
            {
              _id: {'Exchange': '$Exchange', 'Base': '$Base', 'Quote': '$Quote'},
              lastDate: {$max: '$TimeStart'},
            },
        },
      ]
  ).toArray((err, docs) => {
    if (err) {
      console.log('DB error: ', err);
      cb(err, null);
    }
    let ohlcLastDates = [];
    // docs.forEach((doc) => {
    //   ohlcLastDates.push({
    //     'exchange': doc._id.Exchange,
    //     'base': doc._id.Base,
    //     'quote': doc._id.Quote,
    //     'interval': interval,
    //     'lastDate': doc.lastDate
    //   });
    // });
    docs.forEach((doc) => {
      ohlcLastDates.push([
        doc._id.Exchange,
        doc._id.Base,
        doc._id.Quote,
        interval,
        doc.lastDate,
      ]);
    });
    // console.log('is! res: ', ohlcLastDates);
    cb(null, {
      head: ['Exchange', 'Base', 'Quote', 'Interval', 'Last Date'],
      body: ohlcLastDates,
    });
  });

}

// type ohlcCount {
//    exchange, base, quote: string
//    interval             : Interval
//    dateStart, dateFinish: Date-object
//    count                : uint
// }

// interval: Interval
// dateStart, dateFinish: Date-object or null
// cb      : function(err, []ohlcCount)
function countOhlcs(interval, dateStart, dateFinish, cb) {
  const collection = getCollection(interval);
  let condition = getDateCondition(dateStart, dateFinish);
  console.log('cond: ', condition, dateStart, dateFinish);
  collection.aggregate([
    {$match: condition},
    {$group: {
      _id: {'Exchange': '$Exchange', 'Base': '$Base', 'Quote': '$Quote'}, count: {$sum: 1},
    },
    },
  ]).toArray((err, docs) => {
    if (err) {
      console.log('DB error: ', err);
      cb(err, null);
    }
    let ohlcCounts = [];
    // docs.forEach((doc) => {
    //   ohlcCounts.push({
    //     'exchange': doc._id.Exchange,
    //     'base': doc._id.Base,
    //     'quote': doc._id.Quote,
    //     'interval': interval,
    //     'dateStart': dateStart,
    //     'dateFinish': dateFinish,
    //     'count': doc.count
    //   });
    // });
    // cb(null, ohlcCounts);
    docs.forEach((doc) => {
      ohlcCounts.push([
        doc._id.Exchange,
        doc._id.Base,
        doc._id.Quote,
        interval,
        dateStart,
        dateFinish,
        doc.count,
      ]);
    });
    cb(null, {
      head: ['Exchange', 'Base', 'Quote', 'Interval', 'From', 'To', 'Count'],
      body: ohlcCounts,
    });
  });
}

/**
 * Connect to mongodb && return collection for interval
 *
 * @param interval
 * @return mongodb.collection
 */
function getCollection(interval) {
  // get db connect
  let db = client.db(dbName);
  // TODO: validate interval ???
  return db.collection('ohlc_' + interval);
}

/**
 * Make date condition for mongodb according start & finish date
 *
 * @param dateStart
 * @param dateFinish
 * @returns {*}
 */

// DEPRECATED
function getDateCondition(dateStart, dateFinish) {
  if (!dateStart && !dateFinish) {
    return {};
  }
  let condition = {};
  if (dateStart) {
    condition['$gte'] = new Date(dateStart);
  }
  if (dateFinish) {
    condition['$lt'] = new Date(dateFinish);
  }
  return {TimeStart: condition};
}
