// chaikin money flow
module.exports = {cmfInd};

function cmfInd(period) {
  return (timeframe, timeframes) => {
    
    if (!timeframe) {
      throw new Error('no interval');
    }

    arr = [...timeframes, timeframe];
    chaykin = calculate(timeframe, arr.slice(period * (-1)), period);  


    return chaikin;
  };  
}

function calculate(currentData, yesterdayData, period) {
  if (!yesterdayData) {
    throw new Error('Data!');
  }
  let chaikin = 0; //  =((H5-  G5) - (F5 - H5)) /(F5 - G5)

  let an = [];  //
  for (i=0; i<5; i++) {
    let high = yesterdayData[i].high; // F
    let low = yesterdayData[i].low; // G
    let close = yesterdayData[i].close; // H
    
    anI = ((high - low) -(high - close))/(high-low);
    an.push(ani);
    
  }

  for (i=0; i<an.length; i++) {
    anS += an[i]; 
  }

  chaikin = anS / an.length; 
  return chaikin;
}
