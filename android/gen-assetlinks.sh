#!/usr/bin/env bash
# Print the Digital Asset Links statement for a given keystore.
#
#   ./gen-assetlinks.sh ~/stops-release.keystore stops
#
# The output must be served from the ORIGIN ROOT of the site:
#   https://aphile-m.github.io/.well-known/assetlinks.json
# Not from /Camera/.well-known/ -- Chrome only ever looks at the root.
set -euo pipefail
KEYSTORE="${1:?usage: gen-assetlinks.sh <keystore> <alias>}"
ALIAS="${2:?usage: gen-assetlinks.sh <keystore> <alias>}"
FP=$(keytool -list -v -keystore "$KEYSTORE" -alias "$ALIAS" 2>/dev/null \
     | grep 'SHA256:' | head -1 | sed 's/.*SHA256: //' | tr -d ' ')
[ -n "$FP" ] || { echo "Could not read a SHA-256 fingerprint from $KEYSTORE" >&2; exit 1; }
cat <<JSON
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "io.github.aphilem.stops",
    "sha256_cert_fingerprints": ["$FP"]
  }
}]
JSON
