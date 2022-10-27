/*
* functions/ops/proxyToGrafana.js
*
* Scheduled function for reading new metrics and log entries from Realtime Database, and proxying them to Grafana Cloud.
*/
import { onSchedule } from 'firebase-functions/v2/scheduler'

/*
* EXP: TESTING SCHEDULED FUNCTION
*/
const onceADay = onSchedule('every day 00:03', async ev => {

  console.log('Something happened.');
});

export {
  onceADay
}
