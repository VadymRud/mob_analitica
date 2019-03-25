// this endpoint gives all the data needed to build Assets block in Strategy Builder 
// each row consists of Score for base/quote pair for specific exchange and timeframe, 24hour minichart and Market Behaviour histograms data

module.exports = function(assets) {
  let GET = [
    function(req, res) {
      assets.scores(
          req.marketbehavior, 
          req.interval, 
          req.listpage,
          (err, result) => {
            if (err) {
              console.error('ERROR on GET assets/scores (req.marketbehavior, req.interval, req.listpage, err, result):', req.marketbehavior, req.interval, req.listpage, err, result);
              res.status(400).json(err);
            } else {
              console.log('SUCCESS on GET assets/scores (req.marketbehavior, req.interval, req.listpage, result):', req.marketbehavior, req.interval, req.listpage, result);
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
    summary: 'get table of assets by their scores',
    operationId: 'tools_scores',
    tags: ['assets'],
    parameters: [
      // {
      //   name: 'marketbehavior',
      //   in: 'query',
      //   schema: 
      //     {
      //       type: 'array',
      //       items:
      //       {
      //         type: 'string',
      //         enum: ['breakout', 'range', 'reversal'],
      //         default: 'breakout',
      //       },
      //       required: true,
      //       description: 'coma separated values of Market Behaviour. required at least one type, max all three types.',
      //       explode: false,
      //     },
      // },
      // {
      //   name: 'listpage',
      //   in: 'query',
      //   schema: 
      //     {
      //       type: 'integer',
      //       description: 'number of page with assets for pagination purpose. if missing then default 4 assets will be returned to be used in right side pannel',
      //     },
      // },
      // {
      //   name: 'interval',
      //   in: 'query',
      //   schema: 
      //     {
      //       type: 'string',
      //       enum: ['1m', '3m', '6m', '1y'],
      //       default: '1m',
      //       description: 'number of page with assets for pagination purpose. if missing default 5 assets will be returned to be used in right side pannel',
      //     },
      // },
      // {
      //   name: 'exchange',
      //   in: 'query',
      //   schema: 
      //     {
      //       type: 'string',
      //       default: 'all',
      //       description: 'assets for specific exchange',
      //     },
      // },
      // {
      //   name: 'assetclass',
      //   in: 'query',
      //   schema: 
      //     {
      //       type: 'string',
      //       enum: [All, Stock, ETF, Future, Crypto, Forex, Bond, CFD],
      //       default: 'all',
      //       description: 'assets of specific class',
      //     },
      // },
    ],
    responses: {
      200: {
        description: 'An array of assets by their MSQ score',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/assets_by_score',
              },
            },
          },
        },
      },
    // 400: {
    //     content: {
    //       'application/json': {
    //         schema: {
    //           // $ref: '#/components/schemas/400_error'
    //         },
    //       },
    //     },
    //   },
    },
  };
     
  return operations;
};
