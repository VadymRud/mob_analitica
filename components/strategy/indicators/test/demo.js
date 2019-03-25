let timeframes = [
  {indicators: {}},
  {indicators: {}},
  {indicators: {}},
];

let n = 0;

let demo = demoInd();

for (let i = -1; ++i < timeframes.length;) {
  demo(timeframes[i], (i > 0 ? timeframes.slice(0, i) : []));
}

function demoInd(params) {
  return (timeframe, timeframesPrev) => {
    timeframe.indicators.n = ++n;
    console.log(n, timeframesPrev);

    return 0;
  };
}

