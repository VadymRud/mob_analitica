const math = require('mathjs');

const errPeriodIsntFullStr = 'period isn\'t full';
const errPeriodIsntFull    = new Error(errPeriodIsntFullStr); 

module.exports = {
  hlc, oc, smaDev, bands, 
  hlcInd, ocInd, smaInd, smaOcInd, stDevInd, stDevOcInd, 
  errPeriodIsntFull, errPeriodIsntFullStr,
};

// helpers -------------------------------------------------------------------------

function zero() { 
  return 0;
}

function hlc(timeframe) {
  return (timeframe.high + timeframe.low + timeframe.close) / 3;
}

function oc(timeframe) {
  return (timeframe.open + timeframe.close) / 2;
}

function smaDev(timeframe, timeframes, period) {
  let hlcSumma = 0;
  let hlcs     = [];
  let val;

  for (let int of timeframes.slice(timeframes.length + 1 - period)) {
    hlcSumma += (val = hlc(int));
    hlcs.push(val);
  }

  hlcSumma += (val = hlc(timeframe));
  hlcs.push(val);

  return [hlcSumma/period, math.std(hlcs)];
}

function smaDev(timeframe, timeframes, period) {
  let hlcSumma = 0;
  let hlcs     = [];
  let val;

  for (let int of timeframes.slice(timeframes.length + 1 - period)) {
    hlcSumma += (val = hlc(int));
    hlcs.push(val);
  }

  hlcSumma += (val = hlc(timeframe));
  hlcs.push(val);

  return [hlcSumma/period, math.std(hlcs)];
}

function bands(timeframes, iMax, period) {
  let low  = timeframes[iMax].low;
  let high = timeframes[iMax].high;

  for (let i = iMax - period; ++i <= iMax;) {
    let int = timeframes[i];
    if (int.high > high) {
      high = int.high;
    }
    if (int.low > low) {
      low = int.low;
    }
  }

  return [low, high];
}

// strategy indicators -------------------------------------------------------------

function hlcInd() {
  return timeframe => {
    return timeframe ? (timeframe.high + timeframe.low + timeframe.close) / 3 : 0;
  };
}

function ocInd() {
  return timeframe => {
    return timeframe ? (timeframe.open + timeframe.close) / 2 : 0;
  };
}

function smaInd(period0) {
  if (!(period0 > 1)) {
    return hlc;
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

    let hlcSumma = hlc(timeframe);   
    for (let int of timeframesPrev.slice(timeframesPrev.length + 1 - period)) {
      // TODO: use timeframes.slice.reduce()
      hlcSumma += hlc(int);
    }

    let sma = hlcSumma / period;
    if (timeframe.indicators instanceof Object) {
      timeframe.indicators.sma = sma;
    } else {  
      timeframe.indicators = {sma};
    }

    if (periodIsNotFull) {
      throw errPeriodIsntFull;
    }

    return sma;
  };  
}

function smaOcInd(period0) {
  if (!(period0 > 1)) {
    return hlc;
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

    let ocSumma = oc(timeframe);   
    for (let int of timeframesPrev.slice(timeframesPrev.length + 1 - period)) {
      // TODO: use timeframes.slice.reduce()
      ocSumma += oc(int);
    }

    let smaOc = ocSumma / period;
    if (timeframe.indicators instanceof Object) {
      timeframe.indicators.smaOc = smaOc;
    } else {  
      timeframe.indicators = {smaOc};
    }

    if (periodIsNotFull) {
      throw errPeriodIsntFull;
    }

    return smaOc;
  };  
}

function stDevInd(period0) {
  if (!(period0 > 1)) {
    return zero;
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

    let stDev = math.std([...timeframesPrev.slice(timeframesPrev.length + 1 - period), timeframe].map(hlc));
    if (timeframe.indicators instanceof Object) {
      timeframe.indicators.stDev = stDev;
    } else {  
      timeframe.indicators = {stDev};
    }

    if (periodIsNotFull) {
      throw errPeriodIsntFull;
    }

    return stDev;
  };  
}

function stDevOcInd(period0) {
  if (!(period0 > 1)) {
    return zero;
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

    let stDevOc = math.std([...timeframesPrev.slice(timeframesPrev.length + 1 - period), timeframe].map(oc));
    if (timeframe.indicators instanceof Object) {
      timeframe.indicators.stDevOc = stDevOc;
    } else {  
      timeframe.indicators = {stDevOc};
    }

    if (periodIsNotFull) {
      throw errPeriodIsntFull;
    }

    return stDevOc;
  };  
}

