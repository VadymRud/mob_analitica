const name = 'datastore';

module.exports = {initAsync, name};

const api = require('./datastore_api');

function initAsync(cfg, interfaces, cb) {
  if (!(interfaces.mongodb && interfaces.mongodb.client)) {
    cb('no mongodb.client component for datastore.initAsync()');
    return;
  }

  cb(null, {
    api: api.init(interfaces.mongodb.client),
  });
}
