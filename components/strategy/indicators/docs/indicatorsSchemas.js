indicators: [
        {
          key: "dma",
          name: "Double Moving Average",
          shortName: "DMA",
          params: [
            {name: "Fast Period", type: 'number', min: 1, max: 100, step: 1, default: 9, color: "green", description: "xxx tech writer will write it"}, 
            {name: "Slow Period", type: 'number', min: 1, max: 100, step: 1, default: 14, color: "red", description: "xxx tech writer will write it"}
          ],
          conditions: [
            {value: "crossOver", name: "Cross Over", image: "", description: ""}, 
            {value: "crossUnder", name: "Cross Under", image: "", description: ""}, 
            {value: "above", name: "Above", image: "", description: ""}, 
            {value: "below", name: "Below", image: "", description: ""}
          ],
          buyDefaults: {
            condition: 'crossOver',
          },
          sellDefaults: {
            condition: 'crossUnder',
          }
        },
        {
          key: "vortex",
          name: "Vortex Indicator",
          shortName: "Vortex",
          params: [
            {name: "Period", type: 'number', min: 1, max: 60, step: 1, default: 9, color: "green", description: "xxx tech writer will write it"}
          ],
          conditions: [
            {value: "crossOver", name: "Cross Over", image: "", description: ""}, 
            {value: "crossUnder", name: "Cross Under", image: "", description: ""}, 
            {value: "above", name: "Above", image: "", description: ""}, 
            {value: "below", name: "Below", image: "", description: ""}
          ],
          buyDefaults: {
            condition: 'crossOver',
          },
          sellDefaults: {
            condition: 'crossUnder',
          }
        },
        {
          key: 'rsi',
          name: "Relative Strength Index",
          shortName: "RSI",
          params: [
            {name: "Period", type: 'number', min: 1, max: 60, step: 1, default: 9, color: "green", description: "xxx tech writer will write it"},
            {name: {buy: "Oversold", sell: "Overbought"}, type: 'number', min: 1, max: 60, step: 1, default: {buy: 30, sell: 70}, color: "red", description: "xxx tech writer will write it"}
          ],
          conditions: [
            {value: "greater", name: "Greater", image: "", description: ""},
            {value: "greaterThan", name: "Greater Than", image: "", description: ""}, 
            {value: "less", name: "Less", image: "", description: ""},
            {value: "lessThan", name: "Less Than", image: "", description: ""},
            {value: "crossOver", name: "Cross Over", image: "", description: ""}, 
            {value: "crossUnder", name: "Cross Under", image: "", description: ""}, 
          ],
          buyDefaults: {
            condition: 'lessThan',
          },
          sellDefaults: {
            condition: 'greaterThan',
          }
        },
        {
          key: 'roc',
          name: "Rate of Change",
          shortName: "ROC",
          params: [
            {name: "Period", type: 'number', min: 1, max: 60, step: 1, default: 9, color: "green", description: "xxx tech writer will write it"},
            {name: "Value", type: 'percent', min: -15, max: 15, step: 1, default: {buy: 5, sell: -5}, color: "blue", description: "Rate of Change momentum value"},
          ],
          conditions: [
            {value: "greater", name: "Greater", image: "", description: ""},
            {value: "greaterThan", name: "Greater Than", image: "", description: ""}, 
            {value: "less", name: "Less", image: "", description: ""},
            {value: "lessThan", name: "Less Than", image: "", description: ""},
            {value: "crossOver", name: "Cross Over", image: "", description: ""}, 
            {value: "crossUnder", name: "Cross Under", image: "", description: ""}, 
          ],
          buyDefaults: {
            condition: 'greaterThan',
          },
          sellDefaults: {
            condition: 'lessThan',
          }
        },
        {
          key: 'bb',
          name: "Bolinger Bars",
          shortName: "BB",
          params: [
            {name: "Period", type: 'number', min: 1, max: 60, step: 1, default: 9, color: "green", description: "Period of SMA"},
            {name: "Mult", type: 'number', min: 0.1, max: 4, step: 0.1, default: 1.5, color: "blue", description: "Multiplier"},
          ],          
          conditions: [
            {value: "greater", name: "Greater", image: "", description: ""},
            {value: "greaterThan", name: "Greater Than", image: "", description: ""}, 
            {value: "less", name: "Less", image: "", description: ""},
            {value: "lessThan", name: "Less Than", image: "", description: ""},
            {value: "crossOver", name: "Cross Over", image: "", description: ""}, 
            {value: "crossUnder", name: "Cross Under", image: "", description: ""}, 
          ],
          conditionParams: [
            {value: "1", name: "Upper, Close"},
            {value: "2", name: "Lower, Close"}, 
            {value: "3", name: "Mid, Close"},
          ],
          buyDefaults: {
            condition: 'crossOver',
            conditionParam: '1',
          },
          sellDefaults: {
            condition: 'crossUnder',
            conditionParam: '2',
          }
        },
        {
          key: "stochastic",
          name: "Stochastic",
          shortName: "Stochastic",
          params: [
            {name: "Fast Period", type: 'number', min: 1, max: 100, step: 1, default: 14, color: "green", description: "Fast %K"},
            {name: "Slow Period", type: 'number', min: 1, max: 100, step: 1, default: 3, color: "red", description: "Slow %D"},
          ],
          conditions: [
            {value: "crossOver", name: "Cross Over", image: "", description: ""}, 
            {value: "crossUnder", name: "Cross Under", image: "", description: ""}, 
            {value: "above", name: "Above", image: "", description: ""}, 
            {value: "below", name: "Below", image: "", description: ""}
          ],
          buyDefaults: {
            condition: 'crossOver',
          },
          sellDefaults: {
            condition: 'crossUnder',
          }
        },
        {
          key: "macd",
          name: "Moving Average Convergence Divergence",
          shortName: "MACD",
          params: [
            {name: "Fast Period", type: 'number', min: 1, max: 100, step: 1, default: 12, color: "green", description: "Fast EMA"},
            {name: "Slow Period", type: 'number', min: 1, max: 100, step: 1, default: 26, color: "red", description: "Slow EMA"},
            {name: "Signal Period", type: 'number', min: 1, max: 100, step: 1, default: 9, color: "blue", description: "Signal EMA"},
          ],
          conditions: [
            {value: "crossOver", name: "Cross Over", image: "", description: ""}, 
            {value: "crossUnder", name: "Cross Under", image: "", description: ""},
          ],
          conditionParams: [
            {value: "1", name: "MACD, Signal"},
            {value: "2", name: "Signal, MACD"}, 
          ],
          buyDefaults: {
            condition: 'crossOver',
            conditionParam: '1',
          },
          sellDefaults: {
            condition: 'crossUnder',
            conditionParam: '2'
          }
        },
        {
          key: "sar",
          name: "Parabolic Stop and Reverse",
          shortName: "SAR",
          params: [
            {name: "Acceleration Factor", type: 'number', min: 0.001, max: 1, step: 0.001, default: 0.02, color: "green", description: "Acceleration Factor - AF"},
            {name: "Maximum Acceleration Factor", type: 'number', min: 0.001, max: 1, step: 0.001, default: 0.2, color: "red", description: "Maximum Acceleration Factor"},
          ],
          conditions: [
            {value: "crossOver", name: "Cross Over", image: "", description: ""}, 
            {value: "crossUnder", name: "Cross Under", image: "", description: ""},
          ],
          buyDefaults: {
            condition: 'crossUnder',
          },
          sellDefaults: {
            condition: 'crossOver',
          }
        },
        {
          key: 'adx',
          name: "Average directional movement index",
          shortName: "ADX",
          params: [
            {name: "Period", type: 'number', min: 1, max: 100, step: 1, default: 14, color: "green", description: "Period of SMA"},
            {name: "Min Range", type: 'number', min: 1, max: 100, step: 1, default: 10, color: "red", description: "Trend Minimum Range"},
            {name: "Max Range", type: 'number', min: 1, max: 100, step: 1, default: 10, color: "red", description: "Trend Maximum Range"},
          ],
          conditions: [
            {value: "greater", name: "Greater", image: "", description: ""},
            {value: "greaterThan", name: "Greater Than", image: "", description: ""}, 
            {value: "less", name: "Less", image: "", description: ""},
            {value: "lessThan", name: "Less Than", image: "", description: ""},
            {value: "crossOver", name: "Cross Over", image: "", description: ""}, 
            {value: "crossUnder", name: "Cross Under", image: "", description: ""}, 
            {value: "range", name: "Range", image: "", description: ""},
          ],
          buyDefaults: {
            condition: 'greater',
          },
          sellDefaults: {
            condition: 'greater',
          }
        },
      ],