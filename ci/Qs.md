# Questions

## Why a custom builder?

There is a [community builder for Firebase](https://github.com/GoogleCloudPlatform/cloud-builders-community/tree/master/firebase) but it's no match to what we need.

- no emulation support (no Java) 

Ideally, one of you reading this takes on the challenge of bringing the image we use to the community level. Even then, it is possible that you'd want to curry up some additions to it, as part of your project build chain, so this "building the builder" is not completely in vain.

## Why not host the custom builder image publicly?

Costs. A builder is ~500MB and easily gathers download costs if even 100's of people start pulling it. 

>Note: If you know a way to host images free of charge, leave a note.
