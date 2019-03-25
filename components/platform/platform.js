module.exports = {name: 'platform', initAsync};

const strategy = require('./strategy');
const demo     = require('./demo');

function initAsync(cfg, interfaces, cb) {
  if (!(interfaces.datastore && interfaces.datastore.api)) {
    cb('datastore API for strategy component isn\'t found :-()');
    return;
  }

  let interfacesToAdd = {
    tools: strategy.init(interfaces.datastore.api),
    demo:  demo.init(interfaces.datastore.api),
  };

  cb(null, interfacesToAdd);
}
