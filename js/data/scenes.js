/* ==========================================================================
   scenes.js — recipes.
   Each one is a starting point the advisor can solve, plus the field craft
   that no calculator can give you.
   ========================================================================== */

export const SCENE_GROUPS = ['People', 'Outdoors', 'Street & city', 'Action', 'After dark', 'Close & still'];

export const SCENES = [
  /* ---- People ---------------------------------------------------------- */
  { id:'portrait-shade', group:'People', title:'Portrait in open shade', icon:'◐',
    light:'shade', motion:'gentle', intent:'isolate', focal:55, lens:'kit18',
    craft:'The easiest good portrait light there is. Put your subject just inside the shadow line of a building with the open sky in front of them, not behind. Zoom to 55mm and get close — with no fast glass, length and distance are what soften a background.',
    watch:'Shade is blue. Set the Shade white balance preset or fix it in RAW.' },
  { id:'portrait-backlit', group:'People', title:'Backlit portrait, golden hour', icon:'◑',
    light:'golden', motion:'gentle', intent:'isolate', focal:55, lens:'kit18',
    craft:'Sun directly behind your subject’s head for a rim of light through the hair. Meter off the face, or add about a stop of exposure compensation.',
    watch:'Take the lens hood off if you want flare, keep it on if you do not. Decide, do not discover.' },
  { id:'portrait-window', group:'People', title:'Window light indoors', icon:'▤',
    light:'indoor_day', motion:'gentle', intent:'isolate', focal:55, lens:'kit18',
    craft:'Subject a metre from a large window, turned about 45° into it. Turn every other light in the room off — mixing daylight and tungsten makes skin impossible to correct.',
    watch:'A white card or sheet on the shadow side lifts it without touching the character of the light.' },
  { id:'group', group:'People', title:'Group of people', icon:'▩',
    light:'cloud_bright', motion:'gentle', intent:'sharp_all', focal:35, lens:'kit18',
    craft:'Everyone the same distance from the camera, or arranged in a shallow arc. Focus on the front row. Overcast light is ideal — nobody squints and there are no shadows across faces.',
    watch:'Take five frames minimum. Somebody blinks in every single group photograph ever made.' },
  { id:'kids-indoor', group:'People', title:'Children indoors', icon:'◔',
    light:'indoor_day', motion:'running', intent:'freeze', focal:35, lens:'kit18',
    craft:'Get down to their eye level and stay there. Pre-focus on where they are heading rather than chasing them, and shoot in short bursts. At f/3.5 indoors this leans hard on ISO — let it.',
    watch:'A one-in-ten keeper rate is normal. Do not judge yourself on the ratio.' },

  /* ---- Outdoors -------------------------------------------------------- */
  { id:'landscape-classic', group:'Outdoors', title:'Landscape, front to back', icon:'▰',
    light:'golden', motion:'static', intent:'sharp_all', focal:18, lens:'kit18', tripod:true,
    craft:'Find a foreground element and get within a metre of it. Focus at the hyperfocal distance, not the horizon. Tripod, two-second timer, base ISO.',
    watch:'If the sky is much brighter than the land, bracket three frames and blend them later.' },
  { id:'waterfall', group:'Outdoors', title:'Silky water', icon:'≋',
    light:'overcast', motion:'gentle', intent:'longexp', focal:35, lens:'kit18', tripod:true,
    craft:'Half a second to two seconds turns moving water to silk. Overcast days and shaded gorges let you get there without a filter; open daylight needs about six stops of ND.',
    watch:'Too long and the water loses all texture and becomes a white smear. Two seconds is usually plenty.' },
  { id:'mist', group:'Outdoors', title:'Mist and fog', icon:'░',
    light:'overcast', motion:'static', intent:'natural', focal:55, lens:'kit18', tripod:true,
    craft:'Mist separates layers for you, so use a longer lens to stack them. Add about a stop of exposure compensation — the meter reads all that brightness as mid-grey and darkens it.',
    watch:'Autofocus struggles on low contrast. Find an edge, or focus manually.' },
  { id:'wildlife', group:'Outdoors', title:'Wildlife, golden light', icon:'◕',
    light:'golden', motion:'walking', intent:'freeze', focal:300, lens:'tele70',
    craft:'Get down to the animal’s eye level. Sun behind you or at 45°. Focus on the eye and wait for the head to turn towards you — an animal facing away is never the photograph.',
    watch:'The 70–300 has no VR: at 300mm that is about 1/900 handheld. Rest it on something, or accept ISO 3200 in anything but full sun.' },
  { id:'flowers', group:'Outdoors', title:'Flowers and detail', icon:'✿',
    light:'shade', motion:'gentle', intent:'isolate', focal:55, lens:'kit18',
    craft:'Overcast or shaded light keeps the petals from blowing out. Get low and shoot through something in the foreground for a wash of soft colour across the frame.',
    watch:'Even a light breeze ruins close-ups. Wait for a still moment or shield the plant with your body.' },

  /* ---- Street & city --------------------------------------------------- */
  { id:'street-day', group:'Street & city', title:'Street, daylight', icon:'▥',
    light:'cloud_bright', motion:'walking', intent:'sharp_all', focal:35, lens:'kit18',
    craft:'Zone focus: manual focus at three metres, f/8, and everything from two to six metres is sharp. Find a pool of light, frame it, and wait for someone to walk in.',
    watch:'Almost every weak street frame is shot from too far away. Two metres, not ten.' },
  { id:'architecture', group:'Street & city', title:'Architecture', icon:'▦',
    light:'cloud_bright', motion:'static', intent:'sharp_all', focal:18, lens:'kit18', tripod:true,
    craft:'Keep the sensor parallel to the building or the verticals converge. Use the virtual horizon. Shoot from an unusual height — everything shot from standing eye level looks the same.',
    watch:'Wide lenses stretch anything near the edges of the frame. Keep important detail away from the corners.' },
  { id:'city-blue-hour', group:'Street & city', title:'City at blue hour', icon:'◍',
    light:'blue_hour', motion:'static', intent:'sharp_all', focal:24, lens:'kit18', tripod:true,
    craft:'The twenty minutes after sunset, when sky and street lights balance. Set up early, stay in one spot, and keep shooting — the best frame is usually later than you think.',
    watch:'The light drops about a stop every few minutes. Check the histogram, not the screen.' },
  { id:'markets', group:'Street & city', title:'Markets and interiors', icon:'▨',
    light:'indoor_lit', motion:'walking', intent:'lowlight', focal:35, lens:'kit18',
    craft:'A mode wide open, Auto ISO with a floor of 1/125 and a ceiling of 6400. Stop thinking about numbers and concentrate on faces, hands and the light coming through the roof.',
    watch:'Mixed lighting is the norm here. Shoot RAW so white balance stays negotiable.' },

  /* ---- Action ---------------------------------------------------------- */
  { id:'sport', group:'Action', title:'Field sport', icon:'⚑',
    light:'cloud_bright', motion:'sport', intent:'freeze', focal:300, lens:'tele70',
    craft:'Shutter priority at 1/1000 or faster, AF-C with dynamic-area, back-button focus. Pick one player and follow them rather than tracking the ball.',
    watch:'Shoot the moment before and after the obvious one — the reaction usually beats the action.' },
  { id:'panning', group:'Action', title:'Panning a moving subject', icon:'⇉',
    light:'cloud_bright', motion:'sport', intent:'blur', focal:55, lens:'kit18',
    craft:'Track the subject before, during and after the shutter fires. Feet planted, turn from the hips. 1/60 to 1/30 is the useful range for a cyclist or a car.',
    watch:'One frame in ten works. Stopping the pan at the moment of exposure is what kills the rest.' },
  { id:'birds', group:'Action', title:'Birds in flight', icon:'✦',
    light:'sun_hazy', motion:'flight', intent:'freeze', focal:300, lens:'tele70',
    craft:'Find them against clean sky. Acquire with the centre point, then pan. Pre-focus on a perch they keep returning to and wait for the launch.',
    watch:'1/2000 minimum for wingtips, and with no VR that is also what keeps the lens itself steady. ISO 1600 in bright light is a perfectly reasonable price.' },

  /* ---- After dark ------------------------------------------------------ */
  { id:'light-trails', group:'After dark', title:'Traffic light trails', icon:'⌇',
    light:'street_night', motion:'vehicle', intent:'longexp', focal:24, lens:'kit18', tripod:true,
    craft:'Four to fifteen seconds from a bridge or elevated spot. Start shooting during blue hour so the sky still holds colour behind the trails.',
    watch:'Long-exposure noise reduction doubles the wait between frames. Fine here, fatal for time-lapse.' },
  { id:'stars', group:'After dark', title:'Stars and Milky Way', icon:'✧',
    light:'stars', motion:'static', intent:'lowlight', focal:18, lens:'kit18', tripod:true,
    craft:'Widest aperture, manual focus set by magnifying live view ten times on a bright star. Get away from town, and shoot on a moonless night.',
    watch:'Past about fifteen seconds at 18mm the stars turn from points into short streaks.' },
  { id:'night-street', group:'After dark', title:'Street after dark', icon:'◗',
    light:'street_night', motion:'walking', intent:'lowlight', focal:35, lens:'kit18',
    craft:'Work the pools of light under street lamps and shop windows. Expose for the lit area and let everything else fall to black — the darkness is the cleanest background you will ever get.',
    watch:'Embrace the grain. ISO 6400 with a moment beats ISO 400 without one.' },
  { id:'indoor-event', group:'After dark', title:'Party or indoor event', icon:'◎',
    light:'indoor_dim', motion:'walking', intent:'lowlight', focal:35, lens:'kit18',
    craft:'Bounce the flash off a white ceiling at about −1.3 compensation, so the room light still does the shaping. Turn red-eye reduction off — the pre-flash catches everyone mid-blink.',
    watch:'Keep the shutter at or below 1/200 or the flash sync band appears across the frame.' },

  /* ---- Close & still --------------------------------------------------- */
  { id:'food', group:'Close & still', title:'Food and flat-lay', icon:'◒',
    light:'indoor_day', motion:'static', intent:'natural', focal:55, lens:'kit18',
    craft:'Side or back light from a window, never from the camera position — backlight is what makes food look translucent and fresh. Turn the overhead lights off.',
    watch:'Shoot from directly above for flat-lays and at plate level for a single dish. The 45° angle is the one that looks like a menu.' },
  { id:'still-life', group:'Close & still', title:'Still life', icon:'◇',
    light:'indoor_day', motion:'static', intent:'natural', focal:55, lens:'kit18', tripod:true,
    craft:'One object, one light source, a plain background. Move the object relative to the window and watch the shadow change — this is the cheapest lighting education available.',
    watch:'On a tripod there is no reason to leave base ISO. Take the time and get the cleanest possible file.' },
  { id:'product', group:'Close & still', title:'Small object, clean background', icon:'□',
    light:'indoor_day', motion:'static', intent:'sharp_all', focal:55, lens:'kit18', tripod:true,
    craft:'Large diffused light source, white card opposite to fill the shadow. Stop down to f/8 for depth, and focus-stack if the object is deep.',
    watch:'Past f/16 diffraction softens the whole frame. Stack instead of stopping down further.' },
];

export const sceneById = id => SCENES.find(s => s.id === id);
export const scenesInGroup = g => SCENES.filter(s => s.group === g);

/* ---------- Time-lapse presets -------------------------------------------- */

export const TL_PRESETS = [
  { id:'clouds',  title:'Moving cloud',      icon:'☁', interval:4,   clip:15, light:'cloud_bright', aperture:8,
    note:'Include something static in the foreground so the movement has something to move against.' },
  { id:'sunset',  title:'Sunset or sunrise', icon:'◐', interval:5,   clip:15, light:'golden', aperture:8,
    note:'The light changes by many stops. Either accept the drift, or nudge exposure a third of a stop every few minutes.' },
  { id:'stars',   title:'Star movement',     icon:'✧', interval:25,  clip:12, light:'stars', aperture:3.5,
    note:'Long-exposure noise reduction must be off, or the camera spends half the night taking dark frames.' },
  { id:'traffic', title:'City traffic',      icon:'⌇', interval:3,   clip:15, light:'street_night', aperture:8,
    note:'Start during blue hour. A two-second exposure per frame gives continuous light trails rather than dashes.' },
  { id:'crowd',   title:'Busy pavement',     icon:'▥', interval:1.5, clip:12, light:'cloud_bright', aperture:8,
    note:'Short intervals keep the energy. Anything longer and people teleport between frames.' },
  { id:'bloom',   title:'Plant opening',     icon:'✿', interval:120, clip:10, light:'indoor_day', aperture:8,
    note:'Constant artificial light only — daylight through a window will flicker with every passing cloud.' },
  { id:'weather', title:'Storm front',       icon:'⛆', interval:2,   clip:15, light:'overcast', aperture:8,
    note:'Storms move fast, so keep intervals short. Protect the camera with a bag and a rubber band.' },
  { id:'shadow',  title:'Shadows across a day', icon:'◱', interval:30, clip:15, light:'sun_hard', aperture:11,
    note:'A whole day compressed. Tape the tripod legs, and use mains power or a fresh battery every two hours.' },
];
