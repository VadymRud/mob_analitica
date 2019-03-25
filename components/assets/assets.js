module.exports = {
  // for appinit
  name: 'assets', 
  initAsync, 

};

const stat        = require('./stat');
const scores      = require('./scores');

const statDefault = require('./legacy/stat_default');


function initAsync(cfg, interfaces, cb) {
  if (!(interfaces.mongodb && interfaces.mongodb.client)) {
    cb('mongodb client for strategy component isn\'t found :-()');
    return;
  }

  if (!(interfaces.datastore && interfaces.datastore.api)) {
    cb('datastore API for strategy component isn\'t found :-()');
    return;
  }

  let collName   = interfaces.datastore.api.assetsCollName;
  let collection = interfaces.mongodb.client.db(cfg.database).collection(collName);
  
  let interfacesToAdd = {
    stat:        stat.init(collection, interfaces.datastore.api),
    scores:      scores.init(collection, interfaces.datastore.api),

    // DEPRECATED
    statDefault: statDefault.init(collection, interfaces.datastore.api),
  };

  if (cfg.initAssetsDefault) {
    stat.processDefault(() => {
      cb(null, interfacesToAdd);
    });
  } else {
    cb(null, interfacesToAdd);
  }

  // cb(null, interfacesToAdd);
}
