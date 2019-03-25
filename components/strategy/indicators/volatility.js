module.exports = {avgATR};

function avgATR(ohlcs) {
  if (ohlcs.length < 1) { 
    return 0;
  }
  
  let atrSum = ohlcs.reduce(
      (acc, ohlc, i) => {
        return acc + (
            (i == 0)                         ? ohlc.high - ohlc.low
            : (ohlcs[i-1].close < ohlc.low)  ? ohlc.high - ohlcs[i-1].close
            : (ohlcs[i-1].close > ohlc.high) ? ohlcs[i-1].close - ohlc.low
            :                                  ohlc.high - ohlc.low
        );
      }, 0
  );
  
  return atrSum / ohlcs.length;
}