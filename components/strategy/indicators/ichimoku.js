module.exports = {ichimokuInd};

function ichimokuInd(period, period2) {
  return (timeframe, timeframes) => {
    if (!timeframe) {
      throw new Error('no interval');
    }
    arr = [...timeframes, timeframe];
    ichi = calculate(timeframe, arr, period, period2);
    return ichi;
  };
}

function calculate(currentData, yesterdayData, period, period2) {
  if (!yesterdayData) {
    throw new Error('No Data!');
  }
  // period = 9, period2 = 26 
  let minPeriod1LowArr = [];
  let maxPeriod1HighArr = [];
  
  let minPeriod2LowArr = [];
  let maxPeriod2HighArr = [];
  

  for (i=0; i<period; i++) {
    minPeriod1LowArr.push(yesterdayData[i].low);
    maxPeriod1HighArr.push(yesterdayData[i].high);
  }
  minLowPer1 = Math.min(minPeriod1LowArr);
  maxHighPer1 = Math.max(maxPeriod1HighArr);
  for (i=0; i<period2; i++) {
    minPeriod2LowArr.push(yesterdayData[i].low);
    maxPeriod2HighArr.push(yesterdayData[i].high);
  }
  minLowPer2 = Math.min(minPeriod2LowArr);
  maxHighPer2 = Math.max(maxPeriod2HighArr);
  turningLine = (maxHighPer1 - minLowPer1) /2;
  standardLine = (maxHighPer2 - minLowPer2) /2;
  leadingSpan = ( standardLine + turningLine ) / 2;
  return [turningLine, standardLine, leadingSpan];
}
// Output
// { 
//     "conversion" : 1.33956,
//     "base"       : 1.33723,
//     "spanA"      : 1.33791,
//     "spanB"      : 1.33735
// }