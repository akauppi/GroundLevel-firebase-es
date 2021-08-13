# Known issues

## `index out of range [1] with length 1`

If you see this...

```
$ docker compose up
panic: runtime error: index out of range [1] with length 1

goroutine 50 [running]:
github.com/docker/compose-cli/pkg/compose.(*convergence).ensureService(0xc0000a66c0, 0x2120ba8, 0xc00003a1b0, 0xc00054ebe0, 0xc00052d568, 0x4, 0x0, 0x0, 0x0, 0x0, ...)
	github.com/docker/compose-cli/pkg/compose/convergence.go:222 +0x11f1
github.com/docker/compose-cli/pkg/compose.(*convergence).apply.func1(0x2120ba8, 0xc00003a1b0, 0xc00052d568, 0x4, 0x0, 0x0)
	github.com/docker/compose-cli/pkg/compose/convergence.go:99 +0x21f
github.com/docker/compose-cli/pkg/compose.run.func1(0x0, 0x0)
	github.com/docker/compose-cli/pkg/compose/dependencies.go:102 +0xa3
golang.org/x/sync/errgroup.(*Group).Go.func1(0xc000464a80, 0xc0003803c0)
	golang.org/x/sync@v0.0.0-20210220032951-036812b2e83c/errgroup/errgroup.go:57 +0x59
created by golang.org/x/sync/errgroup.(*Group).Go
	golang.org/x/sync@v0.0.0-20210220032951-036812b2e83c/errgroup/errgroup.go:54 +0x66
```

...do this:

```
$ docker compose down --remove-orphans
[+] Running 11/11
 ⠿ Container app_vite_1                  Removed
 ⠿ Container c7beddddeb43_app_emul_1     Removed
 ⠿ Container app_emul_1                  Removed
 ⠿ Container app_debug_run_e36575ebfcde  Removed
 ⠿ Container app_debug_run_8375d72e9c34  Removed
 ⠿ Container app_debug_run_b89fe03ef831  Removed
 ⠿ Container app_debug_run_b647281167f5  Removed
 ⠿ Container app_debug_run_10f145812250  Removed
 ⠿ Container app_debug_run_eed81ae56d55  Removed
 ⠿ Container app_debug_run_73d8192b0f59  Removed
 ⠿ Network app_default                   Removed
```

The author has no idea what's going on here - but that helps.

