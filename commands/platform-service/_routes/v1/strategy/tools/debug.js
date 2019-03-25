module.exports = function(platformTools) {

  // GET ---------------------------------------------------------------------------

  let GET = [
    (req, res) => {
      let debugId = req.query.debug_id;
      let date    = req.query.date && new Date(req.query.date);
      let period  = req.query.period || 13;
    
      platformTools.debugBacktest( 
          debugId,
          date,
          period,
          (err, result, parameters) => {
            if (err) {
              res.status(400).json(err);
            } else {
              res.status(200).json(result);
            }
          }
      );
    },
  ];   

  GET.apiDoc = {
    summary: 'get debug data for previously backtested strategy',
    tags: ['strategy'],
    operationId: 'tools_debug',
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
        name: 'date',
        schema: {
          type:   'string',
          format: 'date-time',
        },
      },
      {
        in: 'query',
        name: 'period',
        schema: {
          type: 'number',
        },
      },
    ],
    responses: {
      200: {
        description: 'strategy backtest data for detailed debug',
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


  // POST --------------------------------------------------------------------------

  let POST = [
    (req, res) => {
      let strategyItem;   
      if (req.body instanceof Object) {
        // console.log(11111111, req.body);
        strategyItem = req.body;

      } else if (req.body) {
        // console.log(22222222, req.body);
        try {
          strategyItem = JSON.parse(req.body);
          if (!(strategyItem && (strategyItem instanceof Object))) {
            strategyItem = undefined;
          }

        } catch (err) {
          // console.log(7777777);
          res.status(400).json(err);
          return;
        }
      } 

      console.log('strategyItem = %j', strategyItem);

      platformTools.doBacktest(   
          req.query.exchange || 'BITFINEX',
          req.query.base     || 'BTC',
          req.query.quote    || 'USD',
          req.query.interval || '1h',
          req.query.date_start,
          req.query.date_finish,
          strategyItem,
          req.query.full_table,
          (err, result) => {

            // res.json({});
            // return;
            if (err) {
              res.status(400).json(err);

            } else {

              // console.log(result);
              res.status(200).json(result);
            }
          }
      );
    },
    
  ];

  POST.apiDoc = {
    summary: 'backtesting strategy with some ohlcs data',
    tags: ['strategy'],
    operationId: 'tools_debug_post',
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
        },
      },
      {
        in: 'query',
        name: 'date_finish',
        required: false,
        schema: {
          type: 'string',
        },
      },

      {
        in: 'query',
        name: 'full_table',
        required: false,
        schema: {
          type: 'boolean',
        },
      },

      // {
      //   in: 'body',
      //   name: 'strategy_description',
      //   required: true,
      //   schema: {
      //     // type: 'string',
      //   },
      // }  
    ],
    responses: {
      200: {
        description: 'strategy backtest data',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/strategy-backtest',
            },
          },
        },
      },
    },
  };
  
  
  // ------------------------------------------------------------------------------------------
  
  return {
    GET,
    POST,
  };
};
