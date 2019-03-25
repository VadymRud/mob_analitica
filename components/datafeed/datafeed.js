module.exports = {initAsync, name: 'datafeed'};

function initAsync(cfg, activeComponents, cb) {
  cb(null, {
    kraken: require('./kraken'),
    cc:     require('./cc'),
    cw:     require('./cw'),
  });
}

