
As stated [here](https://github.com/firebase/firebase-js-sdk/discussions/4636), `@firebase/performance` needs some
changes, otherwise we get (browser log):

```
index.esm2017.js:77 Uncaught ReferenceError: Cannot access 's' before initialization
```

- Still in 0.900.19

```
//const ERROR_FACTORY = new ErrorFactory(SERVICE, SERVICE_NAME, ERROR_DESCRIPTION_MAP);

const ERROR_FACTORY = {
  create(...args) {   // First time here. Replace ourselves (avoids calling 'new' at module load).
    const { create } = new ErrorFactory(SERVICE, SERVICE_NAME, ERROR_DESCRIPTION_MAP);
    ERROR_FACTORY.create = create;
    return create(...args);
  }
}
```

```
//const consoleLogger = new Logger(SERVICE_NAME);
//consoleLogger.logLevel = LogLevel.INFO;

let consoleLogger = {
  info: _consoleLoggerFirst('info')
};
function _consoleLoggerFirst(level) {
  return (...args) => {
    const logger = new Logger(SERVICE_NAME);
    logger.logLevel = LogLevel.INFO;

    consoleLogger= logger;
    logger[level](...args);
  }
}
```

```
//registerPerformance();
//registerVersion();

let registered;
function getPerformanceWrapper(...args) {
  if (!registered) {
    registerPerformance();
    registerVersion(name, version);
    registered = true;
  }
  return getPerformance(...args)
}
function initializePerformanceWrapper(...args) {
  if (!registered) {
    registerPerformance();
    registerVersion(name, version);
    registered = true;
  }
  return initializePerformance(...args)
}
```

```
//export { getPerformance, initializePerformance, trace };
export { getPerformanceWrapper as getPerformance, initializePerformanceWrapper as initializePerformance, trace };
```

You need to redo such changes for every new version...

