# Archiving photographs to SharePoint

This is optional. Without it Stops works exactly as before and nothing leaves
the device. With it on, the **full-resolution original** of every journal
photograph is archived to your SharePoint or OneDrive for Business, while a
1400px preview stays on the device so the journal still works with no signal.

---

## How it actually works

There is no server, and there is no secret in this repository.

```
   Browser (GitHub Pages, static)
        │
        │  1. OAuth 2.0 Authorization Code + PKCE
        │     — public client, no secret
        ▼
   Microsoft Entra ID  ──────────►  access token (1h) + refresh token
        │
        │  2. HTTPS with a Bearer token
        ▼
   Microsoft Graph  ──────────────►  your SharePoint / OneDrive document library
```

A common misconception is worth stating plainly: **SharePoint is storage, not
compute.** You cannot host a backend "on SharePoint". What you can do — and what
this does — is let the browser authenticate the user directly and call Microsoft
Graph, which is the standard architecture for a single-page app that has no
server of its own.

Consequences worth knowing:

- Every user signs in as themselves. Files land in *their* drive with *their*
  permissions. The app cannot see anything the user cannot already see.
- The client ID and tenant ID are committed to this repository. Both are public
  identifiers that travel in the query string of every authorize request — they
  are configuration, not credentials, and grant nobody anything without a
  successful interactive sign-in. A *client secret* would be a different matter
  entirely, which is exactly why a public client does not use one.
- Because there is no server, tokens live in the browser. The refresh token is
  held in `localStorage`. Microsoft rotates SPA refresh tokens on every use and
  caps them at 24 hours, and the page ships a strict Content-Security-Policy
  that forbids third-party scripts — but this is still weaker than a
  confidential client with a server-side session, and you should know that.
- Uploads larger than 4MB use a resumable Graph upload session in 1.6MB slices,
  so a big RAW-sized JPEG over patchy mobile data survives.

---

## Turning it on

The build ships with an Entra registration already configured, so on any device:

1. **Settings** → **SharePoint archive** → **Connect**
2. Sign in with your Microsoft account
3. **Test connection** — this creates the folder and confirms the whole chain:
   token, drive, folder, write permission
4. Turn on **Archive photographs to SharePoint**

That is the whole thing. Archiving stays off until you flip that switch, and the
settings are per-browser, so each device connects once.

---

## Using your own app registration instead

Only needed if you are pointing this at a different tenant. Settings →
SharePoint archive → **Use a different app registration** holds the fields.

### 1. Register the application

1. Go to <https://entra.microsoft.com> → **Applications** → **App registrations**
   → **New registration**.
2. **Name**: `Stops Photography`
3. **Supported account types**: *Accounts in this organizational directory only*
   is the right choice for a work account. Pick the multi-tenant option only if
   people outside Resgro Capital will use it.
4. **Redirect URI**: choose platform **Single-page application (SPA)** and enter
   exactly:

   ```
   https://aphile-m.github.io/Camera/
   ```

   The trailing slash matters. Add `http://localhost:8000/` as a second SPA
   redirect URI if you want to develop locally.

   > It must be registered as **SPA**, not "Web". A Web platform registration
   > expects a client secret and will reject the PKCE flow with
   > `AADSTS9002326`.

5. **Register**.

### 2. Add the permission

1. In the new registration → **API permissions** → **Add a permission** →
   **Microsoft Graph** → **Delegated permissions**.
2. Add **`Files.ReadWrite`** and **`User.Read`**. (`offline_access` is included
   automatically and is what keeps you signed in.)
3. If your tenant requires it, click **Grant admin consent**. Without it you
   will be able to sign in but Graph will return `accessDenied` on upload.

To write into a **SharePoint team site** library rather than your own OneDrive,
use `Files.ReadWrite.All` or `Sites.ReadWrite.All` instead, and fill in the
Drive ID field in Settings.

### 3. Point the app at it

In **Settings** → **SharePoint archive** → **Use a different app registration**,
paste the **Application (client) ID** and **Directory (tenant) ID** from the
registration's Overview page. Then connect as above.

---

## Where the files go

By default `Apps/Stops Photography/` in your OneDrive for Business, named:

```
2026-08-22-17-42-10-backlit-portrait-back-lane.jpg
```

Change the folder in Settings. To target a document library on a team site
instead, put its Graph **Drive ID** in the Drive ID field — find it with:

```
GET https://graph.microsoft.com/v1.0/sites/{hostname}:/sites/{site-name}:/drives
```

---

## If something goes wrong

| What you see | What it means |
|---|---|
| `AADSTS50011` redirect URI mismatch | The URI in Entra does not match the app's exactly. Settings shows the exact string to register. |
| `AADSTS9002326` cross-origin token redemption | The platform is registered as **Web**. Delete it and re-add under **Single-page application**. |
| `accessDenied` on upload | `Files.ReadWrite` is missing, or admin consent has not been granted. |
| Sign-in works, uploads queue but never send | Check the **Archive photographs** switch is on and you are online. Settings shows the pending count and an **Upload now** button. |
| `itemNotFound` on the folder | Run **Test connection** — it creates the folder. |

A queued upload survives a reload and retries automatically when the network
returns. After three consecutive failures a file moves to the back of the queue
so one bad file cannot block the rest.

---

## A note on using a work account

`Aphile@Resgrocapital.com` is a corporate tenant. Personal photographs in
company-controlled storage are subject to your organisation's retention,
eDiscovery and offboarding policies — if you leave, the files go with the
account. For a personal photography journal, a personal Microsoft account or a
dedicated tenant is the cleaner choice. It works either way; this is a policy
decision rather than a technical one.
