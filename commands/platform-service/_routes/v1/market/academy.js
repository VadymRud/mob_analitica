module.exports = function(platformDemo) {
  let GET = [
    function(req, res, next){
      console.log("middleware");
      next()
    },
    function(req, res){
      platformDemo.academy(
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
      summary: 'Academy',
      operationId: 'academy',
      tags: ['market'],
      parameters: [
      ],
      responses: {
        200: {
          description: 'Academy.',
          content: {
            "application/json": {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/academy',
                }
              }
            }
          }
        },
      }
    };
   
    return operations;
  };