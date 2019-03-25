## SAVING THE NEW STRATEGY

    curl -X POST "http://127.0.0.1:10010/v1/strategy/insert" --data "{\"a\":\"b\"}" -H "Content-Type: application/json"

    curl -X POST "http://127.0.0.1:10010/v1/strategy/insert" --data "{\"a1\":\"b1\"}" -H "Content-Type: text/plain"


## BACKESTING THE NEW STRATEGY

    curl -X POST "http://127.0.0.1:10010/v1/strategy/tools/debug" --data "{\"a1\":\"b1\"}" -H "Content-Type: application/json"

    curl -X POST "http://127.0.0.1:10010/v1/strategy/tools/debug" --data "{\"a1\":\"b1\"}" -H "Content-Type: text/plain"

    ???
    curl -X POST "http://127.0.0.1:10010/v1/strategy/tools/debug" --data "" -H "Content-Type: text/plain" 
    ???


## DASHBOARD

### MY ASSETS

    My Assets Table [{
      exchange:      string,
      base:          string,
      quote:         string,
      ticker         string,
      icon:          string,  // url
      category:      {"Crypto", "Stock", "FX", "Commodity", "ETF", "Bond"},
      price          float,
      change24h:     float,   // percentage
      change30d:     float,   // percentage
      accuracyRate:  float,
      pnlTotal:      float,
      numOfTrades7d: integer,
      minichart24h: {
        time:  timestamp,
        open:  float,
        high:  float,
        low:   float,
        close: float,
        pnl:   float,
      },
      breakouts30d: {
        all:     integer,
        catched: integer,
      }
    }]


### MAIN CHART (FOR SELECTED ASSET & DESCRIBED STRATEGY)
 
    Strategy chart {
      candlestick: [Candle],   
      zigzag:      [Zigzag],
      trades:      [Trade],
      results:     Results, 
    }

    Candle 
      [time, open, high, low, close, volume]

    Point {
      time:   timestamp
      order:  {"buy", "sell"}    
      size:   float,
      price:  float,
      zigzag: float,
      signal: {
        "Breakout Entry", "Breakout Exit", 
        "Take Profit", "Gradual Take Profit", "Stop Loss", "Trailling Stop", "Martingale"
      },
    };

    Trade {
      start:      Point,     // чтобы передавать реверсы делаются два трейда подряд
      end:        Point,
      pnl:        float,     // Profit&Loss value
      trade:      {"short", "long"},  
      signalSell: string,    // signalSell == (start.order == "sell" ? start.price : end.price)
      signalBuy:  string,    // signalBuy  == (start.order == "sell" ? end.signal : start.signal)
      priceBuy:   float,     // priceBuy  == (start.order == "sell" ? end.price : start.price)
      priceSell:  float      // priceSell == (start.order == "sell" ? start.price : end.price)
      // -- size: use start.size
      timeIn:     duration   // ms
      leverage:   float,
      minichart: [
        [timestamp, pnl]...
      ]
    }

    Zigzag 
      [timestamp, value]

    Results {
      msqScore:       float,
      riskReward:     float,
      leverageAvg:    float,
      percentFromATH: float
      drawdownMax:    float,
      slippageAvg:    float,
      winLossRatio:   float,
      winLossAvg:     float,
      sharpRatio:     float,
      stability:      float,
      winLossMax:     float,
      pnlTotal:       float,
      pnlExpected:    float,
      accuracyRate:   float,  // percentage 
      breakouts30d: {
        all:     integer,
        catched: integer,    
      }
    }


### ZOOM IN

    ZoomIn {
      model: {
        accuracyRate: float,        // percentage
        breakouts: {                // ??? why not for 30d only 
          all:     integer,
          catched: integer,        
        },
        leverage:          float,   
        leverageAvg:       float,   
        recoveryTimeAvg:   float,   
        timeInTradeAvg:    float,   
        entryAccuracyRate: float,   // percentage
        exitAccuracyRate:  float,   // percentage
      },

      trading: {
        profit: {
          value:      float,        // dollars
          percentage: float,        // percentage
        },
    
        breakouts30d: {
          all:     integer,
          catched: integer, 
        },

        winLossRatio: float,        // percentage
        orderSizeAvg: float,
        slippageAvg:  float,        // percentage
        shortPnl:     float,        // dollars
        longPnl:      float,        // dollars
        drawdownMax:  float,        // percentage   
        marketDepthRatioAvg: float, // 
        marketDepthSizeAvg:  float, // percentage
        marketSentiment30d:  string,
        peakToValleyRatio:   float, // percentage
      },
  
      market: {
        volume24h:    float,  // dollars
        volatility:   float, 

        breakoutsAvg: { 
          all:     integer,
          catched: integer, 
        },
        spreadAvg: float,  // percentage
  			marketSentiment30d:      string   //"positive", "negative"
	  		peakToValleyRatio:       float,   //percentage
      }
		}


### MY PORTFOLIOS && STRATEGIES && ASSETS (HIERARCHY)

    Portfolios Table {
      [Portfolio]
    }

    Portfolio {
      id:           string,
      name:         string,
      pnlTotal:     float,   // dollars    ??? == "balance" column in portfolio2.png
      change24h:    float,   // percentage      
      breakouts30d: {     
        all:        integer,  
        catched:    integer,  
      },
      accuracyRate: float,    // percentage
      drawdownMax:  float,    // percentage 
      msqScore:     float     // 
      minichart24h: [{
        time: timestamp,
        pnl:  float,
      }],
      strategies: [Strategy],
    }
  
    Strategies Table {
      [Strategy]
    }

    Strategy {
      id:        string,
      name:      string,
      pnlTotal:  float,  // dollars
      change24h: float,  // percentage
      breakouts30d: {
        all:     integer,
        catched: integer,
      },
      accuracyRate: float,    // percentage
      drawdownMax:  float,    // percentage 
      msqScore: float,
      minichart24h: [{
        time: timestamp,
        pnl:  float,
      }],
      assets: [Asset],
    }
 
    Assets Table {
      [Asset]
    }

    Asset {
      id:            string,
      name:          string,
      category:      {"Crypto", "Stock", "FX", "Commodity", "ETF", "Bond"},
      pnlTotal:      float,       
      change24h:     float,
      numOfTrades7d: integer,
      breakouts30d: {
        all:     integer,
        catched: integer,     
      },
      accuracyRate: float,    // percentage
      drawdownMax:  float,    // percentage 
      minichart24h: [{
        time: timestamp,
        pnl:  float,
      }]
    }


### FEATURED STRATEGIES

    Featured strategies [{
      id:          string,
      name:        string,

      performanceChart      // ???

      followers:   integer,
      trades:      integer,
      funds:       float,     // dollars 
      return:      float,     // percentage 
      drawdownMax: float,     // percentage ??? max
      msqScore:    float,
      listed:      Date,
    }]


## ACADEMY

    Academy [{
      id:          string,
      name:        string,
      description: string,
      views:       integer,
      shared:      integer,
      likes:       integer,
      published:   Date,
    }]


## MARKET PLACE 

??? is it some strategies list with next structure for each one

    strategy risk {
      msqScore: {
        max:    float,
        actual: float,
      },
  
      riskReward: {
        max:    float,
        actual: float,
      },
  
      averageLeverage: {
        max: float,
        actual: float,
      },
  
      allTimeHigh: {
        max: float,
        actual: float,
      },
  
      timeSinceATH: {
        max: float,
        actual: float,
      },
  
      biggestWinning: {
        max: float,
        actual: float,
      },
  
      biggestLosing: {
        max: float,
        actual: float,
      },
  
      pickToValley: {
        max: float,
        actual: float,
      }
    }
    
## STRATEGY BUILDER

    score board {
      id: string
      score: integer,
      asset: string // ETHUSD, EOSUSD
      interval: string //1h, 1d
      period: string // YDT
    } may contain additional fields
    
