module.exports = function(strategyCrud) {
  let DELETE = [
    // function(req, res, next){
    //   console.log("middleware");
    //   next()
    // },
    
    function(req, res){
      strategyCrud.remove( 
        req.query.id,
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
    DELETE
  };
  
  DELETE.apiDoc = {
      summary: 'delete the strategy',
      operationId: 'delete',
      tags: ['CRUD'],
      parameters: [
        {
          in: 'query',
          name: 'id',
          required: true,
          schema: {
            type: 'string'
          }
        },
      ],
      responses: {
        200: {
          description: 'Strategy deletion result',
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