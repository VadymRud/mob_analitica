const fs   = require('fs');
const yaml = require('yamljs');

let environment = 'dev';
const cfg       = yaml.load(__dirname + `/../../../environments/${environment}.yaml`);

const settings  = require('./settings');

const appInit   = require('../../appinit');
const mongodb   = require('../../mongodb');
const datastore = require('../../datastore');
const strategy  = require('..');
const platform  = require('../../platform');

const components = [
  mongodb,
  datastore,
  strategy,
  platform,
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

  // if (!(interfaces[strategy.name] && interfaces[strategy.name].algo && interfaces[strategy.name].indicators)) {
  //   console.log('no strategy API component');
  //   process.exit(1);
  // }

  if (!(interfaces[platform.name] && interfaces[platform.name].tools)) {
    console.log('no platform API component');
    process.exit(1);
  }

  let platformTools = interfaces[platform.name].tools;

  let strategyItem = {
    'initialBalance': 10000,
    'indicatorsDefinition': {
      'vortexBuy':    ['vortex', 2],
      'vortexSell':   ['vortex', 12],
      'emaFast':      ['ema',    16, 'emaFast'],
      'emaSlow':      ['ema',    3, 'emaSlow'],
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

  // let strategyItem = {
  //   'initialBalance': 10000,
  //   'indicatorsDefinition': {
  //     'bandsOcEnter': ['bandsOc', settings.periodEmaOc, settings.multiplierEmaOc, settings.period, settings.multiplierEnter],
  //     'bandsOcExit':  ['bandsOc', settings.periodEmaOc, settings.multiplierEmaOc, settings.period, settings.multiplierExit],
  //   },
  //   'decisions': [
  //     {
  //       'action':    'buyStrong',
  //       'condition': [
  //         'and',
  //         ['>', ['ind', 'vortexBuy', 0], ['ind', 'vortexBuy', 1]],
  //         ['>', ['ind', 'emaFast'],      ['ind', 'emaSlow']],
  //         (e.Data.InPosition == strategy.SHORT && e.IsCrossoverOld(ySource, xLowerExit) && csi.OC() > upper)
  //       ],
  //     },

  //     {
  //       'action':    'sellStrong',
  //       'condition': [
  //         'and',
  //         ['<', ['ind', 'vortexSell', 0], ['ind', 'vortexSell', 1]],
  //         ['<', ['ind', 'emaFast'],       ['ind', 'emaSlow']],
  //         (e.Data.InPosition == strategy.LONG && e.IsCrossoverOld(xUpperExit, ySource) && lower > csi.OC())
  //       ],
  //     },

  //     {
  //       'action':    'exitLong',
  //       'condition': [
  //         'and',
  //         ['>', ['ind', 'vortexBuy', 0], ['ind', 'vortexBuy', 1]],
  //         ['>', ['ind', 'emaFast'],      ['ind', 'emaSlow']],
  //         (e.Data.InPosition == strategy.LONG && e.IsCrossoverOld(xUpperExit, ySource))
  //       ],
  //     },

  //     {
  //       'action':    'exitShort',
  //       'condition': [
  //         'and',
  //         ['>', ['ind', 'vortexBuy', 0], ['ind', 'vortexBuy', 1]],
  //         ['>', ['ind', 'emaFast'],      ['ind', 'emaSlow']],
  //         (e.Data.InPosition == strategy.SHORT && e.IsCrossoverOld(ySource, xLowerExit))
  //       ],
  //     },

  let exchange = 'BITFINEX';
  let base     = 'BTC';
  let quote    = 'USD';
  let interval = '1h';

  platformTools.doBacktest(
      exchange, 
      base, 
      quote, 
      interval, 
      null,
      null,
      strategyItem,
      true, 
      (err, res) => {
        if (err) {
          console.error(err);
        }

        let fields = [
          'n', 
          'date', 
          'open', 
          'high', 
          'low', 
          'close', 
          ...(Object.keys(strategyItem.indicatorsDefinition).map(key => ['ind', key])),
          ...(Object.keys(strategyItem.valuesDefinition).map(key => ['val', key])),
          'profit', 
          'action', 
          'from',
          'actionMoney',
          'actionFinal',
          'actionPrice', 
          'actionLots', 
          'finalPosition', 
          'finalLots', 
          'allocatedCapital', 
          'profitCapital', 
          'freeCapitalIfAlone',
        ];
        
        // console.log(res.debug.rows);
        // console.log(fields);

        let tab = fields.map(f => ((f instanceof Array) ? f.join('_') : f)).join('\t');
        for (let tf of res.debug.rows) {
          tab += '\n' + fields.map(
              f => {
                if (f === 'date') {
                  return tf[f] ? ('' + tf[f]).substr(4, 17) : '';
                } 
                if (f instanceof Array) {
                  // console.log((tf.indicators && (f[0] in tf.indicators)), f.length, f, tf.indicators);
                  if (f[0] === 'ind') {

                    // console.log(11111, tf.indicators, f[1], f.length);

                    return (tf.indicators && (f[1] in tf.indicators)) 
                         ? (f.length > 2) ? tf.indicators[f[1]][f[2] || 0] 
                         : tf.indicators[f[1]] instanceof Array ? tf.indicators[f[1]].join(' / ') : tf.indicators[f[1]]
                         : '';
                  }

                  return (tf.values && (f[1] in tf.values)) ? (tf.values[f[1]] || 0) : '';
                }                 
                return tf[f];
              }
          ).join('\t');
        }

        let filename = 'debug.xls';
        fs.writeFileSync(filename, tab);

        console.log(filename);

        client.close();
      }
  );
});


// let strategyItem = {
//   'initialBalance': 10000,
//   'indicatorsDefinition': {
//     'vortexBuy':    ['vortex', settings.periodBuy],
//     'vortexSell':   ['vortex', settings.periodSell],
//     'emaFast':      ['ema',    settings.periodEmaFast, 'emaFast'],
//     'emaSlow':      ['ema',    settings.periodEmaSlow, 'emaSlow'],
//   },
//   'valuesDefinition': [
//   ],
//   'decisions': [
//     {
//       'action':    'buyStrong',
//       'condition': [
//         'and',
//         ['>', ['ind', 'vortexBuy', 0], ['ind', 'vortexBuy', 1]],
//         ['>', ['ind', 'emaFast'],      ['ind', 'emaSlow']],
//       ],
//     },
//     {
//       'action':    'sellStrong',
//       'condition': [
//         'and',
//         ['<', ['ind', 'vortexSell', 0], ['ind', 'vortexSell', 1]],
//         ['<', ['ind', 'emaFast'],       ['ind', 'emaSlow']],
//       ],
//     },
//   ],
// };


