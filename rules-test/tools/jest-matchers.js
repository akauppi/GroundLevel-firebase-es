const { assertFails, assertSucceeds } = require('@firebase/testing');

expect.extend({
  async toAllow(x) {
    try {
      await assertSucceeds(x);
      return { pass: true };

    } catch (err) {
      return { pass: false,
        message: () => 'Expected Firebase operation to be ALLOWED, but it was DENIED. ' + `[${err}]`
      }
    }
  },

  async toDeny(x) {
    try {
      await assertFails(x);
      return { pass: true };

    } catch (err) {
      return { pass: false,
        message: () => 'Expected Firebase operation to be DENIED, but it was ALLOWED! '+ `[${err}]`
      }
    }
  }
});

export {}

