// jest.config.cjs

module.exports = {
  // Default is 5000. None of our tests take that long; fail fast.
  testTimeout: 2000,

  // Recommended for native ES6 use (Aug-20):
  testEnvironment: 'jest-environment-node',
  transform: {}
};
