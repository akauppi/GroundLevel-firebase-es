# 💵 💴 💶 💷

# Billing

When this repo was started, all the necessary features were covered by the Spark ("free") plan. Then, on 20-Jun-20, Google [announced](https://firebase.google.com/support/faq#functions-pricing) they'll require customers to move to Blaze plan, by 17-Aug-20.

That actually.. seems fine. :)

There are technical reasons for this, and the Blaze plan can still be "free" (as in no payments). It's just that you have to provide payment information.

We bring this up under Deployments, because you **won't be affected, unless you deploy Cloud Functions.** 

We try to make clear, what the implied costs of deploying this project might be, but of course you are responsible for them, in the end, and should double check the information from [Firebase pricing](https://firebase.google.com/pricing).

## Cloud Functions

As of Jul 2020:

|what|how much?|free tier|
|---|---|---|
|Cloud functions, `.pubsub.schedule`|0.10 USD per function per month|3 free scheduled jobs per Google account|

Note: The `.pubsub.schedule` is not mentioned on the pricing page. It's based on [Cloud Scheduler > Pricing](https://cloud.google.com/scheduler) (GCP docs).


## Budget alerts

You can place a [budget alert](https://cloud.google.com/billing/docs/how-to/budgets) to get notified if your Firebase (Google Cloud Platform?) costs are rising to some level. But notice it's not a ceiling, and there's no way (Jul 2020) to limit costs per month to a fixed amount.[^1]

[^1]: Well, one could take a credit card that has a rediculously low monthly limit, but Google likely will still keep the account holder responsible. No knowledge - if you try this, let us know.


## Temporarily switching off Cloud Billing

You can switch your Cloud Billing off for the Google project when not needing the service. (tbd. haven't tried this)

<!-- tbd. provide more info about the switching billing off, once there
-->

