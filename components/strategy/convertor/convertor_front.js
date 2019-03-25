module.exports = {parse};

// this is the function to transform data received from frontend which includes indicators blocks data settings and params

// definitions:
// Group 'Entry'
// 'Entry Buy'  --> 'buyStrong'  (it works as enter or reverse depending on the current position)
// 'Entry Sell' --> 'sellStrong' (it works as enter or reverse depending on the current position)

// Group 'Exit'
// "Exit Buy"   --> action: "sell" / from: "long"
// "Exit Sell"  --> action: "buy"  / from: "short"

function parse(data) {
  if (!(data && data instanceof Object)) {
    return ['no data for convertor_front.parse()'];
  }
  if (!(data.entryBuy instanceof Object && data.entrySell instanceof Object 
        && data.exitBuy instanceof Object && data.exitSell instanceof Object)) {
    return ['wrong data for convertor_front.parse(): ' + JSON.stringify(data)];
  }
  
  const allBlocksArray = [data.entryBuy.groups, data.entrySell.groups, data.exitBuy.groups, data.exitSell.groups];
  const blockName      = ['entryBuy', 'entrySell', 'exitBuy', 'exitSell'];

  const indicatorsDefinition = {};
  const decisions = [
    {'action':'buyStrong', 'condition': ['or']},
    {'action':'sellStrong', 'condition': ['or']},
    {'action':'sell', 'from': 'long', 'condition': ['or']},
    {'action':'buy', 'from': 'short', 'condition': ['or']},
  ];

  let parsedData = {
    initialBalance: data.initialBalance || 10000,
    indicatorsDefinition: indicatorsDefinition,

    // TODO: add values from parsedData.entryBuy.groups[i].indicators[i].values
    // 'valuesDefinition': [],

    decisions: decisions,
  };

  // looping through 4 main blocks of groups: 'entryBuy', 'entrySell', 'exitBuy', 'exitSell'
  allBlocksArray.forEach((block, i) => {

    if (block instanceof Array) {

      // looping through 'OR' groups of single Block
      block.forEach((groupOR, i2) => {

        if (groupOR && groupOR instanceof Object && groupOR.indicators instanceof Array) {

          let andConditionsArray = ['and'];
          let prefix = `orblock${i2+1}`;

          // looping through 'AND' indicators inside each 'OR' group
          groupOR.indicators.forEach((indicatorAND, i3) => {

            let indicatorUniqueName = `${prefix}${indicatorAND.key}${blockName[i]}${i3+1}`;
            let condition = indicatorAND.condition.toLowerCase();

            switch (indicatorAND.key.toLowerCase()) {
              case 'vortex': {
                indicatorsDefinition[indicatorUniqueName] = [indicatorAND.key, ...indicatorAND.params];
                // checking condition and pushing relevant condition array to decisions
                andConditionsArray.push(
                  (condition === 'crossover') ? ['cross', ['ind', indicatorUniqueName, 0], ['ind', indicatorUniqueName, 1]] :
                  (condition === 'crossunder') ? ['cross', ['ind', indicatorUniqueName, 1], ['ind', indicatorUniqueName, 0]] :
                  (condition === 'above') ? ['>', ['ind', indicatorUniqueName, 0], ['ind', indicatorUniqueName, 1]] :
                  (condition === 'below') ? ['<', ['ind', indicatorUniqueName, 0], ['ind', indicatorUniqueName, 1]] :
                  null
                );
                break;
              };
              case 'bb': {
                indicatorsDefinition[indicatorUniqueName] = [indicatorAND.key, ...indicatorAND.params];
                andConditionsArray.push(
                  (condition === 'crossover') ? ['cross', ['ind', indicatorUniqueName, 0], ['ind', indicatorUniqueName, 1]] :
                  (condition === 'crossunder') ? ['cross', ['ind', indicatorUniqueName, 1], ['ind', indicatorUniqueName, 0]] :
                  (condition === 'above') ? ['>', ['ind', indicatorUniqueName, 0], ['ind', indicatorUniqueName, 1]] :
                  (condition === 'below') ? ['<', ['ind', indicatorUniqueName, 0], ['ind', indicatorUniqueName, 1]] :
                  null
                );
                break;
              };
              case 'stochastic': {
                indicatorsDefinition[indicatorUniqueName] = [indicatorAND.key, ...indicatorAND.params];
                andConditionsArray.push(
                  (condition === 'crossover') ? ['cross', ['ind', indicatorUniqueName, 0], ['ind', indicatorUniqueName, 1]] :
                  (condition === 'crossunder') ? ['cross', ['ind', indicatorUniqueName, 1], ['ind', indicatorUniqueName, 0]] :
                  (condition === 'above') ? ['>', ['ind', indicatorUniqueName, 0], ['ind', indicatorUniqueName, 1]] :
                  (condition === 'below') ? ['<', ['ind', indicatorUniqueName, 0], ['ind', indicatorUniqueName, 1]] :
                  null
                );
                break;
              };
              case 'dma': {
                indicatorsDefinition[indicatorUniqueName] = [indicatorAND.key, ...indicatorAND.params];
                andConditionsArray.push(
                  (condition === 'crossover') ? ['cross', ['ind', indicatorUniqueName, 0], ['ind', indicatorUniqueName, 1]] :
                  (condition === 'crossunder') ? ['cross', ['ind', indicatorUniqueName, 1], ['ind', indicatorUniqueName, 0]] :
                  (condition === 'above') ? ['>', ['ind', indicatorUniqueName, 0], ['ind', indicatorUniqueName, 1]] :
                  (condition === 'below') ? ['<', ['ind', indicatorUniqueName, 0], ['ind', indicatorUniqueName, 1]] :
                  null
                );
                break;
              };
              case 'adx': {
                indicatorsDefinition[indicatorUniqueName] = [indicatorAND.key, ...indicatorAND.params];
                andConditionsArray.push(
                  (condition === 'crossover') ? ['cross', ['ind', indicatorUniqueName], indicatorAND.value] :
                  (condition === 'crossunder') ? ['cross', indicatorAND.value, ['ind', indicatorUniqueName]] :
                  (condition === 'greater') ? ['>', ['ind', indicatorUniqueName], indicatorAND.value] :
                  (condition === 'greaterequal') ? ['>=', ['ind', indicatorUniqueName], indicatorAND.value] :
                  (condition === 'less') ? ['<', ['ind', indicatorUniqueName], indicatorAND.value] :
                  (condition === 'lessequal') ? ['<=', ['ind', indicatorUniqueName], indicatorAND.value] :
                  null
                );
                break;    
              };
              case 'rsi': {
                indicatorsDefinition[indicatorUniqueName] = [indicatorAND.key, ...indicatorAND.params];
                andConditionsArray.push(
                  (condition === 'crossover') ? ['cross', ['ind', indicatorUniqueName], indicatorAND.value] :
                  (condition === 'crossunder') ? ['cross', indicatorAND.value, ['ind', indicatorUniqueName]] :
                  (condition === 'greater') ? ['>', ['ind', indicatorUniqueName], indicatorAND.value] :
                  (condition === 'greaterequal') ? ['>=', ['ind', indicatorUniqueName], indicatorAND.value] :
                  (condition === 'less') ? ['<', ['ind', indicatorUniqueName], indicatorAND.value] :
                  (condition === 'lessequal') ? ['<=', ['ind', indicatorUniqueName], indicatorAND.value] :
                  null
                );
                break;    
              };
              case 'roc': {
                indicatorsDefinition[indicatorUniqueName] = [indicatorAND.key, ...indicatorAND.params];
                andConditionsArray.push(
                  (indicatorAND.condition === 'crossover') ? ['cross', ['ind', indicatorUniqueName], indicatorAND.value] :
                  (indicatorAND.condition === 'crossunder') ? ['cross', indicatorAND.value, ['ind', indicatorUniqueName]] :
                  (indicatorAND.condition === 'greater') ? ['>', ['ind', indicatorUniqueName], indicatorAND.value] :
                  (indicatorAND.condition === 'greaterequal') ? ['>=', ['ind', indicatorUniqueName], indicatorAND.value] :
                  (indicatorAND.condition === 'less') ? ['<', ['ind', indicatorUniqueName], indicatorAND.value] :
                  (indicatorAND.condition === 'lessequal') ? ['<=', ['ind', indicatorUniqueName], indicatorAND.value] :
                  null
                );
                break;    
              };
              case 'macd': {
                indicatorsDefinition[indicatorUniqueName] = [indicatorAND.key, ...indicatorAND.params];
                andConditionsArray.push(
                  (condition === 'crossover') ? ['cross', ['ind', indicatorUniqueName], indicatorAND.value] :
                  (condition === 'crossunder') ? ['cross', indicatorAND.value, ['ind', indicatorUniqueName]] :
                  null
                );
                break;
              };
              case 'sar': {
                indicatorsDefinition[indicatorUniqueName] = [indicatorAND.key, ...indicatorAND.params];
                andConditionsArray.push(
                  (condition === 'crossover') ? ['cross', ['ind', indicatorUniqueName], indicatorAND.value] :
                  (condition === 'crossunder') ? ['cross', indicatorAND.value, ['ind', indicatorUniqueName]] :
                  null
                );
                break;
              };
              default: 
                console.error('no such indicator logic in Switch');
            }
          });

          decisions[i].condition.push(andConditionsArray);
        }
      });
    };
  });

  return [null, parsedData];
}
