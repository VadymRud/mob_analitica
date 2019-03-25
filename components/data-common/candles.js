module.exports = {summa, summaArr, summaOld, aggregateOld, convertOld};

let duration = require('./interval').duration;

// Candle {
//   exchange     string 
//   base         string     
//   quote        string
//   timeStart    Date
//   open         float
//   high         float
//   low          float
//   close        float
//   volume       float
//   tradesCount  integer
// }

function summa(candles) {
  if (!candles || (candles.length < 1)) {
    return null;
  } 

  if (candles.length == 1) {
    return candles[0];
  }

  let s = candles[0];

  for (let candle of candles.slice(1)) {
    if (candle.high > s.high) {
      s.high = candle.high;
    }
    if (candle.low < s.low) {
      s.low = candle.low;
    }
    s.close = candle.close;
    if (s.hasOwnProperty('volumeTraded')) {  // TODO: remove it!!!
      s.volume += candle.volumeTraded;
    } else if (s.hasOwnProperty('volume')) {
      s.volume += candle.volume;
    }

    if (s.hasOwnProperty('tradesCount')) {
      s.tradesCount  += candle.tradesCount;
    }
  }

  // TODO??? remove this check
  if (!(s.low > 0)) {
    s.low = s.high;  // TODO: check open & close also
  } else if (!(s.high >= s.low)) {
    s.high = s.low;
  } 

  return s;
}

function summaArr(arr) {
  if (!(arr instanceof Array) || (arr.length < 1)) {
    return null;
  } 

  let s = {
    open:   arr[0][1],
    high:   arr[0][2],
    low:    arr[0][3],
    close:  arr[0][4],
    volume: arr[0][5],
  };


  for (let a of arr.slice(1)) {
    if (a[2] > s.high) {
      s.high = a[2];
    }
    if (a[3] < s.low) {
      s.low = a[3];
    }
    s.close   = a[4];
    s.volume += a[5];
  }

  // TODO??? remove this check
  if (!(s.low > 0)) {
    s.low = s.high;  // TODO: check open & close also
  } else if (!(s.high >= s.low)) {
    s.high = s.low;
  } 

  return s;
}



// legacy code -----------------------------------------------------------------------------------------


// DEPRECATED
function summaOld(ohlcs) {
  if (!ohlcs || (ohlcs.length < 1)) {
    return null;
  } else if (ohlcs.length == 1) {
    return ohlcs[0];
  }

  let s = ohlcs[0];

  for (let ohlc of ohlcs.slice(1)) {
    if (ohlc.PriceHigh > s.PriceHigh) {
      s.PriceHigh = ohlc.PriceHigh;
    }
    if (ohlc.PriceLow < s.PriceLow) {
      s.PriceLow = ohlc.PriceLow;
    }
    s.PriceClose = ohlc.PriceClose;
    if (s.hasOwnProperty('VolumeTraded')) {
      s.VolumeTraded += ohlc.VolumeTraded;
    }
    if (s.hasOwnProperty('TradesCount')) {
      s.TradesCount  += ohlc.TradesCount;
    }
  }

  if (!(s.PriceLow > 0)) {
    s.PriceLow = s.PriceHigh;  // TODO: check open & close also
  } else if (!(s.PriceHigh >= s.PriceLow)) {
    s.PriceHigh = s.PriceLow;
  } 

  return s;
}

// DEPRECATED
function convertOld(ohlcs) {
  if (!(ohlcs instanceof Array)) {
    return undefined;
  }

  return ohlcs.map(
    o => ({
      exchange:     o.Exchange,
      base:         o.Base,
      quote:        o.Quote,
      timeStart:    o.TimeStart,
      open:         o.PriceOpen,
      high:         o.PriceHigh,
      low:          o.PriceLow,
      close:        o.PriceClose, 
      volume:       o.VolumeTraded,
      tradesCount:  o.TradesCount,
    })
  );
}

// DEPRECATED
function aggregateOld(ohlcs, interval) {  
  let tfDuration = duration(interval);

  if (ohlcs.length < 1 || !(tfDuration > 0)) {
    return [];
  }

  ohlcs = convertOld(ohlcs);                       // TODO!!! remove this kostyl

  let timeStart  = ohlcs[0].timeStart;
  let timeFinish = ohlcs[ohlcs.length-1].timeStart;

  if (interval == '1h') {
    timeStart.setUTCHours(timeStart.getUTCHours(), 0, 0, 0);
  } else if (interval == '1d') {
    timeStart.setUTCHours(0, 0, 0, 0);
  } else {
    // TODO!!!
    return [];
  }

  let ohlcsAggregated = [];
  
  let i = 0;
  let buffer = [];
  while (timeFinish - timeStart >= 0) {
    while (i < ohlcs.length && (ohlcs[i].timeStart - timeStart) < tfDuration) {
      buffer.push(ohlcs[i]);
      ++i;
    }

    timeFinishThis = new Date(timeStart - (-tfDuration));

    if (buffer.length) {
      let s = summa(buffer);
      s.timeStart = timeStart;
      s.date      = timeFinishThis;
      ohlcsAggregated.push(s);
      buffer = [];
      // TODO!!! add fakes
    }
    
    timeStart = timeFinishThis;
  }

  return ohlcsAggregated;
}
