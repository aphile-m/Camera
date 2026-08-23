/* ==========================================================================
   native.js — reaching a Capacitor plugin from a page the bundler never saw.

   The Android shell loads this site over the network (server.url), so nothing
   here is ever bundled with the app. Capacitor.Plugins is a plain object that
   registerPlugin() fills in, and registerPlugin() normally runs because the
   bundle imports '@capacitor/geolocation' and friends — which cannot happen
   from a remote page. Reading Capacitor.Plugins.X directly therefore finds
   nothing, however plainly the plugin is installed natively.

   Registering by name is the way in: the native bridge injects PluginHeaders
   describing every plugin the APK actually carries, and registerPlugin builds
   its proxy from that.
   ========================================================================== */

export function nativePlugin(name) {
  const C = typeof window !== 'undefined' ? window.Capacitor : null;
  if (!C?.isNativePlatform?.()) return null;
  if (C.Plugins?.[name]) return C.Plugins[name];
  /* Only claim a plugin the shell was actually built with — registerPlugin is
     happy to hand back a proxy that throws Unimplemented on first use. */
  const known = Array.isArray(C.PluginHeaders) && C.PluginHeaders.some(p => p.name === name);
  if (!known) return null;
  try { return C.registerPlugin?.(name) ?? null; } catch { return null; }
}
