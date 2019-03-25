const YAML = require('yamljs');
// const dtUtil = require('../../utils/date-time');

// components init --------------------------------------------------------------

const appinit = require('../../components/appinit/run');

let environment = process.env.ENV || 'local';
const cfg = YAML.load(`./environments/${environment}.yaml`);

const components = [
  require('../../components/mongodb/mongodb'),
  require('../../components/datafeed/init'),
];

appinit.run(cfg, components, loadAsset);


// the task to be executed------------------------------------------------------

function loadAsset(config, activeComponents) {
  let [exchange, base, quote, interval] = process.argv.slice(2);

  if (!exchange) {
    console.error('no exchange defined'); process.exit(1);
  }
  exchange = exchange.toUpperCase();

  if (!base) {
    console.error('no base defined'); process.exit(1);
  }
  base = base.toUpperCase();

  if (!quote) {
    console.error('no quote defined'); process.exit(1);
  }
  quote = quote.toUpperCase();

  if (!interval) {
    interval = '1m';
  }
  console.log('\n', exchange, base, quote, interval);

  // TODO: customize it!!!
  let connector = activeComponents.datafeed.cc;
  // let connector = activeComponents.datafeed.kraken;

  // let duration = 24 * 3600 * 1000;
  // let now = new Date();
  // let dateFinish = new Date(now.getFullYear(), now.getMonth(), now.getDay(), now.getHours(), now.getMinutes());
  // let dateStart = new Date(dateFinish - duration);

  // TODO: customize it!!!
  // let dateStart  = new Date(2019, 0, 19);
  // let dateFinish = new Date(2019, 0, 20); //null; // new Date(2019, 0, 12);
  let now = new Date(); // Today!
  let daysBefore = 0;
  let duration = 3600 * 24 * daysBefore * 1000; // in milliseconds
  let dateStart = new Date(now - duration);

  // dtUtil.setUTC0(dateStart);
  dateStart.setUTCHours(0, 0, 0, 0);
  
  duration = 3600 * 24 * ( daysBefore - 1 ) * 1000; // in milliseconds
  let dateFinish = daysBefore > 0 ? new Date(now - duration) : null;
  if (dateFinish != null) {

    // dtUtil.setUTC0(dateFinish);
    dateFinish.setUTCHours(0, 0, 0, 0);

  }
  console.log('START DATE: ', dateStart, '; FINISH DATE: ', dateFinish);

  connector.getInterval(exchange, base, quote, dateStart, dateFinish, interval, ohlcvs => {
    if (ohlcvs instanceof Array && ohlcvs.length > 0) {
      let source = connector.key();
      for (let ohlcv of ohlcvs) {
        ohlcv.source = source;
      }

      // TODO: use environment config
      let db = activeComponents.mongodb.client.db('data');

      // TODO: select interval & collection name respectively
      let ohlcColl = db.collection('ohlc_' + interval);

      ohlcColl.insertMany(ohlcvs, {forceServerObjectId: true}, (err, res) => {
        if (err) {
          console.error(err);
          console.log('inserted:', (res ? res.insertedCount : null));
          process.exit(1);
        }

        console.log('inserted:', (res ? res.insertedCount : null));
        process.exit(0);
      });
    } else {
      console.log('no ohlcvs to store in the database:', ohlcvs);
      process.exit(1);
    }
  });
}
