const { setup, teardown } = require('./helpers');
const { assertFails, assertSucceeds } = require('@firebase/testing');

require('./jest-matchers');

describe('Rules with no access', () => {
  let ref, ref2;

  // Applies only to tests in this describe block
  beforeAll(async () => {
    const db = await setup();

    // All paths are secure by default    <-- what does that mean?
    ref = db.collection('some-nonexistent-collection');
    ref2 = db.collection('abc');
  });

  afterAll(async () => {
    await teardown();
  });

  test('fail when reading/writing an unauthorized collection', async () => {
    // One-line await
    expect(await assertFails(ref.add({})));

    // Custom Matchers
    //await expect(ref.get()).toDeny();
    await expect(ref.add({})).toDeny();
    //await expect(ref.get()).toAllow(); // should fail
  });

  test('reading of /abc/{id} should succeed', async () => {

    await expect(ref2.get()).toAllow();
  });

  test('writing to /abc should NOT succeed', async () => {

    await expect(ref2.add({})).toDeny();
  });

});