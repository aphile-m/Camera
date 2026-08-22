# Stops for Android

A [Trusted Web Activity](https://developer.chrome.com/docs/android/trusted-web-activity)
wrapping the deployed web app at <https://aphile-m.github.io/Camera/>.

## Why a TWA and not a native app

The web app is ~5,000 lines of tested JavaScript. A native rewrite would throw
all of it away and leave you maintaining two apps that drift apart. A TWA runs
the *same* app inside Chrome's engine, with no browser UI, and gets:

- one codebase — pushing to the site updates the Android app, no release needed
- the same storage. The service worker, IndexedDB and your journal are shared
  with the browser version, because it is literally the same origin
- the Microsoft sign-in works unchanged; the OAuth redirect returns to the same
  verified origin
- a 133KB APK, because the app itself is already on the device's browser

The trade is that it needs Chrome (or any Custom Tabs provider) installed, which
in practice every Android device has. If the check fails it falls back to a
Custom Tab rather than breaking.

## Install it now

`app/build/outputs/apk/debug/app-debug.apk` is debug-signed and installs
straight away:

```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

Or copy the APK to the phone and open it (you will need "install unknown apps"
for your file manager). It installs as `io.github.aphilem.stops.debug`, so it
can sit alongside a release build.

## Building

```bash
cd android
./gradlew assembleDebug          # debug-signed APK, installable
./gradlew assembleRelease        # unsigned release APK
./gradlew bundleRelease          # AAB for the Play Console
```

Needs JDK 17+ and an Android SDK with platform 35. The GitHub Actions workflow
`.github/workflows/android.yml` does all three on demand — **Actions → Android →
Run workflow** — and attaches the results as a downloadable artifact, so you
never need Android Studio.

## Release signing

Generate a key. Keep it safe: lose it and you can never update the app on Play.

```bash
keytool -genkeypair -v -keystore stops-release.keystore \
        -alias stops -keyalg RSA -keysize 2048 -validity 10000
```

**Never commit it.** `android/.gitignore` already excludes `*.keystore` and
`keystore.properties`.

For local signed builds, create `android/keystore.properties`:

```properties
storeFile=/absolute/path/to/stops-release.keystore
storePassword=…
keyAlias=stops
keyPassword=…
```

For CI, add four repository secrets (**Settings → Secrets and variables →
Actions**):

| Secret | Value |
|---|---|
| `KEYSTORE_BASE64` | `base64 -w0 stops-release.keystore` |
| `KEYSTORE_PASSWORD` | the store password |
| `KEY_ALIAS` | `stops` |
| `KEY_PASSWORD` | the key password |

The workflow builds unsigned without them and signed with them.

## Digital Asset Links — the one thing that needs the domain root

Chrome only drops the URL bar if it can verify that the site vouches for the
app. It checks:

```
https://aphile-m.github.io/.well-known/assetlinks.json
```

**At the origin root — not `/Camera/.well-known/`.** This is the awkward part:
`aphile-m/Camera` is a GitHub Pages *project* site, so it can only publish under
`/Camera/`. Serving a file at the domain root needs a repository named
`aphile-m.github.io` (a GitHub Pages *user* site), whose contents are served
from `https://aphile-m.github.io/`.

Generate the statement from your keystore:

```bash
./gen-assetlinks.sh ~/stops-release.keystore stops
```

and publish the output at `.well-known/assetlinks.json` in that repository.

Verify afterwards:

```bash
curl https://aphile-m.github.io/.well-known/assetlinks.json
adb shell pm verify-app-links --re-verify io.github.aphilem.stops
adb shell pm get-app-links io.github.aphilem.stops     # want: verified
```

**Without this the app still works** — it just shows a thin URL bar at the top,
so it reads as a browser rather than an app. Everything else is identical.

If you publish through Google Play with Play App Signing, use the SHA-256 that
the Play Console shows under **Setup → App integrity**, not your upload key's.

## The icon

A camera iris: six blades leaving a hexagonal opening, inside a lens barrel,
in the same amber (`#E6B25A`) on darkroom black (`#100F0D`) as the web app.

- `res/drawable/ic_launcher_foreground.xml` — vector, sits inside the 66dp
  adaptive safe zone so no launcher shape crops it
- `res/drawable/ic_launcher_monochrome.xml` — the Android 13+ themed-icon layer
- `res/mipmap-*/ic_launcher.png` — flat fallbacks for API < 26
- `play-store-icon-512.png`, `play-feature-graphic-1024x500.png` — listing assets

Verified rendering under circle, squircle, rounded-square and square masks at
both 104px and 48px.

## Publishing to Play

1. Build an AAB: `./gradlew bundleRelease`
2. Play Console → create app → upload `app/build/outputs/bundle/release/app-release.aab`
3. Use `play-store-icon-512.png` and `play-feature-graphic-1024x500.png`
4. Take the SHA-256 from **App integrity** and put it in `assetlinks.json`
5. A TWA needs a privacy policy URL and, because the app is essentially a
   browser view of your own site, expect a review question about whether you
   own the domain. You do.

Bump `versionCode` in `app/build.gradle` for every upload.
