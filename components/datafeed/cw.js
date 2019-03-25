const util = require('util');
const request = require('request');

const ohlcsCommon = require('../data-common/candles');
const intervalCommon = require('../data-common/interval');

module.exports = {key, getOne, getInterval};

function key() {
  return 'cryptowatch';
}  

function getOne(exchange, base, quote, dateStart, interval, cb)  {
  let duration = intervalCommon.duration(interval);
  if (duration <= 0) {
    console.error('wrong interval: %s, duration = %d', interval, duration);
    cb();
  }

  let dateFinish = new Date(dateStart.getTime() + duration);

  // console.log(3333333, dateStart, dateFinish, duration);

  if (interval === '8h') {
    let ohlcvs = getInterval(exchange, base, quote, dateStart, dateFinish, '1h');
    if (!ohlcvs) {
      cb();
    }
    cb(ohlcsCommon.summa(ohlcvs));
    // if summa == nil {
    //   return nil, errors.Errorf("no data for %s, %s, %s, %s, %s", exchange, base, quote, dateFinish.Format(time.RFC3339), interval)
    // }
  }

  getInterval(exchange, base, quote, dateStart, dateFinish, interval, ohlcvs => {
    if (!(ohlcvs instanceof Array) || ohlcvs.length !== 1) {
      console.error(
          'incorrect result on Cryptowatch.GetInterval(%s, %s, %s, %s, %s, %d):',
          exchange, base, quote, dateStart, dateFinish, interval, ohlcvs);
      cb();
    }

    cb(ohlcvs[0]);
  });
}

// acceptable durations
// 60 1m
// 180 3m
// 300 5m
// 900 15m
// 1800 30m
// 3600 1h
// 7200 2h
// 14400 4h
// 21600 6h
// 43200 12h
// 86400 1d
// 259200 3d
// 604800 1w

function getInterval(exchange, base, quote, dateStart, dateFinish, interval, cb) {
  let durationOne = intervalCommon.duration(interval);
  if (durationOne <= 0) {
    console.error('wrong interval: %s, duration = %d', interval, durationOne);
    cb();
  }
  durationOneSec = '' + durationOne;
  durationOneSec = durationOneSec.substring(0, durationOneSec.length - 3);

  if (durationOneSec !== '60' && durationOneSec !== '300' && durationOneSec !== '1800' && durationOneSec !== '3600' && durationOneSec !== '7200' && durationOneSec !== '86400') {
    console.errors('wrong interval for cryptowat.ch: %s (%s)', interval, durationOneSec);
    cb();
  }

  // r.SetHeader("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.167 Safari/537.36")

  let exchangeCorrected = exchange.toLowerCase();
  if (exchangeCorrected === 'coinbase') {
    exchangeCorrected = 'coinbase-pro';
  }

  let baseCorrected = base.toLowerCase();
  if (baseCorrected === 'iota') {
    baseCorrected = 'iot';
  }

  let before = dateFinish ? '&before=' + dateFinish.getTime() / 1000 : '';
  let url = util.format('https://api.cryptowat.ch/markets/%s/%s/ohlc?after=%d&periods=%d' + before,
      exchangeCorrected,
      (baseCorrected+quote).toLowerCase(),
      Math.round(dateStart.getTime() / 1000),
      durationOneSec);

  console.log(url);
  const now = new Date();
  request(url, (err, res, body) => {
    if (res.statusMessage != 'OK') {
      console.error(`can't do Cryptowat.ch request: "${url}", code: ${res.statusCode}, headers: `, res.headers);
      cb();
      return;
    }

    let data;
    try {
      data = JSON.parse(body);
    } catch (err) {
      console.error(`can't parse Cryptowat.ch response from: "${url}",\nbody: "${body}"`, err);
      cb();
      return;
    }

    if (!data || !data.result) {
      console.error(`wrong Cryptowat.ch response from: "${url}",\nbody: "${body}" --> `, data);
      cb();
      return;
    }
    let ohlcvs = cwOhlcvs(data.result, exchange, base, quote, interval, dateStart, dateFinish, now);
    cb(ohlcvs);
  });
}

function cwOhlcvs(cwResponse, exchange, base, quote, interval, dateStart, dateFinish, now) {
  let duration = intervalCommon.duration(interval);
  if (duration <= 0) {
    console.error('wrong interval: %s, duration = %d', interval, duration);
    return null;
  }
  durationSec = '' + duration;
  durationSec = durationSec.substring(0, durationSec.length - 3);

  ohlcvsOriginal = cwResponse[durationSec];
  if (!ohlcvsOriginal) {
    console.error('no ohlcv data for %d intervals', durationSec);
    return null;
  }

  let ohlcvs = [];

  for (let ohlcvOriginal of ohlcvsOriginal) {
    if (ohlcvOriginal.length < 6) {
      console.error('bad data from cryptowat.ch', ohlcvOriginal);
      continue;
    }

    let timeFinish = new Date(ohlcvOriginal[0] * 1000);
    let timeStart = new Date(timeFinish.getTime() - duration);
    const finishInterval = new Date(timeStart.getTime() + duration);

    // console.log(4444444, ohlcvOriginal, timeStart, ' ', dateStart, ' ', dateFinish);

    if ((timeStart - dateStart >= 0) &&
        (!dateFinish || (dateFinish - timeStart >= duration)) &&
        (now > finishInterval)) {  // ignore interval which contains current time

      // console.log('+');

      ohlcvs.push({
        Exchange:     exchange,
        Base:         base,
        Quote:        quote,
        TimeStart:    new Date(timeStart),
        PriceOpen:    ohlcvOriginal[1],
        PriceHigh:    ohlcvOriginal[2],
        PriceLow:     ohlcvOriginal[3],
        PriceClose:   ohlcvOriginal[4],
        VolumeTraded: ohlcvOriginal[5],
      });
    }
  }

  return ohlcvs;
}

