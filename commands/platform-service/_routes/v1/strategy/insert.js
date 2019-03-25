module.exports = function(strategyCrud) {
  let POST = [
    // function(req, res, next){
    //   console.log("middleware");
    //   next()
    // },
    
    function(req, res) {
      let description;  
      if (req.body instanceof Object) {
        description = req.body;
      
      } else {
        try {
          description = JSON.parse(req.body);
        } catch (err) {
          res.status(400).json(err);
          return;
        }
      }
      strategyCrud.insert( 
          description,
          (err, result) => {
            if (err) {
              res.status(400).json(err);
            } else {
              res.status(200).json({insertedId: result.insertedId});
            }
          }
      );
    },
  ];

  let operations = {
    POST,
  };
  
  POST.apiDoc = {
    summary: 'inserting the new strategy',
    operationId: 'insert',
    tags: ['CRUD'],
    requestBody: {
      description: 'Strategy description',
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              description: {
                type: 'string',
              },
            },
          },
        },
        'text/plain': {
          schema: {
            type: 'string',
          },
        },
      },
    },

    // below is openAPI 2.0 syntax. Refactored to use openAPI 3.0 syntax
    // parameters: [
    //   {
    //     in: 'body',
    //     name: 'body',
    //     description: 'Strategy description',
    //     required: true,
    //     schema: {
    //       type: 'object',
    //       properties: {
    //         description: {
    //           type: 'string'
    //         }
    //       }
    //     },
    //   }      
    // ],

    responses: {
      200: {
        description: 'Strategy insertion result',
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
   
  return operations;
};
