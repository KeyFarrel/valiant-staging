#!/usr/bin/env bash
# Build the Go WebAssembly binary with security-hardened flags.
#
# Flags used:
#   -trimpath          → removes all local filesystem paths from the binary (fixes CWE-248)
#   -ldflags="-s -w"   → strips symbol table and DWARF debug info
#
# Usage:
#   cd wasm/
#   ./build.sh
#
# Output: ../public/wasm/main.wasm

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUTPUT="${SCRIPT_DIR}/../public/wasm/main.wasm"

echo "[wasm/build.sh] Building main.wasm with -trimpath -ldflags='-s -w' ..."

GOOS=js GOARCH=wasm go build \
  -trimpath \
  -ldflags="-s -w" \
  -o "${OUTPUT}" \
  "${SCRIPT_DIR}"

echo "[wasm/build.sh] Build complete → ${OUTPUT}"

# Verify no local paths remain embedded in the binary
LEAKED=$(strings "${OUTPUT}" | grep -cE "(homebrew|Cellar|/Users/|/home/)" || true)
if [ "${LEAKED}" -gt 0 ]; then
  echo "[wasm/build.sh] WARNING: ${LEAKED} local path(s) still found in binary — check build flags."
  exit 1
fi

echo "[wasm/build.sh] Path-disclosure check passed (0 local paths embedded)."
