# Service for data collecting, aggregation and management

## Loading some data

Command examples:

    node load.js KRAKEN USDT USD  // loads last 24h data in minutes (if absent)

    // finds last date of start for all assets 
    // and write in DB new data from cryptocompare.com (cc)
    node check.js cc  
    node check.js cw // cryptowat.ch
    node check.js cc cw kraken      
    // the list of the available assetss are in the module assets.js
    // after start, process will be write new data every 5 minutes   

## Assets for the 1st system release

### Kraken.com
BTC/USD
ETH/USD
BTC/EUR
ETH/EUR
USDT/USD
XRP/USD
XRP/EUR
ETH/BTC

### Bitmex.com
ALL
XBTUSD/USD (there is only one pair on cryptocompare.com)

### Binance.com
BTC/USDT
ETH/USDT
ETH/BTC
TRX/USDT
TRX/BTC
TNT/BTC
XRP/USDT
BTC/PAX
VIBE/BTC
EOS/USDT

### Bitfinex.com
BTC/USD
ETH/USD
EOS/USD
XRP/USD
BTC/EUR
ETH/BTC
LTC/USD
USDT/USD (pair not found on cryptocompare.com) is on cryptowat.ch
ETH/EUR
IOTA/USD  
NEO/USD
ETC/USD
BAB/USD (pair not found on cryptocompare.com) is on cryptowat.ch

### Coinbase.com
BTC/USD
ETH/USD
LTC/USD
BTC/EUR
ETH/EUR
BCH/USD
BTC/GBP
ETH/BTC
BTC/USDC


## Data to be collected in real-time (for further system releases...)

* Best Ask Price
* Best Ask Size
* Best Bid Price
* Best Bid Size
* Last Price
* Last Size
* Volume
* Market Depth * 10: Bid + Ask (Size+Price)