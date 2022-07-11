# Alternatives

No tool is unique, and if one is, it might tell that it's either not needed, or the certain ecological niche hasn't been filled, yet.

Which one is it?

This page lists alternatives that a developer can consider. Listing the differences helps place these - including GroundLevel itself - on the solution space in one's head.

<font size="+5">🧠</font>

>Disclaimer: any comparison is always subjective. If you feel the text can be improved (to be more up-to-date, factual, or fair), please raise it up as an Issue or PR.


## Other app templates

- [Firelayer](https://firelayer.io)
  - seems visually pleasing!
  - likely Vue.js 2?
  - likely uses bundling

*tbd. When someone has checked Firelayer in detail, and can make a brief (2 sentence!) summary on how it differs from this repo, that is most welcome. `#contribution`*

- [cypress-realworld-app](https://github.com/cypress-io/cypress-realworld-app)
  - Showcasing use of Cypress

- [Platform.sh](https://platform.sh)

   >The cloud PaaS to develop/deploy/host/secure
websites and web apps

   A commercial offering.
   
   Looks really bright. The audience is likely slightly different than what GroundLevel caters to. My *haven't-actually-tried-so-pinch-of-🧂* comparison is below.<sup>[0]</sup>

   <small>`[0]`: Wouldn't it be cool if emojis tilted, when written in italics.</small>

   |||
   |---|---|
   |**Similar**|
   |Focus on developer productivity|
   |Covers CI/CD|
   |Provides CDN, to make site loads snappy.|
   |Regional data storage, for meeting e.g. GDPR requirements<sup>[1]</sup>|
   |Templates. `Platform.sh` has such. For GroundLevel, they would grow organically as  "used by" links in the Readme).
   ||
   |**Different**|
   |Different target audience. `Platform.sh` focuses on companies hosting 10's to 1000's of web sites / apps. GroundLevel starts already from a newbie, writing their first, ever, web app.<sup>[2]</sup>|
   |Tech stack. `Platform.sh` is "multilanguage, multidatabase", whereas GroundLevel builds upon a single, opinionated, ops stack (Firebase, Sentry, Plausible, Grafana/Loki etc.)<sup>[3]</sup>|
   |Commercial offering (140M USD series D claimed) vs. open source (you get what you see).|

   <small>`[1]`: `Platform.sh` may have more tooling.</small>
   
   <small>`[2]`: Scaling up is also in the plans for GroundLevel, but it will not compromise the "my first web app, ever" developer experience.
   </small>

   <small>`[3]`: This does not extend to what one uses for building the web app. There, any web framework can be used (though the sample is using Vue.js).
   </small>

<!-- Open:
   - does Platform.sh provide logging and monitoring (counters) APIs (making those uniform)?
-->

      
*tbd. Study, try out, report the similarities, differences.*
   
>Disclaimer: The author read through some of their materials and watched some videos. The analyses are based on these; did not try them in action.
   
