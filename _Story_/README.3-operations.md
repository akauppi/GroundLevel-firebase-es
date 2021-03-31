
# Operations

Once you (or your CI) deploy versions to the cloud, that's more the *beginning* of a story than the *end*.

It's *only now* that your users come to the picture. Do they find your application? Do they know how to use it? Can they provide feedback? What if the application crashes! on them?

This is the domain of "devops" or "SREs" (Service Reliability Engineers), who's job is to keep things rolling and to close the feedback loop back from the users to the developers.

## Great tools

Don't worry. Having Firebase in the project already *removes* a large part of things that could go wrong in production, or need nurturing. With some additional tools, we aim to cover the rest.

<strike>This is the *purpose* of the "web" repo.</strike> To bring in tools that are not application "features" but operation instrumentation.

There are *lots* of such tools. We propose some (works for a single-person project or a startup), while allowing others to be injected with relative ease. In particular, the set of operational instrumentation is *detached from app code* by purpose. This means e.g. that you can:

- integrate with the ops tools your company/employer already uses
- evaluate e.g. two logging services side-by-side; with the same app, until you are decided
- more easily jump wagons (for pricing or whatever reasons)

