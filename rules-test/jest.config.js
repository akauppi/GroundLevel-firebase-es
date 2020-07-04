//
// JEST config
//
// References:
//  - JEST configuration
//    -> https://jestjs.io/docs/en/configuration
//
export default {

  // For native ES support; see -> https://stackoverflow.com/questions/35756479/does-jest-support-es6-import-export
  testEnvironment: 'jest-environment-node',
  transform: {},

  globalSetup: "./setup.jest.js",
  verbose: true,

  // default 5000 _per test_ is mostly fine. After updates of dependencies, it still was too slooow.
  //testTimeout: "8000"
}
