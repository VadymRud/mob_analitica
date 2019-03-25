/**
 * Strategy alghoritm.
 * @module strategy/algo
 */

const indicators = require('../indicators/indicators');
const indBasics  = require('../indicators/basics');
const money      = require('../money/money');
const risk       = require('../risk/risk');
const values     = require('./values');

module.exports = {

  /**
   * @callback ExecuteCallback
   * @param {string} error - Error
   * @param {object[]} result - Array of timeframes
   */
  /**
   * Executes strategy.
   * @param {object} strategyItem - Strategy descripton object.
   * @param {object[]} timeframesInitial - Initial timeframes.
   * @param {boolean} toSaveDebug - Debug mode flag.
   * @param {ExecuteCallback} cb - Callback
   */
  execute, 

  executeSync,

  /**
   * Get debug description.
   * @param {string} debugId - Id of debug
   */  
  getDebug,
};

function executeSync(strategyItem, timeframesInitial, toSaveDebug) {
  if (!(timeframesInitial instanceof Array && timeframesInitial.length > 0)) {
    return 'no timeframes for strategy.execute()';
  }  

  if (!(strategyItem && (strategyItem instanceof Object))) {
    return 'no strategyItem for strategy.execute()';
  }  

  if (!(strategyItem.decisions && (strategyItem.decisions instanceof Array))) {
    strategyItem.decisions = [];
  }

  indicators.setForStrategy(strategyItem);

  // let initialPrice = timeframesInitial[0].open;

  let balance = {free: strategyItem.initialBalance + 0, total: strategyItem.initialBalance + 0};

  let n          = 0;  
  let timeframes = [
    {
      n:                0, 
      fake:             true,
      // date:          new Date(1970, 0, 1),

      finalLots:        0,
      finalPosition:    0,
      allocatedCapital: 0,
      profitCapital:    0,
    },
  ];  

  for (let timeframe of timeframesInitial) {
    let timeframePrev       = timeframes[timeframes.length - 1];
    timeframe.n             = ++n;

    let actionFinal = (timeframe.action      = action(timeframe, timeframes.slice(1), strategyItem)) &&
                      (timeframe.actionMoney = money.action(timeframe, timeframePrev, balance, strategyItem.position)) &&
                      (timeframe.actionRisk  = risk.action(timeframe, timeframePrev, balance));

    money.set(timeframe, timeframePrev, balance, actionFinal);

    delete timeframe.exchange;
    delete timeframe.base;
    delete timeframe.quote;
    delete timeframe.volumeTraded;
    delete timeframe.tradesCount;

    timeframe.freeCapitalIfAlone = balance.free;

    // if (timeframes.length > 15) {
    //   // console.log(timeframes);
    //   process.exit();
    // }

    timeframes.push(timeframe);

    // if (timeframe.n >= 6) {
    //   break;
    // }

  }

  if (toSaveDebug) {
    return [null, timeframes, saveDebug(result)];
  }

  return [null, timeframes];
}


// DEPRECATED
function execute(strategyItem, timeframesInitial, toSaveDebug, cb) {
  if (!(timeframesInitial instanceof Array && timeframesInitial.length > 0)) {
    cb('no timeframes for strategy.execute()');
    return;
  }  

  if (!(strategyItem && (strategyItem instanceof Object))) {
    cb('no strategyItem for strategy.execute()');
    return;
  }  

  if (!(strategyItem.decisions && (strategyItem.decisions instanceof Array))) {
    strategyItem.decisions = [];
  }

  indicators.setForStrategy(strategyItem);

  // let initialPrice = timeframesInitial[0].open;

  let balance = {free: strategyItem.initialBalance + 0, total: strategyItem.initialBalance + 0};

  let n       = 0;  
  let result  = {timeframes: [
    {
      n:                0, 
      fake:             true,
      // date:          new Date(1970, 0, 1),

      open:             0,
      high:             0,
      low:              0,
      close:            0,
      finalLots:        0,
      finalPosition:    0,
      allocatedCapital: 0,
      profitCapital:    0,
    },
  ]};  

  let from;

  for (let timeframe of timeframesInitial) {
    let timeframePrev = result.timeframes[result.timeframes.length - 1];
    timeframe.n       = ++n;

    [timeframe.action, from] = action(timeframe, result.timeframes.slice(1), strategyItem);

    let actionFinal = timeframe.action &&
                      (timeframe.actionMoney = money.action(timeframe, timeframePrev, balance, from)) &&
                      (timeframe.actionRisk  = risk.action(timeframe, timeframePrev, balance));

    money.set(timeframe, timeframePrev, balance, actionFinal);

    delete timeframe.exchange;
    delete timeframe.base;
    delete timeframe.quote;
    delete timeframe.volumeTraded;
    delete timeframe.tradesCount;

    timeframe.freeCapitalIfAlone = balance.free;

    // if (result.timeframes.length > 15) {
    //   // console.log(result.timeframes);
    //   process.exit();
    // }

    result.timeframes.push(timeframe);

    // console.log(timeframe);
    // if (timeframe.n >= 13) {
    //   break;
    // }

  }

  if (toSaveDebug) {
    result.debugId = saveDebug(result);
  }

  cb(null, result);
}

function action(timeframe, timeframes, strategyItem) {
  let action = '';
  let from;

  timeframe.indicators = {};

  if (Object.keys(strategyItem.indicators).length > 0) {
    for (let key of Object.keys(strategyItem.indicators)) {
      // TODO: check data types
      try {
        value = strategyItem.indicators[key](timeframe, timeframes);
        timeframe.indicators[key] = value;

      } catch (err) {
        // TODO: use const
        // if (err.toString() === indBasics.errPeriodIsntFullStr) {
        if (err === indBasics.errPeriodIsntFull) {
          // timeframe.indicators[key] = [];

        } else {  
          // TODO: throw further???
          console.error(err);
        }
      }
    }  
  }

  // console.log(timeframe.indicators);

  timeframe.values = {};

  if (strategyItem.valuesDefinition instanceof Array && timeframes.length > 0) {
    for (let vd of strategyItem.valuesDefinition) {
      timeframe.values[vd[0]] = values.count(timeframe, timeframes, vd[1]);
    } 
  }

  for (let decision of strategyItem.decisions) {
    if (values.count(timeframe, timeframes, decision.condition)) {
      action = decision.action;
      from   = decision.from;

      // if (action === 'sellLong') {
      //   action = 'sellStrong';
      // } else if (action === 'sellShort') {
      //   action = 'buyStrong';
      // }
      break;
    }
  }
  
  return [action, from];
} 

let   results       = {};
const periodToStore = 10 * 60000; // 10 minutes

function saveDebug(result) {
  let now     = new Date();
  let debugId = now.getTime() + '/' + Math.round(Math.random() * 1000000);

  for (let k of Object.keys(results)) {
    if (now - results[k].storedAt > periodToStore) {
      delete results[k];
    }
  }

  result.storedAt  = now;
  results[debugId] = result;
 
  return debugId;
}

function getDebug(debugId) {
  return results[debugId];  
}

// Comission      float

// type Balance object {
//    free    float
//    total   float
// }

// type StrategyInterval object {
//    n              int     
//    timeStart      date
//    open           float
//    high           float
//    low            float
//    close          float
//    fake           bool
//
//    enterPosition  int
//    enterLots      float
//    enterCapital   float
//
//    action: string
//    actionMoney:    string
//    actionRisk:     string
//
//    action         Action
//    actionLots     float
//    actionPrice    float
//    comission      float

//    finalLots      float
//    finalPosition  int
//    finalCapital   float       // !!! final

// }

// type StrategyResult object {
//   timeframes        []StrategyInterval
//   profitability     float 
//   riskReward        float // == Max Drawdown/Total Profit
//   breakoutsRealized float // share of all
//   accuracyRate      float // share of all breakouts ???
//   winLossRatio      float // on number of trades
//   recoveryTime      float 
// }  

// type Identity string 

// type Action enum {"", "buyStrong", "sellStrong"}   // doNothing

// type Asset object {
//   exchange string
//   base     string
//   quote    string
// }

// type Indicator object {
//    id      string
//    basisId string
//    params  object
// }

// type IndicatorOperation enum {
//   "cross", 
//   ">", ">=", "<", "<=", "=", "!=",
// }


// type IndicatorTerm object {
//    operand1  IndicatorTerm | Indicator | number
//    operand2  IndicatorTerm | Indicator | number
//    operation IndicatorOperation
// }

// type LogicalOperation enum {
//   "AND", "OR",
// }

// type LogicalTerm object {
//    operand1  LogicalTerm | IndicatorTerm
//    operand2  LogicalTerm | IndicatorTerm
//    operation LogicalOperation
// }

// type Decision object {
//    condition LogicalTerm | IndicatorTerm
//    action    Action
// }

// type Strategy object {
//   ownerId        Identity
//   viewersId      Identity
//   debugId        string
//   name           string 
//   asset          Asset
//   initialBalance float
//   indicators     []Indicator
//   decisions      []Decision
// }
