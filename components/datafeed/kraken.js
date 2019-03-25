const util = require('util');
const request = require('request');

const ohlcsCommon = require('../data-common/candles');
const intervalCommon = require('../data-common/interval');

module.exports = {key, getOne, getInterval};

const intervalsKR = {
  '8h': '1h',
  '2h': '1h',
};

function key() {
  return 'kraken';
}  

function getOne(exchange, base, quote, dateStart, interval, cb) {
  if (exchange.toUpperCase() != 'KRAKEN') {
    console.error('exchange.toUpperCase() != "KRAKEN": %s', exchange);
    cb(null);
    return;
  }

  let duration = intervalCommon.duration(interval);
  if (duration == 0) {
    console.error('duration == 0');
    cb(null);
    return;
  }

  let intervalKR = intervalsKR.hasOwnProperty(interval) ? intervalsKR[interval] : interval;
  let dateFinish = new Date(dateStart.getTime() + duration);

  getInterval(exchange, base, quote, dateStart, dateFinish, intervalKR, ohlcvs => {
    cb(ohlcsCommon.summa(ohlcvs));
  });
}

function getInterval(exchange, base, quote, dateStart, dateFinish, interval, cb) {
  if (exchange.toUpperCase() != 'KRAKEN') {
    console.error('exchange.toUpperCase() != "KRAKEN": %s', exchange);
    cb(null);
    return;
  }

  let duration = intervalCommon.duration(interval);
  if (duration == 0) {
    console.error('duration == 0');
    cb(null);
    return;
  }

  let durationMinutes = Math.round(duration / 60000);
  if (durationMinutes <= 0) {
    console.error('no interval duration in minutes??? %s', duration);
    cb(null);
    return;
  }

  let dateBeforeStartUNIX = (new Date(dateStart.getTime() - duration)).getTime()/1000;

  let url = util.format('https://api.kraken.com/0/public/OHLC?pair=%s%s&interval=%d&since=%d',
      base.toUpperCase(),
      quote.toUpperCase(),
      durationMinutes,
      dateBeforeStartUNIX
  );

  console.log(url);

  const now = new Date();
  request(url, (err, res, body) => {
    let data;
    let ohlcvs = [];

    if (res.statusMessage != 'OK') {
      console.error(`can't do Kraken request: "${url}", code: ${res.statusCode}, headers:`, res.headers);
      cb(null);
      return;
    }

    try {
      data = JSON.parse(body);
    } catch (err) {
      console.error(`can't parse Kraken response from: "${url}",\nbody: "${body}"`, err);
      cb(null);
      return;
    }

    if (data.error.length > 0) {
      console.error('error', data.error);
      cb(null);
      return;
    }

    let pairs = base.toUpperCase() + 'Z' + quote.toUpperCase();
    if (pairs.length === 7) {
      // added 'X' for pairs key if length less 8 (examples: XXRPZEUR, USDTZUSD)
      pairs = 'X' + pairs;
    }
    if ((!data.result.hasOwnProperty(pairs)) || data.result[pairs].length < 1) {
      console.error('no data.result.pairs', data.result);
      cb(null);
      return;
    }

    let timeStart;
    for (let item of data.result[pairs]) {
      if (item.length >= 8) {
        timeStart = new Date(item[0] * 1000);
        const finishInterval = new Date(timeStart.getTime() + duration);
        if ((timeStart - dateStart >= 0) &&
            (!dateFinish || (dateFinish - timeStart >= duration)) &&
            (now > finishInterval)) {  // ignore interval which contains current time
          ohlcvs.push({
            Exchange:     'KRAKEN',
            Base:         base,
            Quote:        quote,
            TimeStart:    timeStart,
            PriceOpen:    parseFloat(item[1]),
            PriceHigh:    parseFloat(item[2]),
            PriceLow:     parseFloat(item[3]),
            PriceClose:   parseFloat(item[4]),
            // 5: parseFloat(item[5]),
            VolumeTraded: parseFloat(item[6]),
            TradesCount:  parseFloat(item[7]),
          });
        }
      }
    }

    // console.log(ohlcvs)
    cb(ohlcvs);
  });
}
