module.exports = {atrInd};

function atrInd(period) {
  return (timeframe, timeframes) => {
    
    if (!timeframe) {
      throw new Error('no interval');
    }
    
    arr = [...timeframes, timeframe];
    atr = calculate(timeframe, arr[timeframes.length-1], period);   
    return atr;
  };
}

function calculate(currentData, yesterdayData, period) {
  let highToday = currentData.high;
  let lowToday = currentData.low;

  
  if (!yesterdayData) {
    atr = highToday-lowToday;
  } else {

    let highYesterday = yesterdayData.high;
    let lowYesterday = yesterdayData.low;
    let atrYesterday = yesterdayData.indicators.atr;
    let tr = Math.max((highToday-lowToday), Math.abs(highToday-lowYesterday),  Math.abs(lowToday-highYesterday));
  
    atr = ((tr - atrYesterday) * (2/(14+1))) + atrYesterday;
  }
  return atr;
}

