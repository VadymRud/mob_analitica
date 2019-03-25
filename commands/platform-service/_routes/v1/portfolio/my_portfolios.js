module.exports = function(platformDemo) {
  let GET = [
    // function(req, res, next){
    //   console.log("middleware");
    //   next()
    // },

    function(req, res){
      platformDemo.myPortfolios(
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
      summary: 'My Portfolios',
      tags: ['portfolio'],
      operationId: 'my_portfolios',
      parameters: [
      ],
      responses: {
        200: {
          description: 'My Portfolios.',
          content: {
            "application/json": {
              schema: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/my_portfolios',
                }
              }
            }
          }
        },
      }
    };
   
    return operations;
  };