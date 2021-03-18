# Lighthouse

Google Chrome has a Lighthouse tool to evaluate your site's performance. It's good to use occasionally, with different settings.

Before usage:

- Open Chrome
- `Show` > `Developers` > `Developer tools` (or Alt-Cmd-I shortcut on Mac)
- Unselect ⚙️ > `Clear storage`. Otherwise running Lighthouse will log you out. <sub>[source](https://github.com/GoogleChrome/lighthouse/issues/1418)</sub>

   >![](.images/lighthouse-un-clear-storage.png)

Make a report:

- Open Chrome and the web page. Sign in.
- `Show` > `Developers` > `Developer tools`
- `Lighthouse` tab (may be hidden behind the `≫` icon)
- Pick the check boxes you are interested in, and `Generate report`

![](.images/lighthouse-report.png)

So proud of those results!! :)

If there are places to improvement, Lighthouse offers you links for more information.

Note that the deployment (`index.html` and Rollup configuration) is optimized for HTTP/2 delivery. Use Lighthouse only on production ready build (`app-deploy-ops`), not development.

>Note: If your results are less than 100 and they can be improved by settings in this project, create an Issue.


## References

- [Running Lighthouse on Authenticated pages](https://github.com/GoogleChrome/lighthouse/blob/master/docs/authenticated-pages.md) (Lighthouse GitHub)

