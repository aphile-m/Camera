# Stops for Android

A Capacitor shell around the live web app — the same approach as the Trainer
App, and for the same reasons.

## Why Capacitor and not a TWA

A Trusted Web Activity would have been lighter, but Chrome only drops the URL
bar if it can verify a Digital Asset Links file at the **origin root**:

```
https://aphile-m.github.io/.well-known/assetlinks.json
```

`aphile-m/Camera` is a GitHub Pages *project* site, so it can only publish
under `/Camera/`. Serving the origin root would need a separate
`aphile-m.github.io` repository. Capacitor sidesteps this entirely: it is a
real native app with its own WebView, so there is no origin to verify and never
a URL bar.

`server.url` points at the deployed site, so the shell loads the live app.
Pushing to the site updates the phone app — no rebuild, no OTA pipeline.

## Getting the APK

**From CI (no toolchain needed):** Actions → **Android APK** → *Run workflow*.
It publishes a GitHub Release, so the latest build is always at:

```
https://github.com/aphile-m/Camera/releases/latest/download/Stops.apk
```

**Locally:**

```bash
npm install
npx cap add android
./apply-android-overlay.sh
npx cap sync android
cd android && ./gradlew assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`.

`android/` is generated and gitignored — never edit it directly, because the
next `cap add` overwrites it. Everything that customises the shell lives in
`android-res/` and `apply-android-overlay.sh`.

## Signing

`android-signing/debug.keystore` is committed on purpose. It is a **debug** key
with the standard password `android`; it protects nothing. It exists so every
build carries the same signature and installs over the previous one. Without a
fixed key, the Gradle plugin generates a fresh debug key per machine and
updates fail with *"package conflicts with an existing package"*.

The workflow verifies the built APK's certificate against that keystore and
fails the build on a mismatch, so a bad signature cannot reach a release.

For the Play Store you would need a real release key instead — not needed for
sideloading.

## The icon

A camera iris: six blades leaving a hexagonal opening inside a lens barrel, in
the same amber (`#E6B25A`) on darkroom black (`#100F0D`) as the web app.

| File | Role |
|---|---|
| `android-res/drawable/ic_launcher_foreground.xml` | vector, sized to 31.2dp of the 33dp adaptive safe zone |
| `android-res/drawable/ic_launcher_monochrome.xml` | Android 13+ themed-icon layer |
| `android-res/mipmap-anydpi-v26/ic_launcher*.xml` | adaptive icon, layers referenced directly |
| `android-res/mipmap-*/ic_launcher.png` | flat fallbacks for API < 26 |
| `android-assets/` | 1024px source, splash, Play listing assets |

`apply-android-overlay.sh` guards the two failure modes that are easy to
reintroduce: an `inset` wrapper around the adaptive layers (which renders the
mark small inside a big disc), and `ic_launcher_background` being defined
twice once Capacitor's template and ours are both present.

Verified under circle, squircle, rounded-square and square launcher masks at
104px and 48px.

## Microsoft sign-in

`allowNavigation` in `capacitor.config.json` whitelists the Entra and Graph
hosts so the OAuth round trip completes inside the shell:

```
login.microsoftonline.com, login.live.com, login.microsoft.com,
graph.microsoft.com, *.sharepoint.com, *.up.1drv.com
```

The redirect URI is unchanged — `https://aphile-m.github.io/Camera/` — because
the WebView loads that same origin, so the existing Entra registration works
with no new entry.

## One thing to know about your data

The shell's WebView has its **own storage**, separate from Chrome on the same
phone. Progress, journal entries and settings in the app are therefore separate
from the browser version — they are the same code on the same origin, but two
different stores.

If you want one journal across both, either use the app only, or connect the
SharePoint archive on each and use **Settings → Export a backup / Restore** to
move progress across. This is worth knowing before you build up months of
entries in one and expect them in the other.
