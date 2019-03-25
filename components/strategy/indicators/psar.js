module.exports = {psarInd};

function psarInd(period) {
  return (timeframe, timeframes) => {
      
    if (!timeframe) {
      throw new Error('no interval');
    }
  
    arr = [...timeframes, timeframe];
    psar = calculate(timeframe, arr[timeframes.length-1], period);
    return psar;
  };  
}
  
function calculate(currentData, yesterdayData, period) {
  let highToday = currentData.high;
  
      
  if (!yesterdayData) {
    psar = 0;
    
  } else {
    let psarYesterday = yesterdayData.indicators.psar;
    highYesterday = yesterdayData.high;
    highYesterday = yesterdayData.low;
    af = 0.2; // ??? Anna
    psar = psarYesterday + af;
  }    
  return psar;
}
