const should = require('should');

const ohlcsCommon = require('../../data-common/candles');

describe('datafeed', function() {
  describe('cryptocompare.com', function() {
    it('long interval data should be equal to summa of sub-interval ones', function(done) {
      const cc = require('../cc');
      testConnector(cc, 'CCCAGG', 'BTC', 'USD', '1d', '1h', done);
    });
  });
});

describe('datafeed', function() {
  describe('kraken.com', function() {
    it('long interval data should be equal to summa of sub-interval ones', function(done) {
      const kraken = require('../kraken');
      testConnector(kraken, 'KRAKEN', 'USDT', 'USD', '1d', '1h', done);
    });
  });
});

describe('datafeed', function() {
  describe('cryptowat.ch', function() {
    it('long interval data should be equal to summa of sub-interval ones', function(done) {
      const cw = require('../cw');
      testConnector(cw, 'KRAKEN', 'USDT', 'USD', '1d', '1h', done);
    });
  });
});

function testConnector(connector, exchange, base, quote, intervalMax, intervalMin, done) {
  exchange = exchange.toUpperCase();
  base = base.toUpperCase();
  quote = quote.toUpperCase();

  let duration = 24 * 3600 * 1000; // TODO: use intervalMax
  let dateFinish = new Date();
  dateFinish.setUTCMilliseconds(0);
  dateFinish.setUTCSeconds(0);
  dateFinish.setUTCMinutes(0);
  dateFinish.setUTCHours(0);

  let dateStart = new Date(dateFinish - duration);

  connector.getInterval(exchange, base, quote, dateStart, dateFinish, intervalMin, ohlcvsInterval => {
    should.exist(ohlcvsInterval, 'no .getInterval() data...');

    let ohlcsMaxCombined = ohlcsCommon.summaOld(ohlcvsInterval);
    console.log('ohlcsMaxCombined:', ohlcsMaxCombined);
    should.exist(ohlcsMaxCombined);

    // assert.Equal(requestedDate1, ohlcMax.TimeStart)
    (ohlcsMaxCombined.PriceOpen > 0).should.be.true();
    (ohlcsMaxCombined.PriceHigh > 0).should.be.true();
    (ohlcsMaxCombined.PriceLow > 0).should.be.true();
    (ohlcsMaxCombined.PriceClose > 0).should.be.true();

    connector.getOne(exchange, base, quote, dateStart, intervalMax, ohlcMax => {
      console.log('ohlcMax: ', ohlcMax);

      should.exist(ohlcMax);
      // assert.Equal(requestedDate1, ohlcsMaxCombined.TimeStart)
      should.equal(exchange, ohlcsMaxCombined.Exchange);
      should.equal(base, ohlcsMaxCombined.Base);
      should.equal(quote, ohlcsMaxCombined.Quote);

      (ohlcMax.PriceOpen  > 0).should.be.true();
      (ohlcMax.PriceHigh  > 0).should.be.true();
      (ohlcMax.PriceLow   > 0).should.be.true();
      (ohlcMax.PriceClose > 0).should.be.true();

      should.equal(ohlcMax.PriceOpen, ohlcsMaxCombined.PriceOpen);
      should.equal(ohlcMax.PriceHigh, ohlcsMaxCombined.PriceHigh);
      should.equal(ohlcMax.PriceLow, ohlcsMaxCombined.PriceLow);
      should.equal(ohlcMax.PriceClose, ohlcsMaxCombined.PriceClose);

      done();
    });
  });
}
