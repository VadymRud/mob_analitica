//  ------------------Shulhin
module.exports = {obvInd};
const TA = require('ta-math');

function obvInd(period) {
  if (!(period > 0)) {
    throw 'no period';
  }
  return (timeframe, timeframes) => {
    if (!timeframe) {
      throw 'no interval';
    }
    const highS = timeframes.map(el=>el.high),
      volumeS = timeframes.map(el=>el.volume);
    return TA.obv(highS, volumeS);
  };  
}