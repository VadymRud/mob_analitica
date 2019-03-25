module.exports = {duration};

// type Interval string = {"1m","5m","15m","30m","1h","2h","3h","4h","6h","8h","12h","1d","1w"}

const intervalDurations = {
  '1m': 60000,
  '5m': 300000,
  '30m': 1800000,
  '1h': 3600000,
  '2h': 7200000,
  '8h': 28800000,
  '1d': 86400000,
};

function duration(interval) {
  return intervalDurations.hasOwnProperty(interval) ? intervalDurations[interval] : 0;
}
