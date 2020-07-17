// jest.config.cjs

module.exports = {
  globalSetup: "./setup.jest.js",
  //testTimeout: 8000,    // default 5000 _per test_ is mostly fine

  // needed, otherwise bad things happen -> https://github.com/facebook/jest/issues/7780
  testEnvironment: 'node'
};
