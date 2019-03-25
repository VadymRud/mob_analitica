const strategyCollectionName = 'strategy';

module.exports   = {initAsync, name: 'strategy', strategyCollectionName};
 
const crud       = require('./crud');
const algo       = require('./algo/algo');
const indicators = require('./indicators/indicators');

function initAsync(cfg, interfaces, cb) {
  if (!(interfaces.mongodb && interfaces.mongodb.client)) {
    cb('mongodb client for strategy component isn\'t found :-()');
    return;
  }

  if (!(interfaces.datastore && interfaces.datastore.api)) {
    cb('datastore API for strategy component isn\'t found :-()');
    return;
  }

  let strategyCollection = interfaces.mongodb.client.db(cfg.database).collection(strategyCollectionName);
  
  cb(null, {
    algo,
    crud:       crud.init(strategyCollection),
    indicators: indicators.init(interfaces.datastore.api),
  });
}
