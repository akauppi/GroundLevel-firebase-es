#
# Dockerfile for Prometheus (agent mode)
#
# References:
#   - Best practices for writing Dockerfiles
#       -> https://docs.docker.com/develop/develop-images/dockerfile_best-practices/
#
FROM alpine

WORKDIR /work

ENV prometheus_version 2.37.0
  # Prometheus releases: -> https://github.com/prometheus/prometheus/releases

RUN adduser -s /bin/false -D -H prometheus \
  && apk update \
  && apk --no-cache add curl \
  && curl -LO https://github.com/prometheus/prometheus/releases/download/v${prometheus_version}/prometheus-${prometheus_version}.linux-amd64.tar.gz \
  && tar -xvzf prometheus-${prometheus_version}.linux-amd64.tar.gz \
  && mkdir -p /etc/prometheus /var/lib/prometheus \
  && cp prometheus-${prometheus_version}.linux-amd64/promtool /usr/local/bin/ \
  && cp prometheus-${prometheus_version}.linux-amd64/prometheus /usr/local/bin/ \
  && cp -R prometheus-${prometheus_version}.linux-amd64/console_libraries/ /etc/prometheus/ \
  && cp -R prometheus-${prometheus_version}.linux-amd64/consoles/ /etc/prometheus/ \
  && rm -rf prometheus-${prometheus_version}.linux-amd64* \
  && chown prometheus:prometheus /usr/local/bin/prometheus \
  && chown prometheus:prometheus /usr/local/bin/promtool \
  && chown -R prometheus:prometheus /etc/prometheus \
  && chown prometheus:prometheus /var/lib/prometheus \
  && apk del curl
