# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Here are the versions that are currently being supported with security updates.
If you are using an older version, please upgrade.

| Version | Supported |
| ------- | --------- |
| 0.1.x   | ✅        |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please contanct to the maintainer(s).
The maintainer(s) can be found in the [README file](README.md#credits). Please do not disclose security-related issues publicly
until a patch has been announced. Thank you for improving the security of this project! We appreciate your efforts and responsible
disclosure and will make every effort to acknowledge your contributions.

## Known Limitations

### CWE-248 — Path Disclosure in `public/wasm/main.wasm`

| Field | Detail |
|-------|--------|
| **CWE** | CWE-248 (Uncaught Exception / Information Disclosure) |
| **Severity** | Low |
| **Affected file** | `public/wasm/main.wasm` |
| **Scanner** | WebInspect (Dynamic Analysis) |

**Root cause**: The `main.wasm` binary is compiled from Go source code. If it is
built without the `-trimpath` flag, the Go compiler embeds absolute filesystem
paths from the build machine (Go stdlib paths, project source paths) directly into
the binary. These paths are visible in the raw binary content and can be read by
security scanners.

**Status**: The Go source code for `main.wasm` is not stored in this frontend
repository, so the binary cannot be rebuilt here automatically. The fix must be
applied when the Go source is compiled.

**Resolution**: Rebuild `main.wasm` using the flags documented in
[`wasm/README.md`](wasm/README.md):

```bash
GOOS=js GOARCH=wasm go build \
  -trimpath \
  -ldflags="-s -w" \
  -o public/wasm/main.wasm \
  <path-to-go-source>
```

Once the Go source is committed to the `wasm/` directory, the `Dockerfile` will
automatically rebuild the binary with these flags on every Docker image build,
permanently resolving this finding.

