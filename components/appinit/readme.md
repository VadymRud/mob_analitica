0. To init some async components we need to create list of them and process it with appInit.run(). See the example in commands/platform-service/index.js

1. In the callback of appInit.run() we can:
* check if all required interfaces are successfully initiated (see the example in commands/platform-service/index.js);
* sent to the next callback own initiated interfaces (see the example in components/strategy/index.js);

2. Each async component to be initiated must contain in module.exports:
* "name" field;
* initAsync() method (see the example in components/strategy/index.js)

The signature of initAsync() method is:  
    initAsync(cfg, interfaces, cb)
    cfg        — config-object (sent to appInit in initial call);
    interfaces — object that contains all previously initiated interfaces;
    cb         — callback with signature (err, interfacesToAdd).

3. If different package scripts require each other they can call require() - understanding that common package .initAsync must be called before (otherwise such require() may return incorrect data).

4. So to test any async package we must use appInit.run() also (for example: components/strategy/test/all.js).

