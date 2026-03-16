# WASM Build Instructions

## Overview

`public/wasm/main.wasm` is a Go WebAssembly binary that provides client-side AES
encryption and secret-key derivation for the Valiant frontend application.

## Security Requirement — CWE-248 / Path Disclosure

Go binaries compiled without the `-trimpath` flag embed absolute filesystem paths
from the build machine (e.g. Go stdlib paths, project source paths) directly into
the binary. These paths are visible in the raw binary content and can be read by
security scanners, satisfying CWE-248 (information disclosure through embedded
debug/exception data).

**To remove all embedded paths the binary MUST be rebuilt with `-trimpath`.**

## Required Build Flags

```bash
GOOS=js GOARCH=wasm go build \
  -trimpath \
  -ldflags="-s -w" \
  -o ../public/wasm/main.wasm \
  .
```

| Flag | Purpose |
|------|---------|
| `-trimpath` | Removes all local filesystem paths from the compiled binary (fixes CWE-248) |
| `-ldflags="-s -w"` | Strips symbol table (`-s`) and DWARF debug info (`-w`) — further reduces binary size and information disclosure |

## Build Script

Run [`build.sh`](./build.sh) from this directory:

```bash
cd wasm/
./build.sh
```

## Prerequisites

- Go ≥ 1.21 (`go version`)
- The Go source file(s) for this module must be present in this directory

## Verification

After rebuilding, confirm that no local paths remain in the binary:

```bash
strings public/wasm/main.wasm | grep -E "(homebrew|Cellar|/Users/|/home/)" | wc -l
# Expected output: 0
```

## Note for Maintainers

The Go source code for `main.wasm` is managed separately (it contains hardcoded
secret-key material). When updating the binary, always use the build flags above
and verify the path-disclosure check before committing the new binary.
