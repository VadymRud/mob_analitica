module.exports = {bandsSMAInd, bandsInd, bandsOcInd};

const math   = require('mathjs');
const basics = require('./basics');

function bandsSMAInd(period, K) {
  return (timeframe, timeframes) => {
    if (!interval) {
      throw new Error('no interval');
    }

    if (period > intervals.length + 1) {
      throw new Error('period isn\'t full');
    }

    let [sma, stDev] = basics.smaDev(timeframe, timeframes, period);   
    return [sma + K * stDev, sma - K * stDev];
  };  
}

function bandsInd(period0Ema, multiplierEma, period0, multiplier) {
  if (!(period0 > 0)) {
    period0 = 1;
  }
  if (!(period0Ema > 0)) {
    period0Ema = 1;
  }

  return (timeframe, timeframesPrev) => {
    // if (!timeframe) {
    //   throw 'no timeframe';
    // }
    // if (!(timeframesPrev instanceof Array)) {
    //   timeframesPrev = [];
    // }

    let period          = (period0 > timeframesPrev.length + 1) ? timeframesPrev.length + 1 : period0;
    let periodIsNotFull = period < period0;

    let ema;
    let stDev = math.std([...timeframesPrev.slice(timeframesPrev.length + 1 - period), timeframe].map(basics.hlc));
    if (timeframesPrev.length > 1) {
      let yesterdayEma = timeframesPrev[timeframesPrev.length - 1].indicators.ema;
      ema = ((basics.hlc(timeframe) - yesterdayEma) * multiplierEma) + yesterdayEma;
    } else {
      ema = basics.hlc(timeframe);
    }
    let bands = [
      ema + multiplier * stDev, // upper
      ema - multiplier * stDev, // lower 
    ];

    if (timeframe.indicators instanceof Object) {
      timeframe.indicators.ema = ema;
      timeframe.indicators.stDev = stDev;
      timeframe.indicators.bands = bands;
    } else {  
      timeframe.indicators = {ema, stDev, bands};
    }

    if (periodIsNotFull) {
      throw basics.errPeriodIsntFull;
    }

    return bands;
  };  
}

function bandsOcInd(period0EmaOc, multiplierEmaOc, period0, multiplier) {
  if (!(period0 > 0)) {
    period0 = 1;
  }
  if (!(period0EmaOc > 0)) {
    period0EmaOc = 1;
  }


  return (timeframe, timeframesPrev) => {
    // if (!timeframe) {
    //   throw 'no timeframe';
    // }
    // if (!(timeframesPrev instanceof Array)) {
    //   timeframesPrev = [];
    // }

    let period          = (period0 > timeframesPrev.length + 1) ? timeframesPrev.length + 1 : period0;
    let periodIsNotFull = period < period0;

    let emaOc;
    let stDevOc = math.std([...timeframesPrev.slice(timeframesPrev.length + 1 - period), timeframe].map(basics.oc));
    if (timeframesPrev.length > 1) {
      let yesterdayEmaOc = timeframesPrev[timeframesPrev.length - 1].indicators.emaOc;
      emaOc = ((basics.oc(timeframe) - yesterdayEmaOc) * multiplierEmaOc) + yesterdayEmaOc;
    } else {
      emaOc = basics.oc(timeframe);
    }
    let bandsOc = [
      emaOc + multiplier * stDevOc, // upper
      emaOc - multiplier * stDevOc, // lower 
    ];

    if (timeframe.indicators instanceof Object) {
      timeframe.indicators.emaOc   = emaOc;
      timeframe.indicators.stDevOc = stDevOc;
      timeframe.indicators.bandsOc = bandsOc;
    } else {  
      timeframe.indicators = {emaOc, stDevOc, bandsOc};
    }

    if (periodIsNotFull) {
      throw basics.errPeriodIsntFull;
    }

    return bandsOc;
  };  
}

