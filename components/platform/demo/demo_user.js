module.exports = {init, getUserPortfolios, getAcademy, zoomIn, featuredStrategies, marketPlace};

// const index      = require('./index'); 
// const addZigzag  = require('../strategy/indicators/zigzag').addZigzag;
// const aggregate  = require('../data-common/ohlcs').aggregate;
// const backtest   = require('./demo_strategy').backtest;
// const average    = require('./demo_strategy').average;

// function round(value, ratio) {
//   return Math.round(value * ratio) / ratio
// }  

function random(min, max) {
  return min + Math.random() * (max - min); 
}


// user's data -------------------------------------------------------------------------------------

let userPorfolios = [];

// let userAssetsPartial = {
//   'BTC': [],  
//   'XRP': [],  
//   'ETH': [],  
// };
// let userAssets = [];

// const probOpenOk  = 0.9;
// const probCloseOk = 0.9;
// const maxTradeDev = 5; 


function init(cb) {
  cb();

  // index.interfaces.datastore.getOhlcs('BITFINEX', 'BTC', 'USD', '1m', null, null, (err, btc1m) => {
  //   if (err) { cb(err); return; } 
  //   index.interfaces.datastore.getOhlcs('BITFINEX', 'ETH', 'USD', '1m', null, null, (err, eth1m) => {
  //     if (err) { cb(err); return; } 
  //     index.interfaces.datastore.getOhlcs('BITFINEX', 'XRP', 'USD', '1m', null, null, (err, xrp1m) => {
  //       if (err) { cb(err); return; } 
        
  //       let timeframesBtc  = aggregate(btc1m, '1h');
  //       for (i = 0; ++i < timeframesBtc.length;) addZigzag(timeframesBtc, i);
  //       let timeframesEth  = aggregate(eth1m, '1h');
  //       for (i = 0; ++i < timeframesEth.length;) addZigzag(timeframesEth, i);
  //       let timeframesXrp  = aggregate(xrp1m, '1h');
  //       for (i = 0; ++i < timeframesXrp.length;) addZigzag(timeframesXrp, i);
 
  //       userPorfolios  = [];
  //       let strategyId = 0;
  //       let assetId    = 0;
        
  //       for (let iP = 0; ++iP < 10;) {
  //         let strategies = [];
  //         let resSP      = [];
          
  //         for (let iS = 0; ++iS < 3;) {
  //           ++strategyId;
  //           let assets = [];
  //           let resAS  = [];
            
  //           for (let iA = -1; ++iA < 3;) {
  //             ++assetId;

  //             let [coin, timeframes] = (iA === 0) ? ['BTC', timeframesBtc]
  //                                    : (iA === 1) ? ['ETH', timeframesEth]
  //                                    :              ['XRP', timeframesXrp];
              
  //             let resA = backtest(timeframes, probOpenOk, probCloseOk, maxTradeDev);
  //             resAS.push(resA); 

  //             let asset = {
  //               id:            assetId,
  //               name:          'BITFINEX ' + coin + ' USD',
  //               category:      'Crypto',  
  //               msqScore:      round(random(50, 100), 1),

  //               totalPnL:      resA.totalPnL,
  //               change24h:     resA.change24h,   
  //               numOfTrades7d: resA.numOfTrades7d, 
  //               breakouts30d:  resA.breakouts30d,
  //               accuracyRate:  resA.accuracyRate,
  //               maxDrawdown:   resA.maxDrawdown, 
  //               minichart24h:  resA.minichart24h, 
  //             };

  //             assets.push(asset);
  //             // userAssetsPartial[coin].push(asset);
  //           } 
          
  //           let resS = average(resAS);
  //           resSP.push(resS);

  //           strategies.push({
  //             id:            strategyId,
  //             name:          'User Strategy Number ' + strategyId,
  //             msqScore:      round(random(50, 100), 1),
  //             totalPnL:      resS.totalPnL,
  //             change24h:     resS.change24h,   
  //             numOfTrades7d: resS.numOfTrades7d, 
  //             breakouts30d:  resS.breakouts30d,
  //             accuracyRate:  resS.accuracyRate,
  //             maxDrawdown:   resS.maxDrawdown, 
  //             minichart24h:  resS.minichart24h, 
  //             assets: assets,
  //           });
  //         } 

  //         let resP = average(resSP);
          
  //         userPorfolios.push({
  //           id:            iP,
  //           name:          'User Portfolio Number ' + iP,
  //           msqScore:      round(random(50, 100), 1),
  //           totalPnL:      resP.totalPnL,
  //           change24h:     resP.change24h,   
  //           numOfTrades7d: resP.numOfTrades7d, 
  //           breakouts30d:  resP.breakouts30d,
  //           accuracyRate:  resP.accuracyRate,
  //           maxDrawdown:   resP.maxDrawdown, 
  //           minichart24h:  resP.minichart24h, 
  //           strategies:    strategies,
  //         });
  //       }
      
  //       // let aId = 0;
  //       // for (let coin of ['BTC', 'ETH', 'XRP']) {
  //       //   let resA = average(userAssetsPartial[coin]);

  //       //   userAssets.push({
  //       //     id:            ++aId,
  //       //     name:          coin,
  //       //     category:      'Crypto',  
  //       //     icon:          `http://magicsquare.com/icons/${coin}.png`,
  //       //     totalPnL:      resA.totalPnL,
  //       //     change24h:     resA.change24h,   
  //       //     numOfTrades7d: resA.numOfTrades7d, 
  //       //     breakouts30d:  resA.breakouts30d,
  //       //     accuracyRate:  resA.accuracyRate,
  //       //     // maxDrawdown:   resA.maxDrawdown, 
  //       //     minichart24h:  resA.minichart24h, 
  //       //   });
  //       // }

  //       cb();
  //     });  
  //   });  
  // });  

}  

// function myAssets(cb) {
//   cb(null, userAssets);
// }

function getUserPortfolios(cb){
  cb(null, userPorfolios);
}

// academy -----------------------------------------------------------------------------------------

function getAcademy(cb) {
  let commonAcademy = [];
  for (let i = 0; ++i < 25;) {
    commonAcademy.push({
      id:          i,
      name:        'Academy Lesson Number ' + i,
      description: 'This is only demo lesson containing no content at all!',
      views:       Math.round(random(1000000, 10000000)),
      shared:      Math.round(random(500,     5000)),
      likes:       Math.round(random(10000,   100000)),
      published:   new Date(new Date() - (25 - i) * 1000 * 3600 * 24),
    });
  }
  cb(null, commonAcademy);
}

// common strategies -------------------------------------------------------------------------------

let commonStrategies = [];
let featuredStrat = [];

for (let i = 0; ++i < 5;) {
  featuredStrat.push({
    id:               i,
    name:             'Strategy Number ' + i,
    performanceChart: [],  // TODO!!!
    followers:        Math.round(random(1000,   10000)),
    trades:           Math.round(random(300,    1000)),
    funds:            Math.round(random(100000, 10000000)),
    return:           Math.round(random(20,     50) * 10) / 10,
    maxDrawdown:      Math.round(random(10,     30) * 10) / 10,
    msqScore:         Math.round(random(50,    100)),
    listed:           new Date(new Date() - (25 - i) * 1000 * 3600 * 24),
  });
}

function zoomIn(cb) {
  cb(null, {});
}

function featuredStrategies(cb) {
  cb(null, featuredStrat);
  // cb(null, commonStrategies.filter(strategy => strategy.featured));
}

function marketPlace(cb) {
  cb(null, commonStrategies);
}

