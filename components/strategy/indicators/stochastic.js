module.exports = {stochasticInd};

// LN — the lowest price for the last N periods
// HN — the highest price for the last N periods
// %K = 100 * (close - LN) / (HN - LN) 
// %D = SMA(%K, N1)

function stochasticInd(period) {
  return (timeframe, timeframes) => {
    
    if (!timeframe) {
      throw new Error('no interval');
    }
    arr = [...timeframes, timeframe];
    stoch = calculate(timeframe, arr.slice(period * (-1)), period);  
    return stoch;
  };  
}

function calculate(currentData, yesterdayData, period) {
  if (!yesterdayData) {
    throw new Error('No Data!');
  }
  let closeToday = currentData.close;
  let minLow = 0;
  let maxHigh = 0;
  let minLowArr = [];
  let maxHighArr = [];
  
  for (i=0; i<period; i++) {
    minLowArr.push(yesterdayData[i].low);
    maxHighArr.push(yesterdayData[i].high);
  }
  minLow = Math.min(minLowArr);
  maxHigh = Math.max(maxHighArr);
  stoK = 100 * ((closeToday-minLow) / (maxHigh-minLow)); // =100*(H6-MIN(G2:G6))/(MAX(F2:F6)-MIN(G2:G6))
  let sumAH = 0;
  for (i=0; i<yesterdayData.length; i++) {
    sumAH += yesterdayData[i].indicators.sto_k;
  }
  ah = sumAH / yesterdayData.length;
  
  let sumD = 0;
  for (i=0; i<yesterdayData.length; i++) {
    sumD += yesterdayData[i].indicators.sto_ah;
  }
  stoD = sumD / yesterdayData.length;
  
  return [stoK, ah, stoD];
}
