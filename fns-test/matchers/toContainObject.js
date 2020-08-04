/*
* fns-test/matchers/toContainObject.js
*
* From -> https://medium.com/@andrei.pfeiffer/jest-matching-objects-in-array-50fe2f4d6b98
*   (but against a single object, not array)
*/
expect.extend({
  toContainObject(received, argument) {
    const { printReceived, printExpected } = this.utils;

    const pass = this.equals(received,
      expect.objectContaining(argument)
    )

    if (pass) {
      return {
        message: () => (`expected ${printReceived(received)} not to contain object ${printExpected(argument)}`),
        pass: true
      }
    } else {
      return {
        message: () => (`expected ${printReceived(received)} to contain object ${printExpected(argument)}`),
        pass: false
      }
    }
  }
})

const state = { type: 'START', data: 'foo' }

expect(state).toContainObject({ type: 'START' })
expect(state).toContainObject({ data: 'foo' })
expect(state).not.toContainObject({ type: 'NONE' })
expect(state).not.toContainObject({ data: 'bar' })
