module.exports = function(platformDemo) {
  let GET = [
    // function(req, res, next){
    //   console.log("middleware");
    //   next()
    // },

    function(req, res){
      platformDemo.featuredStrategies(
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
      summary: 'featuredStrategies',
      tags: ['market'],
      operationId: 'featured_strategies',
      parameters: [
      ],
      responses: {
        200: {
          description: 'Featured Strategies.',
          content: {
            "application/json": {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/featured_strategies',
                }
              }
            }
          }
        },
      }
    };
   
    return operations;
  };