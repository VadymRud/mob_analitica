module.exports = function(strategyCrud) {
  let PUT = [
    // function(req, res, next){
    //   console.log("middleware");
    //   next()
    // },
    
    function(req, res){
      strategyCrud.replace( 
        req.body,
        (err, result) => {
          if (err) {
            res.status(400).json(err);
          } else {
            // console.log('-->', result);
            res.status(200).json(result);
          }
        }
      );
    }
  ];

  let operations = {
    PUT
  };
  
  PUT.apiDoc = {
      summary: 'replace the strategy with new one',
      tags: ['CRUD'],
      operationId: 'replace',
      requestBody: {
        description: 'Strategy description',
        required: true,
        content: {
          "application/json": {
            schema: {
              type: 'object',
              properties: {
                description: {
                  type: 'string'
                }
              }
            }
          },
          "text/plain": {
            schema: {
              type: 'string'
            }
          } 
        }
      },
      responses: {
        200: {
          description: 'Strategy replacement result',
          content: {
            "application/json": {
              schema: {
                // $ref: '#/components/schemas/strategy-backtest',
              }
            }
          }
        },
      }
    };
   
    return operations;
  };