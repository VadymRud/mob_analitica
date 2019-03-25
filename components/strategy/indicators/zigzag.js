module.exports = {addZigzag};

let zzPercentDefault = 3;

function addZigzag(intervals, i, zzPercent) {

  let pivotChg  = (zzPercent || zzPercentDefault) * 0.01;

  intervals[i].trend = (intervals[i-1].trend == undefined) ? 1 : intervals[i-1].trend;
  
  if (intervals[i-1].LL == undefined) {
    intervals[i].LL  = intervals[i].low;
    intervals[i].LLI = i;
  } else {
    intervals[i].LL  = intervals[i-1].LL;
    intervals[i].LLI = intervals[i-1].LLI;
  }
  if (intervals[i-1].HH == undefined) {
    intervals[i].HH  = intervals[i].high;
    intervals[i].HHI = i;
  } else {
    intervals[i].HH  = intervals[i-1].HH;
    intervals[i].HHI = intervals[i-1].HHI;
  }

  let ii = i - 1;  // but may be: ii = i;

  if (intervals[i].trend > 0) { // trend is up, look for new swing low
    if (intervals[i].high >= intervals[i].HH) { // new higher high detected
      intervals[i].HH = intervals[i].high;
      intervals[i].HHI = i;
    } else if (intervals[i].low < intervals[i].HH * (1 - pivotChg)) {
      ii                   = intervals[i].HHI;
      intervals[ii].zigzag = intervals[i].HH;
      intervals[ii].swing  = intervals[ii].zigzag;
      intervals[ii].trend  = -1;                      // for charting
      intervals[i].trend   = -1;
      intervals[i].LL      = intervals[i].low;
      intervals[i].LLI     = i;
    }    
  } else { // trend is down, look for new swing high
    if (intervals[i].low <= intervals[i].LL) { // new lower low detected
      intervals[i].LL = intervals[i].low;
      intervals[i].LLI = i;
    } else if (intervals[i].high > intervals[i].LL * (1 + pivotChg)) {
      ii                    = intervals[i].LLI;
      intervals[ii].zigzag = intervals[i].LL;
      intervals[ii].swing  = intervals[ii].zigzag;
      intervals[ii].trend  = 1;                       // for charting
      intervals[i].trend   = 1;
      intervals[i].HH      = intervals[i].high;
      intervals[i].HHI = i;
    }  
  }

  LINE:
  if (intervals[ii].zigzag != undefined) {
    for (let i0 = ii; --i0 > 0;) {
      if (intervals[i0].zigzag != undefined) {

        // if ((Math.abs(intervals[ii].zigzag - intervals[i0].zigzag) < minBreakout) && ((ii - i0) < maxIntervalsToWaitBreak)) {
        //   intervals[ii].zigzag = undefined;
        //   break;
        // } 

        for (let i1 = i0; ++i1 < ii;) {
          intervals[i1].zigzag = intervals[i0].zigzag + 
                                 (intervals[ii].zigzag - intervals[i0].zigzag) * (i1 - i0) / (ii - i0); 
        }
        break LINE;
      }
    }

    if (ii > 0) {
      i0 = 0;
      intervals[i0].zigzag = (intervals[ii].trend > 0) ? intervals[i0].high : intervals[i0].low;
      for (let i1 = i0; ++i1 < ii;) {
        intervals[i1].zigzag = intervals[i0].zigzag + 
                               (intervals[ii].zigzag - intervals[i0].zigzag) * (i1 - i0) / (ii - i0); 
      }
    }
  }
}
