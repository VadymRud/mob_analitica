module.exports = function(ohlcsService) {

  let GET = [
    function(req, res, next){
      console.log("middleware");
      next()
    },
    function(req, res, next){
      // res.status(200).json(ohlcsService.checkOhlcsLastDate(req.query.interval));
      return ohlcsService.checkOhlcsLastDate(req.query.interval, (err, result) => {
        // console.log('is! result: ', err, result);
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
      summary: 'Getting the last actual date for all assets.',
      operationId: 'checkOHLCsLastDate',
      parameters: [
        {
          in: 'query',
          name: 'interval',
          required: true,
          schema: {
            type: 'string'
          }
        },
      ],
      responses: {
        200: {
          description: 'A list of last actual dates for each asset OHLCs.',
          content: {
            "application/json": {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/OHLCsLastDate',
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