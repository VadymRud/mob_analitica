module.exports  = {
  cc: [
    // ### Kraken.com
    {exchange: 'KRAKEN', base: 'BTC', quote: 'USD'},
    {exchange: 'KRAKEN', base: 'ETH', quote: 'USD'},
    {exchange: 'KRAKEN', base: 'BTC', quote: 'EUR'},
    {exchange: 'KRAKEN', base: 'ETH', quote: 'EUR'},
    {exchange: 'KRAKEN', base: 'USDT', quote: 'USD'},
    {exchange: 'KRAKEN', base: 'XRP', quote: 'USD'},
    {exchange: 'KRAKEN', base: 'XRP', quote: 'EUR'},
    {exchange: 'KRAKEN', base: 'ETH', quote: 'BTC'},

    // ### Bitmex.com
    {exchange: 'BITMEX', base: 'XBTUSD', quote: 'USD'},

    // ### Binance.com
    {exchange: 'BINANCE', base: 'BTC', quote: 'USDT'},
    {exchange: 'BINANCE', base: 'ETH', quote: 'USDT'},
    {exchange: 'BINANCE', base: 'ETH', quote: 'BTC'},
    {exchange: 'BINANCE', base: 'TRX', quote: 'USDT'},
    {exchange: 'BINANCE', base: 'TRX', quote: 'BTC'},
    {exchange: 'BINANCE', base: 'TNT', quote: 'BTC'},
    {exchange: 'BINANCE', base: 'XRP', quote: 'USDT'},
    {exchange: 'BINANCE', base: 'BTC', quote: 'PAX'},
    {exchange: 'BINANCE', base: 'VIBE', quote: 'BTC'},
    {exchange: 'BINANCE', base: 'EOS', quote: 'USDT'},

    // ### Bitfinex.com
    {exchange: 'BITFINEX', base: 'BTC', quote: 'USD'},
    {exchange: 'BITFINEX', base: 'ETH', quote: 'USD'},
    {exchange: 'BITFINEX', base: 'EOS', quote: 'USD'},
    {exchange: 'BITFINEX', base: 'XRP', quote: 'USD'},
    {exchange: 'BITFINEX', base: 'BTC', quote: 'EUR'},
    {exchange: 'BITFINEX', base: 'ETH', quote: 'BTC'},
    {exchange: 'BITFINEX', base: 'LTC', quote: 'USD'},
    {exchange: 'BITFINEX', base: 'ETH', quote: 'EUR'},
    {exchange: 'BITFINEX', base: 'IOTA', quote: 'USD'},
    {exchange: 'BITFINEX', base: 'NEO', quote: 'USD'},
    {exchange: 'BITFINEX', base: 'ETC', quote: 'USD'},

    // ### Coinbase.com
    {exchange: 'COINBASE', base: 'BTC', quote: 'USD'},
    {exchange: 'COINBASE', base: 'ETH', quote: 'USD'},
    {exchange: 'COINBASE', base: 'LTC', quote: 'USD'},
    {exchange: 'COINBASE', base: 'BTC', quote: 'EUR'},
    {exchange: 'COINBASE', base: 'ETH', quote: 'EUR'},
    {exchange: 'COINBASE', base: 'BCH', quote: 'USD'},
    {exchange: 'COINBASE', base: 'BTC', quote: 'GBP'},
    {exchange: 'COINBASE', base: 'ETH', quote: 'BTC'},
    {exchange: 'COINBASE', base: 'BTC', quote: 'USDC'},
  ],
  cw: [
    // ### Bitfinex.com
    {exchange: 'BITFINEX', base: 'USDT', quote: 'USD'},
    {exchange: 'BITFINEX', base: 'BAB', quote: 'USD'},
  ],
  kraken: [
    // {exchange: 'KRAKEN', base: 'BTC', quote: 'USD'}, // (kraken.com: 'Unknown asset pair')
    {exchange: 'KRAKEN', base: 'ETH', quote: 'USD'},
    // {exchange: 'KRAKEN', base: 'BTC', quote: 'EUR'}, // (kraken.com: returns result.XXBTZEUR for this pair) (XBT EUR also has result.XXBTZEUR, but values are different)
    {exchange: 'KRAKEN', base: 'ETH', quote: 'EUR'},
    {exchange: 'KRAKEN', base: 'USDT', quote: 'USD'},
    {exchange: 'KRAKEN', base: 'XRP', quote: 'USD'},
    {exchange: 'KRAKEN', base: 'XRP', quote: 'EUR'},
    // {exchange: 'KRAKEN', base: 'ETH', quote: 'BTC'}, // (kraken.com: 'Unknown asset pair')
  ],
};
