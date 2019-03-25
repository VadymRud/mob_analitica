module.exports = {init, scores};

// let collection;
let datastore;

function init(collectionAsync, datastoreAsync) {
  // collection = collectionAsync;
  datastore  = datastoreAsync;
  return module.exports;
}

const symbols = require('../data-common/symbols');

// func to return compiled assets by score data for endpoint
function scores(selectedMarketBehaviours, interval, pageNumberForPagination, cb) {
  datastore.getAssets((err, docs) => {
    // TODO: use correct sort order and pagination number in database query itself (postponed task!)

    if (err) {
      cb(err);
      return;
    }

    let result = [];

    // TODO: check interval and behavior combinations
    let scField = (selectedMarketBehaviours === 'range')   // is it correct constant value?
                ? 'scRng1h'
                : (selectedMarketBehaviours === 'reverse') // is it correct constant value?
                ? 'scRev1h'
                : 'scBrk1h';

    for (let doc of docs) {
      result.push({
        id:     symbols.asset(doc),
        asset:  ('' + doc.base + doc.quote).toUpperCase(),
        inrl:   ('' + doc.interval).toUpperCase(),
        source: ('' + doc.exchange).toUpperCase(),
        score:  doc[scField], 
        // histogram: ????
        // chart: ???
      });
    }

    result.sort((a, b) => (b.score - a.score));

    cb(null, result);
  });
}


// // func to get paginated pages for Assets with scores in Strategy Builder
// function getPaginatedDataForAssetsWithScore(selectedMarketBehaviours, timePeriod, pageNumberForPagination) {
//   // returns a set of documents belonging to page number `pageNum`
//   //         where size of each page is `pageSize`
//   //         
//   //      Calculate number of documents to skip
//   //         skips = pageSize * (pageNum - 1)
  
//   //         # Skip and limit
//   //         cursor = db(dbName).collection('scores').find().skip(skips).limit(pageSize)
// }
  
// // func to get 1m data for specific asset for the past 24h
// function get1mDataForAssetForPast24h(exchange, base, quote, cb) {

//   let collection = client.db(dbName).collection('candles_1m1440');

//   let gteTime = new Date();
//   gteTime.setUTCHours(-24, 0, 0, 0);

//   let condition ={
//     exchange: exchange, 
//     base: base, 
//     quote: quote,
//     date: {'$gte': gteTime}
//   };

//   collection.find(condition).sort({date: 1}).toArray((err, docs) => {
//     if (err) {
//       console.log('DB error: ', err);
//       cb(err);
//     }

//     let last24hCandlesSliced = docs[0].candles.slice(docs[1].candles.length, docs[0].candles.length);
//     let result24hArray = last24hCandlesSliced.concat(docs[1].candles);

//     cb(null, result24hArray);
//   });

// }
  

// // func to prepare data for 24h minichart (1m candle close data for every 15m interval - results in 96 values for 96pixel line chart)
// function prepare96ValuesArrayForAsset24hMiniChart(exchange, base, quote) {
    
//   datastore.get1mDataForAssetForPast24h(exchange, base, quote, (err, Arr24h) => {
//     if (err) {
//       console.log(err);
//       return;
//     }
      
//     let filteredArr = Arr24h.filter((val, i) => !!(i % 15));
//     let final96ValuesArr = filteredArr.map( arr => arr[4]);
    
//     return final96ValuesArr;
//   });
// }
