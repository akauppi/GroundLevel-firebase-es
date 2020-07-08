# 💵 💴 💶 💷

# Billing


When this repo was started, all the necessary features were covered by the Spark ("free") plan. Then, on 20-Jun-20, this showed up:

>⚠  functions: Cloud Functions will soon require the pay-as-you-go (Blaze) billing plan to deploy. To avoid service disruption, upgrade before 2020-08-17. For more information, see: https://firebase.google.com/support/faq#functions-runtime

That's fine - Google may change their terms and the Blaze just means you have to provide a credit card. The free usage is still there and this change does not necessarily incur cost to you. It does, however, incur complexity and raises the bar to just try out Firebase.

The purpose of this repo is to REMAIN USEFUL FOR PEOPLE ALSO IN THE SPARK PLAN. 

However, Cloud Functions are too important to leave out, so if you wish to *deploy* using the Spark plan, you need to scrape them out of your copy.

Otherwise, you can develop with Spark but once you intend to deploy to cloud (starting 17-Aug-2020), you will need to upgrade to Blaze.

What this means:

1. The repo works fully when run locally. Use `npm run dev:local` to run emulators for Cloud Functions.
2. If you decide to upgrade to Blaze plan, likely your use will be free even there. 
  - You can place a [budget alert](https://cloud.google.com/billing/docs/how-to/budgets). Note that it's not a hard ceiling - just a way to get notified!
3. You can also switch your Cloud Billing off for the Google project when not needing the service. (tbd. haven't tried this)

<!-- tbd. provide more info about the switching billing off, once there
-->

---

**References**

- Firebase [pricing plans](https://firebase.google.com/pricing) 
- More [information on the Aug 17th change](https://firebase.google.com/support/faq#functions-pricing)

The change seems to be due to internal technical roadmaps. This happens. Cost-wise it'll mean some cents and an incentive to use the emulators for development.

