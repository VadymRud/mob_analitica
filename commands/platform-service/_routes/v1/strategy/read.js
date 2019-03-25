const {ObjectId} = require('mongodb');

module.exports = function(strategyCrud) {
  let GET = [
    // function(req, res, next){
    //   console.log("middleware");
    //   next()
    // },
    
    function(req, res) {
      strategyCrud.read( 
          ObjectId(req.query.id),
          (err, result) => {
            if (err) {
              res.status(400).json(err);
            } else {
              // console.log('-->', result);
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
    summary: 'read the strategy',
    tags: ['CRUD'],
    operationId: 'read',
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
        description: 'Strategy read result',
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
