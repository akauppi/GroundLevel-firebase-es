// jest.config.cjs

module.exports = {
  // needed
  testEnvironment: 'node',

  // Default is 5000. None of our tests take that long; fail fast.
  testTimeout: 2000
};
