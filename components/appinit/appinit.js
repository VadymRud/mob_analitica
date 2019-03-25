module.exports = {run};

function run(cfg, components, cb) {
  let activeComponents = {};
  _init(cfg, components, activeComponents, cb);
}

function _init(cfg, components, activeComponents, cb) {
  if (components.length < 1) {
    cb(cfg, activeComponents);
    return;
  }

  let component = components.shift();

  if (!(component.name && component.initAsync)) {
    console.error('can\'t init component, it should have .initAsync() method and .name property', component);
    _init(config, components, activeComponents, run);
    return;
  }

  component.initAsync(cfg, activeComponents, (err, res) => {
    if (err) {
      console.error('error on .init() component "%s": %s', component.name, err);
    }

    if (activeComponents.hasOwnProperty(component.name)) {
      console.error('duplicating callback on .init() component "%s"', component.name);
      return;
    }

    activeComponents[component.name] = res;

    _init(cfg, components, activeComponents, cb);
  });
}

