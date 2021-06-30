/*
* test-fns/matchers/toContainObject.js
*
* From -> https://medium.com/@andrei.pfeiffer/jest-matching-objects-in-array-50fe2f4d6b98
*   (but against a single object, not array)
*/
import { expect } from '@jest/globals'

expect.extend({
  toContainObject(received, expected) {
    const { printReceived, printExpected } = this.utils;

    const pass = this.equals(received,
      expect.objectContaining(expected)
    )

    return pass ? {
      message: () => `expected ${ printReceived(received) } not to contain object ${ printExpected(expected) }`,
      pass: true
    } : {
      message: () => `expected ${ printReceived(received) } to contain object ${ printExpected(expected) }`,
      pass: false
    }
  }
})

/*** disabled; remove? (using 'expect' for unit testing is a bad idea, since it distorts the expect counts)
const state = { type: 'START', data: 'foo' }

expect(state).toContainObject({ type: 'START' })
expect(state).toContainObject({ data: 'foo' })
expect(state).not.toContainObject({ type: 'NONE' })
expect(state).not.toContainObject({ data: 'bar' })
*/
