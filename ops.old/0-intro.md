# Iterative lifecycle

![](.images/feedback-loop.png)

<!--*Figure 1. Iterative development*-->
<!-- source (draw.io): href="https://app.diagrams.net/#G1QM56IXBlnFXuJvLmKuDH8QiGTHjfPMkS
-->

Without feedback, you operate in the blind. You don't know, whether you have any users, and not what their experience might be like. Your users have no voice to express their gratitude or wishes.

Closing the development loop is mostly a *cultural* issue. If you *want* to learn from and interact with your user base, we'll show you the tools how.

>Before diving into the details, realize that running the loop depends on *automating* as much as you can - this helps save time for the human-to-human interactions, which collecting feedback and reconsidering the next steps inevitably are. It's in these steps - not in development - where your application really gets baked.

If you haven't deployed your application, yet, please consider doing so first and returning here once its first version is "out there". Without a deployed version you are not going to have an audience to talk with.

Release early and often.


## Tools

We've selected some tools for you.

||Used for|
|---|---|
|[Sentry.io](https://sentry.io/welcome/)|- web vitals (general performance)<br/>- crash analytics|
|[Managed Service for Prometheus](https://cloud.google.com/managed-prometheus)|- metrics storage|
|[Grafana Cloud](https://grafana.com)|- metrics dashboard (counters, histograms)|
|[Plausible Analytics](https://plausible.io)|- aggregated, anonymous data about your users|

<!-- COming up:
- logs						// Cloud Logging    | Grafana Cloud (Loki)
- uptime monitoging		// Cloud Monitoring | Grafana Cloud
-->

<!-- do we want to list it?  Sentry does it, no??
|[Firebase Performance Monitoring](https://firebase.google.com/docs/perf-mon)|- web vitals<br/>- collecting custom code traces (duration, counts)|
-->

<!--
- A/B testing; add mention of the tool(s), once selected (own config + Sentry filters??)
-->

>Author's impressions.
>
>**Sentry** is a tool exclusively made for performance and other monitoring. It's awesome. The author feels it's better to focus on specialized tools with generous free tiers.
>
>**Managed Service for Prometheus** is needed as a data store for Grafana Cloud.
>
>**Grafana Cloud** is a gorgeous cloud offering for pulling and storing metrics, presenting them, and also for logs and traces.
>
>**Plausible** has a focus on retaining anonymity of the users in the aggregated data. This "clicks" well with the author - hopefully you as well. Plus, it's a gorgeous tool (did I use that term already??). 
>
>Note: Plausible is the *only* tool selected without a permanent free tier. It's optional so you can give it a go and decide, whether it's worth your money.

## Requirements

- [Sentry account](https://sentry.io/welcome/)
   - free developer tier should be enough
   - Go through [Setting up Sentry](./Setting up Sentry.md) before continuing.

- [Grafana Cloud account](https://grafana.com)
   - 14 day trial; continue to free account
	- Go through [Setting up Grafana Cloud](./Setting up Grafana Cloud.md).

- [Plausible account](https://plausible.io) (optional)
   - 30 day trial; no free tier
   - Go through [Setting up Plausible](./Setting up Plausible.md)

By having set up the accounts, integrated them with your deployed web application, and generated some user data you will get more out of the following tour.

You can also read the tour first, then set up the things, the come back. :)


## Contents

- Operational monitoring
   - [User happiness](./1.1-happiness.md)
     - Core Web Vitals
     - Crash reporting
   - [Internal probing](./1.2-internal.md)
     - Custom metrics
     <!-- font color=gray>Centralized logging (tbd.)</font -->
   - [Learning about users](./1.3-users.md)
     - Analytics
     <!-- font color=gray>A/B testing (tbd.)</font -->
   <!-- font color=gray>Availability (tbd.)</font -->
   <!-- font color=gray>Alerts (tbd.)</font -->

<!-- tbd.
- A/B testing (under "Knowledge about userbase"?)
  // Likely using configuration and Sentry tagging (not introducing a separate tool).
-->

<!--
- [Building a community](./2-community.md)
   // Discord??? (set up, norms, watering...)
-->

