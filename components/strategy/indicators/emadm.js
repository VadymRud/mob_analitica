module.exports = {emadmInd};


function emadmInd(period) {
  return (timeframe, timeframes) => {
    
    if (!timeframe) {
      throw new Error('no interval');
    }

    if (period > timeframes.length) {
      throw new Error('period isn\'t full');
    }

    let values = [timeframe.close];
    for (let i = timeframes.length; --i >= timeframes.length - period;) {
      values.unshift(timeframes[i].close);
    }
    let hightYesterday = timeframes[timeframes.length - 1].hight;
    let hightToday = timeframe.hight;
    let lowYesterday = timeframes[timeframes.length - 1].low;
    let lowToday = timeframe.low;

    let upMoveHight = hightToday - hightYesterday; // =F3-F2
    let downMove = lowToday - lowYesterday;

    let dmPlus = 0; // =ЕСЛИ(И(X3>Y3;X3>0);X3;0)
    let dmMinus = 0; // =ЕСЛИ(И(Y3>X3;Y3>0);Y3;0)
    if ((upMoveHight > downMove) && (upMoveHight != 0) ) {
      dmPlus = upMoveHight;
    } else {
      dmPlus = 0;
    }

    if ((downMove > upMoveHight) && (downMove != 0) ) {
      dmMinus = downMove;
    } else {
      dmMinus = 0;
    }


    let emaDMPlusYesterday = timeframes[timeframes.length - 1].indicators.emaDMPlus;
    let emaDMMinusYesterday = timeframes[timeframes.length - 1].indicators.emaDMMinus;

    let emaDMPlus = ((dmPlus - emaDMPlusYesterday) * (2 / (14 + 1)))+emaDMPlusYesterday; // =(Z3-AB2)*(2/(14+1))+AB2 
    let emaDMMinus = ((dmMinus - emaDMMinusYesterday) * (2/(14 + 1))) + emaDMMinusYesterday;
    
    return [{'emaDMPlus': emaDMPlus, 'emaDMMinus' : emaDMMinus}];
  };  
}
