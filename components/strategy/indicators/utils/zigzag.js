const fs        = require('fs');
const YAML      = require('yamljs');
const zigzag    = require('../../strategy/indicators/zigzag').zigzag;
const avgATR    = require('../../strategy/indicators/volatility').avgATR;

// components init --------------------------------------------------------------

const appInit = require('../../appinit');
let environment = process.env.ENV || 'local';
const cfg = YAML.load(`./environments/${environment}.yaml`);
const components = [
  require('../../mongodb'),
  require('../'),                                  // datastore 
];

appInit.run(cfg, components, action);


function action(config, interfaces) {
  if (!(interfaces.datastore && interfaces.datastore.api)) {
    console.log('no datastore.api component');
    process.exit(1);
  }
  
  let api = interfaces.datastore.api;

  let dateStart;  // = new Date('2019-01-31 00:00');
  let dateFinish; // = new Date();
  
  // api.getOhlcs('BITFINEX', 'BAB', 'USD', '1m', dateStart, dateFinish, (err, ohlcs1m) => {
  api.getCandles('BITFINEX', 'BAB', 'USD', '1m', dateStart, dateFinish, (err, ohlcs) => {
    if (err) {
      console.log(err);
      process.exit(1);
    } 

    // let ohlcs  = aggregate(ohlcs1m, '1h');

    let minBreakoutToVolatility = 3;  // 2
    let maxIntervalsToWaitBreak = 5;  // 3

    let volatility = avgATR(ohlcs);
    let minBreakout = volatility * minBreakoutToVolatility;

    for (i = 0; ++i < ohlcs.length;) {   // 
      zigzag(ohlcs, i, minBreakout, maxIntervalsToWaitBreak);
    }

    let report = 'date\topen\thigh\tlow\tclose\tzigzag\n';
    let delta = 110;

    for (i = -1; ++i < ohlcs.length;) {   
      let ohlc = ohlcs[i];
      let time = ('' + ohlc.TimeStart).substring(0, 33);
      let zz    = (ohlc.zigzag  == undefined) ? '' : ohlc.zigzag;
      let zz0   = (ohlc.zigzag0 == undefined) ? '' : (ohlc.zigzag0 - delta);

      let chart = '\t' + (ohlc.PriceHigh - delta) + '\t' + (ohlc.PriceLow - delta) + '\t' + ((ohlc.zigzag == undefined) ? '' : (ohlc.zigzag - delta));
      report += time + '\t\t' +  ohlc.PriceHigh + '\t' +  ohlc.PriceLow + '\t\t' + zz + chart + '\t' + zz0 + '\n';
    }  

    // console.log('minBreakout: %d, maxIntervalsToWaitBreak: %d', minBreakout, maxIntervalsToWaitBreak);
    
    fs.writeFileSync('zigzag.xls', report);

    process.exit(0);
  });
}

