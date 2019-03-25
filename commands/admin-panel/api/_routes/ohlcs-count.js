module.exports = function(ohlcsService) {

  let GET = [
    function(req, res, next){
      console.log("middleware");
      next()
    },
    function(req, res, next){
      return ohlcsService.countOhlcs(req.query.interval, req.query.dateStart, req.query.dateFinish, (err, result) => {
        // console.log('is! count: ', err, result);
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
      summary: 'Get the number of records of all assets over a certain period of time.',
      operationId: 'countOhlcs',
      parameters: [
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
          description: 'The number of records for the time period for each asset OHLCs.',
          content: {
            "application/json": {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/countOhlcs',
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