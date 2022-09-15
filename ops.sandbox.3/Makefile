#
# Makefile
#
# Expects:
#	LOKI_USER		user id, e.g. "252484"
#	PROM_USER		user id, e.g. "507028"
#	MP_API_KEY		valid API key with 'MetricsProvider' role
#	ADMIN_API_KEY	valid API key with 'Admin' role
#
#	NOTE: You'll find the right values by visiting http://grafana.com > `My Account` > `Loki` > `Send Logs`
#
#	NOTE: [1] says:
#		<<
#	      We [Grafana Cloud] support only float64 on our platform. This means all the integer and boolean values
#	      will be cast into floating point before storage. True becomes 1 and false becomes 0. We currently don’t ingest
#	      string values.
#		<<
#
# References:
#	- Grafana Loki HTTP API
#	  -> https://grafana.com/docs/loki/latest/api/#post-lokiapiv1push
#	- "Push metrics from Influx Telegraf to Prometheus" (Grafana Cloud docs) [1]
#	  -> https://grafana.com/docs/grafana-cloud/data-configuration/metrics/metrics-influxdb/push-from-telegraf/#pushing-from-applications-directly
#	- InfluxDB Line Protocol
#	  -> https://docs.influxdata.com/influxdb/cloud/reference/syntax/line-protocol/
#

# Note: Loki user id is different from that of Prometheus!
#
#	- Visit `https://grafana.com/orgs/{ your org }`
#	- Click 'Prometheus' > 'Send Metrics'
#	  - pick up the user id
#	- Click 'Loki' > 'Send Logs'
#	  - pick up the user id
#
ifeq ($(LOKI_USER),)
  $(error No 'LOKI_USER' env.var.)
endif
  # 252484

ifeq ($(PROM_USER),)
  $(error No 'PROM_USER' env.var.)
endif
  # 507028

ifeq ($(GC_API_KEY),)
  $(error No 'GC_API_KEY' env.var.)
endif

_LOKI_URL=https://logs-prod-eu-west-0.grafana.net

_INFLUX_URL=https://influx-prod-01-eu-west-0.grafana.net
#!! _PROMETHEUS_URL=https://prometheus-prod-01-eu-west-0.grafana.net

#---
_NOW_NANO := $(shell node -e 'console.log(Date.now())')000000

# Sample from Loki HTTP API quote in SO.
#
loki-post:
	curl -v -XPOST -u $(LOKI_USER):$(MP_API_KEY) -H "Content-Type: application/json" -s "$(_LOKI_URL)/loki/api/v1/push" --data-raw \
      '{"streams": [{ "stream": { "foo": "bar2" }, "values": [ [ "$(_NOW_NANO)", "fizz buzz" ] ] }]}'

# Gives:
#	<<
#	  {"status":"success","data":[{"foo":"bar2"}]}
#	<<
#
loki-get-series:
	curl -v -u $(LOKI_USER):$(ADMIN_API_KEY) "$(_LOKI_URL)/loki/api/v1/series"

# tbd. A GET that would show content we posted.

#loki-get-query:
#	curl -G -s -u $(LOKI_USER):$(ADMIN_API_KEY) "$(_LOKI_URL)/loki/api/v1/query" \
#	  --data-urlencode 'query=sum(rate({job="varlogs"}[10m])) by (level)' | jq -C .

#--- Metrics

# InfluxDB Line Protocol
#
# Grafana Cloud is compatible with this, for metrics input.
#
#	Sample:
#	<<
#		myMeasurement,tag1=value1,tag2=value2 fieldKey="fieldValue" 1556813561098000000
#	<<
#
metrics-push:
	curl -v -XPOST -u $(PROM_USER):$(MP_API_KEY) "$(_INFLUX_URL)/api/v1/push/influx/write" -d \
      'ABC,A=1,B=2 def=34 $(_NOW_NANO)'
	# 204

#mp2:
#	curl https://$(PROM_USER):$(GC_API_KEY)@influx-prod-01-eu-west-0.grafana.net/api/v1/push/influx/write -d \
#      'test,test_label=test_label_value direct_metric="22" $(_NOW_NANO)' -i

#---
echo:
	@echo $(_NOW_NANO)

