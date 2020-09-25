/*
* Ways that the app can log to ops.
*/

/*
* Logging id's
*
* Note: Use of the id's allows us to defined centrally, which get toasted (shown in the UI), and ..maybe.. in the future
*     provide translations.
*/
const testDebug = { level: 'debug' };
const testInfo = { level: 'info' };
const testWarn = { level: 'warn' };
const testError = { level: 'error' };

const vueWarning = { level: 'warn' };

export {
  testDebug,
  testInfo,
  testWarn,
  testError,
  vueWarning
}
