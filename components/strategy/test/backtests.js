const should = require('should');
const algo   = require('../algo/algo');

const period = 13;

// const strategy1 = mock.testVortex;   // doesn't work in this test

const strategy1 = {
  initialBalance: 10000,

  indicatorsDefinition: {
    vortex: ['vortex', 13],
  },

  decisions: [
    {
      condition: ['>',  ['ind', 'vortex', 0],  ['ind', 'vortex', 1]],
      action:    'buyStrong',
    },
    {
      condition: ['<',  ['ind', 'vortex', 0],  ['ind', 'vortex', 1]],
      action:    'sellStrong',
    },
  ],
};

describe('strategies backtests', () => {
  it('the first test!!!', done => {
    let strategyItem = strategy1;

    let timeframes = ohlcs1;
    algo.execute(strategyItem, timeframes, false, (err, strategyResult) => {
      should.not.exist(err);
      should.exist(strategyResult);
      should.exist(strategyResult.timeframes);
      should.equal(strategyResult.timeframes.length, ohlcs1.length + 1);

      let position = 0;
      for (let i = 0; ++i < strategyResult.timeframes.length;) {
        let tf = strategyResult.timeframes[i];
        console.log({
          n:              tf.n, 
          close:          tf.close, 
          action: tf.action, 
          action:         tf.action, 
          enterLots:      tf.enterLots, 
          actionLots:     tf.actionLots, 
          finalLots:      tf.finalLots,
          actionPrice:    tf.actionPrice,
          finalCapital:   tf.finalCapital,
          indicators:     tf.indicators,
        });  

        should.exist(tf.indicators);
        if (tf.n < period) {
          if ('vortex' in tf.indicators) {
            should.equal(tf.indicators.vortex instanceof Array, true);
            should.equal(tf.indicators.vortex.length, 0);
            continue;
          }
        }
        if (tf.indicators.vortex[0] < tf.indicators.vortex[1]) {
          if (position >= 0) {
            should.equal(tf.action, 'sellStrong');
            position = -1;
          } else {
            should.equal(tf.action, '');  // doNothing
          }
        } else if (tf.indicators.vortex[0] > tf.indicators.vortex[1]) {
          if (position <= 0) {
            should.equal(tf.action, 'buyStrong');
            position = 1;
          } else {
            should.equal(tf.action, '');  // doNothing
          }
        } else {
          should.equal(tf.action, '');  // doNothing
        }
      }

      done();
    });
  });
});

let today = new Date(Date.now());
today.setUTCHours(0, 0, 0, 0);

let dayDuration = 24 * 3600 * 1000;
let ohlcs1      = [
  {timeStart: new Date(today - dayDuration * 48), open: 18.5, high: 20,  low: 16,   close: 16}, 
  {timeStart: new Date(today - dayDuration * 47), open: 17.5, high: 19,  low: 15,   close: 15}, 
  {timeStart: new Date(today - dayDuration * 46), open: 16.5, high: 18,  low: 14,   close: 14}, 
  {timeStart: new Date(today - dayDuration * 45), open: 15.5, high: 17,  low: 13,   close: 12},
  {timeStart: new Date(today - dayDuration * 44), open: 14.5, high: 16,  low: 12,   close: 11}, 
  {timeStart: new Date(today - dayDuration * 43), open: 13.5, high: 15,  low: 11,   close: 10}, 
  {timeStart: new Date(today - dayDuration * 42), open: 12.5, high: 14,  low: 10,   close: 10}, 
  {timeStart: new Date(today - dayDuration * 41), open: 11.5, high: 13,  low: 9,    close: 10}, 
  {timeStart: new Date(today - dayDuration * 40), open: 10.5, high: 12,  low: 8,    close: 10}, 
  {timeStart: new Date(today - dayDuration * 39), open: 9.5,  high: 11,  low: 7,    close: 10}, 
  {timeStart: new Date(today - dayDuration * 38), open: 8.5,  high: 10,  low: 6,    close: 10}, 
  {timeStart: new Date(today - dayDuration * 37), open: 8.5, high: 10,   low: 6,    close: 10}, 
  {timeStart: new Date(today - dayDuration * 36), open: 8.5, high: 10,   low: 6,    close: 10}, 
  {timeStart: new Date(today - dayDuration * 35), open: 8.5, high: 10,   low: 6,    close: 10}, 
  {timeStart: new Date(today - dayDuration * 34), open: 8,   high: 8,    low: 6,    close: 8}, 
  {timeStart: new Date(today - dayDuration * 33), open: 8,   high: 8,    low: 5,    close: 8}, 
  {timeStart: new Date(today - dayDuration * 32), open: 7.5, high: 7.5,  low: 6,    close: 7.5}, 
  {timeStart: new Date(today - dayDuration * 31), open: 8.5, high: 8.5,  low: 6,    close: 7}, 
  {timeStart: new Date(today - dayDuration * 30), open: 8.5, high: 10,   low: 5,    close: 7}, 
  {timeStart: new Date(today - dayDuration * 29), open: 8,   high: 10,   low: 8,    close: 10}, 
  {timeStart: new Date(today - dayDuration * 28), open: 11,  high: 11.5, low: 9.5,  close: 9}, 
  {timeStart: new Date(today - dayDuration * 27), open: 9,   high: 10,   low: 8.5,  close: 9}, 
  {timeStart: new Date(today - dayDuration * 26), open: 8,   high: 12,   low: 7,    close: 8.5}, 
  {timeStart: new Date(today - dayDuration * 25), open: 8,   high: 11,   low: 8,    close: 9}, 
  {timeStart: new Date(today - dayDuration * 24), open: 10,  high: 11,   low: 6,   close: 11}, 
  {timeStart: new Date(today - dayDuration * 23), open: 10,  high: 11,   low: 5,   close: 11}, 
  {timeStart: new Date(today - dayDuration * 22), open: 10,  high: 12,   low: 5,   close: 12}, 
  {timeStart: new Date(today - dayDuration * 21), open: 11,  high: 11,   low: 3,   close: 11}, 
  {timeStart: new Date(today - dayDuration * 20), open: 10,  high: 11,   low: 5,   close: 11}, 
  {timeStart: new Date(today - dayDuration * 19), open: 10,  high: 11,   low: 7,    close: 9}, 
  {timeStart: new Date(today - dayDuration * 18), open: 9,   high: 12,   low: 6,  close: 11}, 
  {timeStart: new Date(today - dayDuration * 17), open: 11,  high: 12.5, low: 10,   close: 11.5}, 
  {timeStart: new Date(today - dayDuration * 16), open: 12,  high: 14,   low: 11,   close: 13}, 
  {timeStart: new Date(today - dayDuration * 15), open: 14,  high: 16,   low: 13,   close: 14}, 
  {timeStart: new Date(today - dayDuration * 14), open: 14,  high: 17,   low: 14,   close: 16}, 
  {timeStart: new Date(today - dayDuration * 13), open: 16,  high: 17,   low: 12,   close: 16}, 
  {timeStart: new Date(today - dayDuration * 12), open: 16,  high: 19,   low: 15,   close: 19}, 
  {timeStart: new Date(today - dayDuration * 11), open: 19,  high: 21,   low: 18,   close: 20}, 
  {timeStart: new Date(today - dayDuration * 10), open: 19,  high: 22,   low: 19,   close: 21}, 
  {timeStart: new Date(today - dayDuration * 9),  open: 20,  high: 21,   low: 19,   close: 20}, 
  {timeStart: new Date(today - dayDuration * 8),  open: 20,  high: 20,   low: 18,   close: 19}, 
  {timeStart: new Date(today - dayDuration * 7),  open: 18,  high: 20,   low: 18,   close: 19}, 
  {timeStart: new Date(today - dayDuration * 6),  open: 18,  high: 19,   low: 16,   close: 17}, 
  {timeStart: new Date(today - dayDuration * 5),  open: 17,  high: 18,   low: 15,   close: 15}, 
  {timeStart: new Date(today - dayDuration * 4),  open: 15,  high: 16,   low: 15,   close: 15.5}, 
  {timeStart: new Date(today - dayDuration * 3),  open: 16,  high: 17,   low: 15,   close: 16}, 
  {timeStart: new Date(today - dayDuration * 2),  open: 16,  high: 16.5, low: 15.5, close: 16}, 
  {timeStart: new Date(today - dayDuration * 1),  open: 16,  high: 17,   low: 15,   close: 15.5}, 
];
