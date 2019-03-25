const front = require('./convertor_front');
const data  = require('./example');

let resultObj = front.parse(data);
console.log(JSON.stringify(resultObj, null, 3));

let resultObjBad = front.parse({});
console.log(JSON.stringify(resultObjBad, null, 3));

// console.log(resultObj.indicatorsDefinition.exitSell);

// console.log(resultObj.decisions[0].condition[2]);
// console.log(resultObj.decisions[0]);
