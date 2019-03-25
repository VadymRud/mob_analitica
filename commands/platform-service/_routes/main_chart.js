module.exports = function(platformDemo) {
  let GET = [

    // function(req, res, next){
    //   console.log("middleware");
    //   next()
    // },

    function(req, res){
      platformDemo.mainChart(
        req.query.exchange,
        req.query.base,
        req.query.quote,
        req.query.interval,
        req.query.dateStart,
        req.query.dateFinish,
        (err, result) => {
          if (err) {
            res.status(400).json(err);
          } else {
            res.status(200).json(result);
          }
        }
      );
    }
  ];

  let operations = {
    GET
  };
  
  GET.apiDoc = {
      summary: 'Obtaining data for the main platform\'s chart.',
      operationId: 'main_chart',
      parameters: [
        {
          in: 'query',
          name: 'exchange',
          // required: true,
          schema: {
            type: 'string'
          }
        },
        {
          in: 'query',
          name: 'base',
          // required: true,
          schema: {
            type: 'string'
          }
        },
        {
          in: 'query',
          name: 'quote',
          // required: true,
          schema: {
            type: 'string'
          }
        },
        {
          in: 'query',
          name: 'interval',
          // required: true,
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
                  $ref: '#/components/schemas/main_chart',
                }
              }
            }
          }
        },
      }
    };
   
    return operations;
  };