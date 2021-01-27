// back-end/test-fns/jest.config.cjs

module.exports = { ...require('../jest.config.default.cjs'),

  // Jest default is 5000. Here to help debugging, if some 'fns' test times out.
  testTimeout: 3000,
};
