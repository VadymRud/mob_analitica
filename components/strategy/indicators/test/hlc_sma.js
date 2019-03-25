const should     = require('should');
const indicators = require('../basics');
const data       = require('../../test/data');
 
describe('hlc_sma', () => {
  it('hlc', () => {
    let ohlc = data.ohlcs1[0];
    let hlc  = indicators.hlc(ohlc);
    should.equal(hlc, (ohlc.high + ohlc.low + ohlc.close) / 3.0);
  });

  it('sma(1)', () => {
    let ohlcs  = data.ohlcs1;
    let smaInd = indicators.smaInd(1);
    
    for (let ohlc of ohlcs) {
      let sma = smaInd(ohlc);
      should.equal(sma, indicators.hlc(ohlc));
    }
  });

  it('sma(2)', () => {
    let ohlcs  = data.ohlcs1;
    let smaInd = indicators.smaInd(2);
    
    for (let i in ohlcs) {
      let sma, err;
      
      try {
        sma = smaInd(ohlcs[i], ohlcs.slice(0, i));
      } catch(err_) {
        err = err_;  
      }

      if (i == 0) { // !!! it doesn't work: i === 0
        should.exist(err);
      } else {
        should.equal(sma, (indicators.hlc(ohlcs[i]) + indicators.hlc(ohlcs[i-1])) / 2);
        should.not.exist(err);
      }
    }
  });

  it('sma(5)', () => {
    let ohlcs  = data.ohlcs1;
    let smaInd = indicators.smaInd(5);
    
    for (let i in ohlcs) {
      let sma, err;
      
      try {
        sma = smaInd(ohlcs[i], ohlcs.slice(0, i));
      } catch(err_) {
        err = err_;  
      }

      if (i < 4) { // !!! it doesn't work: i === 0
        should.exist(err, '!!!: ' + i);
      } else {
        let expected = (indicators.hlc(ohlcs[i]) + indicators.hlc(ohlcs[i-1]) + indicators.hlc(ohlcs[i-2]) + indicators.hlc(ohlcs[i-3]) + indicators.hlc(ohlcs[i-4])) / 5;
        should.ok(Math.abs(((sma - expected) / expected)) < 0.00001);
        should.not.exist(err);
      }
    }
  });
});

