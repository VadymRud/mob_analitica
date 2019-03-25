## Prerequirements
    Node.JS version 10.15.x
    MongoDB version 4.0.x
    sudo npm i -g eslint               // works with eslint@5.12.0
    sudo npm i -g eslint-config-google // works with eslint-config-google@0.11.0
    sudo npm i -g mocha                
    sudo npm i -g documentation 
 
## Setup/start

We use master_platform branch as a main one for the moment. 

To install dependencies it need to do "command npm i" inside each folder in /components

??? postinstall.js for recursive installation

To start:

    // edit .../environments/local.yaml
    cd commands/platform-service
    node index.js                    // or "npm start"

To view Swagger-UI:
   
    http://127.0.0.1:10012/api-docs  // or use port from local.yaml


## Data dumping/restoring (to use real database from dev server)

    mongodump --forceTableScan -d data  // -o ~/YouFolder/
    mongorestore 

## Project structure 

    /commands         // service starters and CLI commands
    /components       // reusable system parts 


## Style rules (we don't follow them yet :-( it can be discussed)
   
To read: [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)

To check: 

    eslint . // or "npm run lint" but this npm command produces some console spam...

Some standard rules are declined in .eslint.js


## Documentation example

    cd components/strategy 
    documentation serve index.js
       

## Testing example

    cd components/strategy
    mocha


To run all tests:

    npm run test_all    // it should be fixed though...


## Frontend technical documentation (draft)
    
v. 0.0.1: https://docs.google.com/document/d/1So886weJgHe04d-yiFc3IRvX6g1yBgapxvv4nF55jpw/edit?usp=sharing
 
