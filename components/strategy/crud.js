const mock  = require('./test/mock');

module.exports = {init, insert, replace, save, read, readList, remove, removeList, readMock: mock.read};

let collection;

function init(collectionAsync) {
  collection = collectionAsync;
  return module.exports;
}

function insert(strategy, cb) {
  if (!strategy) {
    cb('no strategy to be saved');
    return;
  }
  
  if (strategy._id) {
    cb('can\'t insert strategy with existing _id');
    return;
  } 

  //  , {forceServerObjectId: true}
  collection.insertOne(strategy, (err, result) => {
    // console.log(result.insertedId);
    cb(err, result);
  });
}

function replace(strategy, cb) {
  if (!strategy) {
    cb('no strategy to be saved');
    return;
  }
  
  if (!strategy._id) {
    cb('can\'t replace strategy without  _id');
    return;
  } 

  collection.replaceOne({_id: strategy._id}, strategy, cb);
}

// DEPRECATED
function save(strategy, cb) {
  if (!strategy) {
    cb('no strategy to be saved');
    return;
  }
  
  if (strategy._id) {
    collection.replaceOne({_id: strategy._id}, strategy, cb);
  } else {
    console.log(1111111111, strategy);

    //  , {forceServerObjectId: true}
    collection.insertOne(strategy, (err, result) => {
      console.log(result.insertedId);
      cb(err, result);
    });
  }
}

function read(id, cb) {
  collection.findOne({_id: id}, cb);
}

function readList(selector, cb) {
  collection.find(selector).toArray(cb);
}

// select * from ohlc_8h where exchange = 'KRAKEN' and asset_base = 'EOS' order by date_start

function remove(id, cb) {
  collection.deleteOne({_id: id}, cb);
}

function removeList(selector, cb) {
  collection.deleteMany(selector, cb);
}
