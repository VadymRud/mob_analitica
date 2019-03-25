module.exports = {emaInd, emaOcInd};

const basics  = require('./basics');

// There are three steps to calculate the EMA. Here is the formula for a 5 Period EMA
// 1. Calculate the SMA: (Period Values / Number of Periods)
// 2. Calculate the Multiplier: (2 / (Number of Periods + 1) therefore (2 / (5+1) = 33.333%
// 3. Calculate the EMA (for the first EMA, we use the SMA(previous day) instead of EMA(previous day)):
// EMA = {Close - EMA(previous day)} x multiplier + EMA(previous day)

function emaInd(period, key) {
  let multiplier = 2 / (period + 1);
  
  if (!key) {
    key = 'ema';
  }

  return (timeframe, timeframesPrev) => {
    // if (!timeframe) {
    //   throw new Error('no timeframe');
    // }

    // if (!(timeframesPrev instanceof Array)) {
    //   timeframesPrev = [];
    // }

    let periodIsNotFull = false;
    if (period > timeframesPrev.length + 1) {
      periodIsNotFull = true;
    }  
    
    let ema;

    // ema = calculate(timeframe, timeframesPrev[timeframesPrev.length-1], period, key);

    let src = (timeframe.high + timeframe.low + timeframe.close) / 3;

    if (timeframesPrev.length > 0) {
      let yesterdayEma = timeframesPrev[timeframesPrev.length - 1].indicators[key];
      ema = ((src - yesterdayEma) * multiplier) + yesterdayEma;

    } else {
      ema = src;
    }

    if (timeframe.indicators instanceof Object) {
      timeframe.indicators[key] = ema;
    } else {  
      timeframe.indicators = {key: ema};
    }

    if (periodIsNotFull) {
      throw basics.errPeriodIsntFull;
    }

    return ema;
  };  
}

// function calculate(currentData, yesterdayData, period, key) {
//   let high = currentData.high;
//   let low = currentData.low;
//   let close = currentData.close;
//   let src = (high + low + close) / 3;
//   if (!yesterdayData) {
//     ema = src;
//   } else {
//     multiplier = 2 / (period + 1);

//     yesterdayEma = yesterdayData.indicators[key];
//     ema = ((src - yesterdayEma) * multiplier) + yesterdayEma;
//   }
//   return ema;
// }

function emaOcInd(period, key) {
  let multiplier = 2 / (period + 1);

  if (!key) {
    key = 'emaOc';
  }

  return (timeframe, timeframesPrev) => {
    // if (!timeframe) {
    //   throw new Error('no timeframe');
    // }

    // if (!(timeframesPrev instanceof Array)) {
    //   timeframesPrev = [];
    // }

    let periodIsNotFull = false;
    if (period > timeframesPrev.length + 1) {
      periodIsNotFull = true;
    }  
    
    let srcOc = (timeframe.open + timeframe.close) / 2;   
    let emaOc;

    // console.log(' timeframesPrev!!! ', timeframesPrev); 
    // process.exit();
    
    if (timeframesPrev.length > 0) {
      let yesterdayEmaOc = timeframesPrev[timeframesPrev.length - 1].indicators[key];
      emaOc = ((srcOc - yesterdayEmaOc) * multiplier) + yesterdayEmaOc;
    } else {
      emaOc = srcOc;
    }

    if (timeframe.indicators instanceof Object) {
      timeframe.indicators[key] = emaOc;
    } else {  
      timeframe.indicators = {key: emaOc};
    }

    if (periodIsNotFull) {
      throw basics.errPeriodIsntFull;
    }
    
    return emaOc;
  };  
}


