module.exports = function(platformDemo) {
  let GET = [
    // function(req, res, next){
    //   console.log("middleware");
    //   next()
    // },
    function(req, res){
      platformDemo.marketPlace(
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
      summary: 'marketPlace',
      tags: ['market'],
      operationId: 'market_place',
      parameters: [
      ],
      responses: {
        200: {
          description: 'Market Place.',
          content: {
            "application/json": {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/strategy_risk',
                }
              }
            }
          }
        },
      }
    };
   
    return operations;
  };