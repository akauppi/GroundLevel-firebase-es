/*
* back-end/test-fns/callables.test.js
*/
import { test, expect, describe } from '@jest/globals'

import { fns } from 'firebase-jest-testing/cloudFunctions'

describe ('Can proxy application logs', () => {
  const fnLog = fns.httpsCallable("logs_v1");

  test ('good log entries', async () => {
    const msgs = [
      { level:'info', msg:'Jack says hi!' },
      { level:'warn', msg:'Avrell is hungry!' },
      { level:'error', msg:'William' },
      { level:'fatal', msg:'Joe is in jail!' }
    ];

    const data = (await fnLog(msgs)).data;    // null

    expect(data).toBeNull();
  });
});
