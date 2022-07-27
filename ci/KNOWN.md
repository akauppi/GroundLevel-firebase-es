# Known issues

## Backend: warnings of bad `npm` version

```
Step #1: npm WARN EBADENGINE Unsupported engine {
Step #1: npm WARN EBADENGINE   package: undefined,
Step #1: npm WARN EBADENGINE   required: { node: '16' },
Step #1: npm WARN EBADENGINE   current: { node: 'v18.2.0', npm: '8.9.0' }
Step #1: npm WARN EBADENGINE }
```

This is ok, and can be ignored.

The reason is that we (`packages/backend/docker-compose.yaml`) install Firebase `functions` stuff using Node 18, which it isn't technically supporting, yet.

There's no harm. This fades away once Firebase starts supporting Node 18.

>Node.js 18 was released on April 19th 2022.

>Node.js 18 [is scheduled](https://nodejs.org/en/about/releases/) to enter LTS in Oct 2022.
