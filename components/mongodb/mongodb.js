const name = 'mongodb';

module.exports = {initAsync, name};

const MongoClient = require('mongodb').MongoClient;

function initAsync(cfg, interfaces, cb) {
  const mongoClient = new MongoClient(cfg.mongodb, {useNewUrlParser: true});
  mongoClient.connect((err, client) => {
    cb(err, {client});
  });
}

