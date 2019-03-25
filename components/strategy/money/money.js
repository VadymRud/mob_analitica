const actions = require('../actions');

module.exports = {action, set};
 
function action(timeframe, timeframePrev, balance, from) {

  if (from) {
    timeframe.from = from;

    if (((timeframePrev.finalPosition < 0)   && (from !== 'short')) ||
        ((timeframePrev.finalPosition > 0)   && (from !== 'long'))  ||
        ((timeframePrev.finalPosition === 0) && (from !== 'flat'))   ) {
      return '';
    }
  }
  
  switch (timeframe.action) {
    case actions.buy:
      return (timeframePrev.finalPosition < 0)  ? actions.moneyFlat 
           : (timeframePrev.finalPosition == 0) ? actions.moneyLong 
           : '';

    case actions.buyStrong:
      // console.log(timeframePrev, 111111, (timeframePrev.finalPosition <= 0) ? actions.moneyLong : '');
      // process.exit();

      return (timeframePrev.finalPosition <= 0) ? actions.moneyLong : '';
      // !!! no reenter

    case actions.sell:
      return (timeframePrev.finalPosition > 0)  ? actions.moneyFlat 
           : (timeframePrev.finalPosition == 0) ? actions.moneyShort 
           : '';

    case actions.sellStrong:
      return (timeframePrev.finalPosition >= 0) ? actions.moneyShort : '';
      // !!! no reenter

  }
  return '';
}
 
function set(timeframe, timeframePrev, balance, actionFinal) {
  let change = count(timeframe, timeframePrev, balance, actionFinal);

  let [changeFree, allocatedCapital, profitCapital, profit, actionLots, actionPrice, finalLots, finalPosition] = change;
  timeframe.actionFinal      = actionFinal ? actionFinal : '';              // doNothing
  timeframe.finalPosition    = finalPosition;
  timeframe.actionPrice      = actionPrice;
  timeframe.actionLots       = actionLots;
  timeframe.finalLots        = finalLots;
  timeframe.allocatedCapital = allocatedCapital;
  timeframe.profitCapital    = profitCapital;
  timeframe.profit           = profit; 

  balance.free  += changeFree; 
  balance.total  = balance.free + allocatedCapital + profitCapital;

} 


function count(timeframe, timeframePrev, balance, actionFinal) {
  
  let profit;
  let allocatedCapital; 
  let profitCapital; 
  let actionLots; 
  let actionPrice; 
  let finalLots; 
  let finalPosition;

  switch (actionFinal) {
    case actions.moneyFlat:
      if (timeframePrev.finalPosition === 0) {
        return [0, 0, 0, 0, 0, 0, 0, 0];     // no position => no action, no capital
      }  

      actionPrice     = timeframe.close;     // TODO: check correct actionPrice
      actionLots      = timeframePrev.finalLots;
      profit          = timeframePrev.finalLots * timeframePrev.finalPosition * (actionPrice - timeframePrev.close);


      return [timeframePrev.allocatedCapital + timeframePrev.profitCapital + profit, 0, 0, profit, actionLots, actionPrice, 0, 0]; 

    case actions.moneyLong:
      actionPrice        = timeframe.close; // TODO: check correct actionPrice
      profit             = timeframePrev.finalLots * (timeframePrev.close - actionPrice);
      profitCapital      = timeframePrev.profitCapital + profit; 
      finalPosition      = 1;
      
      if (timeframePrev.finalPosition < 0) {
        // !!! reverse
        allocatedCapital = timeframePrev.allocatedCapital;   // TODO: check MoneyManagementType
        changeFree       = 0; 
        finalLots        = (allocatedCapital + profitCapital) / actionPrice;
        actionLots       = timeframePrev.finalLots + finalLots;
      
      } else {
        allocatedCapital = balance.free;                     // TODO: check MoneyManagementType
        changeFree       = -allocatedCapital;
        actionLots       = allocatedCapital / actionPrice;
        finalLots        = timeframePrev.finalLots + actionLots;

      }
      return [changeFree, allocatedCapital, profitCapital, profit, actionLots, actionPrice, finalLots, finalPosition];

    case actions.moneyShort:
      actionPrice        = timeframe.close; // TODO: check correct actionPrice
      profit             = timeframePrev.finalLots * (actionPrice - timeframePrev.close);
      profitCapital      = timeframePrev.profitCapital + profit; 
      finalPosition      = -1;
        
      if (timeframePrev.finalPosition > 0) {
        // !!! reverse
        allocatedCapital  = timeframePrev.allocatedCapital;   // TODO: check MoneyManagementType
        changeFree        = 0; 
        finalLots         = (allocatedCapital + profitCapital) / actionPrice;
        actionLots        = timeframePrev.finalLots + finalLots;
      
      } else {
        allocatedCapital  = balance.free;                     // TODO: check MoneyManagementType
        changeFree        = -allocatedCapital;
        actionLots        = allocatedCapital / actionPrice;
        finalLots         = timeframePrev.finalLots + actionLots;

      }

      return [changeFree, allocatedCapital, profitCapital, profit, actionLots, actionPrice, finalLots, finalPosition];

  }

  // case actions.doNothing:
  // case '':
  // default:
  if (timeframePrev.finalPosition === 0) {
    return [0, 0, 0, 0, 0, 0, 0, 0]; // no position => no action, no capital
  }  


  profit           = timeframePrev.finalLots * timeframePrev.finalPosition * (timeframe.close - timeframePrev.close);
  allocatedCapital = timeframePrev.allocatedCapital;
  profitCapital    = timeframePrev.profitCapital + profit;
  finalLots        = timeframePrev.finalLots;
  finalPosition    = timeframePrev.finalPosition;

  return [0, allocatedCapital, profitCapital, profit, 0, 0, finalLots, finalPosition];
}


