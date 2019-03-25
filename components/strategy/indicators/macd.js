// https://runkit.com/anandaravindan/macd
module.exports = {macdInd};

function macdInd(period, period2) {
  return (timeframe, timeframes) => {
      
    if (!timeframe) {
      throw new Error('no interval');
    }
  
    arr = [...timeframes, timeframe];
    macd = calculate(timeframe, arr[timeframes.length-1], period, period2);
    return macd;
  };  
}
  
function calculate(currentData, yesterdayData, period, period2) {
  let closeToday = currentData.close;
  if (!yesterdayData) {
    macd = 0;
    
  } else {
    emaMultiplier1 = (2 / (period + 1));
    emaMultiplier2 = (2 / (period2 + 1));
    ema12Yesterday = yesterdayData.indicators.ema12;
    ema26Yesterday = yesterdayData.indicators.ema24;
    ema12 = ((closeToday - ema12Yesterday) * emaMultiplier1) + ema12Yesterday;
    ema26 = ((closeToday - ema26Yesterday) * emaMultiplier1) + ema26Yesterday;
    macd = ema12 - ema26;
  }    
  return macd;
}
