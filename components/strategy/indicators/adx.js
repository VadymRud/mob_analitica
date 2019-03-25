module.exports = {adxInd};


function adxInd(period) {
  return (timeframe, timeframes) => {
    
    if (!timeframe) {
      throw new Error('no interval');
    }

    arr = [...timeframes, timeframe];
    adx = calculate(timeframe, arr[timeframes.length-1], period);
    return adx;
  };  
}

function calculate(currentData, yesterdayData, period) {
  let multiplier = 2 / (period + 1);
  let adx;
  let highToday = currentData.high;
  let lowToday = currentData.low;
    
  if (!yesterdayData) {
    adx = 0;
    atr = highToday-lowToday;
  } else {
    let adxYesterday = yesterdayData.indicators.adx;
    let atr = currentData.indicators.atr;
    let highYesterday = yesterdayData.high;
    
    let lowYesterday = yesterdayData.low;
    

    let upMoveHigh = highToday - highYesterday; // =F3-F2
    let downMove =  lowYesterday- lowToday;

    let dmPlus = 0; // =ЕСЛИ(И(X3>Y3;X3>0);X3;0)
    let dmMinus = 0; // =ЕСЛИ(И(Y3>X3;Y3>0);Y3;0)
    if ((upMoveHigh > downMove) && (upMoveHigh != 0) ) {
      dmPlus = upMoveHigh;
    } else {
      dmPlus = 0;
    }

    if ((downMove > upMoveHigh) && (downMove != 0) ) {
      dmMinus = downMove;
    } else {
      dmMinus = 0;
    }


    let emaDMPlusYesterday = yesterdayData.indicators.emaDMPlus;
    let emaDMMinusYesterday = yesterdayData.indicators.emaDMMinus;

    let emaDMPlus = ((dmPlus - emaDMPlusYesterday) * (2 / (14 + 1)))+emaDMPlusYesterday; // =(Z3-AB2)*(2/(14+1))+AB2 
    let emaDMMinus = ((dmMinus - emaDMMinusYesterday) * (2/(14 + 1))) + emaDMMinusYesterday;
    let diPlus = 100 * emaDMPlus / atr; // =100*AB3/$U3
    let diMinus = 100 * emaDMMinus / atr;
    let adxNotSmoothed = 100* (Math.abs(diPlus - diMinus) / (diPlus + diMinus)); // 100*ABS(AD3-AE3)/(AD3 +AE3)
    adx = ((adxNotSmoothed - adxYesterday) * (2/(14+1)))+ adxYesterday;// (AF3-AG2)*(2/(14+1))+AG2

  }
  return adx;
}
