# Firebase regions <sup>[1]</sup>

<small>`[1]`: Also called "locations"</small>

The Firebase regions story is not quite simple, and keeps evolving.

Originally, it seems, Firebase Realtime Database only "lived" in `us-central1`, one single region.

Cloud Functions and Cloud Firestore, pushing for more cloud scale scalability, introduced more regions.

In 2022, also Realtime Database can be hosted in other regions than `us-central1`, but only a few. 

When one creates a Firebase project (either Cloud Functions, Cloud Firestore or Realtime Database), one needs to select a location (region) for it. It would be simple if this was a single choice, but it's not quite so..

Thus the need to look into it. We're trying to answer two questions:

- Which region(s) should I run my backend in?
- How to set it up?

>Note: Once Firebase resources are created, the choice is set. You cannot modify the region/location any more.
>
>If you wish to experiment with another setup, just create a new project (unless you have user data in there, which... we're not covering transitioning such to another region).


## Check the Docs

It might be a good idea to first read what Firebase has to say about this. Read the below links *in full!!* and then return here. :)

[Select locations for your project](https://firebase.google.com/docs/projects/locations) states:

- There is a *default GCP resource location* 

   >This location is where your data is stored for GCP services that require a location setting.

   Steers Cloud Firestore, Cloud Storage and Cloud Firestore scheduled functions - but *not* Cloud Firestore regular functions, or Realtime Database!


## Regional capabilities

Firebase docs list regions per product, but not a good list per region (which is helpful to decide, which one you'd pick). Here we go.


|region|GCP resources <sub>[source](https://firebase.google.com/docs/projects/locations#location-r)</sub>|Cloud Functions<sup>[2]</sup> <sub>[source](https://firebase.google.com/docs/functions/locations)</sub>|Realtime Database <sub>[source](https://firebase.google.com/docs/projects/locations#rtdb-locations)</sub>|
|---|---|---|---|
|**North America**|
|&nbsp;&nbsp;`us-west1`|✓|-- <sup>[4]</sup>|
|&nbsp;&nbsp;`us-west2`|✓|✓ Tier 2|
|&nbsp;&nbsp;`us-west3`|✓|✓ Tier 2|
|&nbsp;&nbsp;`us-west4`|✓|✓ Tier 2|
|&nbsp;&nbsp;`northamerica-northeast1`|✓|✓ Tier 2|
|&nbsp;&nbsp;`us-east1`|✓|✓ Tier 1|
|&nbsp;&nbsp;`us-east4`|✓|✓ Tier 1|
|<font color=gray>&nbsp;&nbsp;`us-central1`|<font color=gray>multi-region only <sup>[3]<sup>|<font color=gray>✓ Tier 1|<font color=gray>✓|
|**South America**|
|&nbsp;&nbsp;`southamerica-east1`|✓|✓ Tier 2|
|**Europe**|
|<font color=gray>&nbsp;&nbsp;`europe-west1`|<font color=gray>multi-region only <sup>[3]<sup>|<font color=gray>✓ Tier 1|<font color=gray>✓|
|&nbsp;&nbsp;`europe-west2`|✓|✓ Tier 1|
|&nbsp;&nbsp;`europe-west3`|✓|✓ Tier 2|
|&nbsp;&nbsp;`europe-central2`|✓|✓ Tier 2|
|&nbsp;&nbsp;`europe-west6`|✓|✓ Tier 2|
|**Asia**|
|&nbsp;&nbsp;`asia-south1`|✓|✓ Tier 2|
|&nbsp;&nbsp;`asia-southeast1`|✓|✓ Tier 2|✓|
|&nbsp;&nbsp;`asia-southeast2`|✓|✓ Tier 2|
|&nbsp;&nbsp;`asia-east1`|✓|✓ Tier 1|
|&nbsp;&nbsp;`asia-east2`|✓|✓ Tier 1|
|&nbsp;&nbsp;`asia-northeast1`|✓|✓ Tier 1|
|&nbsp;&nbsp;`asia-northeast2`|✓|✓ Tier 1|
|&nbsp;&nbsp;`asia-northeast3`|✓|✓ Tier 2|
|**Australia**|
|&nbsp;&nbsp;`australia-southeast1`|✓|✓ Tier 2|

>Note: The data is based on Firebase docs as of July 4th 2022. Things may have changed.

><small>`[2]`: other than scheduled functions</small>

><small>`[3]`: `us-central1` (Iowa) and `europe-west1` (Belgium), the locations for hosting Realtime Database, aren't listed as a regional "GCP resources" targets, at all. They are offered as Multi-region services, however.</small>

><small>`[4]`: Whether `us-west1` really doesn't support Cloud Functions, at all, is unknown. It isn't listed in Jul 2022. It could be on the way out.</small>

## How to select?

Pick something that's close to your users. The Firebase documentation puts names of cities to the regions, to help you decide.

**Regional**

Regional would suffice fine. Multi-region is for more 9's at the end of the SLA - and costs more, accordingly.

**Tier 1 and 2**

That affects pricing, but the difference might not be that noticable. Leaving that decision to You.

**Legislation (GDPR et.al.)**

Let's say you'd prefer your user's data to always remain within a certain legal boundary, e.g. the EU.

- `europe-west1` is Belgium (EU), but not available as a regional service
- `europe-west2` is London (UK; non-EU)
- `europe-west3` is Frankfurt (EU)
- `europe-west6` is Zürich (non-EU) <sub>The author is not aware if Switzerland would be a valid storage area, with the GDPR in mind.</sub>

This leaves only `europe-west3` (Frankfurt) ticking all the boxes.

For Realtime Database (only used for operational monitoring), you can pick `europe-west1` (Belgium).

>It's somewhat worrying that only a single region would tick the boxes, for GDPR. Maybe Google's thought is that if such things matter, the organization also wants to use multi-region (`eur3`).


## What are we omitting?

Two things.

### Cloud Functions

Cloud Functions can be run in multiple regions. There are called "regional functions" and you can read about them in the Firebase documentation.

We choose not to do that, but instead deploy and run Cloud Functions always in the same "default GCP resources" location where also Cloud Firestore is running.

This is mainly just to keep things simple.

If you want to run Cloud Functions in multiple regions, that's fine. You'll just code the functions accordingly, and need to tune the deployment scripts to your liking.


### Multi-region

Multi-region deployments add the service's monthly uptime target from 99.99% (max. 4.3 min downtime) to 99.999% (max. 26s downtime) <sub>[source](https://firebase.google.com/docs/firestore/locations#sla)</sub>.

In reality, the downtimes are likely much less.

>Check out [Google Cloud > Service health](https://status.cloud.google.com/regional/europe) to see how their services are doing. 
>
>There's also `View history` at the bottom, to get an idea about the frequency and duration of historic incidents that affected service availability.


## I know what I want - how to set it up?

Firebase Console asks you to select a location when creating the services (Cloud Firestore / Cloud Functions and separately, Realtime Database).

Just do that. The repo will sniff your setup automatically, and deploy to the right destination.


## References

- Firebase docs
   - [Select locations for your project](https://firebase.google.com/docs/projects/locations)
   - [Cloud Function locations](https://firebase.google.com/docs/functions/locations)
   - [Cloud Firestore locations](https://firebase.google.com/docs/firestore/locations)
