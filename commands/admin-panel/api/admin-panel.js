const express   = require('express');
const openApi   = require('express-openapi');
const swaggerUi = require('swagger-ui-express');

const path      = require('path');
const YAML      = require('yamljs');
const cors      = require('cors');

const appInit      = require('../../../components/appinit/appinit');
const ohlcsService = require('../../../components/datastore/datastore_api');


// settings ---------------------------------------------------------------------

const cfg         = YAML.load(`${__dirname}/../../../environments/${process.env.ENV || 'local'}.yaml`);
const port        = process.env.PORT || 10020;

const apiDoc      = require('./api-doc');
const docsPath    = '/openapi';
const apiDocsPath = '/api-docs';


// components init --------------------------------------------------------------

const components = [
  require('../../../components/mongodb/mongodb'),
  require('../../../components/datastore/datastore'),
];

appInit.run(cfg, components, (config, activeComponents) => {

  if (!activeComponents.mongodb) {
    console.log('no mongodb component');
  }

  const app = express();
  app.use(cors());  // !!! it must be done before openApi.initialize()
  
  const api = openApi.initialize({
    app,
    apiDoc,
    docsPath,
    paths:        path.resolve(__dirname, '_routes'),
    dependencies: {ohlcsService}, 
  });
  
  app.use(apiDocsPath, swaggerUi.serve, swaggerUi.setup(api.apiDoc));
  app.use(express.static(path.join(__dirname, 'client/build')));  
  app.listen(port);
  
  console.log(`see this: http://127.0.0.1:${port}${apiDocsPath}`);  

});

