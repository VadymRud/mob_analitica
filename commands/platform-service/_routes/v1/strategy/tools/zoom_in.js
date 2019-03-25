module.exports = function(platformTools) {
  let GET = [
    // function(req, res, next){
    //   console.log("middleware");
    //   next()
    // },
    function(req, res) {
      platformTools.zoomIn(
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

  let operations = {
    GET,
  };
  
  GET.apiDoc = {
    summary: 'zoomIn',
    tags: ['strategy'],
    operationId: 'zoom_in',
    parameters: [
    ],
    responses: {
      200: {
        description: 'Zoom In.',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/zoom_in',
              },
            },
          },
        },
      },
    },
  };
   
  return operations;
};
