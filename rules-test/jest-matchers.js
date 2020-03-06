const { assertFails, assertSucceeds } = require('@firebase/testing');

expect.extend({
  async toAllow(x) {
    let pass, errMsg;
    try {
      await assertSucceeds(x);
      pass = true;
    } catch (err) {
      pass= false;
      errMsg= err;
    }

    return {
      pass,
      message: () => 'Expected Firebase operation to be ALLOWED, but it was DENIED. '+ `[${errMsg}]`
    };
  },

  async toDeny(x) {
    let pass, errMsg;
    try {
      await assertFails(x);
      pass = true;
    } catch (err) {
      pass= false;
      errMsg = err;
    }

    return {
      pass,
      message: () => 'Expected Firebase operation to be DENIED, but it was ALLOWED! '+ `[${errMsg}]`
    };
  }
});