module.exports = function(strategyIndicators) {
  let GET = [
    // function(req, res, next){
    //   console.log("middleware");
    //   next()
    // },
    function(req, res) {
      strategyIndicators.countIndicator(
          req.query.id       || 'vortex',
          req.query.exchange || 'BITFINEX',
          req.query.base     || 'BTC',
          req.query.quote    || 'USD',
          req.query.interval || '1m',
          req.query.params   || [],
          // req.query.dateStart,
          // req.query.dateFinish,
          (err, result) => {
            if (err) {
              res.status(400).json(err);
            } else {
              res.status(200).json(result);
            }
          }
      );
    },
  ];

  let operations = {
    GET,
  };
  
  GET.apiDoc = {
    summary: 'Testing strategy indicator with some ohlcs data',
    tags: ['strategy'],
    parameters: [
      {
        in: 'query',
        name: 'id',
        // required: true,
        schema: {
          type: 'string',
        },
      },
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
      // {
      //   in: 'query',
      //   name: 'dateStart',
      //   required: false,
      //   schema: {
      //     type: 'string'
      //   }
      // },
      // {
      //   in: 'query',
      //   name: 'dateFinish',
      //   required: false,
      //   schema: {
      //     type: 'string'
      //   }
      // },
    ],
    responses: {
      200: {
        description: 'Strategy indicator data',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/strategy-indicator',
            },
          },
        },
      },
    },
  };
  
  return operations;
};
