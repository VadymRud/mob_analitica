module.exports = {vortexInd};

const basics  = require('./basics');

// Current true range (TR) = Maximum absolute value of either (current high–current low), (current low–previous close), (current high–previous close)
// Current Vortex Movement Up (VM+) = absolute value of current high – previous low
// Current Vortex Movement Down (VM−) = absolute value of current low – previous high
// Sum of the last N periods’ True Range = SUM TRN
// Sum of the last N periods’ VM+ = SUM VMN+
// Sum of the last N periods’ VM- = SUM VMN−
// VIN+ = SUM VMN+/SUM TRN  
// VIN− = SUM VMN-/SUM TRN 

function vortexInd(period0) {
  return (timeframe, timeframesPrev) => {
    // if (!timeframe) {
    //   throw 'no timeframe';
    // }

    let period = (period0 > timeframesPrev.length) ? timeframesPrev.length : period0;

    if (period < period0) {
      throw basics.errPeriodIsntFull;
    }

    let sumTr      = 0;
    let sumViPlus  = 0;
    let sumViMinus = 0;

    // TODO: use .reduce()
    let timeframes = [...timeframesPrev, timeframe];
    for (let i = timeframes.length - period; ++i < timeframes.length;) {
      int     = timeframes[i];
      intPrev = timeframes[i-1];
      sumTr  += Math.max(
          Math.abs(int.high - int.low), 
          Math.abs(int.low  - intPrev.close), 
          Math.abs(int.high - intPrev.close)
      );

      sumViPlus  += Math.abs(int.high - intPrev.low);
      sumViMinus += Math.abs(int.low  - intPrev.high);
    }

    return [sumViPlus/sumTr, sumViMinus/sumTr];
  };  
}
