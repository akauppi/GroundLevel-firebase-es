# Notes

## Specific GCP project for the CI?

It might make sense to create a separate CI project.

The Cloud Build definitions are in the console (not version control!) and removing the project (that runs Firebase) means they must be recreated.

CI projects may well have a longer lifespan, so might be a good idea to have a dedicated such.

*tbd. If going that route, mark details here.*

<!--
- How is access to the CI project granted in GCP Console?
-->

