module.exports = {rsiInd};
// For each trading period an upward change U or downward change D is calculated. Up periods are characterized by the close being higher than the previous close:
// U = close_now - close_previous
// D = 0

// Conversely, a down period is characterized by the close being lower than the previous period's close (note that D is nonetheless a positive number),
// U = 0
// D = close_previous - close_now

// If the last close is the same as the previous, both U and D are zero. 
// The average U and D are calculated using an n-period smoothed or modified moving average (SMMA or MMA) which is an exponentially smoothed Moving Average with α = 1/period. Some commercial packages, like AIQ, use a standard exponential moving average (EMA) as the average instead of Wilder's SMMA.

// Wilder originally formulated the calculation of the moving average as: 
// newval = (prevval * (period - 1) + newdata) / period. 
// This is fully equivalent to the aforementioned exponential smoothing. New data is simply divided by period which is equal to the alpha calculated value of 1/period. Previous average values are modified by (period -1)/period which in effect is period/period - 1/period and finally 1 - 1/period which is 1 - alpha.

// The ratio of these averages is the relative strength or relative strength factor:
// RS = SMMA(U,n) / SMMA(D,n)
// If the average of D values is zero, then according to the equation, the RS value will approach infinity, so that the resulting RSI, as computed below, will approach 100.

// The relative strength factor is then converted to a relative strength index between 0 and 100:[1]
// RSI = 100 - 100 / (1+RS)
// The smoothed moving averages should be appropriately initialized with a simple moving average using the first n values in the p

function rsiInd(period) {
  return (timeframe, timeframes) => {
    
    if (!timeframe) {
      throw new Error('no interval');
    }
    arr = [...timeframes, timeframe];
    inRsi = calculate(timeframe, arr[timeframes.length-1], period); 
    return inRsi;
  };  
}

function calculate(currentData, yesterdayData, period) {
  let highToday = currentData.high;
  let lowToday = currentData.low;
  let closeToday = currentData.close;
  let emaUp;
  let emaDown;
  let rsi;
  
  if (!yesterdayData) {
    rsi = 100;
    emaUp = 0;
    emaDown = 0;

  } else {

    let highYesterday = yesterdayData.high;
    let lowYesterday = yesterdayData.low;
    let closeYesterday = yesterdayData.close;

    let hlcYesterday = (highYesterday + lowYesterday + closeYesterday) / 3;
    let hlcToday = (highToday + lowToday + closeToday) / 3;

    let downHlc = -1 * Math.min((hlcToday-hlcYesterday), 0);
    let upHlc = Math.max((hlcToday-hlcYesterday), 0);

    let emaUpYesterday = yesterdayData.indicators.emaUp;
    let emaDownYesterday = yesterdayData.indicators.emaDown;
    multiplier = 2 / (period + 1);

    emaUp = ((upHlc - emaUpYesterday) * multiplier) + emaUpYesterday;  // =(M3-O2)*(2/(14+1))+O2
    emaDown = ((downHlc - emaDownYesterday) * multiplier) + emaDownYesterday;
    
    if (emaDown == 0) {
      rsi = 100;
    } else {
      rsi = 100 - (100 / (1+ (emaUp / emaDown)));
    }
  }
  return rsi;
}
// test ---------------------------------------------  

// let interval = {close: 10};
// let intervals = [{close: 11},{close: 9},{close: 8},{close: 10},{close: 10}]; 
// // {close: 9},{close: 11},{close: 9},{close: 9},
// let aa = rsiInd(5)(interval, intervals);
// console.log(aa);
