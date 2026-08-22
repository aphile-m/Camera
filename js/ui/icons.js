/* Icons — one consistent 24px stroke set, drawn rather than imported. */
import { svg } from './dom.js';

const P = {
  home:     '<path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',
  learn:    '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5z"/>',
  practice: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  tools:    '<path d="M14.5 5.5a4 4 0 0 0 5 5L21 9l-6 6-6 6-3-3 6-6 6-6z"/><path d="M6 6l3 3"/>',
  journal:  '<path d="M5 4h13a1 1 0 0 1 1 1v15H6a1 1 0 0 1-1-1z"/><path d="M9 4v16M12 9h4M12 13h4"/>',
  camera:   '<path d="M3 8a2 2 0 0 1 2-2h2l1.5-2h7L17 6h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="12.5" r="3.5"/>',
  chevron:  '<path d="m9 5 7 7-7 7"/>',
  back:     '<path d="m15 5-7 7 7 7"/>',
  check:    '<path d="m4.5 12.5 5 5 10-11"/>',
  flame:    '<path d="M12 3s5 4.5 5 9a5 5 0 0 1-10 0c0-2 1-3 1-3s.5 2 2 2c0-3 2-5 2-8z"/>',
  sun:      '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon:     '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/>',
  clock:    '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5.5l3.5 2"/>',
  info:     '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.6v.6"/>',
  warn:     '<path d="M12 4 2.7 20h18.6z"/><path d="M12 10v4.5M12 17.4v.4"/>',
  bad:      '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
  good:     '<circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.5 2.5L16 9.5"/>',
  plus:     '<path d="M12 5v14M5 12h14"/>',
  settings: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v2M12 19.5v2M4.2 7.2l1.7 1M18.1 15.8l1.7 1M4.2 16.8l1.7-1M18.1 8.2l1.7-1"/>',
  star:     '<path d="m12 4 2.4 5.2 5.6.7-4.1 3.9 1.1 5.6L12 16.7 6.9 19.4 8 13.8 3.9 9.9l5.6-.7z"/>',
  target:   '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4"/>',
  layers:   '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  image:    '<rect x="3" y="4.5" width="18" height="15" rx="2"/><circle cx="8.5" cy="10" r="1.8"/><path d="m3.5 17 5-5 4.5 4.5 3-2.5 4.5 4"/>',
  refresh:  '<path d="M20 11a8 8 0 0 0-14-4.5L3.5 9"/><path d="M4 13a8 8 0 0 0 14 4.5L20.5 15"/><path d="M3.5 5v4h4M20.5 19v-4h-4"/>',
  trash:    '<path d="M4.5 6.5h15M9 6.5V4.5h6v2M6.5 6.5 7.5 20h9l1-13.5"/>',
  book:     '<path d="M4 4.5h10a3 3 0 0 1 3 3V20a2.5 2.5 0 0 0-2.5-2.5H4z"/><path d="M20 7v13"/>',
  compass:  '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z"/>',
};

export const icon = (name, size = 20) => svg(P[name] || P.info, { size });
export const iconPath = name => P[name] || P.info;
