const adxInd        = require('../adx').adxInd;
const atrInd        = require('../atr').atrInd;
const rsiInd        = require('../rsi').rsiInd;
const emaInd        = require('../ema').emaInd;
const stochasticInd = require('../stochastic').stochasticInd;
const cmfInd        = require('../cmf').cmfInd;

// load Anna json
let fs = require('fs');
let allAnnaData = JSON.parse(fs.readFileSync(__dirname+'/allAnnaData.json', 'utf8'));
let timeframe = [];
// let timeframesPrev = data1.ohlcs1;
// timeframe = timeframe.length;

for (let i = 0; i < allAnnaData.length; i++) {
  timeframe.push({'timeStart': new Date(allAnnaData[i].timeStart), 'open': parseFloat(allAnnaData[i].open), 'high':
  parseFloat(allAnnaData[i].high),  'low': parseFloat(allAnnaData[i].low), 'close': parseFloat(allAnnaData[i].close),
  'indicators': {'ema': parseFloat(allAnnaData[i]['EMA(hlc3.14)']), 'rsi' :
  parseFloat(allAnnaData[i]['RSI (hlc3.14)']), 'atr': parseFloat(allAnnaData[i]['ATR']),
  'adx': parseFloat(allAnnaData[i]['ADX']), 'emaDMPlus': parseFloat(allAnnaData[i]['EMA(DM+.14)']),
  'emaDMMinus': parseFloat(allAnnaData[i]['EMA(DM-.14)']),
  'emaUp': parseFloat(allAnnaData[i]['EMA(up.14)']), 'emaDown': parseFloat(allAnnaData[i]['EMA(down.14)']),
  'stochastik': parseFloat(allAnnaData[i]['Stochastic - %K (5)']),
  'cmf':parseFloat(allAnnaData[i]['Chaikin Money Flow (3)']),
  }});

};
let timeframes = timeframe.slice(0, 20);
// console.log([...arr, timeframe.slice(0, 1)][3]);
// emaI = emaInd(14)(arr, []);

let atrI;

let sum1adxInd = 0;
let sum2adxInd = 0;
let sum1atrInd = 0;
let sum2atrInd = 0;
let sum1rsiInd = 0;
let sum2rsiInd = 0;
let sum1emaInd = 0;
let sum2emaInd = 0;

let sum1stoInd = 0;
let sum2stoInd = 0;
let sum1cmfInd = 0;
let sum2cmfInd = 0;


for (let i = 0; i < timeframes.length; i++) {
  
  
  adxI = adxInd(14)(timeframes[i], (i > 0 ? timeframes.slice(0, i) : []) );
  atrI = atrInd(14)(timeframes[i], (i > 0 ? timeframes.slice(0, i) : []) );
  rsiI = rsiInd(14)(timeframes[i], (i > 0 ? timeframes.slice(0, i) : []) );
  emaI = emaInd(14)(timeframes[i], (i > 0 ? timeframes.slice(0, i) : []) );
  sum1adxInd += adxI;
  sum2adxInd += timeframes[i].indicators.adx;
  sum1atrInd += atrI;
  sum2atrInd += timeframes[i].indicators.atr;
  sum1rsiInd += rsiI;
  sum2rsiInd += timeframes[i].indicators.rsi;
  sum1emaInd += emaI;
  sum2emaInd += timeframes[i].indicators.ema;
  
  
}

persentDiff = 0.01;
percentAdx = ((sum1adxInd / sum2adxInd) *100 - 100).toFixed(20);
percentATR = ((sum1atrInd / sum2atrInd) *100 - 100).toFixed(20);
percentRSI = ((sum1rsiInd / sum2rsiInd) *100 - 100).toFixed(20);
percentEMA = ((sum1emaInd / sum2emaInd) *100 - 100).toFixed(20);

if ( Math.abs(percentAdx) <  persentDiff) {
  console.log('Diff ADX', 'OK');    
} else {
  console.error('Diff ADX', 'NO');
}

if ( Math.abs(percentATR) <  persentDiff) {
  console.log('Diff ATR', 'OK');    
} else {
  console.error('Diff ATR', 'NO');
}

if ( Math.abs(percentRSI) <  persentDiff) {
  console.log('Diff RSI', 'OK');    
} else {
  console.error('Diff RSI', 'NO');
}
      
if ( Math.abs(percentEMA) <  persentDiff) {
  console.log('Diff EMA', 'OK');    
} else {
  console.error('Diff EMA', 'NO');
}
  

// { exchange: 'BITFINEX',
//     base: 'BTC',
//     quote: 'USD',
//     timeStart: '2019-01-15T18:00:00.000Z',
//     open: '3700.4',
//     high: '3718.6',
//     low: '3700.3',
//     close: '3706.17',
//     oc2: '3703.285',
//     hlc3: '3708.35666666667',
//     'SMA(hlc3.14)': '3708.35666666667',
//     'EMA(hlc3.14)': '3708.35666666667',
//     'Up(hlc3)': '0',
//     'Down(hlc3)': '0',
//     'EMA(up.14)': '0',
//     'EMA(down.14)': '0',
//     'RSI (hlc3.14)': '100',
//     'Abs(High-Low[1])': '0',
//     'Abs(Low-High[1])': '0',
//     TR: '18.2999999999997',
//     ATR: '18.2999999999997',
//     'VIP(14)': '0',
//     'VIM(14)': '0',
//     'UpMove(High)': '0',
//     DownMove: '0',
//     'DM+': '0',
//     'DM-': '0',
//     'EMA(DM+.14)': '0',
//     'EMA(DM-.14)': '0',
//     DI+': '0',
//     'DI-': '0',
//     'ADX-NotSmoothed': '0',
//     ADX: '0' },

