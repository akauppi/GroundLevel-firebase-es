# Troubleshooting

## Clear the Vite cache

If things look really crazy, try this:

```
$ rm -rf tmp/.vite
```

That folder stores the state between Vite invocations, and **sometimes** it helps to just remove it. This forces Vite to rebuild everything.

