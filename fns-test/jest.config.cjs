// jest.config.cjs

module.exports = {
  //REMOVE: globalSetup: "./setup.jest.js",

  // needed, otherwise bad things happen -> https://github.com/facebook/jest/issues/7780
  testEnvironment: 'node',

  // Default is 5000. None of our tests take that long; fail fast.
  testTimeout: 2000
};
