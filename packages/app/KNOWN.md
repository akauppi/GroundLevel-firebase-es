# Known issues

## `npm run dev` does not launch (with Docker)

```
> dev:local
> concurrently --kill-others-on-fail -n emul,init "npm run --silent _dev_local_emul" "npm run -s _dev_local_init && npm run -s _dev_local_vite"

[emul] Launching Docker... 🐳
[emul] 
```

If the terminal stays there for ... longer than 10s, something is wrong with Docker. 

Restart Docker.

`#contribute`: Can you figure out why this happens??

