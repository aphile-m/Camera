# Stops

**Learn photography, one stop at a time.**

**Live: <https://aphile-m.github.io/Camera/>**

A methodical coach for a beginner with a camera. It is not a camera app and not a
settings lookup table — it is a path from "I own a DSLR" to "I know why this frame
works", built around the idea that reading is the smaller half and the shooting is
the point.

Runs entirely in the browser, works offline, has no build step and needs no
account. Journal photographs can optionally be archived to your own SharePoint
or OneDrive — see [SHAREPOINT.md](SHAREPOINT.md).

---

## What is in it

### The path — 35 lessons across 7 levels
Ordered so that nothing depends on something you have not met yet.

| Level | | |
|---|---|---|
| 1 | **Seeing** | What makes a photograph before any setting is touched: subject, light, background, the frame, getting closer. |
| 2 | **Exposure** | The stop, aperture, shutter, ISO, equivalent exposures, metering and the histogram. |
| 3 | **Sharpness** | Focus modes, depth-of-field control and hyperfocal, handholding, diagnosing softness. |
| 4 | **Light** | Direction, hard versus soft, colour temperature, golden and blue hour, fill light. |
| 5 | **Composition** | Thirds and what to use instead, lines, depth and layers, simplification, the moment. |
| 6 | **Subjects** | Portraits, landscape, street, action and wildlife, night, time-lapse. |
| 7 | **After the shutter** | Culling, RAW and an edit order, running a project, self-critique. |

Each lesson has a core idea, an SVG diagram, the specific camera controls to set,
the common mistakes, and a quiz whose questions come back later.

### Field drills — one per lesson
Every lesson ends in something you have to go outside and shoot, with explicit
constraints, stated success criteria, and reflection questions to answer while
the shoot is still fresh. *Three steps closer. Find your own handheld limit.
Walk around the light. Set the trap and wait.*

### Spaced review
Quiz questions are scheduled with a trimmed SM-2: a correct answer pushes the
question further out (1 day → 4 days → longer), a wrong one brings it back
tomorrow. The ideas from level 2 are still there when level 6 needs them.

### The journal, and what it reveals
Log a frame with its settings, a rating, what worked, what you would do
differently, and which of ten faults it fell to. After about ten entries the
**Patterns** tab shows the truth: most photographers have two or three repeating
faults, not twenty different ones. It ranks yours, links back to the lesson that
addresses each, and offers the drill that fixes it. It also reads your settings
habits — *"2 of 3 frames at f/2.8 or wider; shooting wide open by default costs
you sharp frames."*

### Tools that show their working

- **Exposure advisor** — describe the light, the movement and the look you want.
  It solves the exposure the way a photographer reasons about it, then explains
  every decision it made and every trade it had to negotiate, and lists the
  equivalent exposures that would give the same brightness and a different
  photograph.
- **Exposure simulator** — a live canvas scene. Move aperture, shutter or ISO and
  watch background blur, motion smear, grain and clipping change in real time.
- **Depth of field** — a to-scale sharp-zone strip, the one-third/two-thirds
  split, hyperfocal distance, and a diffraction warning for your sensor.
- **Light timetable** — sunrise, golden hour, blue hour and dark for today where
  you are, computed on-device from the NOAA solar equations. No network, no API.
- **Long exposure & ND** — how much filter you need and what each length looks like.
- **Time-lapse planner** — interval, frames, shooting time, card space, batteries,
  and the 180° shutter rule.
- **Field reference** — ten cards to check one-handed while shooting.

---

## The SharePoint archive, briefly

Optional cloud storage for the photographs you log. The split is:

| | |
|---|---|
| **Device** (IndexedDB) | a 1400px preview — always there, works offline |
| **SharePoint** | the full-resolution original, archived |

Once a file has uploaded, the device stops carrying the original. Uploads are
queued, survive a reload, retry automatically when the network returns, and use
a resumable Graph upload session above 4MB so a big file over patchy mobile data
does not have to start again.

The Entra registration ships with the build, so turning it on is: **Settings →
SharePoint archive → Connect → Test connection → flip the switch.** Archiving
stays off until you do. **[Details in SHAREPOINT.md](SHAREPOINT.md).**

---

## Running it

Any static file server. There is no build step and no dependencies.

```bash
python3 -m http.server 8000
# or
npx http-server -p 8000
```

Then open `http://localhost:8000`.

### Publishing

`.github/workflows/pages.yml` deploys every push to the default branch.

Pages has to be switched on once by hand first — GitHub never lets a workflow's
own token create a Pages site, so this cannot be automated:

**Settings → Pages → Build and deployment → Source: _GitHub Actions_**

After that the workflow runs on its own and the site is at
<https://aphile-m.github.io/Camera/>.

It must be served over HTTP rather than opened as a `file://` URL, because it uses
ES modules. Deploy by copying the directory to any static host — GitHub Pages,
Netlify, a folder on a web server.

On a phone, use "Add to Home Screen". It then runs full-screen and works with no
signal at all, which is the point: the light does not wait while you find a bar.

---

## How it is built

```
index.html              the shell — one file, no framework
css/app.css             the design system: tokens, light and dark, components
js/app.js               router, shell, onboarding
js/core/photo.js        the photographic engine — pure functions, no DOM
js/core/store.js        state, localStorage, IndexedDB for journal photographs
js/core/sharepoint.js   optional Microsoft Graph sync — PKCE auth, resumable uploads
js/data/curriculum.js   35 lessons, 35 drills, 75 review cards
js/data/scenes.js       24 scene recipes and 8 time-lapse presets
js/data/reference.js    the field cards
js/ui/                  hyperscript, icons, 32 SVG diagrams, shared components
js/views/               one module per section
sw.js                   offline shell
.github/workflows/      GitHub Pages deployment
```

No dependencies, no bundler, no transpiler. ES modules loaded directly by the
browser. About 5,000 lines, of which the largest single part is the writing.

### The engine

`js/core/photo.js` is the interesting part, and it is deliberately free of DOM so
it can be reasoned about and tested on its own. It holds:

- the exposure equation (`EV₁₀₀ = log₂(N²/t)`) and the full third-stop ladders
- a solver that sets aperture from creative intent, shutter from subject movement
  and the handholding limit, then negotiates ISO — opening the aperture before
  pushing ISO, slowing the shutter before either, and distinguishing an ND filter
  that is *required* (the frame would blow out) from one that is *optional* (the
  exposure is right, but the look you asked for needs a longer shutter)
- depth of field, hyperfocal and diffraction for a given sensor and pixel pitch
- the reciprocal rule corrected for crop factor, resolution and stabilisation
- the 500 rule and the stricter NPF rule for star trailing
- NOAA/Meeus solar position, for sun altitude, azimuth and every twilight boundary

Checked against known cases: Sunny 16 resolves to f/8 · 1/500 · ISO 100 at EV 15;
a 35mm f/1.8 at two metres gives 23 cm of depth; Milky Way at 18mm resolves to
f/3.5 · 13s · ISO 6400.

### Design

An editorial darkroom: warm near-black or warm paper, a single amber accent,
hairline rules, a serif for the writing and tabular mono for every number. Light
and dark are equal citizens, both defined in tokens and both verified.

Everything passes WCAG AA contrast in both themes, every tap target is at least
30 px, no page scrolls horizontally at 390 px, and the whole interface respects
`prefers-reduced-motion`.

---

## Privacy

**By default nothing leaves the device.** There is no account, no analytics and
no network request after the first load. Location, if you grant it, is used only
to compute sun times locally and is stored in this browser. Journal photographs
go into IndexedDB on the device, downscaled to 1400 px. Settings has an export
for a JSON backup and a restore to match.

**The one exception is opt-in.** If you connect a Microsoft account under
Settings → SharePoint archive, the full-resolution original of each journal
photograph is uploaded to *your* SharePoint or OneDrive. Nothing else is ever
sent — not your progress, not the journal text, not your location. The app signs
you in directly with Microsoft using OAuth 2.0 + PKCE as a public client, so
there is no server in the middle and no secret in this repository. Turn the
switch off and the app goes back to being entirely local.

---

## A note on the advice

The advice is deliberately opinionated. Where photographers reasonably disagree,
it picks the answer that helps a beginner improve fastest and says why. It will
tell you that noise is cosmetic and blur is fatal, that Auto ISO is a professional
tool rather than cheating, that you are almost certainly standing too far back,
and that if somebody asks you to delete their photograph you should delete it.
