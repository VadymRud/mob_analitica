const fs   = require('fs');
const util = require('util');
const yaml = require('yamljs');

let environment = 'dev';
const cfg       = yaml.load(__dirname + `/../../../environments/${environment}.yaml`);

const algo      = require('../algo/algo');

const appInit   = require('../../appinit');
const mongodb   = require('../../mongodb');
const datastore = require('../../datastore');
const strategy  = require('..');

const components = [
  mongodb,
  datastore,
  strategy,
];

appInit.run(cfg, components, (config, interfaces) => {
  if (!(interfaces[mongodb.name] && interfaces[mongodb.name].client)) {
    console.log('no mongodb component');
    process.exit(1);
  }

  let client = interfaces[mongodb.name].client;

  if (!(interfaces[datastore.name] && interfaces[datastore.name].api)) {
    console.log('no datastore API component');
    process.exit(1);
  }

  let dataApi = interfaces[datastore.name].api;

  if (!(interfaces[strategy.name] && interfaces[strategy.name].algo && interfaces[strategy.name].indicators)) {
    console.log('no strategy API component');
    process.exit(1);
  }

  let exchange = 'BITFINEX';
  let base     = 'BTC';
  let quote    = 'USD';
  let interval = '1h';

  dataApi.getCandles(exchange, base, quote, interval, null, null, (err, timeframes0) => {
    if (err) {
      client.close();
      console.error(err);
      process.exit(1);
    }

    let initialBalance = 10000;
    let filename = 'debug.xls';
    let report = util.format(
        '%s\t%s\t%s\t%s\t%s\t%s\n',
        'vortexBuy',
        'vortexSell',
        'emaFast',
        'emaSlow',
        'p&l (%)',
        'max trade loss (%)'
    );

    let num = 0;
    for (let periodBuy = 1; ++periodBuy < 25;) {
      for (let periodSell = 1; ++periodSell < 25;) {
        for (let periodEmaFast = 1; ++periodEmaFast < 25;) {
          for (let periodEmaSlow = 1; ++periodEmaSlow < 25;) {

            if (++num % 100 === 1) {
              console.log(num - 1);
            }
            let strategyItem = {
              'initialBalance': initialBalance,
              'indicatorsDefinition': {
                'vortexBuy':    ['vortex', periodBuy],
                'vortexSell':   ['vortex', periodSell],
                'emaFast':      ['ema',    periodEmaFast, 'emaFast'],
                'emaSlow':      ['ema',    periodEmaSlow, 'emaSlow'],
              },
              'valuesDefinition': [
              ],
              'decisions': [
                {
                  'action':    'buyStrong',
                  'condition': [
                    'and',
                    ['>', ['ind', 'vortexBuy', 0], ['ind', 'vortexBuy', 1]],
                    ['>', ['ind', 'emaFast'],      ['ind', 'emaSlow']],
                  ],
                },
                {
                  'action':    'sellStrong',
                  'condition': [
                    'and',
                    ['<', ['ind', 'vortexSell', 0], ['ind', 'vortexSell', 1]],
                    ['<', ['ind', 'emaFast'],       ['ind', 'emaSlow']],
                  ],
                },
              ],
            };
          
            let [errExec, timeframes] = algo.executeSync(strategyItem, timeframes0);
            if (errExec) {
              client.close();
              console.error(errExec);
              process.exit(1);
            }
        
            if (timeframes.length < 1) {
              client.close();
              console.error('no timeframes returned by algo.executeSync');
              process.exit(1);
            }
        

            let capitalPrev  = initialBalance;
            let tradeLossMax = 0;
            for (let i = 0; ++i < timeframes.length;) {
              let capital = timeframes[i].allocatedCapital + timeframes[i].profitCapital + timeframes[i].freeCapitalIfAlone;
              if (capital < capitalPrev) {
                let tradeLoss = (capitalPrev - capital) / capitalPrev;
                if (tradeLoss > tradeLossMax) {
                  tradeLossMax = tradeLoss;
                }
              }
              capitalPrev = capital;
            }
        
            report += periodBuy + '\t' + periodSell  + '\t' + periodEmaFast + '\t' + periodEmaSlow + '\t' 
                    // + profit(timeframes[timeframes.length - 1], initialBalance) 
                    + (100 * (capitalPrev - initialBalance) / initialBalance) + '\t'
                    + (-100 * tradeLossMax) + '\t'
                    + '\n';

          }        
        }
      }
    }

    fs.writeFileSync(filename, report);

    client.close();
  });

});

// function profit(tf, initialBalance) {
//   return 100 * (tf.allocatedCapital + tf.profitCapital + tf.freeCapitalIfAlone - initialBalance) / initialBalance;
// }

