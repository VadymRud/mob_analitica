module.exports = function(assetsDefault) {
  let GET = [

    // function(req, res, next){
    //   console.log("middleware");
    //   next()
    // },

    function(req, res) {
      assetsDefault.scores(
          (err, result) => {
            if (err) {
              res.status(400).json(err);
            } else {
              res.status(200).json(result);
            }
          }
      );
    },
  ];

  let operations = {GET};
  
  GET.apiDoc = {
    summary: 'my assets',
    operationId: 'tools_assets',
    tags: ['assets'],
    parameters: [
    ],
    responses: {
      200: {
        description: 'My assets...',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/my_assets',
              },
            },
          },
        },
      },
    },
  };
   
  return operations;
};
