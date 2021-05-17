/*
* test-fns/logging.test.js
*/
import { test, expect, describe, beforeAll, afterAll } from '@jest/globals'

import { httpsCallable } from 'firebase-jest-testing/firebaseClientLike'

describe ('Can proxy application logs', () => {

  test.skip ('good log entries', async () => {
    const msgs = [
      { level:'info', msg:'Jack says hi!' },
      { level:'warn', msg:'Avrell is hungry!' },
      { level:'error', msg:'William' },
      { level:'fatal', msg:'Joe is in jail!' }
    ];

    const fnLog = httpsCallable("cloudLoggingProxy_v0");

    const { data } = await fnLog(msgs);    // { data: null }
    expect(data).toBeNull();
  });
});
