const basics = require('../indicators/basics');
 
const test0 = {
  initialBalance: 10000,
  indicators:     [],
  decisions:      [
    {
      condition: ['>', basics.smaInd(1), 11],
      action:    'buyStrong',
    },
  ],
};

const testVortex = {
  'initialBalance': 10000,
  'indicatorsDefinition': {
    'vortex': ['vortex', 13],
  },
  'decisions': [
    {
      'condition': ['cross', ['ind', 'vortex', 0], ['ind', 'vortex', 1]],
      'action':    'buyStrong',
    },
    {
      'condition': ['cross', ['ind', 'vortex', 1], ['ind', 'vortex', 0]],
      'action':    'sellStrong',
    },
  ],
};

module.exports = {read, testVortex};  // cursorMock

const strategies = {
  test0,
  test_vortex: testVortex,
};

function read(id, cb) {
  let strategy = strategies[id];
  if (!(strategy && strategy instanceof Object)) {
    cb(`no strategy with id "${id}"`, null);
  }

  cb(null, strategy);
}
