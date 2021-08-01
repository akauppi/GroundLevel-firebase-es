# Wishes for Docker Compose

## Ability to set `--abort-on-container-exit` in the YAML

It would be nice to provide a developer experience where `docker compose up` just launches the "right things".

To do this, and not give up robustness, I would need to be able to defined *in the YAML file* that the CLI option `--abort-on-container-exit` should be applied, if `docker compose up` is launched, without any parameters.

