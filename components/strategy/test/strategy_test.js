// const should   = require('should');

const YAML     = require('yamljs');
const appinit  = require('../../appinit/appinit');
const crudTest = require('../../crud-test/crud-test');

describe('strategy crud tests', () => {
  let strategyCrud;
  let client;

  before(done => {
    let environment = 'test';
    const cfg = YAML.load(__dirname + `/../../../environments/${environment}.yaml`);

    const components = [
      require('../../mongodb/mongodb'),  // mongodb.client
      require('../../datastore/datastore'), 
      require('../strategy'),            // strategy.strategy  
    ];

    appinit.run(cfg, components, (config, interfaces) => {
      // if (!(interfaces.strategy && interfaces.strategy.api)) {
      //   should.fail('no strategy component');
      //   done();
      //   return;
      // }

      client       = interfaces.mongodb.client;
      strategyCrud = interfaces.strategy.crud;

      done();
    });
  });

  after(done => {
    client.close(false, done);
  });
  
  it('create / read / update / read / delete / read', done => {
    crudTest.test(strategyCrud, strategyCrud.removeList, {}, {}, done);
  });
});
