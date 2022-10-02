/*
* src/central/perfs.js
*
* Application specific performance measurements.
*/
import { createPerfStart } from './commonPerf'

const initPerfStart = createPerfStart("init-main");
const initAsidePerfStart = createPerfStart("init-aside");
const initRouterPerfStart = createPerfStart("init-router");

export {
  initPerfStart,
  initAsidePerfStart,
  initRouterPerfStart
}
