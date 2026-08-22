/* ==========================================================================
   sharepoint.js — optional cloud storage for journal photographs.

   ARCHITECTURE NOTE, because this is the part people get wrong:
   SharePoint is storage, not compute. A static site cannot have a "server" on
   SharePoint. What this does instead is the standard serverless-SPA pattern:
   the browser authenticates the user directly against Microsoft Entra ID using
   OAuth 2.0 Authorization Code + PKCE (a *public* client — there is no secret
   anywhere in this repository), then talks to Microsoft Graph itself.

   So the split is:
     device (IndexedDB) -> a 1400px thumbnail, always present, works offline
     SharePoint         -> the full-resolution original, archived

   Everything here is optional. With no account configured the app behaves
   exactly as it did before and nothing leaves the device.
   ========================================================================== */

import * as store from './store.js';

const GRAPH = 'https://graph.microsoft.com/v1.0';
const SCOPES = ['Files.ReadWrite', 'User.Read', 'offline_access'];
const TOKEN_KEY = 'stops.ms.token';
const PKCE_KEY  = 'stops.ms.pkce';

/* ---------- Configuration -------------------------------------------------- */
/*  Held in app state so it can be edited in Settings rather than hard-coded.
    `tenant` may be a tenant id, a domain, or 'organizations' / 'common'.      */

export const defaultConfig = () => ({
  /* The Entra registration this build ships against. A client ID and a tenant
     ID are public identifiers — both travel in the query string of every
     authorize request — so they are configuration, not credentials. Shipping
     them means a new device just taps Connect. Settings can override both. */
  clientId: 'e0ed735c-665a-46e6-a07b-82ada187ec7b',
  tenant: 'd9ab9fea-2b47-4817-9517-98fff790232b',
  folder: 'Apps/Stops Photography',
  driveId: '',          // blank = the signed-in user's own OneDrive
  enabled: false,       // archiving stays opt-in
});

export const config = () => ({ ...defaultConfig(), ...(store.get().sharepoint || {}) });
export const isConfigured = () => !!config().clientId;

/* The redirect URI must match the one registered in Entra exactly, including
   the trailing slash. Deriving it from the page means dev and production both
   work as long as both are registered. */
export function redirectUri() {
  const url = new URL(location.href);
  url.hash = ''; url.search = '';
  return url.href.replace(/index\.html$/, '');
}

const authority = () => `https://login.microsoftonline.com/${encodeURIComponent(config().tenant || 'organizations')}`;

/* ---------- PKCE ----------------------------------------------------------- */

const b64url = buf => btoa(String.fromCharCode(...new Uint8Array(buf)))
  .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

function randomString(bytes = 48) {
  return b64url(crypto.getRandomValues(new Uint8Array(bytes)));
}

async function challengeFor(verifier) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return b64url(digest);
}

/* ---------- Token handling -------------------------------------------------- */

const readToken = () => {
  try { return JSON.parse(localStorage.getItem(TOKEN_KEY) || 'null'); } catch { return null; }
};
const writeToken = t => localStorage.setItem(TOKEN_KEY, JSON.stringify(t));
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const isSignedIn = () => !!readToken()?.refresh_token;
export const account = () => readToken()?.account || null;

/* Returns a valid access token, refreshing silently when it has expired. */
async function accessToken() {
  const t = readToken();
  if (!t) throw new AuthError('Not signed in to Microsoft.');
  if (t.expires_at - 60_000 > Date.now()) return t.access_token;
  if (!t.refresh_token) { clearToken(); throw new AuthError('Session expired — sign in again.'); }

  const res = await fetch(`${authority()}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: config().clientId,
      grant_type: 'refresh_token',
      refresh_token: t.refresh_token,
      scope: SCOPES.join(' '),
    }),
  });
  if (!res.ok) {
    clearToken();
    throw new AuthError('Microsoft sign-in expired. Connect again in Settings.');
  }
  const data = await res.json();
  writeToken({
    ...t,
    access_token: data.access_token,
    refresh_token: data.refresh_token || t.refresh_token,
    expires_at: Date.now() + (data.expires_in ?? 3600) * 1000,
  });
  return data.access_token;
}

export class AuthError extends Error {}
export class GraphError extends Error {
  constructor(message, status) { super(message); this.status = status; }
}

/* ---------- Sign in / out ---------------------------------------------------- */

export async function signIn() {
  const cfg = config();
  if (!cfg.clientId) throw new AuthError('Add your application (client) ID in Settings first.');

  const verifier = randomString();
  const state = randomString(16);
  sessionStorage.setItem(PKCE_KEY, JSON.stringify({ verifier, state, from: location.hash }));

  const params = new URLSearchParams({
    client_id: cfg.clientId,
    response_type: 'code',
    redirect_uri: redirectUri(),
    response_mode: 'query',
    scope: SCOPES.join(' '),
    state,
    code_challenge: await challengeFor(verifier),
    code_challenge_method: 'S256',
    prompt: 'select_account',
  });
  location.assign(`${authority()}/oauth2/v2.0/authorize?${params}`);
}

/* Called once on boot. Returns true when it consumed an auth redirect. */
export async function completeSignIn() {
  const params = new URLSearchParams(location.search);
  const code = params.get('code');
  const error = params.get('error');
  if (!code && !error) return false;

  const saved = JSON.parse(sessionStorage.getItem(PKCE_KEY) || 'null');
  sessionStorage.removeItem(PKCE_KEY);
  /* Clean the query string out of the address bar either way. */
  const restore = () => history.replaceState(null, '', redirectUri() + (saved?.from || '#/settings'));

  if (error) { restore(); throw new AuthError(params.get('error_description') || error); }
  if (!saved || saved.state !== params.get('state')) { restore(); throw new AuthError('Sign-in state did not match — start again.'); }

  const res = await fetch(`${authority()}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: config().clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri(),
      code_verifier: saved.verifier,
      scope: SCOPES.join(' '),
    }),
  });
  const data = await res.json();
  if (!res.ok) { restore(); throw new AuthError(data.error_description || 'Could not complete sign-in.'); }

  writeToken({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + (data.expires_in ?? 3600) * 1000,
  });

  /* Record who signed in, for the Settings screen. */
  try {
    const me = await graph('/me');
    const t = readToken();
    writeToken({ ...t, account: { name: me.displayName, mail: me.mail || me.userPrincipalName } });
  } catch { /* the token still works even if /me is blocked */ }

  restore();
  return true;
}

export function signOut() {
  clearToken();
  store.update(s => { s.sharepoint = { ...config(), enabled: false }; });
}

/* ---------- Graph ------------------------------------------------------------ */

async function graph(path, { method = 'GET', body, headers = {}, raw = false } = {}) {
  const token = await accessToken();
  const res = await fetch(path.startsWith('http') ? path : GRAPH + path, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body && !(body instanceof Blob) ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body instanceof Blob ? body : body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let detail = `${res.status}`;
    try { detail = (await res.json())?.error?.message || detail; } catch {}
    if (res.status === 401) { clearToken(); throw new AuthError('Microsoft session expired. Connect again in Settings.'); }
    throw new GraphError(detail, res.status);
  }
  if (raw) return res;
  return res.status === 204 ? null : res.json();
}

/* The drive to write into: a named library, or the user's own OneDrive. */
const driveRoot = () => {
  const { driveId } = config();
  return driveId ? `/drives/${driveId}` : '/me/drive';
};

const encodePath = p => p.split('/').filter(Boolean).map(encodeURIComponent).join('/');

/* ---------- Uploading -------------------------------------------------------- */
/*  Graph takes a simple PUT up to 4MB. A photograph off a DSLR is bigger than
    that, so anything larger goes through a resumable upload session in 5MB
    slices — which is also what makes a flaky mobile connection survivable.    */

const SIMPLE_LIMIT = 4 * 1024 * 1024;
const CHUNK = 5 * 327_680;                 // 1.6MB — must be a multiple of 320KiB

export async function uploadImage(blob, filename, onProgress) {
  const path = `${config().folder}/${filename}`;
  if (blob.size <= SIMPLE_LIMIT) {
    onProgress?.(0);
    const item = await graph(`${driveRoot()}/root:/${encodePath(path)}:/content`, {
      method: 'PUT', body: blob, headers: { 'Content-Type': blob.type || 'application/octet-stream' },
    });
    onProgress?.(1);
    return { id: item.id, driveId: item.parentReference?.driveId, webUrl: item.webUrl, size: item.size, name: item.name };
  }

  const session = await graph(`${driveRoot()}/root:/${encodePath(path)}:/createUploadSession`, {
    method: 'POST',
    body: { item: { '@microsoft.graph.conflictBehavior': 'rename' } },
  });

  let start = 0, item = null;
  while (start < blob.size) {
    const end = Math.min(start + CHUNK, blob.size);
    const res = await fetch(session.uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Length': String(end - start),
        'Content-Range': `bytes ${start}-${end - 1}/${blob.size}`,
      },
      body: blob.slice(start, end),
    });
    if (!res.ok) throw new GraphError(`Upload failed at ${Math.round(start / 1024)}KB (${res.status})`, res.status);
    if (res.status === 200 || res.status === 201) item = await res.json();
    start = end;
    onProgress?.(start / blob.size);
  }
  return { id: item.id, driveId: item.parentReference?.driveId, webUrl: item.webUrl, size: item.size, name: item.name };
}

export async function downloadImage(ref) {
  const base = ref.driveId ? `/drives/${ref.driveId}` : driveRoot();
  const res = await graph(`${base}/items/${ref.id}/content`, { raw: true });
  return res.blob();
}

export async function deleteImage(ref) {
  const base = ref.driveId ? `/drives/${ref.driveId}` : driveRoot();
  try { await graph(`${base}/items/${ref.id}`, { method: 'DELETE' }); }
  catch (e) { if (e.status !== 404) throw e; }
}

export async function listImages() {
  const res = await graph(`${driveRoot()}/root:/${encodePath(config().folder)}:/children?$top=200&$select=id,name,size,webUrl,lastModifiedDateTime,parentReference`);
  return (res.value || []).map(i => ({
    id: i.id, name: i.name, size: i.size, webUrl: i.webUrl,
    driveId: i.parentReference?.driveId, at: i.lastModifiedDateTime,
  }));
}

/* Confirms the whole chain works: token, drive, folder, write permission. */
export async function testConnection() {
  const me = await graph('/me?$select=displayName,mail,userPrincipalName');
  const drive = await graph(`${driveRoot()}?$select=id,name,driveType,owner,quota`);
  let folder = null;
  try {
    folder = await graph(`${driveRoot()}/root:/${encodePath(config().folder)}`);
  } catch (e) {
    if (e.status !== 404) throw e;
    /* Not there yet — create it, one level at a time. */
    let parent = 'root';
    for (const segment of config().folder.split('/').filter(Boolean)) {
      const created = await graph(`${driveRoot()}/${parent === 'root' ? 'root' : `items/${parent}`}/children`, {
        method: 'POST',
        body: { name: segment, folder: {}, '@microsoft.graph.conflictBehavior': 'replace' },
      });
      parent = created.id; folder = created;
    }
  }
  return {
    user: me.displayName, mail: me.mail || me.userPrincipalName,
    drive: drive.name, driveType: drive.driveType, driveId: drive.id,
    folderUrl: folder?.webUrl,
    quotaFreeGB: drive.quota ? (drive.quota.remaining / 1e9).toFixed(1) : null,
  };
}

/* ---------- JSON documents, with optimistic concurrency ----------------------- */
/*  Used by sync.js. Read returns the ETag; write sends it back as If-Match, and
    a 412 means another device got there first — which the caller handles by
    re-reading and re-merging, never by forcing.                               */

const jsonPath = name => `${driveRoot()}/root:/${encodePath(`${config().folder}/${name}.json`)}`;

export async function readJson(name) {
  const token = await accessToken();
  const res = await fetch(`${GRAPH}${jsonPath(name)}:/content`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status === 404) return { data: null, etag: null };
  if (res.status === 401) { clearToken(); throw new AuthError('Microsoft session expired. Connect again in Settings.'); }
  if (!res.ok) throw new GraphError(`Could not read ${name}.json (${res.status})`, res.status);

  const text = await res.text();
  let data;
  try { data = text ? JSON.parse(text) : null; }
  catch { /* Better to stop than overwrite something we cannot understand. */
    throw new GraphError(`${name}.json is not valid JSON — refusing to overwrite it.`, 422);
  }

  /* ETag is not a CORS-safelisted response header, so a cross-origin read only
     sees it when the server sends Access-Control-Expose-Headers. Graph does,
     but relying on that silently disables concurrency control the day it stops
     — and a lost write is invisible. Fall back to the item metadata, where the
     same value travels in the body and CORS cannot hide it. */
  let etag = res.headers.get('etag');
  if (!etag) {
    const meta = await graph(`${jsonPath(name)}?$select=eTag,cTag`).catch(() => null);
    etag = meta?.eTag || meta?.cTag || null;
  }
  return { data, etag };
}

/* True when the last write went out without an ETag — surfaced in Settings,
   because syncing without concurrency control is worth knowing about. */
export let lastWriteUnguarded = false;

export async function writeJson(name, data, etag = null) {
  lastWriteUnguarded = !etag;
  const token = await accessToken();
  const res = await fetch(`${GRAPH}${jsonPath(name)}:/content`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(etag ? { 'If-Match': etag } : {}),
    },
    body: JSON.stringify(data),
  });
  if (res.status === 412) throw new Error('CONFLICT');
  if (res.status === 401) { clearToken(); throw new AuthError('Microsoft session expired. Connect again in Settings.'); }
  if (!res.ok) throw new GraphError(`Could not write ${name}.json (${res.status})`, res.status);
  return res.json().catch(() => null);
}

/* ---------- Thumbnails --------------------------------------------------------- */
/*  A device that did not take the photograph has no local copy, and the stored
    original is several megabytes. Graph renders thumbnails server-side, so a
    second device pulls a preview rather than the whole frame.                   */

export async function thumbnail(ref, size = 'large') {
  const base = ref.driveId ? `/drives/${ref.driveId}` : driveRoot();
  const meta = await graph(`${base}/items/${ref.id}/thumbnails?$select=${size}`);
  const url = meta?.value?.[0]?.[size]?.url;
  if (!url) return null;
  /* The thumbnail URL is pre-authorised and short-lived — no bearer token. */
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.blob();
}

/* ---------- The sync queue ---------------------------------------------------- */
/*  Uploads are queued rather than awaited, so attaching a photograph never
    blocks saving a journal entry, and a shoot logged in a field with no signal
    still uploads when you get home.                                            */

let flushing = false;

export function queueUpload(entryId, imageId, filename) {
  store.update(s => {
    s.uploadQueue = [...(s.uploadQueue || []).filter(q => q.imageId !== imageId), { entryId, imageId, filename, tries: 0 }];
  });
  flush();
}

export async function flush({ onChange } = {}) {
  if (flushing || !isSignedIn() || !config().enabled || !navigator.onLine) return;
  flushing = true;
  try {
    while ((store.get().uploadQueue || []).length) {
      const job = store.get().uploadQueue[0];
      try {
        const blob = await store.getImage(job.imageId);
        if (!blob) { dequeue(job.imageId); continue; }
        const ref = await uploadImage(blob, job.filename);
        store.update(s => {
          const i = s.journal.findIndex(e => e.id === job.entryId);
          if (i >= 0) s.journal[i] = { ...s.journal[i], remote: ref, originalId: null };
        });
        /* The original has a home now, so stop carrying it on the device. */
        await store.deleteImage(job.imageId).catch(() => {});
        dequeue(job.imageId);
        onChange?.({ done: true, imageId: job.imageId });
        announce({ done: true, imageId: job.imageId });
      } catch (e) {
        if (e instanceof AuthError) throw e;
        store.update(s => {
          const q = s.uploadQueue || [];
          if (q[0]) q[0] = { ...q[0], tries: (q[0].tries || 0) + 1, error: e.message };
          /* Three failures and it goes to the back, so one bad file cannot
             block everything behind it. */
          if (q[0]?.tries >= 3) s.uploadQueue = [...q.slice(1), q[0]];
        });
        onChange?.({ error: e.message });
        announce({ error: e.message });
        break;
      }
    }
  } finally {
    flushing = false;
  }
}

const dequeue = imageId => store.update(s => { s.uploadQueue = (s.uploadQueue || []).filter(q => q.imageId !== imageId); });

/* Uploads happen in the background, so the views that show sync state need a
   nudge when one lands — nothing else re-renders on its own. */
const announce = detail => {
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('stops:sync', { detail }));
};

export const pendingCount = () => (store.get().uploadQueue || []).length;

/* Retry whenever the network comes back. */
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => flush());
}
