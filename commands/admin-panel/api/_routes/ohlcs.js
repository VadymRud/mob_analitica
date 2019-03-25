module.exports = function(ohlcsService) {
  let GET = [
    function(req, res, next){
      console.log("middleware");
      next()
    },
    function(req, res, next){
      return ohlcsService.getCandles(
        req.query.exchange,
        req.query.base,
        req.query.quote,
        req.query.interval,
        req.query.dateStart,
        req.query.dateFinish,
        (err, result) => {
        // console.log('is! filtered: ', err, result);
        if (err) {
          return res.status(400).json(err);
        }
        return res.status(200).json(result);
      });
    }
  ];

  let operations = {
    GET
  };
  
  GET.apiDoc = {
      summary: 'Obtaining assets data using filters.',
      operationId: 'OHLCs',
      parameters: [
        {
          in: 'query',
          name: 'exchange',
          required: true,
          schema: {
            type: 'string'
          }
        },
        {
          in: 'query',
          name: 'base',
          required: true,
          schema: {
            type: 'string'
          }
        },
        {
          in: 'query',
          name: 'quote',
          required: true,
          schema: {
            type: 'string'
          }
        },
        {
          in: 'query',
          name: 'interval',
          required: true,
          schema: {
            type: 'string'
          }
        },
        {
          in: 'query',
          name: 'dateStart',
          required: false,
          schema: {
            type: 'string'
          }
        },
        {
          in: 'query',
          name: 'dateFinish',
          required: false,
          schema: {
            type: 'string'
          }
        },
      ],
      responses: {
        200: {
          description: 'The list of filtered assets data.',
          content: {
            "application/json": {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/OHLCs',
                }
              }
            }
          }
        },
        // default: {
        //   description: 'An error occurred',
        //   schema: {
        //   }
        // }
      }
    };
   
    return operations;
  };