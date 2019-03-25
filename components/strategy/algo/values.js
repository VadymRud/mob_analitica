/**
 * Strategy alghoritm conditions.
 * @module strategy/conditions
 */

module.exports = {count};

const util = require('util');

function count(timeframe, timeframes, condition) {
  if (typeof condition === 'number') {
    return condition;

  } else if (condition instanceof Function) {
    return condition(timeframe, timeframes);

  } else if (condition instanceof Array) {
    switch (condition[0]) {
      case 'val':
        if (timeframe.values && (condition[1] in timeframe.values)) {
          return timeframe.values[condition[1]];
        }  
        return 0;

      case 'ind':
        if (timeframe.indicators && (condition[1] in timeframe.indicators)) {
          return (timeframe.indicators[condition[1]] instanceof Array) 
               ? timeframe.indicators[condition[1]][condition[2]] 
               : timeframe.indicators[condition[1]];
        }  
        return 0;

      case 'cross':
        if (timeframes.length < 2) {
          // initial fake timeframe can't be used
          return 0;
        }

        let timeframeP  = timeframes[timeframes.length - 1];
        let timeframesP = timeframes.slice(0, timeframes.length - 1);
        return (count(timeframeP, timeframesP, condition[1]) <= count(timeframeP, timeframesP, condition[2])) &&
               (count(timeframe,  timeframes,  condition[1]) >  count(timeframe,  timeframes,  condition[2]));

      case 'not':
      case 'NOT':
        return !count(timeframe, timeframes, condition[1]);

      case 'and':
      case 'AND':
        return count(timeframe, timeframes, condition[1]) && count(timeframe, timeframes, condition[2]);

      case 'or':
      case 'OR':
        return count(timeframe, timeframes, condition[1]) || count(timeframe, timeframes, condition[2]);
          
      case '+':
        let v1 = count(timeframe, timeframes, condition[1]); 
        let v2 = count(timeframe, timeframes, condition[2]);       
        return v1 + v2;

      case '-':
        return count(timeframe, timeframes, condition[1]) - count(timeframe, timeframes, condition[2]);

      case '*':
        return count(timeframe, timeframes, condition[1]) * count(timeframe, timeframes, condition[2]);
        
      case '/':
        return count(timeframe, timeframes, condition[1]) / count(timeframe, timeframes, condition[2]);

        // case '%':
        //   return checkCondition(timeframe, timeframes, condition[1]) - checkCondition(timeframe, timeframes, condition[2]);

      case '<':
        return count(timeframe, timeframes, condition[1]) < count(timeframe, timeframes, condition[2]);

      case '<=':
        return count(timeframe, timeframes, condition[1]) <= count(timeframe, timeframes, condition[2]);

      case '>':
        // console.log(1, checkCondition(timeframe, timeframes, condition[1]));
        // console.log(2, checkCondition(timeframe, timeframes, condition[2]));

        return count(timeframe, timeframes, condition[1]) > count(timeframe, timeframes, condition[2]);

      case '>=':
        return count(timeframe, timeframes, condition[1]) >= count(timeframe, timeframes, condition[2]);

      case '=':
        return count(timeframe, timeframes, condition[1]) == count(timeframe, timeframes, condition[2]);

      case '!=':
        return count(timeframe, timeframes, condition[1]) != count(timeframe, timeframes, condition[2]);

    }
  }

  throw util.format('wrong condition: %j', condition);
}  
