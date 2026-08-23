#!/usr/bin/env bash
# Lay the Stops icon and colours over the project `npx cap add android`
# generates. Used identically by CI and locally, so a local build and a
# release build cannot drift.
set -euo pipefail
RES=android/app/src/main/res
[ -d "$RES" ] || { echo "No $RES — run 'npx cap add android' first." >&2; exit 1; }

cp -r android-res/. "$RES/"

# Capacitor's default background is a vector we do not use; the adaptive icon
# references @color/ic_launcher_background instead. Leaving it behind is dead
# weight in every APK.
rm -f "$RES/drawable/ic_launcher_background.xml"
# Its foreground PNGs are superseded by our vector at @drawable/ic_launcher_foreground.
rm -f "$RES"/mipmap-*/ic_launcher_foreground.png

# Capacitor ships splash.png at every density. Ours is drawable/splash.xml, and
# two resources cannot share a name with different extensions.
rm -f "$RES"/drawable*/splash.png

# Location permissions. The @capacitor/geolocation plugin does NOT declare
# these in its own manifest, so without them the runtime request is refused
# instantly and the light timetable can never find you.
python3 - android/app/src/main/AndroidManifest.xml <<'PERMS'
import sys, re
path = sys.argv[1]
xml = open(path).read()
wanted = ["android.permission.ACCESS_COARSE_LOCATION",
          "android.permission.ACCESS_FINE_LOCATION"]
missing = [p for p in wanted if p not in xml]
if missing:
    lines = "\n".join(f'    <uses-permission android:name="{p}" />' for p in missing)
    xml = re.sub(r"(<application\b)", lines + "\n\n    \\1", xml, count=1)
    open(path, "w").write(xml)
    print(f"Added {len(missing)} location permission(s) to the manifest.")
else:
    print("Location permissions already present.")
PERMS

# Guard the two mistakes that are easy to reintroduce and hard to spot.
# Parse the XML rather than grepping it: the file's own comment mentions the
# element it is warning about, and a text match trips over that.
python3 - "$RES/mipmap-anydpi-v26" <<'GUARD'
import sys, glob, xml.etree.ElementTree as ET
bad = []
for f in glob.glob(sys.argv[1] + "/*.xml"):
    root = ET.parse(f).getroot()
    if root.iter("inset").__next__() if False else any(e.tag == "inset" for e in root.iter()):
        bad.append(f)
if bad:
    print("::error::adaptive icon layers are inset (%s) — the mark renders small inside a disc" % ", ".join(bad))
    sys.exit(1)
GUARD
DUPES=$(grep -rho 'name="ic_launcher_background"' "$RES/values/" | wc -l)
if [ "$DUPES" -ne 1 ]; then
  echo "::error::ic_launcher_background defined $DUPES times — expected exactly 1" >&2; exit 1
fi
echo "Icon overlay applied."
