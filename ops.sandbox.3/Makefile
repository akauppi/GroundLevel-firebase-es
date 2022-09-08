#
# Makefile
#
# Expects:
#	GC_USER		user id, e.g. 252484
#	GC_API_KEY	valid API key
#
#	NOTE: You'll find the right values by http://grafana.com > `My Account` > `Loki` > `Send Logs`
#
# Requires:
#	- curl
#
# References:
#	- Grafana Loki HTTP API
#	  -> https://grafana.com/docs/loki/latest/api/#post-lokiapiv1push
#

# Notes:
# 	"The API endpoints starting with /loki/ are Prometheus API-compatible and the result formats can be used interchangeably."

##_GRAFANA_ID=$(GC_ID)
##_GRAFANA_TOKEN=$(GC_TOKEN)

ifeq ($(GC_USER),)
  $(error No 'GC_USER' env.var.)
endif
ifeq ($(GC_API_KEY),)
  $(error No 'GC_API_KEY' env.var.)
endif

_LOKI_URL=https://$(GC_USER):$(GC_API_KEY)@logs-prod-eu-west-0.grafana.net

# Sample from Loki HTTP API quote in SO.
#
loki-post:
	curl -v -XPOST -H "Content-Type: application/json" -s "$(_LOKI_URL)/loki/api/v1/push" --data-raw \
      '{"streams": [{ "stream": { "foo": "bar2" }, "values": [ [ "1662583488133000000", "fizz buzz" ] ] }]}'

# Gives:
#	<<
# 	  {"status":"success","data":[]}
#	<<
#
loki-get-series:
	curl -v "$(_LOKI_URL)/loki/api/v1/series"

loki-get-query:
	curl -G -s "$(_LOKI_URL)/loki/api/v1/query" \
	  --data-urlencode 'query=sum(rate({job="varlogs"}[10m])) by (level)' | jq -C .

#---
echo:
	@echo A
