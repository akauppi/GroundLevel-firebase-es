/*
* src/counters.js
*
* Context:
*   - 'window.plausible.trackEvent' has been set up (or left missing if Plausible is disabled)
*
* Tickling the goals set up in Plausible dashboard (for the particular project).
*/

function crCounter(goal) {  // (string) => () => ()

  return () => {
    const { trackEvent } = window.plausible || {};

    if (!trackEvent) {
      console.info("Skipping goal (Plausible not enabled)", goal);
    } else {
      trackEvent(goal);
    }
  }
}

const countAbc = crCounter("abc");    // sample

export {
  countAbc
}
