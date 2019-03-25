const util = require('util');
const request = require('request');

const ohlcsCommon = require('../data-common/candles');
const intervalCommon = require('../data-common/interval');

module.exports = {key, getOne, getInterval};

const intervalsCC = {
  '8h': '1h',
  '2h': '1h',
  '5m': '1m',
  '30m': '1m',
};

function key() {
  return 'cryptocompare';
}  

// https://min-api.cryptocompare.com/documentation?key=Historical&cat=dataHistominute
// Minute data for USDT-USD is only available for the last 7 days
// max limit == 2000, default limit == 1440

function getOne(exchange, base, quote, dateStart, interval, cb) {
  let intervalCC = intervalsCC.hasOwnProperty(interval) ? intervalsCC[interval] : interval;
  let dateFinish = new Date(dateStart.getTime() + intervalCommon.duration(interval));

  getInterval(exchange, base, quote, dateStart, dateFinish, intervalCC, ohlcvs => {
    cb(ohlcsCommon.summa(ohlcvs));
  });
}

function getInterval(exchange, base, quote, dateStart, dateFinish, interval, cb) {
  let durationOne = intervalCommon.duration(interval);

  let intervalUrl = getIntervalUrl(interval);
  if (!intervalUrl) {
    console.error(`bad interval: "${interval}"`);
    cb(null);
    // return null;
  }

  let historyDuration = (dateFinish ? dateFinish : new Date()) - dateStart;
  let limit = Math.round(historyDuration / durationOne);

  let upcExchange = exchange.toUpperCase();
  let upcBase = base.toUpperCase();
  let upcQuote = quote.toUpperCase();

  if (upcBase == 'IOTA') {
    upcBase = 'IOT';
  }

  let finish = dateFinish ? '&toTs=' + Math.round(dateFinish.getTime() / 1000) : '';
  url = util.format(
      'https://min-api.cryptocompare.com/data/%s?e=%s&fsym=%s&tsym=%s&limit=%d' + finish,
      intervalUrl, upcExchange, upcBase, upcQuote, limit);

  console.log(url);

  const now = new Date();
  request(url, function(err, res, body) {
    let ohlcvs = [];
    if (err) {
      console.error(`can't do Cryptocompare.com request: "${url}" `, err.Error);
      cb(null);
      return null;
    }

    if (res.statusMessage != 'OK') {
      console.error(`can't do Cryptocompare.com request: "${url}", code: ${res.statusCode}, headers: `, res.headers);
      cb(null);
      return null;
    }

    let data;
    try {
      data = JSON.parse(body);
    } catch (err) {
      console.error(`can't parse Cryptocompare.com response from: "${url}",\nbody: "${body}"`, err);
      cb(null);
      return null;
    }

    if (data.Response == 'Error') {
      console.error(data.Response, data.Message);
      cb(null);
      return null;
    }

    if (data.Response == 'Success') {
      for (let item of data.Data) {
        timeStart = new Date(item.time * 1000);

        const finishInterval = new Date(timeStart.getTime() + durationOne);
        // console.log('!!!: ', 't: ', timeStart, ' now: ', now, ' dur: ', durationOne,
        //     ' (now > t + dur):', now > finishInterval, ' t + dur: ', finishInterval);

        if ((timeStart - dateStart >= 0) &&
            (!dateFinish || (dateFinish - timeStart >= durationOne)) &&
            (now > finishInterval)) {   // ignore interval which contains current time
          // console.log("+");

          ohlcvs.push({
            Exchange:   exchange,
            Base:       base,
            Quote:      quote,
            TimeStart:  timeStart, 
            PriceOpen:  item.open,
            PriceHigh:  item.high,
            PriceLow:   item.low,
            PriceClose: item.close,
          });
        }
      }

      cb(ohlcvs);
    }
  });
}

const intervalUrls = {
  '1d': 'histoday',
  '1h': 'histohour',
  '1m': 'histominute',
};

function getIntervalUrl(interval) {
  return intervalUrls.hasOwnProperty(interval) ? intervalUrls[interval] : '';
}
