const express    = require('express');
const swaggerUi  = require('swagger-ui-express');
const openApi    = require('express-openapi');

const path       = require('path');
const cors       = require('cors');
const YAML       = require('yamljs');
const bodyParser = require('body-parser');

const appInit    = require('../../components/appinit');
 

// settings ---------------------------------------------------------------------

const cfg         = YAML.load(`${__dirname}/../../environments/${process.env.ENV || 'local'}.yaml`);

const host        = cfg.host || 'http://127.0.0.1';
const port        = cfg.port || 10012;

const apiDocs     = require('./api-docs');
const apiDocsPath = '/api-docs';
const openapiPath = '/openapi';
  

// components init --------------------------------------------------------------

const mongodb   = require('../../components/mongodb');
const datastore = require('../../components/datastore');
const strategy  = require('../../components/strategy');
const assets    = require('../../components/assets');
const platform  = require('../../components/platform');

const components   = [
  mongodb,
  datastore,
  strategy,
  assets,
  platform,
];

appInit.run(cfg, components, (config, interfaces) => {
  if (!(interfaces[mongodb.name] && interfaces[mongodb.name].client)) {
    console.log('no mongodb component');
    process.exit(1);
  }

  if (!(interfaces[datastore.name] && interfaces[datastore.name].api)) {
    console.log('no datastore API component');
    process.exit(1);
  }
 
  if (!(interfaces[strategy.name] && interfaces[strategy.name].crud && interfaces[strategy.name].algo && interfaces[strategy.name].indicators)) {
    console.log('no strategy API component');
    process.exit(1);
  }

  if (!(interfaces[assets.name] && interfaces[assets.name].scores && interfaces[assets.name].statDefault)) {
    console.log('no assets API component');
    process.exit(1);
  }


  if (!(interfaces[platform.name] && interfaces[platform.name].tools && interfaces[platform.name].demo)) {
    console.log('no platform API component');
    process.exit(1);
  }

  const app = express(); 
  app.use(cors());              // !!! it must be done before openApi.initialize()

  app.use(bodyParser.text({type: 'text/plain'}));
  app.use(bodyParser.json());

  let api = openApi.initialize({
    app:      app,
    apiDoc:   apiDocs,
    docsPath: openapiPath,
    paths:    path.resolve(__dirname, '_routes'),
    
    dependencies: {
      datastore:          interfaces[datastore.name].api, 
      
      strategyCrud:       interfaces[strategy.name].crud,
      strategyAlgo:       interfaces[strategy.name].algo,
      strategyIndicators: interfaces[strategy.name].indicators,
      
      assets:             interfaces[assets.name].scores,
      assetsDefault:      interfaces[assets.name].statDefault,

      platformDemo:       interfaces[platform.name].demo,
      platformTools:      interfaces[platform.name].tools,
    },
  });
  
  // console.log(api.dependencies);
  // console.log('it\'s test output from ~/commands/strategy-service/index.js, should be removed...');

  app.use(apiDocsPath, swaggerUi.serve, swaggerUi.setup(api.apiDoc)); 
  app.listen(port);

  console.log(`see this: ${host}:${port}${apiDocsPath}`);  
});


