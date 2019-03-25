const should = require('should');

const MongoClient = require('mongodb').MongoClient;

describe('mongodb', function() {
  it('connection test (it\'s not a unit-test but integration one)', done => {
    const mongoClient = new MongoClient('mongodb://localhost:27017/', {useNewUrlParser: true});
    mongoClient.connect((err, client) => {
      should.not.exist(err);
      should.exist(client);

      client.close().then(done);
    });
  });
});

