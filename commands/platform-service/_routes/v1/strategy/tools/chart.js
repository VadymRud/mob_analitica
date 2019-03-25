module.exports = function(platformTools) {

  // GET ---------------------------------------------------------------------------

  let GET = [
    (req, res) => {
      platformTools.chartTypeChange(
          req.query.debug_id,
          req.query.chart_type,
          (err, result) => {
            if (err) {
              console.error('ERROR on GET strategy/tools/chart (req.query.debug_id, req.query.chart_type, err, result):', req.query.debug_id, req.query.chart_type, err, result);
              res.status(400).json({err});
              
            } else {
              console.log('SUCCESS on GET strategy/tools/chart (req.query.debug_id, req.query.chart_type, result):', req.query.debug_id, req.query.chart_type, result);
              res.status(200).json(result);
            }
          }
      );
    },
  ];

  GET.apiDoc = {
    summary: 'get detailed data for previously charted strategy',
    tags: ['strategy'],
    operationId: 'tools_chart',
    parameters: [
      {
        in: 'query',
        name: 'debug_id',
        required: true,
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'chart_type',
        // required: true,
        schema: {
          type: 'string',   // ["candle" (default), "line", "none"]
        },
      },
    ],
    responses: {
      200: {
        description: '',
        content: {
          'application/json': {
            schema: {
              // $ref: '#/components/schemas/strategy-backtest',
            },
          },
        },
      },
    },
  };

  // POST ---------------------------------------------------------------------------

  const mock = require('../../../../../../components/strategy/test/mock');
 
  let POST = [
    (req, res) => {
      let strategyDescription;  
      if (req.body instanceof Object) {
        strategyDescription = req.body;
      } else if (('' + req.body).trim().length > 0) { // 
        try {
          strategyDescription = JSON.parse(req.body);
        } catch (err) {
          console.error('ERROR on POST strategy/tools/chart (exchange, base, quote, interval, dateStart, dateFinish, chartType, req.body, dontConvert, err):', exchange, base, quote, interval, dateStart, dateFinish, chartType, req.body, dontConvert, err);
          res.status(400).json({err});
          return;
        }
      } else {
        strategyDescription = {};
      }

      let exchange    = req.query.exchange || 'BITFINEX';
      let base        = req.query.base     || 'BTC';
      let quote       = req.query.quote    || 'USD';
      let interval    = req.query.interval || '1h';
      let dateStart   = req.query.date_start;
      let dateFinish  = req.query.date_finish;
      let chartType   = req.query.chart_type;
      let dontConvert = req.query.dont_convert;
      let strategyDescription0 = strategyDescription;
      strategyDescription      = (strategyDescription0 instanceof Object && Object.keys(strategyDescription0).length) 
                               ? strategyDescription0 : mock.testVortex;


      platformTools.chart( 
          exchange,
          base,
          quote,
          interval,
          dateStart,
          dateFinish,
          chartType,
          strategyDescription,
          dontConvert,
          (err, result) => {
            if (err) {
              console.error('ERROR on POST strategy/tools/chart (exchange, base, quote, interval, dateStart, dateFinish, chartType, strategyDescription, dontConvert, err, result):', exchange, base, quote, interval, dateStart, dateFinish, chartType, JSON.stringify(strategyDescription), dontConvert, err, format(result));
              res.status(400).json(err);
            } else {
              console.log('SUCCESS on POST strategy/tools/chart (exchange, base, quote, interval, dateStart, dateFinish, chartType, strategyDescription, dontConvert, result):', exchange, base, quote, interval, dateStart, dateFinish, chartType, JSON.stringify(strategyDescription), dontConvert, format(result));
              res.status(200).json(result);
            }
          }
      );
    },
  ];

  function format(result0) {
    if (!(result0 && result0 instanceof Object)) {
      return result0;      
    }

    let result = { ...result0 };
    
    if (result.candlestick instanceof Array) {
      result.candlestickLength = result.candlestick.length;
      delete result.candlestick;
    }

    if (result.trades instanceof Array) {
      result.tradesLength = result.trades.length;
      delete result.trades;
    }

    if (result.zigzag instanceof Array) {
      result.zigzagLength = result.zigzag.length;
      delete result.zigzag;
    }

    // result.parameters = JSON.stringify(result.parameters);
    // result.trades = JSON.stringify(result.trades);
    // result.zigzag = JSON.stringify(result.zigzag);
    // result.results = JSON.stringify(result.results);

    return JSON.stringify(result);
  }

  POST.apiDoc = {
    summary: 'obtaining data for the main platform\'s chart.',
    tags: ['strategy'],
    operationId: 'tools_chart_post',
    parameters: [
      {
        in: 'query',
        name: 'exchange',
        // required: true,
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'base',
        // required: true,
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'quote',
        // required: true,
        schema: {
          type: 'string',
        },
      },
      {
        in: 'query',
        name: 'interval',
        // required: true,
        schema: {
          type: 'string',
        },
      },  
      {
        in: 'query',
        name: 'date_start',
        required: false,
        schema: {
          type: 'string',
          format: 'date-time',
        },
      },
      {
        in: 'query',
        name: 'date_finish',
        required: false,
        schema: {
          type: 'string',
          format: 'date-time',
        },
      },

      {
        in: 'query',
        name: 'dont_convert',
        schema: {
          type: 'boolean',
        },
      },

      {
        in: 'query',
        name: 'chart_type',
        // required: true,
        schema: {
          type: 'string',   // ["candle" (default), "line", "none"]
        },
      },
    ],
    requestBody: {
      description: 'Strategy description',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              description: {
                type: 'string',
              },
            },
          },
        },
        'text/plain': {
          schema: {
            type: 'string',
          },
        },
      },
    },  

    responses: {
      200: {
        description: 'Strategy backtest chart data',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/main_chart',
              },
            },
          },
        },
      },
    },
  };

  // ---------------------------------------------------------------------------

  return {
    GET,
    POST,
  };
  
};
