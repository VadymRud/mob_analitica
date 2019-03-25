module.exports = {demoTrades, backtest, average};

function round(value, ratio) {
  return Math.round(value * ratio) / ratio
}  

function random(min, max) {
  return min + Math.random() * (max - min); 
}

const finalCapital = 100000;

function pnl(price, priceEnter) {
  return finalCapital * (price - priceEnter) / priceEnter
}

function tradeI(timeframes, i, tradeStatus, trades, maxTradeDev) {
  let trI = Math.round(random(i - maxTradeDev, i + maxTradeDev));
  if (trI < 0) {
    trI = 0;
  }
  tradeStatus.trI = (trI < tradeStatus.trI) ? tradeStatus.trI : trI;

  return tradeStatus.trI;
  // return i;
}

function openPosition(timeframes, i, tradeStatus, trades, maxTradeDev) {
  let trI = tradeI(timeframes, i, tradeStatus, trades, maxTradeDev);
 
  let tf  = timeframes[trI];

  tradeStatus.position = (timeframes[i].trend > 0) ? 1 : -1;

  tradeStatus.openPoint = {
    i:          trI,
    order:      (timeframes[i].trend > 0) ? 'buy' : 'sell',
    signal:     "Breakout Entry",
    price:      tf.close,
    size:       finalCapital / tf.close,
    date:       tf.timeStart,
    lineVertex: tf.zigzag,
  }
}

function closePosition(timeframes, i, tradeStatus, trades, maxTradeDev) {
  let trI = tradeI(timeframes, i, tradeStatus, trades, maxTradeDev);
  let tf  = timeframes[trI];

  let point = {
    i:          trI,
    order:      (tradeStatus.position > 0) ? 'sell' : 'buy',
    signal:     "Breakout Exit",
    price:      tf.close,
    size:       tradeStatus.openPoint.size,
    date:       tf.timeStart,
    lineVertex: tf.zigzag,
  };

  let leverage = 1;
  let minichart = [];

  for (let i = tradeStatus.openPoint.i - 1; ++i <= point.i;) {
    minichart.push({
      date: timeframes[i].timeStart,
      pnl:  tradeStatus.position * pnl(timeframes[i].close, tradeStatus.openPoint.price),
    });    
  }

  trades.push({
    start:      tradeStatus.openPoint,
    end:        point,
    trade:      (tradeStatus.position > 0) ? 'long' : 'short',
    signalBuy:  (tradeStatus.position > 0) ? tradeStatus.openPoint.signal : point.signal,
    signalSell: (tradeStatus.position > 0) ? point.signal : tradeStatus.openPoint.signal,
    priceBuy:   (tradeStatus.position > 0) ? tradeStatus.openPoint.price : point.price,
    priceSell:  (tradeStatus.position > 0) ? point.price : tradeStatus.openPoint.price,
    timeIn:     point.date - tradeStatus.openPoint.date,
    leverage:   leverage,
    pnl:        tradeStatus.position * pnl(point.price, tradeStatus.openPoint.price), 
    minichart:  minichart,
  });

  tradeStatus.position = 0;
  delete tradeStatus.openPoint;
}

function demoTrades(timeframes, probOpenOk, probCloseOk, maxTradeDev) {
  let tradeStatus = {
    trI:           -1,
    position:      0,
    lastTrade:     -1,
    freeCapital:   10000,
    investedFunds: 0,
  };

  let trades = [];

  for (let i = -1; ++i < timeframes.length;) {
    let tf = timeframes[i];
    if (tf.swing != undefined) {
      if (tradeStatus.position != 0 && Math.random() < probCloseOk) {
        closePosition(timeframes, i, tradeStatus, trades, maxTradeDev)
      }

      if (tradeStatus.position == 0 && Math.random() < probOpenOk) {
        openPosition(timeframes, i, tradeStatus, trades, maxTradeDev)
      }
    }
  }

  return trades;
}

function backtest(timeframes, probOpenOk, probCloseOk, maxTradeDev) {
  let trades = demoTrades(timeframes, probOpenOk, probCloseOk, maxTradeDev);
  let initialPrice = timeframes[0].close;

  let res = {
    totalPnL:      0,
    change24h:     0,       // percentage
    numOfTrades7d: 0,
    breakouts30d:  {     
      all:     0,
      catched: 0,
    },
    accuracyRate:  round(random(probOpenOk*probCloseOk*0.8, probOpenOk*probCloseOk) * 100, 10),
    maxDrawdown:   round(random(10, 30), 10),
    minichart24h:  [],
  };

  for (let tf of timeframes) {
    if (tf.swing != undefined) {
      res.breakouts30d.all++;
    }  
  }
  res.breakouts30d.catched = Math.round(random(res.breakouts30d.all * probOpenOk, res.breakouts30d.all));

  let now          = new Date();
  let timeMinus7d  = now - 7 * 24 * 3600000;
  let timeMinus3d  = now - 3 * 24 * 3600000;
  let timeMinus24h = now -     24 * 3600000;

  let pnls = [];

  for (let trade of trades) {
    // console.log(trade.start);

    if (trade.start.date.getTime() > timeMinus7d) {
      res.numOfTrades7d += 2;
    }
    for (let pnl of trade.minichart) {
      pnls.push({
        date: pnl.date,
        pnl:  res.totalPnL + pnl.pnl,
      });
    }
    res.totalPnL += trade.pnl;
  }

  let pnlBefore24h;
  for (let pnl of pnls) {
    if (pnl.date.getTime() < timeMinus3d) {  // timeMinus24h
      pnlBefore24h = pnl.pnl;
    } else {
      res.minichart24h.push(pnl);
      // TODO: add absent;
    }
  }
  if (pnlBefore24h > 0) {
    res.change24h = round(100 * (res.totalPnL - pnlBefore24h) / pnlBefore24h, 10);
  }

  return res;
}

function average(results) {
  let res = {
    totalPnL:      0,
    change24h:     0,       // percentage
    numOfTrades7d: 0,
    breakouts30d:  {     
      all:     0,
      catched: 0,
    },
    accuracyRate:  0,
    maxDrawdown:   0,
    minichart24h:  [],
  }

  if (!(results && results.length > 0)) {
    return res;
  }

  for (let r of results) {
    res.totalPnL             += r.totalPnL;
    res.change24h            += r.change24h;
    res.numOfTrades7d        += r.numOfTrades7d;
    res.breakouts30d.all     += r.breakouts30d.all;
    res.breakouts30d.catched += r.breakouts30d.catched;
    res.accuracyRate         += r.accuracyRate;
    res.maxDrawdown          += r.maxDrawdown;
    if (r.minichart24h.length > res.minichart24h.length) {
      res.minichart24h = r.minichart24h;
    }
  }

  res.totalPnL     = round(res.totalPnL, 1);
  res.change24h    = round(res.change24h    / results.length, 10);
  res.accuracyRate = round(res.accuracyRate / results.length, 10);
  res.maxDrawdown  = round(res.maxDrawdown  / results.length, 10);

  return res;
}