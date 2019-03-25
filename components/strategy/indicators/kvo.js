module.exports = { kvoInd };


function kvoInd(period, period2) {
  return (timeframe, timeframes) => {
    
    if (!timeframe) {
      throw new Error('no interval');
    }

    arr = [...timeframes, timeframe];
    kvo = calculate(timeframe, arr[timeframes.length-1], period, period2);
    return kvo;
  };  
}

function calculate(currentData, yesterdayData, period) {
  if (!yesterdayData) {
    kvo = [];
    trendYesterday = -1;
  } else {
    cmYesterday = yesterdayData.indicators.cm;
    highYesterday = yesterdayData.high;
    lowYesterday = yesterdayData.low;
    closeYesterday = yesterdayData.close;
    dmYesterday = highYesterday - lowYesterday;
    trendYesterday = yesterdayData.indicators.trend;

    let high = currentData.high;
    let low = currentData.low;
    let close = currentData.close;
    let volume = currentData.volume;

    if ((high + low + close) > (highYesterday + lowYesterday + closeYesterday)) {
      trend = 1;
    } else {
      trend = -1;
    }
    dm = high - low;
    if (trend == trendYesterday) {
      cm = cmYesterday + dm;
    } else {
      cm = dmYesterday + dm;
    }
    if (cm == 0) {
      temp = -2;
    } else {
      temp = Math.abs(2 * (dm/cm -1));
    }
    vf = volume * temp * trend * 100;
    emaMultiplier1 = (2 / (period + 1));
    emaMultiplier2 = (2 / (period2 + 1));
    emaMultiplier13 = (2 / (13 + 1));
    ema34Yesterday = yesterdayData.indicators.ema34;
    ema55Yesterday = yesterdayData.indicators.ema55;
    koFast = ((closeToday - vf) * emaMultiplier1) + vf;
    koSlow = ((closeToday - vf) * emaMultiplier2) + vf;
    ko = koFast - koSlow;
    kos = ((closeToday - ko) * emaMultiplier13) + ko;
    kvo = [ko, kos];
  }
}
