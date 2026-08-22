/* ==========================================================================
   curriculum.js — the path.
   Seven levels, thirty-odd lessons, each ending in a field drill you have to
   actually go and shoot. Order matters: nothing here depends on something
   you have not met yet.
   ========================================================================== */

export const LEVELS = [
  { id:1, name:'Seeing',        blurb:'Before a single setting. What actually makes a photograph work.', colour:'amber' },
  { id:2, name:'Exposure',      blurb:'The three controls, what each one costs, and how to trade between them.', colour:'amber' },
  { id:3, name:'Sharpness',     blurb:'Focus, depth, and the unglamorous business of not blurring the frame.', colour:'cyan' },
  { id:4, name:'Light',         blurb:'Reading light and choosing it, which is most of photography.', colour:'cyan' },
  { id:5, name:'Composition',   blurb:'Arranging a frame once you can already expose and focus it.', colour:'violet' },
  { id:6, name:'Subjects',      blurb:'Portraits, landscape, street, action, night. Applying everything.', colour:'violet' },
  { id:7, name:'After the shutter', blurb:'Culling, editing, projects, and honest self-critique.', colour:'green' },
];

export const LESSONS = [

/* ── LEVEL 1 · SEEING ──────────────────────────────────────────────────── */
{
  id:'l1-what-makes',
  level:1, title:'What a photograph is actually made of', sub:'Four ingredients, in order of importance', minutes:5,
  idea:'A photograph that works almost always has one clear subject, light that suits it, a frame with nothing in it that does not belong, and a moment worth keeping. Settings are how you serve those four things — they are never the point on their own.',
  body:[
    { h:'The order is not negotiable', p:'A technically perfect photograph of nothing is still a photograph of nothing. A slightly soft frame of something extraordinary is worth keeping forever. When you find yourself fiddling with the camera, stop and ask which of the four you have actually got.' },
    { h:'Subject', p:'One thing the picture is about. If a stranger looked at your frame and could not point at what you meant, you have not got a subject yet — you have a snapshot of a place.' },
    { h:'Light', p:'Not "enough light". The right light: its direction, its hardness, its colour. Photographers do not find subjects and then hope for light. They find light and then look for a subject to put in it.' },
    { h:'Composition', p:'Where things sit in the rectangle, and — more importantly — what you left out. Most beginner frames improve by removing something, not adding.' },
    { h:'Moment', p:'The gesture, the glance, the wave breaking. In a still frame you get one instant; choosing which one is a skill you build by shooting a lot and looking hard afterwards.' },
  ],
  points:[
    'Subject → light → composition → moment. Settings serve these.',
    'If you cannot name the subject in three words, the frame is not ready.',
    'Improving a photograph usually means removing something.',
  ],
  diagram:'four-ingredients',
  camera:[
    { control:'Mode dial', do:'Leave it on A (aperture priority) for now. This level is about your eyes, not the dial.' },
    { control:'Format',    do:'Set image quality to RAW + JPEG. You will want the RAW later, when you learn what it is for.' },
  ],
  mistakes:[
    'Photographing a whole scene because it felt good to stand in, instead of the one thing in it that was interesting.',
    'Shooting from standing height, from wherever you happened to be standing.',
  ],
  drill:{
    id:'d1-one-subject', title:'One subject, ten frames', frames:10,
    brief:'Find a single object, person or detail. Photograph only that, ten different ways — closer, lower, from behind, against a different background. Do not move on to a second subject.',
    constraints:['One subject only','Ten frames, no more','Move your feet for every frame'],
    success:['A stranger can name the subject from any one of the ten frames','At least three frames are from a height you would not normally shoot from'],
    reflect:['Which frame is strongest, and what is different about it?','What did you have to remove from the background to make it work?'],
  },
  quiz:[
    { q:'You have a beautiful scene but nothing in it stands out. What is missing?', a:['Better settings','A subject','A tripod','A wider lens'], correct:1, why:'Light and composition cannot rescue a frame with nothing to be about.' },
    { q:'Which is usually the fastest way to improve a beginner frame?', a:['Add a filter','Raise the ISO','Take something out of the frame','Shoot in Auto'], correct:2, why:'Simplification is the single highest-yield habit in early photography.' },
  ],
},
{
  id:'l1-closer',
  level:1, title:'Get closer', sub:'Robert Capa was right and it still stings', minutes:4,
  idea:'"If your pictures aren’t good enough, you aren’t close enough." Beginner frames are almost always too wide, because standing back feels safe and includes everything. Including everything is the problem.',
  body:[
    { h:'Why wide feels right and is wrong', p:'Your eye roams around a scene and assembles an impression. The camera cannot roam — it flattens everything into one rectangle where every element competes at once. What felt like a rich scene becomes clutter.' },
    { h:'Fill the frame', p:'Decide what the picture is about, then move until that thing owns the frame. Not zoom — move. Zooming changes the relationship between subject and background; walking changes your point of view, which is the more powerful of the two.' },
    { h:'The crop test', p:'After a shoot, try cropping each frame hard. If the crop is better than the original, you were too far away. Do this honestly for a week and your framing will change permanently.' },
  ],
  points:[
    'Walk, do not zoom, when you want the subject bigger.',
    'If a hard crop improves the frame, you stood too far back.',
    'Wide angles include everything, which means they include the mess.',
  ],
  diagram:'closer',
  camera:[
    { control:'Focal length', do:'Try a whole session at 50mm (35mm on a crop body). One focal length forces you to move.' },
    { control:'Minimum focus', do:'Learn your lens’s closest focus distance. Most kit zooms stop around 28cm — closer than people expect.' },
  ],
  mistakes:['Zooming out "so it all fits in".','Cropping in post to fix what your feet should have fixed.'],
  drill:{
    id:'d1-three-steps', title:'Three steps closer', frames:12,
    brief:'Photograph six subjects. For each one: take the frame you instinctively wanted, then take three steps forward and take it again. Keep both.',
    constraints:['Six subjects, two frames each','No zooming between the pair','Same focal length throughout'],
    success:['You prefer the closer frame in at least four of the six pairs'],
    reflect:['In the pairs where the wider frame won, why did it win?'],
  },
  quiz:[
    { q:'Your subject is too small in the frame. What is the better first move?', a:['Zoom in','Walk closer','Crop later','Raise the ISO'], correct:1, why:'Walking changes perspective as well as size; zooming only changes size.' },
    { q:'A hard crop consistently improves your frames. That tells you:', a:['Your lens is soft','You are standing too far back','Your ISO is too high','You need a tripod'], correct:1, why:'It is the clearest diagnostic there is for framing too wide.' },
  ],
},
{
  id:'l1-background',
  level:1, title:'The background is the picture', sub:'The single most common beginner failure', minutes:5,
  idea:'Beginners look at the subject. Photographers look at everything behind it. A pole growing out of a head, a bright bin in the corner, a stripe of blown-out sky — these ruin more frames than any wrong setting ever will.',
  body:[
    { h:'Why it happens', p:'Your brain suppresses what it is not interested in; the sensor does not. You genuinely did not see the road sign behind your friend, because you were looking at your friend. The fix is a deliberate habit, not better attention.' },
    { h:'The sweep', p:'Before every frame, run your eye around the edge of the viewfinder — top, right, bottom, left — then across the background. It takes under a second and it will save more photographs than any accessory you can buy.' },
    { h:'Three ways to fix a bad background', p:'Move yourself, so the background changes. Move the subject, into better surroundings. Or throw the background out of focus with a wider aperture and more distance behind the subject. In that order of preference — the first two are free and always work.' },
    { h:'Watch for', p:'Bright patches (the eye goes there first, every time), horizontal lines through a head, merging tones where subject and background are the same brightness, and anything with text on it.' },
  ],
  points:[
    'Sweep the edges and the background before you press the shutter.',
    'Bright areas pull the eye. Keep the brightest thing in the frame as your subject.',
    'Move yourself first, blur the background last.',
  ],
  diagram:'background',
  camera:[
    { control:'Depth-of-field preview', do:'If your body has one, use it: the viewfinder shows the background at the aperture you have actually set.' },
    { control:'Live view', do:'The rear screen shows depth of field honestly. Use it when you are unsure how much the background will blur.' },
  ],
  mistakes:['Pole-through-the-head.','Bright sky burning out behind a portrait.','Busy patterned background competing with a face.'],
  drill:{
    id:'d1-background', title:'Same subject, five backgrounds', frames:5,
    brief:'Pick one subject that can move — a person, a mug, a plant. Photograph it against five deliberately different backgrounds: dark, bright, textured, plain, and distant.',
    constraints:['Same subject and same focal length throughout','Only the background may change'],
    success:['You can rank the five and explain the ranking in one sentence each'],
    reflect:['Which background made the subject strongest, and was it the darkest, plainest, or furthest away?'],
  },
  quiz:[
    { q:'The eye is drawn first to:', a:['The sharpest area','The brightest area','The centre','The largest object'], correct:1, why:'Brightness beats sharpness, position and size for attention. Control it deliberately.' },
    { q:'Cheapest reliable fix for a cluttered background:', a:['A faster lens','Moving your own feet','Higher ISO','A longer exposure'], correct:1, why:'Changing your position changes the whole background for free.' },
  ],
},
{
  id:'l1-light-first',
  level:1, title:'Find the light first', sub:'Photography is a light-hunting habit', minutes:5,
  idea:'Stop looking for things to photograph. Start looking for light, and then find something to put in it. This one inversion separates people who improve quickly from people who plateau.',
  body:[
    { h:'What good light looks like', p:'Light with a direction you can see. A shaft through a doorway. The soft, even wall of light near a big window. Late sun raking across a street so everything has an edge. If you cannot tell where the light is coming from, it probably will not make an interesting photograph.' },
    { h:'The pool of light', p:'Train yourself to notice pools — a lit patch on a pavement, a table by a window, sun between two buildings. Frame the pool, expose for it, and wait for something to walk into it. Half of great street photography is exactly this.' },
    { h:'Time of day beats everything', p:'The same street is a different photograph at 07:00, 13:00 and 18:00. Midday sun from overhead is the least flattering light of the day for faces. The hour after sunrise and before sunset is the easiest good light there is.' },
  ],
  points:[
    'Hunt light, then find a subject for it.',
    'Light with a visible direction is more interesting than bright light.',
    'The hour after sunrise and before sunset does most of the work for you.',
  ],
  diagram:'pool-of-light',
  camera:[
    { control:'Metering', do:'Leave it on matrix/evaluative for now — you will learn to override it in Level 2.' },
    { control:'White balance', do:'Leave on Auto while you are learning to see light. Fix it deliberately later.' },
  ],
  mistakes:['Shooting at midday because that is when you were free.','Judging light by how bright it is rather than by its direction.'],
  drill:{
    id:'d1-pool', title:'Wait for the light', frames:8,
    brief:'Find one pool of interesting light. Frame it, set your exposure for the lit area, and wait until something worth photographing enters it. Give it fifteen real minutes.',
    constraints:['One position, one frame','At least fifteen minutes of waiting','Expose for the light, let the shadows go dark'],
    success:['At least one frame where the subject is lit and the surroundings are not'],
    reflect:['What did waiting give you that walking around would not have?'],
  },
  quiz:[
    { q:'Best general-purpose habit for finding photographs:', a:['Look for subjects','Look for light, then subjects','Look for backgrounds','Look for colour'], correct:1, why:'Light is the scarcer ingredient, so hunt the scarce thing first.' },
    { q:'Overhead midday sun is hardest on:', a:['Landscapes','Faces','Architecture','Still life'], correct:1, why:'It drops shadows into eye sockets and under the nose — the least flattering angle for a face.' },
  ],
},
{
  id:'l1-frame-edges',
  level:1, title:'The frame is a decision', sub:'Everything inside it is something you chose', minutes:4,
  idea:'A photograph is not a window onto the world; it is a rectangle you drew around part of it. Every element inside is there because you allowed it. Start treating the edges as an active choice and your frames tighten immediately.',
  body:[
    { h:'Edges do work', p:'What touches an edge, what gets cut, and what sits just inside all change how the frame reads. A subject cut awkwardly at a joint — wrist, ankle, knee — looks like an accident. Cut deliberately, mid-limb, and it reads as intent.' },
    { h:'Do not centre by default', p:'Dead centre is the one position that says nothing. It works when the frame is symmetrical and you meant it, and reads as carelessness the rest of the time.' },
    { h:'Give movement somewhere to go', p:'If your subject faces or moves left, leave space on the left. Without it, the frame feels cramped and the subject looks about to hit the edge.' },
    { h:'Orientation is a choice too', p:'Turn the camera. Vertical suits tall subjects and single people; horizontal suits relationships and context. Most beginners shoot everything horizontally out of habit.' },
  ],
  points:[
    'Cut limbs mid-segment, never at a joint.',
    'Leave space in the direction of a gaze or a movement.',
    'Shoot every important frame both horizontally and vertically.',
  ],
  diagram:'edges',
  camera:[
    { control:'Grid display', do:'Turn on the viewfinder or live-view grid. Leave it on permanently.' },
    { control:'Virtual horizon', do:'Enable it. A tilted horizon is the easiest fault to avoid and the most obvious to spot.' },
  ],
  mistakes:['Amputating hands and feet at the wrist and ankle.','Subject staring straight out of the near edge of the frame.'],
  drill:{
    id:'d1-orientation', title:'Both ways, every time', frames:12,
    brief:'Photograph six subjects, each one horizontally and vertically, from the same spot. Choose the winner from each pair afterwards, not while shooting.',
    constraints:['Six subjects, both orientations','Same position for each pair'],
    success:['Vertical wins at least twice — proof you had a default'],
    reflect:['What kind of subject preferred vertical?'],
  },
  quiz:[
    { q:'A person looking to the right of the frame should have:', a:['Space on the right','Space on the left','No space','Be centred'], correct:0, why:'Give a gaze somewhere to travel, or the frame feels blocked.' },
    { q:'The worst place to cut an arm is:', a:['Mid-forearm','At the wrist','Mid-upper-arm','Below the shoulder'], correct:1, why:'Cuts at joints read as amputation; cuts mid-limb read as a deliberate crop.' },
  ],
},

/* ── LEVEL 2 · EXPOSURE ────────────────────────────────────────────────── */
{
  id:'l2-stops',
  level:2, title:'The stop', sub:'One idea that makes all three controls the same idea', minutes:6,
  idea:'A stop is a doubling or halving of light. That is the whole concept. Aperture, shutter and ISO all move in stops, which is why they can trade against each other perfectly. Learn stops and the exposure triangle stops being a triangle and becomes arithmetic.',
  body:[
    { h:'Doubling and halving', p:'One stop more light = twice as much. One stop less = half. It does not matter which control you use to get there — the sensor cannot tell the difference in brightness terms, only in look terms.' },
    { h:'Shutter is the easy one', p:'1/125 → 1/60 is one stop more light, because the shutter is open twice as long. The full ladder is 1/1000, 1/500, 1/250, 1/125, 1/60, 1/30, 1/15, 1/8, 1/4, 1/2, 1s. Each step doubles.' },
    { h:'ISO is just as easy', p:'100 → 200 → 400 → 800 → 1600. Each step is one stop, doubling the sensitivity — and the noise.' },
    { h:'Aperture is the awkward one', p:'f/1.4, f/2, f/2.8, f/4, f/5.6, f/8, f/11, f/16, f/22. Each step halves the light. The numbers look strange because the f-number is a ratio and light passes through an area: to halve an area you multiply the diameter by 1.4 — the square root of two. Memorise the ladder; the maths behind it never needs to be recalled in the field.' },
    { h:'Thirds', p:'Your camera moves in third-stops by default: f/5.6, f/6.3, f/7.1, f/8. Three clicks equal one full stop. That is why the dial seems to have so many positions.' },
  ],
  points:[
    'A stop is a doubling or halving of light.',
    'Aperture ladder: 1.4 · 2 · 2.8 · 4 · 5.6 · 8 · 11 · 16 · 22.',
    'Three clicks of any dial usually equals one stop.',
  ],
  diagram:'stops-ladder',
  camera:[
    { control:'Exposure step', do:'Leave it at 1/3 EV. Learn to count three clicks as one stop.' },
    { control:'Front / rear dial', do:'Find out which dial changes which control in your mode. Do it now, in daylight, not in the dark.' },
  ],
  mistakes:['Trying to memorise aperture numbers as a formula instead of a ladder.','Not realising the camera moves in thirds, then wondering why "one click" did so little.'],
  drill:{
    id:'d2-ladder', title:'Count the clicks', frames:9,
    brief:'In manual mode on a static subject in steady light: expose correctly, then shoot the same frame at −2, −1, 0, +1 and +2 stops using only the shutter dial. Repeat using only the aperture ring, then only ISO.',
    constraints:['Tripod or a solid surface','Static subject, unchanging light','Nine frames minimum'],
    success:['The −1 frames from all three methods look identically bright','You can predict the click count for one stop without looking'],
    reflect:['The brightness matched. What was different about the three sets?'],
  },
  quiz:[
    { q:'How much more light is f/2.8 than f/5.6?', a:['1 stop','2 stops','3 stops','Half a stop'], correct:1, why:'f/2.8 → f/4 → f/5.6 is two rungs of the ladder, so four times the light.' },
    { q:'1/250s to 1/60s is:', a:['1 stop more','2 stops more','2 stops less','1 stop less'], correct:1, why:'1/250 → 1/125 → 1/60: two doublings of time, so two stops more light.' },
    { q:'On a camera set to 1/3 EV steps, one full stop is:', a:['1 click','2 clicks','3 clicks','6 clicks'], correct:2, why:'Three third-stops make one stop.' },
  ],
},
{
  id:'l2-aperture',
  level:2, title:'Aperture', sub:'Light, and how much of the world is sharp', minutes:6,
  idea:'Aperture does two jobs at once: it sets how much light gets in, and how deep the sharp zone is. That second job is the creative one, and it is the reason aperture priority is where most photographers live.',
  body:[
    { h:'Wide open', p:'f/1.8, f/2.8. Lots of light, and a sharp zone that can be thinner than a face. Backgrounds dissolve. Perfect for lifting a person out of a busy street; unforgiving if your focus is a centimetre off.' },
    { h:'Stopped down', p:'f/8, f/11, f/16. Less light, and a deep sharp zone. Landscapes, architecture, groups of people standing at different distances. Also more forgiving of focus error, which matters more than people admit.' },
    { h:'Three things control depth of field, not one', p:'Aperture, distance to subject, and focal length. Getting physically closer thins the sharp zone dramatically — often more than opening up a stop does. A 35mm lens at f/1.8 focused at three metres has a deeper sharp zone than the same lens at f/4 focused at one metre.' },
    { h:'The background distance trick', p:'Blur is not only about aperture. A subject one metre in front of a wall will never have a creamy background, whatever you set. Move the subject away from the background, and even f/5.6 blurs beautifully.' },
    { h:'Where lenses are sharpest', p:'Almost every lens is at its softest wide open and softest again past f/16. The sweet spot is usually two stops down from maximum — around f/4 on an f/1.8 lens, f/8 on an f/3.5 kit zoom.' },
  ],
  points:[
    'Wide aperture = more light, thinner sharp zone, softer background.',
    'Distance from subject to background matters as much as the f-number.',
    'Most lenses are sharpest about two stops from wide open.',
  ],
  diagram:'aperture-dof',
  camera:[
    { control:'Mode dial', do:'A (Av on Canon). You set aperture, the camera sets shutter.' },
    { control:'Command dial', do:'Turns the aperture. Watch the shutter speed the camera picks — that is the cost of your choice.' },
  ],
  mistakes:['Shooting everything wide open and wondering why half the frames are soft.','Expecting background blur with the subject pressed against a wall.'],
  drill:{
    id:'d2-aperture', title:'The aperture run', frames:6,
    brief:'One subject, standing well clear of a background with detail in it. Shoot at every full stop your lens offers, from wide open to f/16, focusing on the same point each time.',
    constraints:['Same distance and focal length throughout','Background at least five metres behind the subject','Focus on the same point every frame'],
    success:['You can see exactly where the background stops being recognisable','You can see the frame where the lens is at its sharpest'],
    reflect:['At which aperture did the background become an abstraction rather than a place?'],
  },
  quiz:[
    { q:'Which gives the shallowest depth of field?', a:['f/8 at 1m','f/2.8 at 5m','f/2.8 at 1m','f/8 at 5m'], correct:2, why:'Wide aperture and close distance compound. Distance is the stronger lever than people expect.' },
    { q:'Your background will not blur however wide you open. Most likely cause:', a:['Lens too slow','Subject too close to the background','ISO too low','Shutter too fast'], correct:1, why:'Background separation depends on the distance behind the subject.' },
    { q:'A typical kit zoom is sharpest around:', a:['f/3.5','f/8','f/22','f/1.4'], correct:1, why:'Roughly two stops down from wide open, before diffraction sets in.' },
  ],
},
{
  id:'l2-shutter',
  level:2, title:'Shutter speed', sub:'Light, and how time is drawn', minutes:6,
  idea:'Shutter speed decides how a slice of time is rendered: frozen solid, smeared into motion, or somewhere deliberately in between. It is also the control that punishes you hardest, because blur is the one mistake you cannot fix afterwards.',
  body:[
    { h:'Two kinds of blur', p:'Subject blur is the subject moving during the exposure. Camera shake is you moving. They look different — shake blurs the whole frame, subject blur only the moving parts — and they have different fixes. Diagnose before you react.' },
    { h:'The numbers that matter', p:'1/125 holds a standing person. 1/250 handles walking and children being reasonable. 1/500 stops running. 1/1000 covers most sport. 1/2000 and above is for wings and splashing water. Below 1/60, handheld, you are gambling.' },
    { h:'The reciprocal rule', p:'Handheld, keep the shutter at least as fast as 1 over your effective focal length: 1/60 at 60mm, 1/200 at 200mm. On a crop sensor multiply the focal length by 1.5 first. On a 24-megapixel body, halve the result again — high resolution shows every wobble.' },
    { h:'Slow on purpose', p:'1/30 while panning with a cyclist gives a sharp rider on a streaked background. Half a second turns a waterfall to silk. Thirty seconds empties a busy square of people. Slow shutter speeds are a creative tool, not a low-light compromise.' },
    { h:'Flash sync', p:'Most cameras cannot use flash faster than about 1/200. Go beyond it and a black band appears across the frame — the shutter curtain itself, photographed.' },
  ],
  points:[
    'Camera shake blurs everything; subject blur only blurs what moved.',
    'Handheld minimum: 1 ÷ (focal length × crop factor), then halve it on a high-resolution body.',
    'A sharp grainy frame beats a clean blurred one, always.',
  ],
  diagram:'shutter-motion',
  camera:[
    { control:'Mode dial', do:'S (Tv on Canon). You set shutter, the camera sets aperture.' },
    { control:'Release mode', do:'Continuous for anything that moves. Fire in bursts of three.' },
    { control:'Auto ISO', do:'Set a minimum shutter speed so the camera protects you from shake automatically.' },
  ],
  mistakes:['Blaming the lens for softness that is actually camera shake.','Using 1/60 for a portrait of a child.'],
  drill:{
    id:'d2-shutter', title:'Freeze, then smear', frames:10,
    brief:'Find something repeatedly moving — traffic, a tap, someone on a swing. Shoot it at 1/1000, 1/250, 1/60, 1/15 and 1/2. Then find a passing cyclist and pan with them at 1/30.',
    constraints:['Same subject for the ladder','Pan smoothly, follow through after the shutter fires','Keep every frame, including the failures'],
    success:['You can point at the exact speed where the subject stops being readable','At least one panned frame has a sharp subject and a streaked background'],
    reflect:['Which speed told the truth about how fast the subject was actually moving?'],
  },
  quiz:[
    { q:'The whole frame is blurred, including static objects. That is:', a:['Subject blur','Camera shake','Missed focus','Diffraction'], correct:1, why:'If things that were not moving are blurred too, the camera moved.' },
    { q:'Handheld at 200mm on an APS-C body, the safe minimum is about:', a:['1/60','1/200','1/300','1/600'], correct:3, why:'200 × 1.5 = 300, then halve again for a high-resolution sensor.' },
    { q:'To pan a cyclist with a streaked background you would use about:', a:['1/1000','1/500','1/30','1/4'], correct:2, why:'Fast enough to keep the rider readable, slow enough to smear the background.' },
  ],
},
{
  id:'l2-iso',
  level:2, title:'ISO', sub:'The one you spend last, but should not fear', minutes:5,
  idea:'ISO amplifies whatever light you managed to collect. It adds noise, and beginners are far too frightened of it. Noise is a cosmetic problem. Blur and missed moments are not.',
  body:[
    { h:'What it actually does', p:'ISO does not make the sensor more sensitive to light in any physical sense — it amplifies the signal that arrived, and amplifies the noise with it. That is why high ISO looks grainy and slightly flat: you are turning up the volume on a quiet recording.' },
    { h:'The order of spending', p:'Set the aperture your picture needs. Set the shutter your subject needs. Then raise ISO until the exposure is correct. ISO is the balancing item, not the first choice — and never the thing that stops you taking the picture.' },
    { h:'How high is too high', p:'On a modern APS-C body, ISO 1600 is unremarkable, 3200 is fine, 6400 is usable and 12800 is an emergency. Decide your own ceiling by shooting a scene at every ISO once and printing or viewing at full size. Then trust that ceiling and stop worrying.' },
    { h:'Auto ISO is not cheating', p:'Set a minimum shutter speed and a maximum ISO, and the camera protects both ends while you concentrate on the picture. Working photographers use it constantly. In changing light it is simply better than you are.' },
    { h:'Expose to the right', p:'Noise lives in shadows. A slightly brighter exposure — as bright as you can go without clipping the highlights — collects more signal and produces a cleaner file after you pull it back down. Underexposing and lifting later is the reliable way to make noise worse.' },
  ],
  points:[
    'Spend aperture and shutter first, then ISO to balance.',
    'Noise is cosmetic; blur is fatal. Choose accordingly.',
    'Auto ISO with a minimum shutter and a ceiling is a professional tool.',
  ],
  diagram:'iso-noise',
  camera:[
    { control:'Auto ISO', do:'On. Maximum sensitivity 6400. Minimum shutter speed: Auto, or set it to your handheld limit.' },
    { control:'High ISO NR', do:'Low or off if you shoot RAW — you can do better in post than the camera can in-body.' },
  ],
  mistakes:['Refusing to leave ISO 100 indoors and getting blurred frames instead.','Underexposing to "protect" highlights and discovering noise everywhere in the shadows.'],
  drill:{
    id:'d2-iso', title:'Find your own ceiling', frames:8,
    brief:'In a dim room, photograph the same detailed subject at ISO 100, 400, 800, 1600, 3200, 6400 and 12800, adjusting shutter to keep exposure constant. View them at 100% on the biggest screen you have.',
    constraints:['Tripod or a solid surface','Constant aperture','Include shadow area in the frame'],
    success:['You can name the highest ISO you personally accept','You have seen where the shadows fall apart'],
    reflect:['Was your ceiling higher or lower than you expected before the test?'],
  },
  quiz:[
    { q:'The correct order to set exposure for a moving subject is:', a:['ISO, aperture, shutter','Aperture and shutter for the look, then ISO to balance','ISO first, always','Shutter, ISO, aperture'], correct:1, why:'ISO is the balancing item after the creative decisions are made.' },
    { q:'Underexposing a dark scene to protect the highlights usually:', a:['Reduces noise','Increases visible noise when you lift it','Has no effect','Improves sharpness'], correct:1, why:'Noise lives in the shadows; lifting them amplifies it.' },
  ],
},
{
  id:'l2-triangle',
  level:2, title:'Trading between the three', sub:'Equivalent exposures and what each one costs', minutes:6,
  idea:'Any brightness can be reached by countless combinations of aperture, shutter and ISO. They look identical in brightness and completely different in every other way. Choosing between them is the actual craft of exposure.',
  body:[
    { h:'Equivalent exposures', p:'f/2.8 at 1/500 and ISO 100 is exactly as bright as f/5.6 at 1/125 and ISO 100, and as f/5.6 at 1/500 and ISO 400. Two stops given to one control, two stops taken from another. The brightness never changes.' },
    { h:'What changes instead', p:'The first has a thin sharp zone and freezes motion. The second is deep and will blur anything moving. The third is deep, frozen, and noisier. There is no correct answer — only the answer that suits the picture you are trying to make.' },
    { h:'How to decide', p:'Ask which of the three matters most for this frame. Depth of field? Set aperture and let the rest follow (A mode). Motion? Set shutter (S mode). Neither, but the light keeps changing? Manual with Auto ISO — you lock the look and the camera absorbs the variation.' },
    { h:'Sunny 16', p:'On a clear sunny day, at f/16, the correct shutter speed is roughly 1 over your ISO: ISO 100 at 1/100. From that anchor you can work out any exposure without a meter. It is a useful sanity check when a scene fools the camera.' },
  ],
  points:[
    'Give one control two stops, take two from another: same brightness, different photograph.',
    'Decide which control matters, put the camera in that priority mode.',
    'Sunny 16: bright sun, f/16, shutter ≈ 1/ISO.',
  ],
  diagram:'triangle',
  camera:[
    { control:'M + Auto ISO', do:'Set aperture and shutter for the look you want, let ISO float. The fastest way to work in changing light.' },
    { control:'Exposure lock', do:'Meter off the important tone, press AE-L, recompose, shoot.' },
  ],
  mistakes:['Believing there is one "correct" exposure for a scene.','Staying in Manual for its own sake when the light is changing every frame.'],
  drill:{
    id:'d2-equivalent', title:'Four ways to the same brightness', frames:4,
    brief:'One scene containing both a moving element and depth. Make four exposures that are identically bright but use different trios of settings, spanning at least four stops of aperture.',
    constraints:['All four frames the same brightness','At least four stops of aperture between the extremes','Note the settings for each'],
    success:['The four frames are the same brightness and obviously different photographs'],
    reflect:['Which of the four is the photograph you actually wanted, and why?'],
  },
  quiz:[
    { q:'f/4 at 1/250 ISO 200. Which is equivalent?', a:['f/8 at 1/250 ISO 200','f/2.8 at 1/500 ISO 200','f/4 at 1/500 ISO 200','f/8 at 1/500 ISO 400'], correct:1, why:'One stop wider aperture, one stop faster shutter — they cancel exactly.' },
    { q:'Bright sun, ISO 200, f/16. Shutter should be about:', a:['1/60','1/200','1/1000','1/15'], correct:1, why:'Sunny 16: shutter ≈ 1/ISO at f/16.' },
    { q:'The light keeps changing and you need the look locked. Best mode:', a:['Full Auto','Program','Manual with Auto ISO','Shutter priority'], correct:2, why:'You fix aperture and shutter; ISO absorbs the changing light.' },
  ],
},
{
  id:'l2-metering',
  level:2, title:'Metering and the histogram', sub:'Why the camera gets snow and coal wrong', minutes:7,
  idea:'Your meter assumes everything it sees averages to mid-grey. Point it at snow and it makes grey snow; point it at a black cat and it makes a grey cat. Exposure compensation is how you tell it the truth, and the histogram is how you check.',
  body:[
    { h:'The mid-grey assumption', p:'A reflected-light meter has no idea whether a scene is bright things dimly lit or dark things brightly lit. It assumes middle. That assumption is right often enough to be useful and wrong often enough to be dangerous.' },
    { h:'Compensation, in practice', p:'Predominantly white scene — snow, a whitewashed wall, a pale beach — add about +1.7 stops. Predominantly dark — black clothing, deep shade — subtract about 1.3. A backlit face needs roughly +1. You are not correcting a fault; you are supplying information the meter cannot have.' },
    { h:'Metering modes', p:'Matrix/evaluative reads the whole frame and is right most of the time. Centre-weighted favours the middle, and is predictable. Spot reads a tiny area — invaluable for a backlit face or a performer under a stage light, and unforgiving if you put the spot in the wrong place.' },
    { h:'Read the histogram, not the screen', p:'The rear screen brightness lies, especially at night. The histogram does not. Left edge is black, right edge is white. A graph piled hard against the right with a spike on the wall means clipped highlights — detail that no longer exists. Shadows crushed to the left can often be lifted; clipped highlights cannot be recovered.' },
    { h:'Blinkies', p:'Turn on the highlight warning. Blinking areas are blown. Small blinking areas on a light source are fine; blinking across a face or a cloud means you have lost it.' },
  ],
  points:[
    'The meter assumes mid-grey. Snow needs +, black needs −.',
    'Clipped highlights are gone forever; shadows are usually recoverable.',
    'Judge exposure from the histogram, never from the screen brightness.',
  ],
  diagram:'histogram',
  camera:[
    { control:'Exposure compensation', do:'The +/− button with the rear dial. Learn to do it without taking your eye from the viewfinder.' },
    { control:'Highlight warning', do:'Turn blinkies on in the playback display options.' },
    { control:'Metering mode', do:'Matrix as default; switch to spot for backlit and stage lighting.' },
  ],
  mistakes:['Trusting the rear screen at night and coming home two stops under.','Leaving exposure compensation set from yesterday.'],
  drill:{
    id:'d2-meter', title:'Fool the meter on purpose', frames:9,
    brief:'Photograph three things: something white filling the frame, something black filling the frame, and a person against a bright window. Shoot each at the meter’s reading, then corrected. Check the histogram every time.',
    constraints:['Fill the frame with the tone being tested','Check the histogram before moving on','Note the compensation you used'],
    success:['White renders white and black renders black','You can predict the compensation before you look at the result'],
    reflect:['How far out was the meter on the backlit frame?'],
  },
  quiz:[
    { q:'Filling the frame with fresh snow, your meter will:', a:['Expose it correctly','Underexpose it to grey','Overexpose it','Fail to meter'], correct:1, why:'It assumes mid-grey, so it darkens everything bright.' },
    { q:'Which is unrecoverable in editing?', a:['Crushed shadows','Clipped highlights','Slight underexposure','A cool white balance'], correct:1, why:'Once a highlight clips to pure white there is no data left.' },
    { q:'Backlit portrait, matrix metering. Most useful first move:', a:['−1 stop','+1 stop','Raise ISO','Narrow the aperture'], correct:1, why:'The bright background drags the meter down, so the face needs opening up.' },
  ],
},

/* ── LEVEL 3 · SHARPNESS ───────────────────────────────────────────────── */
{
  id:'l3-focus-modes',
  level:3, title:'Focus modes and points', sub:'Telling the camera what the picture is about', minutes:6,
  idea:'Autofocus is not a single feature; it is two decisions. When does it focus, and where does it look? Get those two right and the hit rate on moving subjects goes from frustrating to routine.',
  body:[
    { h:'AF-S — single', p:'Focus once, lock, recompose, shoot. Correct for anything that is not moving: portraits, landscape, still life, architecture. The focus confirmation means it is locked and will not drift.' },
    { h:'AF-C — continuous', p:'Keeps refocusing while the shutter is half-pressed. Correct for anything moving towards or away from you: children, animals, sport, street. In AF-C the camera will fire whether or not it has achieved focus, which is the trade for never missing the moment.' },
    { h:'Where it looks', p:'Single point is the precise choice: you place the point on the eye and it goes there. Dynamic-area keeps a chosen point but uses its neighbours if the subject moves off it — the right choice for erratic subjects. Auto-area lets the camera guess, and it will usually guess the nearest high-contrast thing, which is rarely what you meant.' },
    { h:'Focus and recompose, and its limit', p:'Lock focus on the eye, then swing the camera to compose. Fast and effective — but when you swing, the focus plane swings with you, and at f/1.8 up close that can be enough to miss. Wide open, move the focus point instead of the camera.' },
    { h:'Back-button focus', p:'Move focus off the shutter button onto a rear button. The shutter then only takes pictures. Focus once and shoot ten frames without refocusing, or hold the button for continuous. It takes a week to adapt and you will never go back.' },
  ],
  points:[
    'AF-S for still subjects, AF-C for anything moving.',
    'Single point for precision, dynamic-area for erratic movement, never auto-area.',
    'At wide apertures, move the focus point rather than recomposing.',
  ],
  diagram:'af-modes',
  camera:[
    { control:'AF mode', do:'AF-S for static, AF-C for moving. Learn the button so you can switch without looking.' },
    { control:'AF-area mode', do:'Single point as your default. Dynamic 9 or 21 point for action.' },
    { control:'Back-button AF', do:'Assign AF-ON (or AE-L/AF-L) to focus, and turn off focus on the shutter release.' },
  ],
  mistakes:['Using AF-S on a walking child and wondering why every frame back-focuses.','Leaving the camera in auto-area and letting it focus on the nearest railing.'],
  drill:{
    id:'d3-focus', title:'Track something moving', frames:20,
    brief:'Ask someone to walk slowly towards you from twenty metres. Shoot ten frames in AF-S and ten in AF-C, single point on their face, at f/4 or wider. Count the hits.',
    constraints:['Same aperture for both sets','Focus point on the eye','Count sharp frames honestly at 100%'],
    success:['AF-C beats AF-S by a wide margin','You can explain what AF-S did wrong on each miss'],
    reflect:['At what distance did AF-S start failing, and why there?'],
  },
  quiz:[
    { q:'A child running towards you. Correct focus mode:', a:['AF-S','AF-C','Manual','Auto-area'], correct:1, why:'Continuous autofocus tracks changing distance; single-servo locks and goes stale.' },
    { q:'Focus-and-recompose is riskiest when:', a:['Using f/11 at distance','Using f/1.8 up close','On a tripod','In bright light'], correct:1, why:'Thin depth of field plus a swing of the camera moves the subject out of the sharp plane.' },
  ],
},
{
  id:'l3-dof-control',
  level:3, title:'Controlling depth of field', sub:'Hyperfocal, and where to actually put the focus', minutes:6,
  idea:'Depth of field is not symmetrical: roughly a third of the sharp zone falls in front of your focus point and two thirds behind. Knowing that changes where you place focus in every landscape you ever shoot.',
  body:[
    { h:'The one-third rule', p:'Focus a third of the way into the scene, not on the horizon and not on your boots. Focusing at infinity throws away the near half of your sharp zone for nothing, because there is nothing behind infinity to be sharp.' },
    { h:'Hyperfocal distance', p:'For any focal length and aperture there is a distance at which everything from half that distance to infinity is acceptably sharp. Focus there and you get the maximum possible depth. On an 18mm lens at f/8 on a crop body, that is around two metres — so focus at two metres and everything from one metre to the horizon is sharp.' },
    { h:'Portraits: the eye, always', p:'The near eye. Not the nose, not the cheek. If the eyes are sharp a viewer forgives everything else; if they are soft nothing rescues the frame.' },
    { h:'When depth is not enough', p:'Macro and close-up work can leave a sharp zone of millimetres. The answer is not f/22 — diffraction will soften the whole frame. Shoot several frames with focus stepped through the subject and blend them.' },
  ],
  points:[
    'One third in front, two thirds behind: focus into the scene, not at infinity.',
    'Hyperfocal focusing gives the maximum possible depth for a given aperture.',
    'In a portrait, sharp eyes matter more than anything else in the frame.',
  ],
  diagram:'hyperfocal',
  camera:[
    { control:'Focus point', do:'Move it to the eye rather than recomposing, whenever you have time.' },
    { control:'Live view + magnify', do:'For landscapes on a tripod, magnify 10× and confirm focus manually.' },
    { control:'Tools', do:'Use the depth-of-field calculator in this app to find the hyperfocal distance for your lens.' },
  ],
  mistakes:['Focusing on the horizon for a landscape and losing all the foreground.','Reaching for f/22 to get more depth, and softening the whole frame.'],
  drill:{
    id:'d3-hyperfocal', title:'Front to back', frames:6,
    brief:'Find a scene with something interesting within a metre and a horizon behind it. Look up the hyperfocal distance for your focal length at f/8 and f/11, focus there, and shoot. Also shoot one focused on the horizon and one on the foreground for comparison.',
    constraints:['Tripod','Same composition every frame','Note the focus distance for each'],
    success:['The hyperfocal frame is sharp from foreground to horizon','You can see exactly what focusing on the horizon threw away'],
    reflect:['How much closer than you expected was the hyperfocal point?'],
  },
  quiz:[
    { q:'Depth of field extends roughly:', a:['Equally in front and behind','One third in front, two thirds behind','All behind','All in front'], correct:1, why:'The asymmetry is why you focus into a scene rather than at its far edge.' },
    { q:'Landscape at 18mm f/8 on a crop body. Best focus point:', a:['The horizon','About two metres in','Your feet','The brightest cloud'], correct:1, why:'That is roughly the hyperfocal distance, which maximises the sharp zone.' },
  ],
},
{
  id:'l3-handholding',
  level:3, title:'Holding the camera still', sub:'Free sharpness, available immediately', minutes:4,
  idea:'A significant share of beginner softness is not focus and not the lens. It is the photographer. Technique here costs nothing and buys you two or three stops, which is more than most lens upgrades.',
  body:[
    { h:'How to stand', p:'Feet apart, one slightly forward. Elbows tucked into your ribs — not winged out. Left hand under the lens supporting the weight, right hand on the grip. Camera pressed to your eye so your face is a third point of contact.' },
    { h:'How to breathe', p:'Breathe out, pause, then squeeze — do not stab at the shutter. Rifle shooters have known this for a century and it is exactly the same problem.' },
    { h:'Use the world', p:'Lean against a wall, kneel and brace an elbow on your knee, put the camera on a bollard, a bag, a railing. Almost anywhere you shoot has something solid within reach.' },
    { h:'Fire three', p:'Shoot bursts of three at slow speeds. The first frame absorbs the shutter press, the middle two are usually the sharpest. Costs nothing, and it works.' },
    { h:'Stabilisation, honestly', p:'VR/IS buys about three stops against your own shake. It does nothing at all about a subject that is moving. Turn it off on a tripod, where it can hunt and actually add blur.' },
  ],
  points:[
    'Elbows in, breathe out, squeeze — three stops for free.',
    'Fire three frames at slow speeds and keep the middle one.',
    'Stabilisation fights your shake, never your subject’s movement.',
  ],
  diagram:'handhold',
  camera:[
    { control:'Release mode', do:'Continuous low. Bursts of three become automatic.' },
    { control:'VR / IS', do:'On when handheld, off on a tripod.' },
  ],
  mistakes:['Holding the camera at arm’s length on the rear screen at 1/30.','Leaving stabilisation on for a thirty-second tripod exposure.'],
  drill:{
    id:'d3-handhold', title:'Find your own limit', frames:24,
    brief:'At one focal length, shoot a detailed static subject at 1/125, 1/60, 1/30, 1/15 and 1/8 — six frames at each speed, using proper technique. Review at 100% and work out the slowest speed at which you get four sharp frames out of six.',
    constraints:['Same focal length and subject','Six frames per speed','Judge at 100%, not on the rear screen'],
    success:['You know your personal handheld limit as a number'],
    reflect:['How did your limit compare with the reciprocal rule?'],
  },
  quiz:[
    { q:'Image stabilisation helps with:', a:['Subject movement','Camera shake','Both equally','Focus errors'], correct:1, why:'It corrects the camera’s movement only. A running child still needs shutter speed.' },
    { q:'On a tripod for a 30-second exposure, stabilisation should be:', a:['On','Off','Set to panning mode','It makes no difference'], correct:1, why:'With nothing to correct, the system can hunt and introduce its own blur.' },
  ],
},
{
  id:'l3-tack-sharp',
  level:3, title:'Everything else that costs you sharpness', sub:'Diffraction, filters, and the shutter itself', minutes:5,
  idea:'Once focus and shake are handled, the remaining softness has a small number of causes, and each has a specific fix. Knowing which one you are looking at saves you from buying a lens you did not need.',
  body:[
    { h:'Diffraction', p:'Past about f/11 on a crop sensor, light bending around the aperture blades softens the entire frame — evenly, so it does not look like a focus error. More depth of field, less detail. Beyond f/16 the trade is almost never worth it.' },
    { h:'Cheap filters', p:'A poor UV filter in front of a good lens costs you contrast and adds flare around every light source. If you use protection, buy properly coated glass, and take it off at night.' },
    { h:'Shutter shock and mirror slap', p:'On a DSLR between roughly 1/15 and 1 second, the mirror flipping up can vibrate the camera. Use mirror lock-up or exposure delay mode on a tripod in that range.' },
    { h:'Diagnosing softness', p:'Whole frame evenly soft at a small aperture: diffraction. Whole frame smeared in one direction: shake. Subject soft, background sharp: missed focus. Everything soft with haloes around lights: filter or condensation. Match the symptom to the cause before changing anything.' },
  ],
  points:[
    'Diffraction softens everything past about f/11 on a crop sensor.',
    'Directional smear means shake; sharp background with a soft subject means missed focus.',
    'Use exposure delay or mirror lock-up between 1/15 and 1s on a tripod.',
  ],
  diagram:'sharpness-diagnosis',
  camera:[
    { control:'Exposure delay mode', do:'On, for tripod work between 1/15 and 1 second.' },
    { control:'Self-timer', do:'Two seconds, so your hand is off the camera when the shutter opens.' },
  ],
  mistakes:['Blaming the lens for diffraction at f/22.','Leaving a scratched filter on the lens for night photography.'],
  drill:{
    id:'d3-diffraction', title:'Find where diffraction starts', frames:7,
    brief:'On a tripod, photograph a detailed flat subject — a brick wall, a newspaper — at every full stop from wide open to the smallest aperture your lens has. Compare the centre at 100%.',
    constraints:['Tripod, self-timer, stabilisation off','Perfectly flat subject, parallel to the sensor','Same focus point throughout'],
    success:['You can name the aperture where your lens is sharpest, and where it starts to fall off'],
    reflect:['How much detail did f/22 actually cost you compared with f/8?'],
  },
  quiz:[
    { q:'The entire frame is evenly soft at f/22 on a tripod. Cause:', a:['Missed focus','Camera shake','Diffraction','A dirty sensor'], correct:2, why:'Diffraction softens uniformly and gets worse the further you stop down.' },
    { q:'Subject soft, background sharp. Cause:', a:['Diffraction','Back-focus','Shutter shock','High ISO'], correct:1, why:'The sharp plane landed behind your subject — a focus placement problem.' },
  ],
},

/* ── LEVEL 4 · LIGHT ───────────────────────────────────────────────────── */
{
  id:'l4-direction',
  level:4, title:'Direction of light', sub:'Front, side, back — and why side wins', minutes:6,
  idea:'Where the light comes from relative to your subject decides whether the photograph looks flat, sculpted or luminous. It is the first thing to notice and the easiest thing to change: you move.',
  body:[
    { h:'Front light', p:'Sun behind you, falling on the subject’s face. Even, safe, and flat — it fills in every shadow, and shadows are what create the impression of three dimensions. It is what the old advice about standing with the sun behind you produces, and it is why those photographs look like documents.' },
    { h:'Side light', p:'Light across the subject at ninety degrees. One side lit, one side in shadow, texture raked out. This is the light that makes stone look like stone and a face look like a sculpture. When in doubt, put the light to the side.' },
    { h:'Back light', p:'Light behind the subject, coming towards you. A bright rim around hair and shoulders, the subject separated from the background, air and dust made visible. It is the most beautiful and the most technically demanding: your meter will underexpose the face, so add about a stop of compensation, or spot-meter the face.' },
    { h:'Top light', p:'Midday sun from overhead. Eye sockets go black, a shadow sits under the nose. Almost always the worst option for a face. Move into open shade, use a reflector or fill flash, or photograph something other than a person.' },
    { h:'Working it out', p:'Look at the shadows on the ground, not at the sun. Shadows point away from the source, and their length tells you how low it is. Then walk around your subject until the shadow falls where you want it.' },
  ],
  points:[
    'Front light is flat, side light sculpts, back light glows.',
    'Backlight needs about +1 stop, or spot-meter the face.',
    'Read the shadows to find the light, then move around your subject.',
  ],
  diagram:'light-direction',
  camera:[
    { control:'Exposure compensation', do:'+1 for backlit subjects as a starting point, then check the histogram.' },
    { control:'Metering', do:'Spot metering on the face is more reliable than compensation when the background is extreme.' },
    { control:'Lens hood', do:'On for backlight, unless you want the flare — in which case take it off deliberately.' },
  ],
  mistakes:['Putting the sun behind yourself out of habit and producing flat, squinting portraits.','Shooting into the light without compensating and getting a silhouette you did not want.'],
  drill:{
    id:'d4-direction', title:'Walk around the light', frames:12,
    brief:'One subject, outdoors, in sun. Photograph it front-lit, side-lit and back-lit by walking around it — four frames each. Do not move the subject.',
    constraints:['Same subject, same focal length','You move, not the subject','Compensate for the backlit set'],
    success:['The three sets look like three different photographs','The backlit set has a readable subject, not a silhouette'],
    reflect:['Which direction suited this subject, and would that hold for a different subject?'],
  },
  quiz:[
    { q:'Which direction reveals texture best?', a:['Front','Side','Back','Top'], correct:1, why:'Raking light across a surface throws every small relief into shadow.' },
    { q:'A backlit portrait metered normally comes out:', a:['Too bright','A dark face','Correctly exposed','Too warm'], correct:1, why:'The bright background drags the meter down, underexposing the face.' },
  ],
},
{
  id:'l4-quality',
  level:4, title:'Hard light and soft light', sub:'It is the size of the source, nothing else', minutes:5,
  idea:'Soft light has gradual shadow edges; hard light has sharp ones. What decides it is the apparent size of the light source relative to the subject — not the weather, not the brightness, not the time of day.',
  body:[
    { h:'The rule', p:'Big source close to the subject = soft. Small source far away = hard. The sun is enormous but so distant that it acts as a small source, which is why direct sun is hard. Put cloud in front of it and the whole sky becomes the source: huge, close, soft.' },
    { h:'What each is good for', p:'Soft light is forgiving and flattering: portraits, food, anything with texture you do not want emphasised. Hard light is dramatic and graphic: strong shadows, high contrast, shapes and silhouettes. Neither is better. Choosing deliberately is what matters.' },
    { h:'Making light softer for free', p:'Move your subject next to a large window, into open shade, or under an overhang. Wait for cloud. Bounce a flash off a white ceiling instead of firing it straight ahead. All of these enlarge the effective source.' },
    { h:'Distance changes everything', p:'A window two metres from your subject is a big soft source. The same window ten metres away is small and comparatively hard, and the falloff across the subject is much gentler. Moving your subject a metre closer to a window is often the entire fix.' },
  ],
  points:[
    'Soft = large source close by. Hard = small source far away.',
    'Cloud converts the sun from a small hard source into a giant soft one.',
    'Moving a subject closer to a window is the cheapest lighting modifier there is.',
  ],
  diagram:'light-quality',
  camera:[
    { control:'Pop-up flash', do:'Almost never fire it straight at a subject. If you must, hold a white card at 45° to bounce it upward.' },
    { control:'White balance', do:'Open shade is blue. Set the Shade preset or correct it in RAW.' },
  ],
  mistakes:['Photographing a face in direct midday sun and blaming the camera.','Assuming overcast means bad light — for portraits it is often the best light of the day.'],
  drill:{
    id:'d4-quality', title:'Hard and soft, same subject', frames:8,
    brief:'Photograph the same subject in direct sun and then in open shade or beside a large window. Four frames each, same framing.',
    constraints:['Same subject and framing','One set hard, one set soft','Note the time and conditions for each'],
    success:['You can point at the shadow edges and explain which is which'],
    reflect:['Which suited the subject, and what would have changed your answer?'],
  },
  quiz:[
    { q:'What makes light soft?', a:['Low brightness','A large source close to the subject','A warm colour','A slow shutter'], correct:1, why:'Apparent source size is the only thing that decides shadow-edge hardness.' },
    { q:'Direct sunlight is hard because the sun is:', a:['Very bright','Very hot','Very far away, so it acts small','Yellow'], correct:2, why:'Enormous in reality, tiny in apparent size — so its shadows have hard edges.' },
  ],
},
{
  id:'l4-colour',
  level:4, title:'The colour of light', sub:'White balance, and when to lie about it', minutes:5,
  idea:'Light is not white. Candlelight is deep orange, midday sun is neutral, shade is blue, and a fluorescent office is green. White balance tells the camera what to call white — and sometimes the truthful answer is not the best one.',
  body:[
    { h:'Kelvin, roughly', p:'Candle around 1900K, tungsten bulb 2800K, sunrise 3200K, midday 5500K, overcast 6500K, deep shade 8000K. Low numbers are warm, high numbers are cool — which feels backwards, and simply has to be learned.' },
    { h:'Auto is good, not perfect', p:'Modern auto white balance handles mixed lighting well but neutralises exactly the warmth you went out at sunset to capture. If your golden-hour frames look disappointingly grey, that is auto white balance doing its job too well.' },
    { h:'Lie deliberately', p:'Set Cloudy or Shade in warm light to push it further. Set Tungsten under normal light for a cold blue night look. White balance is a creative control with as much reach as any filter.' },
    { h:'RAW makes it free', p:'In a RAW file, white balance is metadata — you can change it afterwards with no penalty at all. In a JPEG it is baked in, and correcting it later costs quality. This is one of the strongest arguments for shooting RAW while learning.' },
    { h:'Mixed light', p:'A room lit by both a window and a tungsten lamp cannot be neutral everywhere. Pick which source your subject sits in, balance for that, and let the other go warm or cool as a deliberate part of the frame.' },
  ],
  points:[
    'Low Kelvin is warm, high Kelvin is cool.',
    'Auto white balance often cancels the very warmth you came for.',
    'In RAW, white balance is free to change afterwards.',
  ],
  diagram:'kelvin',
  camera:[
    { control:'White balance', do:'Auto for mixed lighting, Cloudy or Shade to keep golden hour warm, fixed preset for anything sequential.' },
    { control:'Format', do:'RAW while you are learning. White balance and exposure become adjustable rather than final.' },
  ],
  mistakes:['Shooting a sunset on auto white balance and losing all the colour.','Using auto white balance across a time-lapse, so the colour flickers frame to frame.'],
  drill:{
    id:'d4-wb', title:'Same scene, five white balances', frames:5,
    brief:'One warm-lit scene at golden hour or under lamps. Shoot it on Auto, Daylight, Cloudy, Shade and Tungsten without changing anything else.',
    constraints:['Identical framing and exposure','Five white balance settings','Shoot RAW so you can compare properly'],
    success:['You can predict which preset warms and which cools before you look'],
    reflect:['Which one matched what you actually saw, and which one matched what you felt?'],
  },
  quiz:[
    { q:'Which is the warmest light?', a:['2800K','5500K','6500K','8000K'], correct:0, why:'Low colour temperature is orange; high is blue.' },
    { q:'Your sunset frames look grey and disappointing. Likely cause:', a:['ISO too high','Auto white balance neutralising the warmth','Shutter too slow','Aperture too narrow'], correct:1, why:'Auto white balance corrects the colour cast you deliberately went out to photograph.' },
  ],
},
{
  id:'l4-golden-blue',
  level:4, title:'Golden hour and blue hour', sub:'Two windows that do most of the work', minutes:5,
  idea:'The hour after sunrise and before sunset gives you low, warm, directional light for free. The twenty minutes after sunset gives you a sky that balances with artificial light. Being in position for either is more valuable than any equipment decision you will make.',
  body:[
    { h:'Golden hour', p:'The sun is low, so light travels through more atmosphere: warmer, softer, and coming from the side rather than overhead. Long shadows, rim light, and faces that do not squint. It is not an hour — nearer forty minutes, and much shorter near the equator.' },
    { h:'Be early', p:'Amateurs arrive when the light is good. The light is gone by the time they have chosen a spot. Arrive half an hour early, find the frame, set up, and wait for the light to come to it.' },
    { h:'Blue hour', p:'Roughly twenty minutes after sunset — or before sunrise — when the sun is between four and six degrees below the horizon. The sky is a deep saturated blue and still bright enough to balance with street lights and windows. It is the best light of the day for cities, and it is genuinely brief.' },
    { h:'Shoot through it', p:'During blue hour the light drops about a stop every few minutes. Set up on a tripod, stay in one position, and keep shooting the same frame. The best version is often four minutes after you thought you were finished.' },
    { h:'Overcast counts too', p:'A grey day is a giant softbox: perfect for portraits, forests, waterfalls and detail. It is only bad for big landscape vistas, where a white sky is dead space. Point the camera down instead.' },
  ],
  points:[
    'Arrive thirty minutes early and let the light come to your frame.',
    'Blue hour lasts about twenty minutes and balances sky with city lights.',
    'Overcast is excellent light — just keep the white sky out of the frame.',
  ],
  diagram:'golden-blue',
  camera:[
    { control:'White balance', do:'Cloudy or Shade during golden hour to keep the warmth.' },
    { control:'Tripod', do:'Essential for blue hour — exposures run from a fraction of a second to many seconds.' },
    { control:'Tools', do:'Use the light-timing tool in this app to see exactly when each window opens where you are.' },
  ],
  mistakes:['Packing up at sunset and missing blue hour entirely.','Including a blank white sky in an overcast landscape.'],
  drill:{
    id:'d4-blue', title:'Shoot through blue hour', frames:15,
    brief:'Find a city or building view. Set up on a tripod fifteen minutes before sunset and shoot the same frame every three minutes until it is fully dark. Do not move.',
    constraints:['Tripod, one composition','A frame every three minutes','Keep shooting for at least forty minutes past sunset'],
    success:['You can identify the exact frame where sky and artificial light balance'],
    reflect:['How long after sunset was your best frame taken?'],
  },
  quiz:[
    { q:'Blue hour is best defined as:', a:['Any time after sunset','When the sun is 4–6° below the horizon','The hour before sunrise','When street lights turn on'], correct:1, why:'It is a sun-elevation window, which is why it moves with the season and latitude.' },
    { q:'Overcast light is worst for:', a:['Portraits','Waterfalls','Wide landscapes with sky','Forest detail'], correct:2, why:'A featureless white sky is dead space in a wide landscape.' },
  ],
},
{
  id:'l4-fill-flash',
  level:4, title:'Adding light', sub:'Reflectors and fill flash, without the deer-in-headlights look', minutes:5,
  idea:'Sometimes the light is nearly right and just needs help in the shadows. A reflector or a small amount of flash fills those shadows without changing the character of the light — which is the opposite of what most beginners do with flash.',
  body:[
    { h:'Fill, do not replace', p:'The mistake is firing full-power flash straight at a subject: it becomes the main light, kills the existing light entirely, and produces a bright face against a black background. Dial flash compensation down to about −1.3 stops and it fills shadows while the ambient light still does the shaping.' },
    { h:'Bounce it', p:'Aim the flash at a white ceiling or wall. The reflected pool of light is enormous relative to your subject, so it is soft, and it comes from a natural direction. Straight-on flash from a small tube is the smallest, hardest source you own.' },
    { h:'Reflectors', p:'A white card, a sheet of polystyrene, a car sunshade, a white wall. Position it opposite the light source and angle it back into the shadow side. Free, silent, and you can see the result before you shoot.' },
    { h:'Backlight plus fill', p:'The classic outdoor portrait: sun behind the subject for rim light, reflector or fill flash from the front for the face. Rich and dimensional, and impossible to get from front lighting alone.' },
    { h:'Sync speed', p:'Flash will not work faster than about 1/200 on most cameras. In bright sun you may need to stop down or use a neutral-density filter to get the ambient exposure down to where flash can reach it.' },
  ],
  points:[
    'Flash compensation around −1.3 fills shadows without taking over.',
    'Bounce off a ceiling or wall to make the source big and soft.',
    'Backlight plus a reflector is the most reliable outdoor portrait recipe there is.',
  ],
  diagram:'fill-flash',
  camera:[
    { control:'Flash compensation', do:'Start at −1.3 EV for fill. Adjust from there.' },
    { control:'Flash mode', do:'Fill flash, not auto. Turn off red-eye reduction — the pre-flash makes people blink.' },
    { control:'Sync speed', do:'Keep the shutter at or below 1/200 whenever flash is firing.' },
  ],
  mistakes:['Firing full flash straight at a person in a dark room.','Leaving red-eye reduction on and catching everyone mid-blink.'],
  drill:{
    id:'d4-fill', title:'Fill the shadow side', frames:9,
    brief:'Portrait in side light or backlight. Shoot it with no fill, then with a white card reflector, then with flash at −1.3 EV. Three frames each, same framing.',
    constraints:['Same framing and exposure across all nine','Reflector opposite the light source','Flash compensation at −1.3, not zero'],
    success:['The filled frames keep the character of the original light'],
    reflect:['Could you tell which frames used flash? If yes, the flash was too strong.'],
  },
  quiz:[
    { q:'Good starting flash compensation for fill:', a:['+1 EV','0 EV','−1.3 EV','−3 EV'], correct:2, why:'Enough to open shadows, not enough to become the main light.' },
    { q:'Bouncing flash off a ceiling makes the light:', a:['Harder','Softer','Warmer only','Brighter'], correct:1, why:'The ceiling becomes a large source, so shadow edges soften.' },
  ],
},

/* ── LEVEL 5 · COMPOSITION ─────────────────────────────────────────────── */
{
  id:'l5-thirds-beyond',
  level:5, title:'Thirds, and what to use instead', sub:'A starting grid, not a law', minutes:5,
  idea:'Rule of thirds: place important elements a third of the way in, rather than dead centre. It is a useful default that stops beginners centring everything. It is also the shallowest compositional idea there is, and you should outgrow it.',
  body:[
    { h:'Why it works at all', p:'Off-centre placement creates tension and gives the eye somewhere to travel. Dead centre resolves everything immediately, which is why it feels static unless the frame is deliberately symmetrical.' },
    { h:'What it does not tell you', p:'It says nothing about balance between elements, about what is in the negative space, about how the eye enters the frame, or about the relationship between subject and background. Frames can obey it perfectly and still be dull.' },
    { h:'Better questions', p:'Where does the eye land first, and where does it go next? What balances the subject on the opposite side? Is there a path into the frame? Is anything competing with the subject for attention?' },
    { h:'Deliberate centring', p:'Centre when the subject is symmetrical, when you want confrontation and stillness, or when the frame itself is a strong geometric shape. The distinction between a centred frame and a lazy one is whether you chose it.' },
    { h:'Horizons', p:'A high horizon emphasises land and foreground; a low horizon emphasises sky. Halfway divides the frame into two competing halves — which occasionally is exactly what a reflection needs, and is otherwise indecisive.' },
  ],
  points:[
    'Thirds is a default that beats centring by accident.',
    'Ask where the eye lands and where it travels next.',
    'Centre deliberately or not at all; keep horizons off the middle unless reflecting.',
  ],
  diagram:'thirds',
  camera:[
    { control:'Grid', do:'Keep the thirds grid on, but treat it as a reminder rather than an instruction.' },
    { control:'Virtual horizon', do:'Use it. A crooked horizon undermines an otherwise good frame.' },
  ],
  mistakes:['Putting the subject on a thirds line and thinking the composition is finished.','Splitting the frame exactly in half with the horizon by default.'],
  drill:{
    id:'d5-thirds', title:'Break it deliberately', frames:10,
    brief:'Shoot five frames that obey the rule of thirds and five that deliberately break it — dead centre, hard against an edge, subject tiny in a large space. Make each broken frame work.',
    constraints:['Five obeying, five breaking','Each broken frame must have a reason you can state'],
    success:['At least two broken frames are stronger than their obedient equivalents'],
    reflect:['What made the successful rule-breaks work?'],
  },
  quiz:[
    { q:'Placing a horizon dead centre is:', a:['Always wrong','Right for reflections and symmetry','The default','Only for landscapes'], correct:1, why:'Halving the frame works when the two halves genuinely mirror each other.' },
    { q:'The rule of thirds mainly protects beginners from:', a:['Bad exposure','Centring everything by accident','Camera shake','Wrong white balance'], correct:1, why:'It is a corrective habit, not a theory of composition.' },
  ],
},
{
  id:'l5-lines-shapes',
  level:5, title:'Lines, shapes and the path of the eye', sub:'Directing attention on purpose', minutes:6,
  idea:'A viewer’s eye enters a photograph, travels, and either settles on your subject or leaves. Lines, shapes and contrast are the controls you have over that journey.',
  body:[
    { h:'Leading lines', p:'Roads, fences, shadows, railings, a row of windows — anything linear pulls the eye along it. Point them at your subject and you have delivered the viewer. Point them out of the frame and you have shown them the exit.' },
    { h:'Diagonals', p:'Horizontal lines feel calm, vertical lines feel stable, diagonals feel dynamic. Tilting your position slightly turns a static row into a diagonal that moves.' },
    { h:'Frames within frames', p:'Shoot through a doorway, an arch, a gap in foliage, a window. It adds depth, hides clutter, and tells the viewer exactly where to look. One of the most reliable techniques in the book.' },
    { h:'Repetition and the break', p:'Patterns are satisfying; a break in a pattern is a subject. A row of identical chairs is a texture. A row of identical chairs with one red one is a photograph.' },
    { h:'Where the eye actually goes', p:'In order of pull: the brightest area, the sharpest area, faces and eyes, high-contrast edges, then converging lines. If any of those point somewhere other than your subject, the frame is fighting you.' },
  ],
  points:[
    'Lines deliver the eye — aim them at your subject.',
    'Frames within frames add depth and hide clutter.',
    'A break in a pattern is a subject; a pattern alone is a texture.',
  ],
  diagram:'leading-lines',
  camera:[
    { control:'Focal length', do:'Wide angles exaggerate converging lines; long lenses compress and flatten them.' },
    { control:'Height', do:'Crouch or climb. Lines converge differently from every height, and standing is only one of them.' },
  ],
  mistakes:['Leading lines that point straight out of the frame past the subject.','Photographing a pattern with no break and calling it a composition.'],
  drill:{
    id:'d5-lines', title:'Deliver the eye', frames:9,
    brief:'Make three frames using leading lines, three shooting through a natural frame, and three of a pattern with a single break in it.',
    constraints:['Three of each type','The subject must sit where the line or frame points'],
    success:['A viewer looks at your subject first in every frame'],
    reflect:['Which of the three techniques came most naturally, and which did you have to hunt for?'],
  },
  quiz:[
    { q:'What pulls the eye most strongly?', a:['The largest object','The brightest area','The centre','The warmest colour'], correct:1, why:'Brightness wins, which is why a blown-out corner ruins a frame.' },
    { q:'Shooting through a doorway mainly adds:', a:['Sharpness','Depth and focus of attention','Exposure latitude','Colour'], correct:1, why:'The frame layers the image and directs where the viewer looks.' },
  ],
},
{
  id:'l5-depth-layers',
  level:5, title:'Depth and layers', sub:'Making a flat rectangle feel three-dimensional', minutes:5,
  idea:'A photograph is flat. The impression of depth is manufactured — with layers, with scale, with overlapping objects, and with light falling off into the distance. Learn to build it and ordinary scenes gain dimension.',
  body:[
    { h:'Foreground, middle, background', p:'Put something in the near ground. A rock, a branch, a railing, a person’s shoulder. The viewer reads near-versus-far immediately and the frame stops being a wall.' },
    { h:'Overlap', p:'Objects that overlap tell the eye what is in front of what. A frame where everything sits side by side with no overlap reads flat, however wide the scene.' },
    { h:'Atmospheric perspective', p:'Distant things are paler, cooler and lower in contrast. Include near and far in one frame and the difference itself communicates distance — this is why mist and haze photograph so well.' },
    { h:'Compression and expansion', p:'A wide lens up close exaggerates distance: near things loom, far things shrink. A long lens compresses: layers stack up on each other like scenery flats. Both are choices about how space reads, not just how much fits in.' },
    { h:'Light as depth', p:'A lit subject against a dark background separates instantly. If your subject and background are the same brightness they merge, no matter how much space is between them.' },
  ],
  points:[
    'Add a foreground element and the frame gains depth immediately.',
    'Wide lenses exaggerate distance; long lenses stack layers flat.',
    'Separate subject from background by brightness, not just by distance.',
  ],
  diagram:'layers',
  camera:[
    { control:'Focal length', do:'Try the same scene at 18mm from close and 55mm from far back. The subject stays the same size; the world behind it changes completely.' },
    { control:'Aperture', do:'Deep enough to keep the foreground readable — around f/8 to f/11 for a layered landscape.' },
  ],
  mistakes:['Shooting a wide landscape with nothing in the near ground.','Placing a dark subject against a dark background so they merge.'],
  drill:{
    id:'d5-layers', title:'Three planes', frames:8,
    brief:'Make eight frames that each contain a clear foreground, middle ground and background. At least three should use a long lens to compress the layers.',
    constraints:['Three distinct planes in every frame','At least three frames above 100mm equivalent'],
    success:['A viewer can point at all three planes without being prompted'],
    reflect:['Did the wide or the long frames feel deeper, and why?'],
  },
  quiz:[
    { q:'A long lens tends to:', a:['Exaggerate distance','Compress layers together','Add depth of field','Increase contrast'], correct:1, why:'Telephoto compression stacks near and far elements onto each other.' },
    { q:'Fastest way to add depth to a flat landscape:', a:['Raise ISO','Add a foreground element','Use a faster shutter','Shoot vertically'], correct:1, why:'A near element gives the eye a reference for near versus far.' },
  ],
},
{
  id:'l5-simplify',
  level:5, title:'Simplify', sub:'Negative space and the discipline of leaving things out', minutes:5,
  idea:'Strong photographs usually contain fewer elements than beginners expect. Every additional object divides the viewer’s attention. The most reliable edit is subtraction.',
  body:[
    { h:'Negative space', p:'Empty area around a subject is not wasted; it is what gives the subject room to be seen. A small subject in a large clean space is often far stronger than the same subject filling the frame.' },
    { h:'One idea per frame', p:'If you are trying to show the market and the light and the old man and the architecture, you will show none of them. Pick one. Shoot the others separately.' },
    { h:'Simplify by moving', p:'Crouch so the background becomes sky. Step left so the bin is behind a wall. Get closer so the clutter falls outside the frame. Simplification is a physical act far more often than a settings change.' },
    { h:'Simplify with light', p:'Expose for a lit subject and let everything else fall to black. Darkness is the cleanest background available, and it is free at night and in any doorway.' },
    { h:'The three-second test', p:'Show someone a frame for three seconds and ask what it was about. If they hesitate, the frame has too much in it.' },
  ],
  points:[
    'Empty space gives the subject room to be seen.',
    'One idea per frame — shoot the second idea as a second frame.',
    'Exposing for the light and letting the rest go black is the cleanest simplification there is.',
  ],
  diagram:'negative-space',
  camera:[
    { control:'Metering', do:'Spot-meter the lit area to let surroundings fall dark deliberately.' },
    { control:'Position', do:'Crouch to put sky behind your subject; it is the simplest background available outdoors.' },
  ],
  mistakes:['Trying to include everything that made the moment feel good.','Filling every corner of the frame because empty space feels like waste.'],
  drill:{
    id:'d5-simplify', title:'Two elements maximum', frames:10,
    brief:'Ten frames, each containing no more than two identifiable elements. Subject plus one thing. Nothing else in the frame.',
    constraints:['Maximum two elements per frame','No cropping afterwards — get it right in camera'],
    success:['Every frame passes the three-second test with a stranger'],
    reflect:['What did you have to do physically to get the third element out?'],
  },
  quiz:[
    { q:'Negative space around a subject:', a:['Wastes resolution','Gives the subject room and emphasis','Should be filled','Only suits minimalism'], correct:1, why:'Emptiness directs attention and gives a subject weight.' },
    { q:'The cleanest free background at night is:', a:['A wall','Darkness','Sky','A crowd'], correct:1, why:'Exposing for a lit subject lets everything else fall to black.' },
  ],
},
{
  id:'l5-moment',
  level:5, title:'The moment', sub:'Anticipation beats reaction, every time', minutes:5,
  idea:'By the time you have seen something happen and pressed the shutter, it has happened. Photographers who consistently catch moments are not faster — they set up and wait for something they predicted.',
  body:[
    { h:'Pre-visualise', p:'Find the frame first: good light, clean background, interesting geometry. Set exposure and focus for it. Then wait for the subject to walk into a photograph you have already made.' },
    { h:'Watch the rhythm', p:'Most situations repeat. A skateboarder tries the same trick eight times. Waves break at intervals. A street corner fills and empties. Watch two cycles before you shoot the third, and you will know exactly when to fire.' },
    { h:'Gesture over expression', p:'A hand mid-movement, a leaning body, two people’s heads turning together — these read from across a room. A frozen smile rarely says anything. Watch hands and posture, not just faces.' },
    { h:'Burst, but not blindly', p:'Continuous shooting helps within a moment you have already anticipated. It does not help you find one. Ten frames of a badly composed gesture are still ten bad frames.' },
    { h:'The frame after', p:'Keep shooting for two seconds after you think it is over. The reaction — the laugh afterwards, the exhale, the glance back — is frequently better than the event itself.' },
  ],
  points:[
    'Set up the frame first, then wait for the subject to enter it.',
    'Watch two cycles of a repeating action before shooting the third.',
    'Keep shooting for two seconds after you think the moment has passed.',
  ],
  diagram:'moment',
  camera:[
    { control:'Release mode', do:'Continuous. Short bursts around an anticipated peak.' },
    { control:'Pre-focus', do:'Focus on the spot the action will reach, then wait — faster than any autofocus system.' },
    { control:'Buffer', do:'Use a fast card. A full buffer at the wrong moment costs you the frame.' },
  ],
  mistakes:['Chasing action around and reacting to it.','Firing a hundred frames hoping one works.'],
  drill:{
    id:'d5-moment', title:'Set the trap', frames:12,
    brief:'Find a spot where something repeats — a crossing, a doorway, a skate spot. Compose and expose for the empty frame. Wait, and shoot only when someone enters it well. Give it thirty minutes.',
    constraints:['One composition, held for thirty minutes','Pre-focused, exposure locked','Shoot only when the frame is genuinely right'],
    success:['At least two frames where the subject occupies exactly the space you left'],
    reflect:['How many times did you fire too early?'],
  },
  quiz:[
    { q:'The most reliable way to catch a moment is to:', a:['Shoot faster','Set up the frame and wait','Use burst mode constantly','Use a longer lens'], correct:1, why:'Anticipation puts you ahead of the action instead of chasing it.' },
    { q:'Reading across a room, which carries best?', a:['A smile','A gesture or posture','Sharp eyes','Colour'], correct:1, why:'Body language is legible at any size; small expressions are not.' },
  ],
},

/* ── LEVEL 6 · SUBJECTS ────────────────────────────────────────────────── */
{
  id:'l6-portrait',
  level:6, title:'Portraits', sub:'Distance, focal length, eyes, and making people comfortable', minutes:7,
  idea:'A good portrait is mostly a good interaction, plus three technical decisions: how far away you stand, where you focus, and where the light is. Get those right and equipment barely matters.',
  body:[
    { h:'Focal length changes the face', p:'A wide lens up close enlarges whatever is nearest — usually the nose — and it is unflattering. Step back and use 50 to 105mm equivalent, and facial proportions render naturally. On a crop body, roughly 35 to 70mm. The lens does not distort the face; the short distance does.' },
    { h:'Focus on the near eye', p:'Every time. At f/1.8 the depth of field at portrait distance can be under five centimetres — sharp eyelashes and a soft ear. If both eyes cannot be sharp, the near one must be.' },
    { h:'Light on the face', p:'Turn your subject until the light shapes the face rather than flattening it — the classic positions put a small triangle of light on the shadowed cheek. Open shade with a bright opening in front of them is the easiest good portrait light there is.' },
    { h:'Eye level, or lower', p:'Shooting down at an adult diminishes them; shooting up gives them presence. Photograph children from their own eye level and the pictures stop looking like surveillance.' },
    { h:'The interaction', p:'Talk. Give simple directions — "look at me, now look away, now back" — because people cannot pose from nothing. Shoot through the awkwardness; the first thirty frames are usually warm-up, and the good ones come once they forget the camera.' },
    { h:'Hands and posture', p:'Hands are the second most expressive thing after eyes and the most common source of awkwardness. Give them something to do: a pocket, a cup, a doorframe. Weight on the back foot, chin slightly forward and down.' },
  ],
  points:[
    'Stand back and use 50–105mm equivalent; short distance is what distorts faces.',
    'Focus on the near eye without exception.',
    'Give simple directions — nobody can pose from a blank instruction.',
  ],
  diagram:'portrait-light',
  camera:[
    { control:'Mode', do:'A mode, f/2 to f/4 for a single person, f/5.6 or narrower for two or more.' },
    { control:'AF', do:'AF-S, single point on the near eye. Eye-detection if your body has it.' },
    { control:'Metering', do:'Spot or centre-weighted on the face when the background is much brighter or darker.' },
  ],
  mistakes:['Shooting a face at 18mm from a metre away.','Group shot at f/1.8, with only one person in focus.'],
  drill:{
    id:'d6-portrait', title:'One person, twenty frames', frames:20,
    brief:'Photograph one willing person for twenty minutes. Start at eye level in open shade. Change one thing at a time: distance, then their direction relative to the light, then your height, then give them something to do with their hands.',
    constraints:['One person, twenty frames','Focus on the near eye every time','Change only one variable per set'],
    success:['At least three frames where they look comfortable rather than posed','The eyes are sharp in every keeper'],
    reflect:['Which change made the biggest difference — light, height or distance?'],
  },
  quiz:[
    { q:'A face looks distorted with a big nose. The cause is:', a:['The lens','Standing too close','Aperture too wide','ISO too high'], correct:1, why:'Proximity exaggerates the nearest features; the focal length just tempts you closer.' },
    { q:'Photographing two people, minimum sensible aperture is around:', a:['f/1.4','f/2','f/5.6','f/22'], correct:2, why:'You need enough depth to keep both faces in the sharp zone.' },
  ],
},
{
  id:'l6-landscape',
  level:6, title:'Landscape', sub:'Foreground, timing, and having a reason', minutes:6,
  idea:'A landscape without a subject is a view. The technical side is straightforward — tripod, f/8 to f/11, hyperfocal focus. The hard part is having something for the frame to be about, and being there when the light is right.',
  body:[
    { h:'Give it a subject', p:'A tree, a rock, a building, a person for scale, a shaft of light. Something the eye can land on. Beautiful terrain alone rarely survives being flattened into a rectangle.' },
    { h:'The near ground does the work', p:'Get low and close to something in the foreground. It gives depth, scale and a way into the frame. Most weak landscape photographs are shot from standing height with nothing within ten metres.' },
    { h:'The settings are the easy part', p:'Tripod. f/8 to f/11. Base ISO. Focus about a third in, or at the hyperfocal distance. Two-second timer. Mirror lock-up if the shutter is between 1/15 and one second.' },
    { h:'Managing the sky', p:'Bright sky and dark land can exceed what the sensor holds in one frame. Use a graduated filter, bracket three exposures and blend, or simply compose with less sky. Expose so the highlights just avoid clipping and lift the shadows afterwards.' },
    { h:'Weather is the subject', p:'Clearing storms, mist, low cloud catching light, rain on the road. Blue-sky days are the least interesting conditions there are. Go out in bad weather and stay for the ten minutes after it breaks.' },
  ],
  points:[
    'Every landscape needs a subject, not just a view.',
    'Get low and close to a foreground element.',
    'The best landscape light is the ten minutes after bad weather breaks.',
  ],
  diagram:'landscape-layers',
  camera:[
    { control:'Mode', do:'A mode at f/8–f/11, base ISO, on a tripod.' },
    { control:'Focus', do:'Hyperfocal distance, confirmed in magnified live view.' },
    { control:'Bracketing', do:'Three frames at −2, 0, +2 when the sky is much brighter than the land.' },
  ],
  mistakes:['Standing at a viewpoint and photographing the whole panorama with nothing in the foreground.','Focusing at infinity and losing the near ground.'],
  drill:{
    id:'d6-landscape', title:'Foreground first', frames:10,
    brief:'Find a landscape. Before framing the wide view, find a foreground element and get within a metre of it. Build ten frames around foreground elements, all on a tripod at f/11 focused hyperfocally.',
    constraints:['Tripod, f/11, base ISO','A foreground element within two metres in every frame','Hyperfocal focus'],
    success:['Every frame is sharp from the near element to the horizon','A viewer’s eye enters through the foreground'],
    reflect:['How much closer to the foreground did you have to get than felt natural?'],
  },
  quiz:[
    { q:'Typical landscape aperture on a crop sensor:', a:['f/2.8','f/8–f/11','f/22','f/1.8'], correct:1, why:'Deep enough for front-to-back sharpness, short of where diffraction bites.' },
    { q:'Sky far brighter than the land. Best approach:', a:['Raise ISO','Bracket and blend, or use a graduated filter','Use a faster shutter','Open the aperture'], correct:1, why:'The dynamic range exceeds one frame, so either filter it or combine exposures.' },
  ],
},
{
  id:'l6-street',
  level:6, title:'Street', sub:'Zone focus, nerve, and behaving decently', minutes:6,
  idea:'Street photography is anticipation plus a technical setup that removes hesitation. The technical part takes ten minutes to learn. The nerve takes longer, and the ethics are not optional.',
  body:[
    { h:'Zone focusing', p:'Set the lens to f/8, manual focus at about three metres, and anything from roughly two to six metres is sharp. Now you never wait for autofocus, and you can shoot from the hip or without raising the camera to your eye. This is how most classic street work was made.' },
    { h:'One camera, one lens', p:'35mm equivalent, or 50mm if you prefer more separation. Changing lenses in the street means missing everything that happens while you are changing lenses.' },
    { h:'Work the light, not the people', p:'Find a shaft of light between buildings, a lit doorway, a reflection. Set up and wait. You are not hunting people, you are building a stage and waiting for a cast.' },
    { h:'Get closer than is comfortable', p:'Almost every weak street frame is a distant one. A 35mm lens at two metres puts the viewer inside the scene. Most people either do not notice or do not mind — a nod and a smile resolves the rest.' },
    { h:'Ethics', p:'Photographing people in public is generally lawful in most countries, and that is not the same as it being right. Do not photograph people to mock them. Take particular care with children, with people in distress, and with anyone who cannot consent. If somebody asks you to delete a frame, delete it — the picture is not worth the harm.' },
  ],
  points:[
    'Zone focus at f/8 and about three metres removes all hesitation.',
    'Find the light and wait, rather than hunting people.',
    'If someone objects, delete it. No frame is worth a person’s distress.',
  ],
  diagram:'zone-focus',
  camera:[
    { control:'Focus', do:'Manual, set to about 3m, at f/8. Check the depth-of-field scale or use this app’s calculator.' },
    { control:'Mode', do:'S mode at 1/250 minimum with Auto ISO, or full manual once you know the light.' },
    { control:'Sound', do:'Quiet shutter mode, and turn off the focus beep.' },
  ],
  mistakes:['Shooting everything from across the road with a long lens.','Photographing people in difficulty as though they were scenery.'],
  drill:{
    id:'d6-street', title:'Zone focus for an hour', frames:30,
    brief:'One lens, manual focus at three metres, f/8, shutter 1/250, Auto ISO. Walk for an hour. Do not refocus at any point. Find light first, then wait for people.',
    constraints:['Manual focus, unchanged for the whole hour','Nothing shot from more than five metres away','At least three frames where you waited in one spot for five minutes'],
    success:['Most frames are acceptably sharp despite never focusing','At least one frame where the light was found before the subject'],
    reflect:['What did not having to focus change about how you shot?'],
  },
  quiz:[
    { q:'Zone focusing means:', a:['Using auto-area AF','Pre-setting manual focus and relying on depth of field','Focusing on the nearest object','Using face detection'], correct:1, why:'A fixed distance plus a deep aperture makes a usable sharp zone with no focusing delay.' },
    { q:'Somebody asks you to delete their photograph. You should:', a:['Refuse, it is legal','Delete it','Walk away','Argue the law'], correct:1, why:'Legality is not the standard. Do not cause harm for a frame.' },
  ],
},
{
  id:'l6-action',
  level:6, title:'Action and wildlife', sub:'Tracking, pre-focus and accepting a low hit rate', minutes:6,
  idea:'Fast subjects are a numbers game played with the right technique. Continuous autofocus, a shutter fast enough for the subject, panning with the movement, and the discipline to shoot where the subject is going rather than where it is.',
  body:[
    { h:'Shutter speed first', p:'This is a shutter-priority world. 1/500 for running people, 1/1000 for most sport, 1/2000 and beyond for wings and splashing water. Raise ISO without hesitation to get there — a noisy sharp frame is a photograph, a clean blurred one is not.' },
    { h:'AF-C and the right area mode', p:'Continuous autofocus, dynamic-area with a moderate number of points. Acquire the subject with the centre point, then keep it under the point while you pan. Auto-area will focus on the fence.' },
    { h:'Pre-focus on the destination', p:'Focus where the action is heading — the hurdle, the finish line, the branch a bird keeps returning to — and wait. Faster and more reliable than any tracking system when the path is predictable.' },
    { h:'Pan and follow through', p:'Track the subject before, during and after the shutter fires, like a golf swing. Stopping at the moment of exposure is the most common cause of blur in panning.' },
    { h:'Backgrounds and light', p:'A bird against a clean sky is a photograph; the same bird against branches is a mess. Position yourself so the background is clean and the light comes from behind you or from the side. With animals, low is almost always better — get down to their eye level.' },
    { h:'Hit rate', p:'One in ten is normal for birds in flight. Professionals delete most of what they shoot. Judge yourself on the keeper, not on the ratio.' },
  ],
  points:[
    'Shutter priority, and raise ISO without hesitation to reach the speed you need.',
    'Pre-focus where the subject is going, not where it is.',
    'Follow through after the shutter fires, like a golf swing.',
  ],
  diagram:'panning',
  camera:[
    { control:'Mode', do:'S mode, Auto ISO with a generous ceiling.' },
    { control:'AF', do:'AF-C, dynamic-area, back-button focus so you can hold focus between bursts.' },
    { control:'Drive', do:'Continuous high. Short bursts around the peak, not one long spray.' },
  ],
  mistakes:['Using AF-S on a moving subject.','Stopping the pan the moment the shutter fires.'],
  drill:{
    id:'d6-action', title:'Track and pan', frames:40,
    brief:'Find repeating movement — a road, a dog park, a sports pitch. Twenty frames freezing the action at 1/1000, and twenty panning at 1/60. Count the keepers in each set.',
    constraints:['AF-C, dynamic area','Follow through on every panned frame','Count sharp frames honestly'],
    success:['At least six sharp freezes and at least two successful pans'],
    reflect:['On the panned failures, did you stop moving when you fired?'],
  },
  quiz:[
    { q:'Panning blur is usually caused by:', a:['Shutter too fast','Stopping the pan at the moment of exposure','ISO too low','Wrong white balance'], correct:1, why:'Continuous follow-through is what keeps the subject aligned with the sensor.' },
    { q:'Birds in flight, typical minimum shutter:', a:['1/250','1/500','1/2000','1/60'], correct:2, why:'Wingtips travel fast; anything slower renders them as smears.' },
  ],
},
{
  id:'l6-night',
  level:6, title:'Night and long exposure', sub:'Tripod, manual focus, and time as a material', minutes:6,
  idea:'After dark the camera stops being able to guess. You take over: manual focus, manual exposure, a tripod, and shutter speeds long enough that time itself becomes part of the composition.',
  body:[
    { h:'Focus manually, in live view', p:'Autofocus fails in the dark. Switch to live view, magnify ten times on the brightest thing you can find — a distant light, a bright star — and turn the focus ring until it is a point rather than a blob. Then tape the ring or simply do not touch it.' },
    { h:'The setup', p:'Tripod, stabilisation off, two-second timer or a remote release, base ISO where possible, and RAW. Long-exposure noise reduction doubles your shooting time by taking a matching dark frame, which is worth it for single shots and fatal for time-lapse.' },
    { h:'Light trails and empty streets', p:'Four to fifteen seconds turns traffic into ribbons. Thirty seconds and longer erases moving people entirely, leaving an empty city. Time is a compositional tool: choosing the exposure length chooses what exists in the frame.' },
    { h:'Stars', p:'The earth turns, so exposures beyond a certain length turn stars into streaks. As a rough guide, 500 divided by your effective focal length gives the seconds available — about eighteen seconds on an 18mm lens on a crop body. This app’s astro tool gives a more accurate figure for your sensor. Open the aperture fully and use ISO 1600 to 6400.' },
    { h:'Blue hour beats full dark', p:'For cityscapes, the twenty minutes after sunset give you a deep blue sky with detail in it, rather than a black hole. Full darkness is usually less interesting than photographers expect.' },
  ],
  points:[
    'Manual focus via magnified live view on a bright point.',
    'Exposure length decides what exists in the frame — long enough and people vanish.',
    'Stars trail beyond roughly 500 ÷ effective focal length in seconds.',
  ],
  diagram:'long-exposure',
  camera:[
    { control:'Mode', do:'M. Set aperture and shutter yourself; the meter is unreliable at night.' },
    { control:'Focus', do:'Manual, set in magnified live view, then left alone.' },
    { control:'Long-exposure NR', do:'On for single frames, off for time-lapse and star trails.' },
  ],
  mistakes:['Trying to autofocus in the dark and getting a frame of soft blobs.','Leaving stabilisation on while on a tripod.'],
  drill:{
    id:'d6-night', title:'Time as a material', frames:8,
    brief:'One night scene with movement in it — traffic, a busy pavement. Shoot the same frame at 1s, 4s, 15s and 30s. Then find a lit subject and expose so everything around it falls black.',
    constraints:['Tripod, manual focus set in live view','Same composition across the ladder','Stabilisation off, two-second timer'],
    success:['You can see exactly where moving people stop existing','The lit-subject frame has a clean black background'],
    reflect:['Which exposure length told the truest story about that place?'],
  },
  quiz:[
    { q:'Autofocus fails at night. Best approach:', a:['Use the AF assist beam','Manual focus with magnified live view','Focus at infinity on the barrel','Raise ISO'], correct:1, why:'Magnified live view on a bright point is precise and repeatable; infinity marks are often inaccurate.' },
    { q:'Roughly how long can an 18mm lens on a crop body expose before stars trail?', a:['5s','18s','60s','120s'], correct:1, why:'500 ÷ (18 × 1.5) ≈ 18 seconds. The NPF rule gives a stricter figure.' },
  ],
},
{
  id:'l6-timelapse',
  level:6, title:'Time-lapse', sub:'Hundreds of frames that must be identical', minutes:6,
  idea:'A time-lapse is a single photograph repeated hundreds of times with one variable — time — allowed to change. Everything else must be locked, because any setting that drifts becomes a flicker on screen.',
  body:[
    { h:'Lock everything', p:'Manual mode, manual focus, fixed white balance. Auto anything will adjust between frames and produce visible flicker. This is the single most common time-lapse failure and it is unfixable afterwards without specialist software.' },
    { h:'Interval decides the speed', p:'Interval × frame rate = how much faster than reality the result runs. A 2-second interval at 25fps is 50× speed. Clouds want 3–5 seconds, sunsets 4–6, stars 20–30, a flower opening 2–10 minutes, and busy pavements 1–2 seconds.' },
    { h:'The 180° guideline', p:'Set the shutter to about half the interval — a 4-second interval wants a 2-second exposure. Movement then blends between frames and the result looks like film rather than a slideshow of stills. In daylight this means a neutral-density filter.' },
    { h:'Count the cost before you start', p:'A 20-second clip at 25fps is 500 frames. At a 5-second interval that is 42 minutes of shooting and several gigabytes of card. Plan for battery too: about 900 frames from a healthy DSLR battery.' },
    { h:'Holy grail transitions', p:'Sunrise and sunset change by many stops during the sequence. Either accept the drift, adjust exposure manually by a third of a stop every few minutes, or use software built to ramp exposure afterwards.' },
  ],
  points:[
    'Manual everything — any auto setting becomes flicker.',
    'Interval × frame rate = the speed-up factor.',
    'Shutter at about half the interval keeps motion smooth.',
  ],
  diagram:'timelapse',
  camera:[
    { control:'Interval timer', do:'Shooting menu → Interval timer shooting. Set interval and number of shots.' },
    { control:'Everything else', do:'M mode, manual focus, fixed white balance, long-exposure NR off.' },
    { control:'Tools', do:'Use the time-lapse planner in this app to work out interval, frame count, duration and card space.' },
  ],
  mistakes:['Leaving auto white balance on and getting a colour flicker through the whole sequence.','Running out of battery or card at the two-thirds mark.'],
  drill:{
    id:'d6-timelapse', title:'Your first sequence', frames:300,
    brief:'Plan and shoot a 10-second clip at 25fps — 250 frames. Use the planner to pick the interval. Lock manual exposure, manual focus and fixed white balance, and do not touch the camera once it starts.',
    constraints:['Manual everything','Tripod, weighted if there is wind','Do not touch the camera mid-sequence'],
    success:['No visible flicker between frames','The sequence runs long enough to show real change'],
    reflect:['What changed during the sequence that you had not planned for?'],
  },
  quiz:[
    { q:'A 3-second interval at 25fps produces a speed-up of:', a:['25×','75×','3×','250×'], correct:1, why:'Interval × frame rate = 3 × 25 = 75× real time.' },
    { q:'Auto white balance during a time-lapse causes:', a:['Noise','Frame-to-frame colour flicker','Soft focus','Battery drain'], correct:1, why:'Each frame is balanced independently, so the colour jumps between them.' },
  ],
},

/* ── LEVEL 7 · AFTER THE SHUTTER ──────────────────────────────────────── */
{
  id:'l7-cull',
  level:7, title:'Culling', sub:'Being ruthless is a skill and it improves your shooting', minutes:5,
  idea:'Selecting well is a separate craft from shooting well, and it feeds back into it. Photographers who edit hard learn faster, because they are forced to articulate what actually worked.',
  body:[
    { h:'Two passes', p:'First pass, fast: keep anything with potential, reject anything technically broken or duplicated. Do not linger. Second pass, slow, on the survivors: pick the single best frame from each near-identical group.' },
    { h:'One frame per moment', p:'If you shot twelve frames of the same gesture, exactly one goes through. Keeping three near-identical frames means you have not made the decision, and an undecided selection weakens everything around it.' },
    { h:'Judge cold', p:'Do not select the same day you shot. You will still be attached to how it felt to be there. A week later you only see what is in the frame — which is all a viewer ever sees.' },
    { h:'Ask the hard question', p:'For each keeper: what is this photograph about, in three words? If you cannot answer, it goes. Effort spent taking it is not a reason to keep it.' },
    { h:'Keep the failures, briefly', p:'Before deleting, look at what went wrong and name the cause: shake, missed focus, cluttered background, wrong moment. Write the pattern down. That list is your next month of practice.' },
  ],
  points:[
    'Two passes: fast reject, then slow selection.',
    'One frame per moment. Near-duplicates are an undecided edit.',
    'Name the cause of each failure before deleting — that list is your practice plan.',
  ],
  diagram:'culling',
  camera:[
    { control:'In-camera rating', do:'Rate frames on the card during downtime, so the first pass is half done.' },
    { control:'Workflow', do:'Import, first pass same day, selection a week later.' },
  ],
  mistakes:['Keeping every frame because storage is cheap.','Choosing favourites on the day, while still attached to the experience.'],
  drill:{
    id:'d7-cull', title:'Ten to one', frames:0,
    brief:'Take a shoot of at least fifty frames from more than a week ago. Cut it to ten, then to three, then to one. Write one sentence on why the final frame survived and one on the most common failure you found.',
    constraints:['A shoot at least a week old','Cut to exactly one frame','Write the failure pattern down'],
    success:['You have one frame and a named failure pattern to work on'],
    reflect:['What was the most common cause of rejection, and which lesson addresses it?'],
  },
  quiz:[
    { q:'How many frames should survive from one moment?', a:['All the sharp ones','Three','One','As many as you like'], correct:2, why:'Keeping near-duplicates means the selection decision has not been made.' },
    { q:'Best time to select from a shoot:', a:['Immediately','The next day','A week or more later','Never'], correct:2, why:'Distance removes your attachment to the experience of being there.' },
  ],
},
{
  id:'l7-raw',
  level:7, title:'RAW and a simple edit order', sub:'What editing is for, and what it cannot fix', minutes:6,
  idea:'A RAW file is the sensor’s measurements, not a picture. Editing is where you finish the photograph you exposed. It is not where you rescue one you did not.',
  body:[
    { h:'RAW versus JPEG', p:'A JPEG is processed and compressed by the camera and the decisions are baked in. A RAW holds far more tonal information, and white balance, exposure and colour remain adjustable with no penalty. It costs card space and requires processing. While you are learning, that trade is worth it every time.' },
    { h:'What RAW can rescue', p:'About one and a half stops of underexposure, a stop of overexposure before highlights clip, and almost any white balance error. What it cannot rescue: missed focus, camera shake, a cluttered background, or a moment you did not catch.' },
    { h:'An order that works', p:'Crop and straighten. Set white balance. Set exposure, then highlights and shadows. Set black point and white point for contrast. Then local adjustments — dodging and burning to guide the eye. Then colour. Sharpening and noise reduction last, always.' },
    { h:'Restraint', p:'The most common beginner edit is oversaturated, over-sharpened and over-clarified. Make the adjustment until it looks right, then pull it back about twenty percent. Compare against the original at every stage.' },
    { h:'Dodge and burn', p:'Selectively brightening and darkening is the oldest technique in the darkroom and still the most powerful. Darken the corners and edges slightly, lighten your subject slightly, and you are directing the viewer’s eye exactly the way composition does.' },
  ],
  points:[
    'RAW rescues exposure and colour; nothing rescues focus or the moment.',
    'Edit order: crop → white balance → exposure → contrast → local → colour → sharpen.',
    'Make the edit, then pull it back twenty percent.',
  ],
  diagram:'edit-order',
  camera:[
    { control:'Image quality', do:'RAW, or RAW + JPEG while you are still building a workflow.' },
    { control:'Picture control', do:'Neutral. It affects the JPEG and the rear-screen preview, not the RAW data.' },
  ],
  mistakes:['Underexposing deliberately, assuming RAW will fix it.','Sharpening before noise reduction, and amplifying the noise.'],
  drill:{
    id:'d7-edit', title:'One frame, edited in order', frames:0,
    brief:'Take one RAW file. Edit it following the order above, and export a version after each stage. Compare the sequence side by side.',
    constraints:['One file','Export at each stage','No preset — every adjustment made deliberately'],
    success:['You can see what each stage contributed','The final edit is subtler than your usual'],
    reflect:['Which single adjustment made the largest difference?'],
  },
  quiz:[
    { q:'Which can RAW not rescue?', a:['White balance','Underexposure by a stop','Missed focus','A slightly cool cast'], correct:2, why:'Focus is optical. No amount of data recovers detail the lens never resolved.' },
    { q:'Sharpening should come:', a:['First','Before white balance','Last, after noise reduction','It does not matter'], correct:2, why:'Sharpening before noise reduction amplifies the noise you are about to remove.' },
  ],
},
{
  id:'l7-project',
  level:7, title:'Work on a project', sub:'The fastest way past a plateau', minutes:5,
  idea:'Shooting whatever you happen to see produces a slow, scattered improvement. Shooting one defined subject repeatedly forces you past the obvious frames and into the interesting ones, and it is how photographers develop a voice.',
  body:[
    { h:'Why single frames stop teaching', p:'A one-off good photograph might be luck. Twenty photographs about one idea cannot be. A project forces you to return after the easy shots are used up, which is precisely where the learning is.' },
    { h:'Make it narrow and reachable', p:'"My city" is not a project. "The people who open the shops on my street before seven in the morning" is. Narrow enough to finish, close enough that you can go back this week without planning a trip.' },
    { h:'Set a number and a deadline', p:'Twelve frames in six weeks. Constraints beat inspiration. The deadline is what makes you go out on the day you do not feel like it, and those days produce a surprising share of the keepers.' },
    { h:'Sequence, do not just collect', p:'Lay the frames out together. A set needs variety in scale — wide, medium, detail — and a rhythm. Two very similar frames next to each other weaken both. Editing a set teaches you more about composition than any single frame ever will.' },
    { h:'Show it to someone', p:'Pick one person whose eye you trust and ask them what the set is about — not whether they like it. If their answer is not what you intended, the gap is your next project.' },
  ],
  points:[
    'Narrow, reachable subject; a fixed number of frames and a deadline.',
    'Vary the scale: wide, medium, detail.',
    'Ask a viewer what the set is about, not whether they like it.',
  ],
  diagram:'project',
  camera:[
    { control:'Constraint', do:'One lens, or one focal length, for the whole project. Consistency is what makes a set read as one body of work.' },
  ],
  mistakes:['Choosing a subject so broad it can never be finished.','Collecting frames without ever laying them out as a set.'],
  drill:{
    id:'d7-project', title:'Define and begin a project', frames:12,
    brief:'Write a one-sentence project statement, narrow enough to complete in six weeks. Set a target of twelve frames. Shoot the first three this week, and lay them out together.',
    constraints:['One sentence, one subject','Twelve frames, six weeks','One focal length throughout'],
    success:['The statement fits in one sentence with no "and"','Three frames exist and vary in scale'],
    reflect:['What is the least obvious frame this subject could contain?'],
  },
  quiz:[
    { q:'A good beginner project is:', a:['My city','My street’s early-morning shopkeepers','Travel','Nature'], correct:1, why:'Narrow, reachable and finishable — the three properties that make a project work.' },
    { q:'When showing a set, the most useful question is:', a:['Do you like it?','Which is your favourite?','What is this about?','Is it sharp?'], correct:2, why:'It tests whether the set communicates, rather than collecting approval.' },
  ],
},
{
  id:'l7-critique',
  level:7, title:'Critique your own work', sub:'A repeatable checklist that beats taste', minutes:5,
  idea:'"I like it" and "something is off" are not useful. A fixed checklist turns a vague feeling into a named fault with a specific fix — and a named fault is something you can practise away.',
  body:[
    { h:'The checklist, in order', p:'Subject: can a stranger name it? Light: does it have a direction, and does it suit the subject? Background: is there anything in it that does not belong? Frame: are the edges deliberate, is the horizon straight? Moment: is this the best instant available? Technical: focus on the right thing, sharp where it should be, exposure holding the highlights?' },
    { h:'Name the fault, then the fix', p:'"Weak" is useless. "The background has a bright doorway that pulls the eye, and I should have moved two steps left" is a lesson. Every critique should end in an action you could have taken at the time.' },
    { h:'Track the pattern', p:'Log the fault each time in this app’s journal. After thirty entries you will see that most of your failures are two or three repeating problems, not thirty different ones. Fix those two and everything lifts at once.' },
    { h:'Getting outside feedback', p:'Ask specific questions: "Where does your eye go first?" and "What do you think this is about?" People are reflexively polite about whether they like something, and reliably honest about what they saw first.' },
    { h:'Compare against real work', p:'Look at photographers far better than you, and look properly: where is the light coming from, where is the camera, what did they leave out, what is the subject doing with its hands? Copy deliberately as an exercise. Every photographer learned this way.' },
  ],
  points:[
    'Subject → light → background → frame → moment → technical, in that order.',
    'Every critique ends in an action you could have taken at the time.',
    'Ask viewers where their eye goes first, not whether they like it.',
  ],
  diagram:'critique',
  camera:[
    { control:'Journal', do:'Log every shoot in this app with the fault you found. The pattern is the point.' },
  ],
  mistakes:['Judging your own work on effort rather than result.','Only ever looking at other beginners’ work.'],
  drill:{
    id:'d7-critique', title:'Run the checklist on ten frames', frames:0,
    brief:'Take ten of your own frames. Run the six-point checklist on each. Log every fault in the journal with the specific action you could have taken instead.',
    constraints:['Ten frames','All six points on each','Every fault paired with a concrete fix'],
    success:['You can name your two most common faults from the log'],
    reflect:['Which lesson in this app addresses your most common fault? Go back and reread it.'],
  },
  quiz:[
    { q:'The most useful question to ask a viewer:', a:['Do you like it?','Where does your eye go first?','Is it sharp?','What camera should I buy?'], correct:1, why:'It reports what the frame actually does, rather than whether they want to be kind.' },
    { q:'A useful critique always ends with:', a:['A rating','A named fault and the action that would have fixed it','A comparison','A crop'], correct:1, why:'Without an action, a critique cannot become practice.' },
  ],
},
];

/* ---------- Derived helpers ---------------------------------------------- */

export const lessonById = id => LESSONS.find(l => l.id === id);
export const lessonsInLevel = level => LESSONS.filter(l => l.level === level);
export const DRILLS = LESSONS.filter(l => l.drill).map(l => ({ ...l.drill, lessonId: l.id, level: l.level }));
export const drillById = id => DRILLS.find(d => d.id === id);

/* Every quiz question becomes a review card, keyed lesson#index. */
export const CARDS = LESSONS.flatMap(l =>
  (l.quiz || []).map((q, i) => ({ id: `${l.id}#${i}`, lessonId: l.id, level: l.level, ...q }))
);
export const cardById = id => CARDS.find(c => c.id === id);
