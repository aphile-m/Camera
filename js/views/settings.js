/* ==========================================================================
   settings.js — gear, units, theme, and getting your data out.
   ========================================================================== */

import { h, toast, relative } from '../ui/dom.js';
import { icon } from '../ui/icons.js';
import { Section, Card, Note, KV, Seg, Chips, Slider, Switch, Empty } from '../ui/parts.js';
import * as store from '../core/store.js';
import * as P from '../core/photo.js';
import * as sp from '../core/sharepoint.js';
import * as sync from '../core/sync.js';
import { captureLocation } from '../core/geo.js';
import * as nav from '../core/nav.js';
import { LESSONS, DRILLS } from '../data/curriculum.js';

export function SettingsView(state, rerender) {
  const gear = state.gear;

  const textField = (label, value, onInput, opts = {}) => {
    const input = h('input', { type: opts.type || 'text', placeholder: opts.placeholder || '', onInput: e => onInput(e.target.value) });
    input.value = value ?? '';
    return h('label.field', {}, h('span.lab', {}, label), input);
  };

  return h('div.stack-lg', { class: 'enter' },
    h('div', {},
      h('h1', { style: { marginTop: '6px' } }, 'Settings'),
      h('p', { class: 'lede', style: { marginTop: '6px' } },
        'Everything here stays on this device. Nothing is uploaded, and there is no account.')),

    Section('You', Card(h('div.stack', {},
      textField('Name', state.profile.name, v => store.update(s => { s.profile.name = v; }), { placeholder: 'Optional' }),
      h('div', {},
        h('span.eyebrow', { style: { display: 'block', marginBottom: '8px' } }, 'Theme'),
        Seg([{ id: 'auto', label: 'Auto' }, { id: 'light', label: 'Light' }, { id: 'dark', label: 'Dark' }],
          state.profile.theme, v => { store.update(s => { s.profile.theme = v; }); applyTheme(v); })),
      h('div', {},
        h('span.eyebrow', { style: { display: 'block', marginBottom: '8px' } }, 'Distances'),
        Seg([{ id: 'metric', label: 'Metres' }, { id: 'imperial', label: 'Feet' }],
          state.profile.units, v => { store.update(s => { s.profile.units = v; }); rerender(); }))))),

    Section('Camera', Card(h('div.stack', {},
      textField('Body', gear.body, v => store.update(s => { s.gear.body = v; })),
      h('div', {},
        h('span.eyebrow', { style: { display: 'block', marginBottom: '8px' } }, 'Sensor'),
        Chips(Object.entries(P.SENSORS).map(([id, v]) => ({ id, label: v.label })), gear.sensor,
          v => { store.update(s => { s.gear.sensor = v; }); rerender(); }),
        h('p', { class: 'tiny', style: { marginTop: '8px' } },
          `Crop factor ${P.SENSORS[gear.sensor]?.crop}× — this affects depth of field, the handheld limit and the star-trail limit.`)),
      Slider({ label: 'Highest ISO you are happy to print', value: P.ISOS.indexOf(P.nearestISO(gear.isoCeiling)),
        min: P.ISOS.indexOf(400), max: P.ISOS.indexOf(25600),
        format: i => P.fmtISO(P.ISOS[i]),
        onInput: i => store.update(s => { s.gear.isoCeiling = P.ISOS[i]; }) }),
      h('p', { class: 'tiny' },
        'The advisor will trade aperture and shutter speed to stay under this before it pushes ISO past it. Shoot lesson 2-4’s drill to find your own honest ceiling.'),
      Slider({ label: 'How steady are your hands', value: (state.profile.steadiness || 0) + 2, min: 0, max: 4,
        format: i => ['Shaky (−2 stops)', 'Below average', 'Average', 'Steady', 'Very steady (+2 stops)'][i],
        onInput: i => store.update(s => { s.profile.steadiness = i - 2; }) })))),

    Section('Lenses', h('div', {},
      h('div.card.flush', {}, ...gear.lenses.map((l, i) =>
        h('div', { style: { padding: '14px 16px', borderBottom: i < gear.lenses.length - 1 ? '1px solid var(--line)' : 'none', display: 'flex', gap: '12px', alignItems: 'center' } },
          h('div.grow', {},
            h('div', { style: { fontWeight: '600', fontSize: '14.5px' } }, l.label),
            h('div.tiny.num', { style: { marginTop: '2px' } },
              `${l.min === l.max ? `${l.min}mm` : `${l.min}–${l.max}mm`} · ${P.fmtAperture(l.wideAperture)}${l.wideAperture !== l.longAperture ? `–${P.fmtAperture(l.longAperture)}` : ''}${l.stabilised ? ' · stabilised' : ''}`)),
          h('button.btn.btn-sm.btn-ghost', {
            onClick: () => { store.update(s => { s.gear.lenses = s.gear.lenses.filter(x => x.id !== l.id); }); rerender(); },
          }, icon('trash', 15))))),
      h('button.btn.btn-block', { style: { marginTop: '10px' }, onClick: () => addLens(rerender) },
        icon('plus', 16), 'Add a lens'))),

    Section('Location', Card(
      state.location
        ? h('div', {},
            h('div.small', {}, `${state.location.label || 'Saved'} · ${state.location.lat.toFixed(3)}, ${state.location.lon.toFixed(3)}`),
            h('div.row', { style: { gap: '8px', marginTop: '12px' } },
              h('button.btn.btn-sm', { onClick: () => { store.update(s => { s.location = null; }); rerender(); } }, 'Clear'),
              h('a.btn.btn-sm', { href: '#/tools/light' }, 'Open timetable')))
        : h('div', {},
            h('p', { class: 'small', style: { marginBottom: '12px' } },
              'Used only to work out sunrise, golden hour and blue hour. Calculated on this device; nothing is sent anywhere.'),
            h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' } },
              textField('Latitude', '', v => { state.__lat = Number(v); }, { type: 'number', placeholder: '-26.2' }),
              textField('Longitude', '', v => { state.__lon = Number(v); }, { type: 'number', placeholder: '28.0' })),
            h('div.row', { style: { gap: '8px', marginTop: '12px' } },
              h('button.btn.btn-sm.btn-primary', { onClick: () => {
                if (isNaN(state.__lat) || isNaN(state.__lon)) return toast('Enter both numbers');
                store.update(s => { s.location = { lat: state.__lat, lon: state.__lon, label: 'Manual' }; });
                toast('Saved'); rerender();
              } }, 'Save'),
              h('button.btn.btn-sm', { onClick: async e => {
                const btn = e.currentTarget; btn.disabled = true;
                try { await captureLocation(); rerender(); }
                catch (err) { btn.disabled = false; toast(err.message); }
              } }, icon('compass', 15), 'Locate me'))))),

    SharePointSection(state, rerender),

    Section('Your data', Card(h('div.stack', {},
      KV([
        ['Lessons read', `${LESSONS.filter(l => state.lessons[l.id]?.read).length} of ${LESSONS.length}`],
        ['Drills shot', `${Object.values(state.drills).filter(d => d.completed).length} of ${DRILLS.length}`],
        ['Journal entries', String(state.journal.length)],
        ['Review cards', String(Object.keys(state.reviews).length)],
      ]),
      h('div.row', { style: { gap: '8px' } },
        h('button.btn.btn-sm', { style: { flex: '1' }, onClick: () => {
          const blob = new Blob([store.exportJSON()], { type: 'application/json' });
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = `stops-backup-${new Date().toISOString().slice(0, 10)}.json`;
          a.click();
          toast('Backup downloaded');
        } }, 'Export a backup'),
        h('button.btn.btn-sm', { style: { flex: '1' }, onClick: () => {
          const input = h('input', { type: 'file', accept: 'application/json' });
          input.onchange = async () => {
            const f = input.files?.[0]; if (!f) return;
            try { store.importJSON(await f.text()); toast('Restored'); rerender(); }
            catch { toast('That file could not be read'); }
          };
          input.click();
        } }, 'Restore')),
      h('button.btn.btn-sm.btn-block', { onClick: () => {
        if (confirm('Erase all progress, drills and journal entries? This cannot be undone.')) {
          /* Every entry behind us now points at something that was erased. */
          store.reset(); toast('Everything erased'); nav.go('#/', { replace: true });
        }
      } }, 'Erase everything')))),

    Section('About', Card(
      h('p', { class: 'small' },
        'Stops is a photography coach, not a camera app. It works offline, stores nothing on a server, and has no account. Everything it calculates — exposure, depth of field, sun position — is worked out on this device from first principles.'),
      h('p', { class: 'small', style: { marginTop: '10px' } },
        'The advice is deliberately opinionated. Where photographers disagree, it picks the answer that helps a beginner improve fastest and says why.'))));
}

/* ---------- SharePoint --------------------------------------------------- */

function SharePointSection(state, rerender) {
  const cfg = sp.config();
  const signedIn = sp.isSignedIn();
  const who = sp.account();
  const pending = sp.pendingCount();
  const status = h('div', {});

  const cfgField = (label, key, placeholder, hint) => {
    const input = h('input', {
      type: 'text', placeholder,
      onInput: e => store.update(s => { s.sharepoint = { ...sp.config(), [key]: e.target.value.trim() }; }),
    });
    input.value = cfg[key] ?? '';
    return h('label.field', {}, h('span.lab', {}, label), input,
      hint ? h('p', { class: 'tiny', style: { marginTop: '6px' } }, hint) : null);
  };

  return Section('SharePoint archive', Card(h('div.stack', {},
    h('p', { class: 'small' },
      'Optional. With this on, the full-resolution original of every journal photograph is archived to your SharePoint or OneDrive, while a preview stays on this device so the journal still works with no signal. Leave it off and nothing ever leaves the device.'),

    h('div.stack', {},
      h('div.row-between', {},
        h('div', {},
          h('div', { style: { fontWeight: '600', fontSize: '14.5px' } },
            signedIn ? (who?.name || 'Connected') : 'Not connected'),
          h('div.tiny', { style: { marginTop: '2px' } },
            signedIn ? (who?.mail || 'Signed in to Microsoft') : 'Sign in to start archiving')),
        signedIn
          ? h('button.btn.btn-sm', { onClick: () => { sp.signOut(); rerender(); } }, 'Sign out')
          : h('button.btn.btn-sm.btn-primary', { onClick: () => sp.signIn().catch(e => toast(e.message)) }, 'Connect')),

      signedIn ? Switch('Archive photographs to SharePoint', cfg.enabled, v => {
        store.update(s => { s.sharepoint = { ...sp.config(), enabled: v }; });
        if (v) sp.flush();
        rerender();
      }) : null,

      pending ? Note('warn', `${pending} photograph${pending > 1 ? 's' : ''} waiting to upload. They go up automatically when you are online.`) : null,

      signedIn ? h('div.row', { style: { gap: '8px' } },
        h('button.btn.btn-sm', { style: { flex: '1' }, onClick: async e => {
          const btn = e.currentTarget; btn.disabled = true; btn.textContent = 'Testing…';
          try {
            const r = await sp.testConnection();
            status.replaceChildren(Note('good',
              `Connected as ${r.user} (${r.mail}). Writing to "${r.drive}"${r.quotaFreeGB ? `, ${r.quotaFreeGB}GB free` : ''}. The folder is ready.`));
          } catch (err) {
            status.replaceChildren(Note('bad', err.message));
          } finally { btn.disabled = false; btn.textContent = 'Test connection'; }
        } }, 'Test connection'),
        pending ? h('button.btn.btn-sm', { style: { flex: '1' }, onClick: async () => {
          await sp.flush({ onChange: r => r.error && toast(r.error) });
          rerender();
        } }, 'Upload now') : null) : null,
      status,

      signedIn ? cfgField('Folder', 'folder', 'Apps/Stops Photography',
        'Created automatically the first time you test the connection.') : null,
      signedIn ? cfgField('Drive ID', 'driveId', 'Leave blank for your own OneDrive',
        'Set this only to target a specific SharePoint document library instead of your OneDrive.') : null,

      /* Only relevant before signing in — and only if you are pointing this at
         a different Entra registration than the one it ships with. */
      !signedIn ? h('details', { style: { marginTop: '4px' } },
        h('summary', { class: 'small', style: { cursor: 'pointer', color: 'var(--muted)', padding: '6px 0' } },
          'Use a different app registration'),
        h('div.stack', { style: { marginTop: '10px' } },
          cfgField('Application (client) ID', 'clientId', '00000000-0000-0000-0000-000000000000',
            'From Entra ID → App registrations → your app → Overview.'),
          cfgField('Directory (tenant) ID', 'tenant', 'organizations',
            'Your tenant ID, or "organizations" to accept any work account.'),
          h('div', {},
            h('span.eyebrow', { style: { display: 'block', marginBottom: '6px' } }, 'Redirect URI to register'),
            h('code', { class: 'num', style: { display: 'block', padding: '10px 12px', background: 'var(--surface-2)', border: '1px solid var(--line)', borderRadius: 'var(--r)', fontSize: '12px', wordBreak: 'break-all' } },
              sp.redirectUri()),
            h('p', { class: 'tiny', style: { marginTop: '6px' } },
              'Register this as a Single-page application redirect URI. It must match exactly.')))) : null),

    Note('info', 'There is no server and no client secret. The app signs you in directly with Microsoft using PKCE, and talks to Microsoft Graph from the browser. Nobody but you and Microsoft ever sees the files.'))));
}

function addLens(rerender) {
  const draft = { id: store.uid(), label: '', min: 35, max: 35, wideAperture: 1.8, longAperture: 1.8, stabilised: false };
  const f = (label, key, step = 1) => {
    const input = h('input', { type: key === 'label' ? 'text' : 'number', step, onInput: e => { draft[key] = key === 'label' ? e.target.value : Number(e.target.value); } });
    input.value = draft[key];
    return h('label.field', {}, h('span.lab', {}, label), input);
  };
  import('../ui/dom.js').then(({ sheet }) => {
    const close = sheet('Add a lens', h('div.stack', {},
      f('Name', 'label'),
      h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' } },
        f('Shortest focal length', 'min'), f('Longest focal length', 'max')),
      h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' } },
        f('Widest aperture (wide end)', 'wideAperture', 0.1), f('Widest aperture (long end)', 'longAperture', 0.1)),
      Switch('Stabilised (VR / IS / OIS)', false, v => { draft.stabilised = v; }),
      h('button.btn.btn-primary.btn-block', { onClick: () => {
        if (!draft.label.trim()) return toast('Give it a name');
        if (draft.max < draft.min) [draft.min, draft.max] = [draft.max, draft.min];
        store.update(s => { s.gear.lenses.push(draft); });
        close(); rerender(); toast('Lens added');
      } }, 'Add lens')));
  });
}

export function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === 'auto') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', theme);
  const dark = theme === 'dark' || (theme === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#100f0d' : '#f7f4ef');
}
