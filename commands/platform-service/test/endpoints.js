const should  = require('should');
const request = require('request');
const epArr = [
  {
    host:         'http://localhost:10012',
    path:         '/v1/strategy/tools/indicator',
    method:       'POST',
    query:        '?dont_convert=true',
    expectedCode: '200',
    expectedErr:  false,  
  },

  {
    host:         'http://localhost:10012',
    path:         '/v1/strategy/tools/zoom_in',
    method:       'GET',
    query:        '',
    expectedCode: '200',
    expectedErr:  false,  
  },

];
// http://localhost:10012/v1/strategy/tools/indicator?id=vortex&exchange=BITFINEX&base=BTC&quote=USD&interval=1m
// let ep = {
//   host:         'http://localhost:10012',
//   path:         '/v1/strategy/tools/indicator',
//   method:       'POST',
//   query:        '?dont_convert=true',
//   expectedCode: '200',
//   expectedErr:  false,  
// };

for (i=0; i < epArr.length; i++) {
  // ep.query = 'id=' + epArr[i] + '&exchange=BITFINEX&base=BTC&quote=USD&interval=1h';
  url = epArr[i].host + epArr[i].path + epArr[i].query;

  describe(url, () => {
    describe(epArr[i].method, () => {
      it('should return ' + epArr[i].expectedCode, done => {

        let options = {
          url,
          headers: {
            'Accept':       'application/json',
            'Content-Type': 'application/json',
          },
        };

        // console.log(options);

        let requester = (epArr[i].method === 'POST') ? request.post : request;

        requester(options, (err, response, body) => {
          should.equal(epArr.expectedCode, response.statusCode);
          if (epArr[i].expectedErr) {
            should.exists(err);
          } else {
            should.not.exist(err);
          }

          // console.log('error:', err); // Print the error if one occurred
          // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
          // console.log('body:', body); // Print the HTML for the Google homepage.
          done();

        });
      });
    });
  });
}
