// Flow8 marketingsite — gegenereerd uit de goedgekeurde preview (site-3d-draai-preview.html).
// De 3D-wereld: de staande 8, de reis van een opdracht en de lichtbundel.
import * as THREE from './vendor/three/three.module.min.js';
import { RoomEnvironment } from './vendor/three/addons/environments/RoomEnvironment.js';
import { mergeGeometries } from './vendor/three/addons/utils/BufferGeometryUtils.js';
import { EffectComposer } from './vendor/three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from './vendor/three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from './vendor/three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from './vendor/three/addons/postprocessing/OutputPass.js';

const html = document.documentElement;
const rustig = matchMedia('(prefers-reduced-motion: reduce)').matches;
const SMAL = innerWidth <= 820;
const TAU = Math.PI * 2;
const VINK = '<svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>';
const PIJL = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';

// ── Het verhaal: één opdracht door de dag ──
const VERHAAL = [null,
  { tijd: '08:12 · Kantoor', kort: 'plannen', kop: 'De servicebeurt bij Fam. de Wit staat ingepland.', tekst: 'De planner zet de opdracht bij Daan, dinsdag om 08:30. Flow 8 rekent de reistijd uit en zet de werkbon klaar op Daans telefoon.', punten: ['Week, maand of dag per monteur', 'Route optimaliseren met één klik', 'Alle monteurs en routes op de kaart'],
    detail: { kop: 'Plannen zonder puzzelen.', lead: 'De planning is het hart van Flow 8. Je ziet per monteur per dag wat er moet gebeuren, waar, en hoe lang het rijden is.', beelden: [1, 'beeld/kaart-vlak.webp'], functies: [['Planning per week, maand of kwartaal', 'Lijst-, week- en dagweergave. Opdrachten per monteur, met soort werk, adres en status.'], ['Route en reistijd', 'Flow 8 zet de opdrachten in de slimste volgorde en rekent de reistijd en terugkomst uit.'], ['Kaartoverzicht', 'Alle klanten en opdrachten op de kaart, gekleurd naar de status van het werk.'], ['Storingsdienst en klantmails', 'Zie wie deze week dienst heeft. Klanten krijgen hun afspraak per mail bevestigd.']] } },
  { tijd: '10:05 · Monteur', kort: 'de werkbon', kop: 'Daan rondt de werkbon af, nog bij de klant.', tekst: 'Checklist afgevinkt, terugslagklep vervangen, de klant tekent op de telefoon. De werkbon is verstuurd voordat Daan wegrijdt, ook als er even geen bereik is.', punten: ['Checklist, materiaal en foto’s', 'Handtekening van de klant', 'Werkt zonder bereik, verstuurt later'],
    detail: { kop: 'De werkbon in de broekzak.', lead: 'Geen papieren bon meer die op kantoor overgetypt moet worden. De monteur werkt op de eigen telefoon, gewoon in de browser.', beelden: [2], functies: [['Klaargezet door kantoor', 'De monteur ziet de dag met alle opdrachten, adressen en wat er moet gebeuren.'], ['Checklist en materiaal', 'Afvinken wat gedaan is en materiaal kiezen uit de eigen artikellijst.'], ['Foto’s en handtekening', 'Foto’s bij de bon, en de klant tekent op het scherm.'], ['Ook zonder bereik', 'In een kelder of pompput werkt het gewoon door; de bon gaat zodra er weer verbinding is.']] } },
  { tijd: '10:40 · Werkplaats', kort: 'werkorders', kop: 'De oude pomp gaat naar de werkplaats.', tekst: 'Op de werkbon staat dat de pomp gereviseerd moet worden. De werkplaats maakt werkorder REP-1043 aan en volgt hem van ontvangst tot gereed.', punten: ['Eigen stappen per soort werkorder', 'Prioriteit, deadline en werkdocumenten', 'Gekoppeld aan klant en pompregister'],
    detail: { kop: 'Reparaties lopen gewoon mee.', lead: 'Werkorders voor de werkplaats, met de stappen die bij jullie manier van werken horen.', beelden: [3], functies: [['Eigen statussen', 'Per soort werkorder bepaal je zelf de stappen, van ontvangen tot gereed.'], ['Prioriteit en deadline', 'Wat haast heeft staat bovenaan; verlopen deadlines vallen direct op.'], ['Werkdocumenten', 'Handleidingen en tekeningen op één plek, te openen vanuit elke werkorder.'], ['Pompregister', 'Elke pomp met type, serienummer en geschiedenis, gekoppeld aan de klant.']] } },
  { tijd: '11:30 · Klant', kort: 'de klant', kop: 'Fam. de Wit heeft de werkbon al in de mail.', tekst: 'Als pdf, in de huisstijl van jullie bedrijf. Kantoor ziet de bon binnenkomen en kan hem meteen verwerken. Niemand heeft iets hoeven overtypen.', punten: ['Werkbon als pdf in eigen huisstijl', 'Afspraken bevestigen per mail', 'Alles terug te vinden in het maillog'],
    detail: { kop: 'De klant heeft alles, meteen.', lead: 'De klant krijgt de werkbon als pdf per mail, met jullie logo en gegevens. En in de rapportage zie je hoe het jaar loopt.', beelden: [4, 'beeld/rapportage.webp'], functies: [['Werkbon als pdf', 'Automatisch opgemaakt in jullie huisstijl, met materiaal, uren en handtekening.'], ['Klantmails', 'Afspraken bevestigen of wijzigen, met sjablonen die je zelf aanpast.'], ['Maillog', 'Per klant zie je wat er verstuurd is en wanneer.'], ['Rapportage', 'Opdrachten per monteur, per soort werk en per maand, voor het hele jaar.']] } }
];
document.getElementById('uitlegs').innerHTML = VERHAAL.slice(1).map((v, i) =>
  `<article class="uitleg" data-uitleg="${i + 1}"><div class="tijd"><i></i>${v.tijd}</div><h2>${v.kop}</h2><p>${v.tekst}</p><ul>${v.punten.map(p => `<li>${VINK}<span>${p}</span></li>`).join('')}</ul><button class="link-pijl meer" type="button" data-detail="${i + 1}">Meer over ${v.kort} ${PIJL}</button></article>`).join('');

// ── 2D-schermen: schalen naar de beschikbare ruimte, animatie opnieuw afspelen bij binnenkomst ──
const schermen = [...document.querySelectorAll('.scherm')];
function schaalSchermen() {
  schermen.forEach(s => {
    const b = +s.dataset.b, h = +s.dataset.h, staand = h > b;
    let sc;
    if (innerWidth <= 820) { const ruimteH = innerHeight - 128 - 250; sc = Math.min((innerWidth - 32) / b, ruimteH / h); }
    else sc = staand ? Math.min(innerHeight * 0.66 / h, 1.1) : Math.min(innerWidth * 0.42 / b, innerHeight * 0.62 / h, 1.25);
    s.style.setProperty('--s', sc.toFixed(3)); s.style.width = b * sc + 'px'; s.style.height = h * sc + 'px';
    if (innerWidth > 820) s.style.right = staand ? '12vw' : '4vw';
  });
}
schaalSchermen(); addEventListener('resize', schaalSchermen);
let schermNu = 0;
function toonScherm(i) {
  if (i === schermNu) return; schermNu = i;
  schermen.forEach(s => {
    const aan = +s.dataset.scherm === i;
    s.classList.toggle('aan', aan);
    if (aan) { s.classList.remove('speel'); void s.offsetWidth; s.classList.add('speel'); }
  });
}
schermen.forEach(s => s.addEventListener('click', () => openDetail(+s.dataset.scherm)));

// ── Detailpagina ──
const detail = document.getElementById('detail'), detailInhoud = document.getElementById('detail-inhoud');
let terugFocus = null;
function openDetail(i) {
  const v = VERHAAL[i]; if (!v) return;
  const beeld = b => {
    if (typeof b === 'string') return `<figure><img src="${b}" alt="" loading="lazy"><figcaption>Uit een echte omgeving, namen onherkenbaar gemaakt.</figcaption></figure>`;
    const s = document.querySelector(`.scherm[data-scherm="${b}"]`), w = +s.dataset.b, h = +s.dataset.h;
    const max = Math.min(innerWidth - (innerWidth <= 820 ? 64 : 160), 700), sc = Math.min(max / w, (h > w ? 560 : 9999) / h, 1.2);
    return `<figure><div class="groot"><div class="speel" style="width:${w * sc}px;height:${h * sc}px"><div style="transform:scale(${sc});transform-origin:0 0">${s.querySelector('.binnen').innerHTML}</div></div></div><figcaption>Voorbeeldgegevens.</figcaption></figure>`;
  };
  detailInhoud.innerHTML = `<div class="tijd">${v.tijd}</div><h2 id="detail-kop">${v.detail.kop}</h2><p class="lead">${v.detail.lead}</p>${v.detail.beelden.map(beeld).join('')}<div class="functies">${v.detail.functies.map(f => `<div><h3>${VINK}${f[0]}</h3><p>${f[1]}</p></div>`).join('')}</div><div class="actie"><a class="knop groot" href="#contact">Demo aanvragen</a><small>Eerste 3 maanden gratis · maandelijks opzegbaar</small></div>`;
  terugFocus = document.activeElement; detail.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => detail.classList.add('open')));
  detail.querySelector('.vel').scrollTop = 0; detail.querySelector('.sluit').focus({ preventScroll: true }); document.body.style.overflow = 'hidden';
}
function sluitDetail() { detail.classList.remove('open'); document.body.style.overflow = ''; setTimeout(() => { if (!detail.classList.contains('open')) detail.hidden = true; }, 500); if (terugFocus) terugFocus.focus({ preventScroll: true }); }
detail.addEventListener('click', e => { if (e.target.closest('[data-sluit], a[href^="#"]')) sluitDetail(); });
addEventListener('keydown', e => { if (e.key === 'Escape' && !detail.hidden) sluitDetail(); });
document.addEventListener('click', e => { const b = e.target.closest('[data-detail]'); if (b) openDetail(+b.dataset.detail); });

const doek = document.getElementById('doek');
let renderer = null;
if (!rustig) { try { renderer = new THREE.WebGLRenderer({ canvas: doek, antialias: true, alpha: true, powerPreference: 'high-performance' }); } catch (e) { renderer = null; } }
if (!renderer) { html.classList.add('geen-3d'); document.querySelectorAll('.uitleg').forEach(u => u.classList.add('aan')); schermen.forEach(s => s.classList.add('aan', 'speel')); }
else start3d();

function start3d() {
const PR = Math.min(SMAL ? 1.75 : 2, devicePixelRatio || 1);
renderer.setPixelRatio(PR); renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 80);
const CYAAN = new THREE.Color(0x7fe0f5), BLAUW = new THREE.Color(0x4f6ef5);
const kleurOp = (u, uit = new THREE.Color()) => uit.copy(CYAAN).lerp(BLAUW, 0.5 - 0.5 * Math.cos(u * TAU));
const stip = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.2, 'rgba(255,255,255,.7)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
let zaad = 7; const rnd = () => (zaad = (zaad * 16807) % 2147483647) / 2147483647;
const tijdU = { value: 0 }, donkerU = { value: 1 };
// De rand van het nieuwe vlak: x = hoogte in css-px vanaf boven (midden), y = helling, z = breedte brokkelrand, w = pixelverhouding
const snedeU = { value: new THREE.Vector4(1e5, -0.07, 150, 1) }, maatU = { value: new THREE.Vector2(1, 1) }, flitsU = { value: 0 };
const SNEDE_GLSL = `uniform vec4 snede; uniform vec2 maatCss;
  float boven(vec2 fc){ vec2 css = vec2(fc.x / snede.w, maatCss.y - fc.y / snede.w); return snede.x + snede.y * (css.x - maatCss.x * 0.5) - css.y; }
`;

// ── De staande 8 ──
const S8 = 1.18;
function acht(t, uit = new THREE.Vector3()) { const s = Math.sin(t), c = Math.cos(t), d = 1 + s * s; const y = c / d * 1.15, h = (s * c / d) * 1.05; const dr = (1 - y / 1.15) * 0.25 * Math.PI; return uit.set(h * Math.cos(dr) * S8, y * S8, (h * Math.sin(dr) + 0.12 * s) * S8); }
class Acht extends THREE.Curve { getPoint(u, uit = new THREE.Vector3()) { return acht(u * TAU, uit); } }
const curve = new Acht(), TSEG = SMAL ? 500 : 900, RSEG = 32;
function buisMet(radius) { const g = new THREE.TubeGeometry(curve, TSEG, radius, RSEG, true); const n = g.attributes.position.count, kl = new Float32Array(n * 3), c = new THREE.Color(); for (let i = 0; i <= TSEG; i++) for (let j = 0; j <= RSEG; j++) { const k = i * (RSEG + 1) + j; if (k < n) { kleurOp(i / TSEG, c); kl.set([c.r, c.g, c.b], k * 3); } } g.setAttribute('color', new THREE.BufferAttribute(kl, 3)); return g; }
// structuur in de 8: een glazen mantel met gedraaide groeven, waar het licht op breekt
const groefTex = (() => { const c = document.createElement('canvas'); c.width = 256; c.height = 64; const g = c.getContext('2d'), img = g.createImageData(256, 64); for (let y = 0; y < 64; y++) for (let x = 0; x < 256; x++) { const h = Math.pow(0.5 + 0.5 * Math.sin((x / 256 + y / 64) * TAU * 3), 3) * 255, i = (y * 256 + x) * 4; img.data[i] = img.data[i + 1] = img.data[i + 2] = h; img.data[i + 3] = 255; } g.putImageData(img, 0, 0); const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(SMAL ? 90 : 150, 1); return t; })();
const kernMat = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.12, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.05, emissive: 0x1a2a6e, emissiveIntensity: 0.35, transmission: SMAL ? 0 : 0.55, thickness: 0.16, ior: 1.45, bumpMap: groefTex, bumpScale: 0.9 });
function snij(mat) { mat.onBeforeCompile = sh => { sh.uniforms.snede = snedeU; sh.uniforms.maatCss = maatU; sh.fragmentShader = SNEDE_GLSL + sh.fragmentShader.replace('void main() {', 'void main() {\n  if (boven(gl_FragCoord.xy) < 0.0) discard;'); }; return mat; }
kernMat.onBeforeCompile = sh => { sh.uniforms.snede = snedeU; sh.uniforms.maatCss = maatU; sh.fragmentShader = SNEDE_GLSL + sh.fragmentShader.replace('void main() {', 'void main() {\n  if (boven(gl_FragCoord.xy) < 0.0) discard;'); };
const kernGeo = buisMet(0.062); scene.add(new THREE.Mesh(kernGeo, kernMat));
// binnenin een lichtgevende kern, door het glas heen zichtbaar
const kernLicht = snij(new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }));
scene.add(new THREE.Mesh(buisMet(0.028), kernLicht));
// een fijne gevlochten metalen mantel, en om de zoveel afstand een dunne band
const vlechtMat = snij(new THREE.MeshPhysicalMaterial({ color: 0x9cc4ff, metalness: 0.7, roughness: 0.25, clearcoat: 0.5, emissive: 0x18306e, emissiveIntensity: 0.4 }));
{
  const NF = SMAL ? 1400 : 2600, FR = curve.computeFrenetFrames(NF, true), P = [...Array(NF + 1)].map((_, i) => curve.getPointAt(i / NF));
  const n = SMAL ? 4 : 6, draaien = SMAL ? 30 : 42, geos = [];
  for (let k = 0; k < n; k++) {
    const rich = k % 2 ? 1 : -1, fase = Math.floor(k / 2) / (n / 2) * TAU, p = [];
    for (let i = 0; i < NF; i += 2) { const a = fase + rich * draaien * TAU * (i / NF); p.push(P[i].clone().addScaledVector(FR.normals[i], 0.064 * Math.cos(a)).addScaledVector(FR.binormals[i], 0.064 * Math.sin(a))); }
    geos.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(p, true), SMAL ? 900 : 1600, 0.0028, 5, true));
  }
  scene.add(new THREE.Mesh(mergeGeometries(geos), vlechtMat));
  const band = new THREE.TorusGeometry(0.066, 0.0045, 10, 48);
  for (let i = 0; i < 12; i++) { const u = (i + 0.5) / 12, q = curve.getPointAt(u), m = new THREE.Mesh(band, vlechtMat); m.position.copy(q); m.lookAt(q.clone().add(curve.getTangentAt(u))); scene.add(m); }
}
// Gloedschil: zachte rand plus het spoor dat de opdracht achter zich laat
const kopU = { value: 0 }, richtingU = { value: 1 }, spoorU = { value: 0 };
const gloedMat = new THREE.ShaderMaterial({ uniforms: { tijd: tijdU, kop: kopU, richting: richtingU, spoor: spoorU, donker: donkerU, snede: snedeU, maatCss: maatU },
  vertexShader: `varying float vU; varying vec3 vN; varying vec3 vV; void main(){ vU=uv.x; vec4 mv=modelViewMatrix*vec4(position,1.0); vN=normalize(normalMatrix*normal); vV=normalize(-mv.xyz); gl_Position=projectionMatrix*mv; }`,
  fragmentShader: SNEDE_GLSL + `uniform float tijd; uniform float kop; uniform float richting; uniform float spoor; uniform float donker; varying float vU; varying vec3 vN; varying vec3 vV;
    void main(){ if (boven(gl_FragCoord.xy) < 0.0) discard; float rand=pow(1.0-abs(dot(vN,vV)),2.2); vec3 c=mix(vec3(0.50,0.88,0.96),vec3(0.31,0.43,0.96),0.5-0.5*cos(vU*6.2832));
      float d = richting>0.0 ? fract(kop - vU) : fract(vU - kop);
      float staart = (1.0 - smoothstep(0.0, 0.11, d)) * spoor;
      float a = rand*0.24 + staart*(0.28+rand*0.4);
      vec3 kl = mix(c, vec3(0.9,0.98,1.0), staart*0.5);
      if (donker < 0.5) { kl = mix(vec3(0.18,0.36,0.95), vec3(0.06,0.62,0.85), staart); a = staart*(0.5+rand*0.5); }
      gl_FragColor=vec4(kl*1.1,a);
      #include <colorspace_fragment>
    }`,
  transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
const gloed = new THREE.Mesh(buisMet(0.1), gloedMat); scene.add(gloed);
// lichtbundel achter de 8, zacht zinderend (zoals een lichtzuil achter het logo)
const bundelMat = new THREE.ShaderMaterial({ uniforms: { tijd: tijdU, donker: donkerU, sterkte: { value: 1 }, warm: { value: 0 }, snij: { value: new THREE.Vector2(1e5, 1) }, maat: maatU },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `uniform float tijd; uniform float donker; uniform float sterkte; uniform float warm; uniform vec2 snij; uniform vec2 maat; varying vec2 vUv;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float ruis(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y); }
    float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { s += a * ruis(p); p *= 2.03; a *= 0.5; } return s; }
    void main(){ float x = vUv.x - 0.5;
      // naar onderen waaiert de bundel uit als een klok; bovenaan blijft hij een dunne lichtstreep
      float onder = smoothstep(0.62, 0.05, vUv.y), breed = mix(1.0, 7.0, onder * onder) * (1.0 + 0.1 * sin(tijd * 0.5));
      float kern = exp(-x * x * 1400.0 / breed), waas = exp(-x * x * 34.0 / breed) * (0.28 + 0.5 * onder * onder);
      float v = smoothstep(0.0, 0.06, vUv.y) * smoothstep(1.0, 0.55, vUv.y);
      float zinder = 0.88 + 0.12 * sin(vUv.y * 34.0 - tijd * 0.9) * sin(vUv.y * 11.0 + tijd * 0.5);
      // korrel en een fijn pixelraster in het licht, zoals bij Huly
      // stromende wolken in het licht (ze zakken langzaam omlaag) en een fijn raster in plaats van korrel
      vec2 px = gl_FragCoord.xy / max(snij.y, 1.0), q = vec2(x * 9.0, vUv.y * 7.0 + tijd * 0.05);
      float wolk = smoothstep(0.22, 0.86, fbm(q + 0.8 * fbm(q * 1.6 + vec2(0.0, tijd * 0.04))));
      vec2 bin = abs(fract(px / 3.0) - 0.5); float raster = 1.0 - 0.32 * step(0.36, max(bin.x, bin.y)), korrel = 1.0;
      vec3 koel = mix(vec3(0.31, 0.43, 0.96), vec3(0.49, 0.36, 0.98), onder * 0.6), heet = mix(vec3(0.34, 0.51, 0.85), vec3(1.0, 0.54, 0.39), smoothstep(0.8, 0.3, vUv.y));
      vec3 c = mix(mix(koel, heet, warm), vec3(0.86, 0.97, 1.0), clamp(kern * 1.2, 0.0, 1.0));
      float puls = pow(0.5 + 0.5 * cos(6.2832 * (vUv.y * 0.9 + tijd * 0.06)), 14.0) + pow(0.5 + 0.5 * cos(6.2832 * (vUv.y * 0.6 + tijd * 0.035 + 0.5)), 20.0) * 0.6;
      c = mix(c, vec3(0.5, 0.36, 1.0), smoothstep(0.04, 0.3, abs(x)) * 0.55 * (1.0 - kern)); // naar buiten toe paarser
      float a = (kern * (0.95 + puls * 0.9) + waas * raster * (0.45 + 1.1 * wolk) * (1.25 + puls * 0.8)) * v * zinder * sterkte * korrel;
      a *= 1.0 - smoothstep(snij.x - 70.0, snij.x + 4.0, maat.y - gl_FragCoord.y / snij.y); // de straal stopt waar hij op de slotzin landt
      if (donker < 0.5) { c = vec3(0.31, 0.43, 0.96); a *= 0.45; }
      gl_FragColor = vec4(c, a);
      #include <colorspace_fragment>
    }`, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
const lichtbundel = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 20), bundelMat); lichtbundel.renderOrder = -1; scene.add(lichtbundel);

// ── De lichtstraal in schermruimte (donker thema): kern, waas met stromende wolken en belichte rook ──
const straalU = { tijd: tijdU, res: { value: new THREE.Vector2(1, 1) }, css: { value: new THREE.Vector2(1, 1) }, bx: { value: -1e4 }, snij: { value: 1e5 }, sterkte: { value: 0 }, warm: { value: 0 } };
const straalMat2 = new THREE.ShaderMaterial({ uniforms: straalU, transparent: true, depthTest: true, depthWrite: false, blending: THREE.AdditiveBlending,
  vertexShader: 'void main(){ gl_Position = vec4(position.xy, 0.99999, 1.0); }', // achter alles: de 8 dekt de straal af
  fragmentShader: `uniform float tijd; uniform vec2 res; uniform vec2 css; uniform float bx; uniform float snij; uniform float sterkte; uniform float warm;
    float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float ruis(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
    float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < OCT; i++) { s += a * ruis(p); p *= 2.03; a *= 0.5; } return s; }
    void main(){
      vec2 cp = gl_FragCoord.xy / res * css; cp.y = css.y - cp.y;           // css-pixels, oorsprong linksboven
      float dx = cp.x - bx, dy = snij - cp.y, hoog = clamp(cp.y / css.y, 0.0, 1.0);
      float landt = step(snij, 9e4), boven = mix(1.0, smoothstep(-2.0, 6.0, dy), landt), bovenZacht = mix(1.0, smoothstep(-160.0, 40.0, dy), landt);
      // naar het raakpunt (of naar onderen) waaiert de straal uit
      float naar = mix(smoothstep(0.25, 1.0, hoog), exp(-max(dy, 0.0) / 230.0), landt);
      float bw = 20.0 + 250.0 * naar;
      float kern = exp(-dx * dx / 3.0) * boven * (0.6 + 0.4 * hoog), kernZacht = exp(-dx * dx / 70.0) * boven * 0.3;
      float puls = pow(0.5 + 0.5 * cos(6.2832 * (-cp.y / 700.0 - tijd * 0.1)), 12.0) * exp(-dx * dx / 8.0) * boven;
      float waas = exp(-dx * dx / (bw * bw)) * bovenZacht * (0.22 + 0.78 * naar);
      float rookZone = exp(-abs(dx) / 230.0) * bovenZacht;
      float waaier = landt * exp(-abs(dy) / 30.0) * exp(-dx * dx / (230.0 * 230.0));
      vec3 col = vec3(0.0);
      if (waas + rookZone + waaier > 0.01) {
        // stromende wolken in de waas (zakken omlaag) en een fijn raster in plaats van korrel
        vec2 q = vec2(dx * 0.010, (cp.y - tijd * 40.0) * 0.005);
        float wolk = smoothstep(0.22, 0.86, fbm(q + 0.8 * fbm(q * 1.6 + vec2(0.0, tijd * 0.05))));
        vec2 bin = abs(fract(cp / 3.0) - 0.5); float raster = 1.0 - 0.32 * step(0.36, max(bin.x, bin.y));
        // grote, trage rookwolken rond de straal, door het licht beschenen
        vec2 q2 = vec2(cp.x * 0.0021 + tijd * 0.004, cp.y * 0.0027 - tijd * 0.011);
        float rook = smoothstep(0.46, 0.95, fbm(q2 + 0.7 * fbm(q2 * 2.1 - vec2(tijd * 0.008))));
        float bt = clamp(abs(dx) / max(bw, 1.0), 0.0, 1.0);
        vec3 kB = mix(vec3(0.8, 0.96, 1.0), vec3(0.3, 0.62, 1.0), smoothstep(0.0, 0.5, bt));
        kB = mix(kB, vec3(0.5, 0.36, 1.0), smoothstep(0.5, 1.0, bt));
        kB = mix(kB, vec3(1.0, 0.54, 0.39), warm * 0.55 * naar * smoothstep(0.25, 0.95, bt));
        vec3 kRook = mix(vec3(0.1, 0.16, 0.48), vec3(0.26, 0.2, 0.62), rook);
        vec3 kWaaier = mix(vec3(0.85, 0.96, 1.0), vec3(1.0, 0.78, 0.66), warm * 0.6);
        col = kB * waas * (0.3 + 0.95 * wolk) * raster * 0.85 + kRook * rook * rookZone * (0.35 + 0.65 * naar) * 0.38 + kWaaier * waaier * 0.9;
      }
      col += vec3(0.92, 0.98, 1.0) * (kern * 1.2 + kernZacht + puls * 1.2);
      gl_FragColor = vec4(col * sterkte * 1.35, 1.0);
    }`,
  defines: { OCT: SMAL ? 3 : 4 } });
const straal2 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), straalMat2); straal2.frustumCulled = false; straal2.renderOrder = -3; scene.add(straal2);
// zachte nevel achter alles: trage wolken in blauw en violet, met korrel
const nevelMat = new THREE.ShaderMaterial({ uniforms: { tijd: tijdU, donker: donkerU }, transparent: true, depthWrite: false, depthTest: false,
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform float tijd; uniform float donker; varying vec2 vUv;
    float h(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 45758.5); }
    float ruis(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h(i), h(i + vec2(1, 0)), f.x), mix(h(i + vec2(0, 1)), h(i + vec2(1, 1)), f.x), f.y); }
    float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { s += a * ruis(p); p *= 2.03; a *= 0.5; } return s; }
    void main(){ vec2 p = vUv * vec2(3.2, 2.0); float t = tijd * 0.018;
      float w = fbm(p + vec2(t, -t * 0.6) + fbm(p * 0.7 - t));
      float midden = exp(-pow((vUv.x - 0.5) * 2.4, 2.0)) * smoothstep(0.0, 0.7, vUv.y + 0.2);
      vec3 c = mix(vec3(0.05, 0.09, 0.30), vec3(0.19, 0.13, 0.46), w);
      float a = smoothstep(0.35, 0.85, w) * (0.03 + 0.08 * midden) * donker;
      a *= 0.85 + 0.3 * h(floor(gl_FragCoord.xy) + floor(tijd * 10.0));
      gl_FragColor = vec4(c, a);
      #include <colorspace_fragment>
    }` });
const nevel = new THREE.Mesh(new THREE.PlaneGeometry(60, 34), nevelMat); nevel.renderOrder = -2; nevel.position.set(0, 0, -24); camera.add(nevel); scene.add(camera);
const N8 = 900, frames = curve.computeFrenetFrames(N8, true), pts8 = []; for (let i = 0; i <= N8; i++) pts8.push(curve.getPointAt(i / N8));

// ── Lijnen: rustig, zonder flitsen; alleen een trage glinstering ──
const vezelVert = `attribute float aF; attribute float aL; varying float vU; varying float vF; varying float vD; varying float vRand; varying float vL;
  void main(){ vU=uv.x; vF=aF; vL=aL; vec4 mv=modelViewMatrix*vec4(position,1.0); vD=-mv.z;
  #ifdef BUIS
    vRand=pow(1.0-abs(dot(normalize(normalMatrix*normal),normalize(-mv.xyz))),1.4);
  #else
    vRand=0.6;
  #endif
  gl_Position=projectionMatrix*mv; }`;
const vezelFrag = SNEDE_GLSL + `uniform float tijd; uniform float donker; uniform float basis; uniform float flits; varying float vU; varying float vF; varying float vD; varying float vRand; varying float vL;
  void main(){
    float glim = 0.75 + 0.25*sin(vU*18.0 - tijd*0.6 + vF*6.2832);
    vec3 c = mix(vec3(0.50,0.88,0.96), vec3(0.31,0.43,0.96), 0.5+0.5*sin(vU*2.5+vF*6.2832));
    float a = basis*(0.45+vRand)*glim;
    if (donker < 0.5) { c = mix(vec3(0.12,0.18,0.48), vec3(0.18,0.36,0.88), 0.5+0.5*sin(vU*3.0+vF*6.2832)); a = basis*2.6*(0.4+vRand)*glim; }
  #ifdef WERELD
    float sx = vU*vL; float fl = pow(0.5 + 0.5 * cos(6.2832 * (sx*0.07 - tijd*0.12 + vF*9.0)), 16.0) * step(0.72, fract(vF*13.7)) * flits * 0.6; // weinig kabels dragen een flits, met veel ruimte ertussen
  #else
    float fl = (pow(0.5 + 0.5 * cos(6.2832 * (vU*5.0 - tijd*0.7 + vF*9.0)), 14.0) + pow(0.5 + 0.5 * cos(6.2832 * (vU*3.0 - tijd*0.45 + vF*4.0)), 20.0)*0.7) * flits;
  #endif
    a += fl * (donker > 0.5 ? 1.6 : 0.9); c = mix(c, donker > 0.5 ? vec3(0.92,0.98,1.0) : vec3(0.1,0.5,0.95), clamp(fl,0.0,1.0)*0.75);
    a *= exp(-max(vD-4.0,0.0)*0.3);
  #ifdef WERELD
    a *= smoothstep(0.9, 2.4, vD) * 0.7; // kabels vlak voor de camera vallen weg; tekst en beelden houden de aandacht
  #endif
    gl_FragColor = vec4(c, a);
    #include <colorspace_fragment>
  }`;
function vezelMat(buis, basis) { return new THREE.ShaderMaterial({ uniforms: { tijd: tijdU, donker: donkerU, basis: { value: basis }, snede: snedeU, maatCss: maatU, flits: flitsU }, defines: buis ? { BUIS: '' } : {}, vertexShader: vezelVert, fragmentShader: vezelFrag, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }); }
const buizen = [], lijnen = [];
function merk(g) { const n = g.attributes.position.count; g.setAttribute('aF', new THREE.BufferAttribute(new Float32Array(n).fill(rnd()), 1)); return g; }
function lijnGeo(c, seg) { const p = c.getSpacedPoints(seg), pos = [], uv = []; for (let i = 0; i < seg; i++) { pos.push(p[i].x, p[i].y, p[i].z, p[i + 1].x, p[i + 1].y, p[i + 1].z); uv.push(i / seg, 0, (i + 1) / seg, 0); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); return g; }
function vezel(punten, { dik = 0.003, seg = 90, buis = true, gesloten = false } = {}) {
  const c = new THREE.CatmullRomCurve3(punten, gesloten, 'centripetal');
  if (buis) buizen.push(merk(new THREE.TubeGeometry(c, seg, dik, 5, gesloten))); else lijnen.push(merk(lijnGeo(c, seg)));
  return c;
}
// strengen die om de 8 heen draaien
for (let k = 0; k < (SMAL ? 14 : 26); k++) {
  const r = 0.085 + Math.pow(rnd(), 1.4) * 0.16, fase = rnd() * TAU, dr = Math.round(2 + rnd() * 5) * (rnd() < .5 ? -1 : 1), p = [];
  for (let i = 0; i < 120; i++) { const j = Math.round(i / 120 * N8), a = fase + dr * TAU * (i / 120); p.push(pts8[j].clone().addScaledVector(frames.normals[j], r * Math.cos(a)).addScaledVector(frames.binormals[j], r * Math.sin(a))); }
  vezel(p, { dik: k < 10 ? 0.0026 : 0.0017, seg: 520, gesloten: true, buis: k < (SMAL ? 8 : 14) });
}

// ── Stations langs de 8: kantoor, monteur, werkplaats, klant ──
const STOP = [null, { a: 0.18, y: 0.66 }, { a: Math.PI * .5 + 0.18, y: 0.24 }, { a: Math.PI + 0.18, y: -0.2 }, { a: Math.PI * 1.5 + 0.18, y: -0.62 }];
const R_STOP = SMAL ? 4.3 : 3.1;
const naar = a => new THREE.Vector3(Math.sin(a), 0, Math.cos(a)), rechts = a => new THREE.Vector3(Math.cos(a), 0, -Math.sin(a));
const stationU = [null];
for (let i = 1; i <= 4; i++) { let best = -1e9, bu = 0; const n = naar(STOP[i].a); pts8.forEach((p, j) => { const sc = p.x * n.x + p.z * n.z - 4 * Math.abs(p.y - STOP[i].y); if (sc > best) { best = sc; bu = j / N8; } }); stationU.push(bu); }
const stationPos = stationU.map(u => u === null ? null : curve.getPointAt(u));
const v = new THREE.Vector3();
function puntOp8(y, spreiding = 0.45) { for (let t = 0; t < 60; t++) { const p = pts8[Math.floor(rnd() * N8)]; if (Math.abs(p.y - y) < spreiding) return p.clone(); } return pts8[Math.floor(rnd() * N8)].clone(); }
// Per station een bundel lijnen naar buiten, de kant op waar het scherm verschijnt
const straalGeos = [];
for (let i = 1; i <= 4; i++) {
  const S = stationPos[i], doel = new THREE.Vector3(0, STOP[i].y, 0).addScaledVector(rechts(STOP[i].a), SMAL ? 0.2 : 1.05).addScaledVector(naar(STOP[i].a), SMAL ? 1.1 : 0.7).add(v.set(0, SMAL ? 0.45 : 0, 0));
  for (let j = 0; j < 9; j++) {
    const B = doel.clone().add(v.set((rnd() - .5) * 0.5, (rnd() - .5) * 0.55, (rnd() - .5) * 0.3)), A = S.clone().add(v.set((rnd() - .5) * 0.05, (rnd() - .5) * 0.05, (rnd() - .5) * 0.05));
    const m = A.clone().lerp(B, 0.5).add(v.set((rnd() - .5) * 0.15, -0.08 - rnd() * 0.18, (rnd() - .5) * 0.15));
    const c = new THREE.CatmullRomCurve3([A, m, B], false, 'centripetal'); const g = new THREE.TubeGeometry(c, 60, 0.0022 + rnd() * 0.0016, 5, false);
    const n = g.attributes.position.count; g.setAttribute('aSt', new THREE.BufferAttribute(new Float32Array(n).fill(i - 1), 1)); g.setAttribute('aF', new THREE.BufferAttribute(new Float32Array(n).fill(rnd()), 1)); straalGeos.push(g);
  }
}
// Bij aankomst van de opdracht loopt één golf licht door de lijnen van dat station naar het scherm
const aankomstU = { value: new THREE.Vector4(-99, -99, -99, -99) }, actiefSt = { value: -1 }, groeiU = { value: new THREE.Vector4(0, 0, 0, 0) };
const straalMat = new THREE.ShaderMaterial({ uniforms: { tijd: tijdU, donker: donkerU, aankomst: aankomstU, actief: actiefSt, groei: groeiU, snede: snedeU, maatCss: maatU },
  vertexShader: `attribute float aSt; attribute float aF; varying float vU; varying float vSt; varying float vF; varying float vRand; void main(){ vU=uv.x; vSt=aSt; vF=aF; vec4 mv=modelViewMatrix*vec4(position,1.0); vRand=pow(1.0-abs(dot(normalize(normalMatrix*normal),normalize(-mv.xyz))),1.4); gl_Position=projectionMatrix*mv; }`,
  fragmentShader: SNEDE_GLSL + `uniform vec4 groei; uniform float tijd; uniform float donker; uniform vec4 aankomst; uniform float actief; varying float vU; varying float vSt; varying float vF; varying float vRand;
    void main(){
      if (boven(gl_FragCoord.xy) < 0.0) discard;
      float t0 = vSt<0.5 ? aankomst.x : vSt<1.5 ? aankomst.y : vSt<2.5 ? aankomst.z : aankomst.w;
      float t = tijd - t0 - vF*0.25;
      float kop = t*0.9;
      float golf = exp(-pow((kop - vU)*7.0, 2.0)) * step(0.0, t) * step(kop, 1.4);
      // de draden groeien pas uit de 8 als je bij dit station bent
      float g = vSt<0.5 ? groei.x : vSt<1.5 ? groei.y : vSt<2.5 ? groei.z : groei.w;
      if (vU > g) discard;
      float tip = smoothstep(g, g - 0.12, vU) * smoothstep(0.0, 0.05, g);
      float aan = abs(vSt - actief) < 0.5 ? 1.0 : 0.0;
      float a = (0.10 + aan*0.18)*(0.45+vRand) + golf*1.4;
      vec3 c = mix(vec3(0.50,0.88,0.96), vec3(0.92,0.98,1.0), golf*0.7);
      if (donker < 0.5) { c = mix(vec3(0.14,0.22,0.6), vec3(0.1,0.55,0.95), clamp(golf,0.0,1.0)); a = (0.22 + aan*0.3)*(0.45+vRand) + golf*0.9; }
      a *= tip;
      gl_FragColor=vec4(c,a);
      #include <colorspace_fragment>
    }`, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
const straalGeo = mergeGeometries(straalGeos); scene.add(new THREE.Mesh(straalGeo, straalMat));
// verbindingen tussen de stations onderling en een netwerk de diepte in
for (let i = 1; i <= 4; i++) { const A = stationPos[i], B = stationPos[i % 4 + 1]; for (let j = 0; j < 3; j++) { const m = A.clone().add(B).multiplyScalar(0.5), uit = m.clone().setY(0).normalize(); vezel([A, m.clone().addScaledVector(uit, 0.55 + rnd() * 0.5).add(v.set(0, (rnd() - .5) * 0.5, 0)), B], { dik: 0.0016 + rnd() * 0.0012, seg: 120 }); } }
const VER = []; for (let i = 0; i < (SMAL ? 16 : 30); i++) { const a = rnd() * TAU, r = 6 + rnd() * 4.5; VER.push(new THREE.Vector3(Math.sin(a) * r, -2.4 + rnd() * 4.8, Math.cos(a) * r)); }
VER.forEach((P, i) => {
  const A = puntOp8(P.y * 0.4, 0.6), m = A.clone().lerp(P, 0.5).add(v.set((rnd() - .5) * 0.8, (rnd() - .5) * 0.8, (rnd() - .5) * 0.8));
  vezel([A, m, P], { buis: false, seg: 60 });
  VER.map((Q, j) => [Q.distanceTo(P), j]).sort((a, b) => a[0] - b[0]).slice(1, 3).forEach(([, j]) => { if (j > i) vezel([P, P.clone().lerp(VER[j], 0.5).add(v.set(0, -0.4, 0)), VER[j]], { buis: false, seg: 50 }); });
});
const buisMat = vezelMat(true, 0.15), lijnMat = vezelMat(false, 0.09), vezelMats = [buisMat, lijnMat, straalMat];
const buisGeo = mergeGeometries(buizen); // strengen rond de 8 uit: de gloed en de structuur in de 8 geven de diepte
// netwerk de diepte in uit
const knoopMat = new THREE.PointsMaterial({ size: 0.12, map: stip, color: 0x9fdcff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
// knooppunten in de verte uit
// Stationsringen
const ringMat = new THREE.MeshBasicMaterial({ color: 0xbfefff, transparent: true, opacity: 0.6, toneMapped: false });
const ringen = [null];
for (let i = 1; i <= 4; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.0045, 10, 64), ringMat.clone()); r.position.copy(stationPos[i]); r.lookAt(naar(STOP[i].a).multiplyScalar(R_STOP).setY(STOP[i].y)); scene.add(r); ringen.push(r); }

// ── Afbrokkelen: het nieuwe vlak schuift omhoog en de 8 valt op die rand uiteen in stof ──
const STOF = SMAL ? 7000 : 18000;
const sPos = new Float32Array(STOF * 3), sRicht = new Float32Array(STOF * 3), sGr = new Float32Array(STOF), sKl = new Float32Array(STOF * 3), sF = new Float32Array(STOF);
{ const kc = new THREE.Color(), wit = new THREE.Color(1, 1, 1), t = new THREE.Vector3(), uit = new THREE.Vector3();
  for (let i = 0; i < STOF; i++) {
    const r = rnd(), g = r < 0.6 ? kernGeo : r < 0.88 ? buisGeo : straalGeo, pa = g.attributes.position, j = Math.floor(rnd() * pa.count);
    t.fromBufferAttribute(pa, j); sPos.set([t.x, t.y, t.z], i * 3);
    uit.set(t.x, 0, t.z); if (uit.lengthSq() < 1e-4) uit.set(rnd() - .5, 0, rnd() - .5); uit.normalize();
    sRicht.set([uit.x * (0.3 + rnd() * 0.9) + (rnd() - .5) * 0.6, 0.5 + rnd() * 1.1, uit.z * (0.3 + rnd() * 0.9) + (rnd() - .5) * 0.6], i * 3);
    sGr[i] = 0.5 + Math.pow(rnd(), 2) * 2.2; sF[i] = rnd();
    if (g === kernGeo) kc.fromBufferAttribute(g.attributes.color, j); else kleurOp(rnd(), kc);
    kc.lerp(wit, rnd() * 0.3); sKl.set([kc.r, kc.g, kc.b], i * 3);
  } }
const stofGeo = new THREE.BufferGeometry();
stofGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3)); stofGeo.setAttribute('aRicht', new THREE.BufferAttribute(sRicht, 3)); stofGeo.setAttribute('aGr', new THREE.BufferAttribute(sGr, 1)); stofGeo.setAttribute('aKl', new THREE.BufferAttribute(sKl, 3)); stofGeo.setAttribute('aF', new THREE.BufferAttribute(sF, 1));
const stofPR = { value: PR };
const stofMat = new THREE.ShaderMaterial({ uniforms: { tijd: tijdU, donker: donkerU, snede: snedeU, maatCss: maatU, pr: stofPR },
  vertexShader: `attribute vec3 aRicht; attribute float aGr; attribute vec3 aKl; attribute float aF; uniform float tijd; uniform vec4 snede; uniform vec2 maatCss; uniform float pr; varying vec3 vKl; varying float vA; varying float vVonk;
    void main(){
      vec4 c0 = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      vec2 ndc = c0.xy / c0.w; vec2 css = vec2((ndc.x * 0.5 + 0.5) * maatCss.x, (0.5 - ndc.y * 0.5) * maatCss.y);
      float boven = snede.x + snede.y * (css.x - maatCss.x * 0.5) - css.y;
      float t = clamp(1.0 - (boven - snede.z * 0.12 * aF) / (snede.z * 0.65), 0.0, 1.0);
      float e = pow(t, 1.6);
      vec3 p = position + aRicht * e * 0.9;
      p.x += sin(tijd * 1.3 + aF * 40.0) * 0.05 * e; p.z += cos(tijd * 1.1 + aF * 30.0) * 0.05 * e;
      vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
      vVonk = smoothstep(0.15, 0.45, t) * (1.0 - smoothstep(0.45, 0.85, t));
      vA = step(0.001, t) * (1.0 - smoothstep(0.7, 1.0, t)) * step(0.0, c0.w);
      gl_PointSize = aGr * pr * (1.0 + vVonk * 1.4) * (7.0 / max(-mv.z, 0.2));
      vKl = aKl; }`,
  fragmentShader: `uniform float donker; varying vec3 vKl; varying float vA; varying float vVonk;
    void main(){ float r = length(gl_PointCoord - 0.5); if (r > 0.5 || vA <= 0.0) discard; float s = smoothstep(0.5, 0.1, r);
      vec3 c = mix(vKl, vec3(0.95, 0.99, 1.0), vVonk * 0.8); float a = vA * s * (0.75 + vVonk * 1.1);
      if (donker < 0.5) { c = mix(vec3(0.14, 0.24, 0.66), vec3(0.12, 0.5, 0.95), vVonk); a = vA * s * (0.8 + vVonk * 0.4); }
      gl_FragColor = vec4(c, a);
      #include <colorspace_fragment>
    }`, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
const stof = new THREE.Points(stofGeo, stofMat); stof.frustumCulled = false; // vonken uit: de lijnen met flitsen lopen door


// ── De opdracht: één lichtpunt dat van station naar station reist ──
const opdracht = new THREE.Group(); scene.add(opdracht);
const kern = new THREE.Mesh(new THREE.SphereGeometry(0.034, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false })); opdracht.add(kern);
const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: stip, color: 0x7fe0f5, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); halo.scale.set(0.42, 0.42, 1); opdracht.add(halo);
const opRing = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.005, 10, 48), new THREE.MeshBasicMaterial({ color: 0x4f6ef5, transparent: true, opacity: 0 })); opdracht.add(opRing);
const opLicht = new THREE.PointLight(0x7fe0f5, 0.7, 1.2, 2); opdracht.add(opLicht);
// u langs de 8, uitgevouwen zodat de opdracht altijd de korte kant op reist
const U = [null, stationU[1]];
for (let i = 2; i <= 4; i++) { let d = ((stationU[i] - stationU[i - 1]) % 1 + 1) % 1; if (d > 0.6) d -= 1; U.push(U[i - 1] + d); }
const STOP_P = [null, 0.26, 0.44, 0.62, 0.80], RUST = 0.045;
const U_START = U[1] - 0.14, U_EIND = U[4] + (((0.5 - stationU[4]) % 1 + 1) % 1);
const glad = x => x * x * x * (x * (x * 6 - 15) + 10);
function opdrachtU(p) {
  if (p <= STOP_P[1] - RUST) return { u: U_START + (U[1] - U_START) * glad(THREE.MathUtils.clamp((p - 0.1) / (STOP_P[1] - RUST - 0.1), 0, 1)), rich: 1 };
  for (let i = 1; i <= 4; i++) {
    if (p <= STOP_P[i] + RUST) return { u: U[i], rich: i > 1 ? Math.sign(U[i] - U[i - 1]) : 1 };
    const volgendP = i < 4 ? STOP_P[i + 1] - RUST : 0.95, volgendU = i < 4 ? U[i + 1] : U_EIND;
    if (p <= volgendP) return { u: U[i] + (volgendU - U[i]) * glad((p - STOP_P[i] - RUST) / (volgendP - STOP_P[i] - RUST)), rich: Math.sign(volgendU - U[i]) || 1 };
  }
  return { u: U_EIND, rich: 1 };
}

// ── Nevel en bloom ──
const NEVEL = new THREE.Color(0x030407);
let composer = null, bloom = null;
function maakComposer() { if (SMAL) return; composer = new EffectComposer(renderer); composer.setPixelRatio(Math.min(1.5, PR)); composer.addPass(new RenderPass(scene, camera)); bloom = new UnrealBloomPass(new THREE.Vector2(doek.clientWidth, doek.clientHeight), 0.3, 0.45, 0.84); composer.addPass(bloom); composer.addPass(new OutputPass()); }

// ── Camerapad ──
const K = [[0.00, -0.45, SMAL ? 0.85 : 0.05, SMAL ? 6.6 : 5.4], [0.12, -0.05, 0.75, SMAL ? 5.2 : 3.6]];
for (let i = 1; i <= 4; i++) K.push([STOP_P[i], STOP[i].a, STOP[i].y, R_STOP]);
K.push([1.00, STOP[4].a + 0.45, STOP[4].y, R_STOP]); // na de stop Klant blijft het beeld staan; de 8 draait rustig door

// ── Doorlopende wereld onder de reis: de camera zakt door lichtlijnen met diepte ──
const EIND = K[K.length - 1], aE = EIND[1], yE = EIND[2], rE = EIND[3];
const kPx = () => 2 * rE * Math.tan(THREE.MathUtils.degToRad(17)) / innerHeight; // wereld-eenheden per pixel op de as
const RE = rechts(aE), NA = naar(aE), BOVEN = new THREE.Vector3(0, 1, 0);
const basis = new THREE.Matrix4().makeBasis(RE, BOVEN, NA); // lokaal: x rechts, y omhoog, z naar de camera (negatief = de diepte in)
const wereldMat = vezelMat(true, 0.07);
wereldMat.uniforms.flits = { value: 1 }; wereldMat.defines.WERELD = ''; vezelMats.push(wereldMat);
const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const kr = (p, dicht = false) => new THREE.CatmullRomCurve3(p, dicht, 'centripetal');
const ringP = (cx, cy, cz, r, kantel, draai = 0, n = 48) => [...Array(n)].map((_, i) => { const w = i / n * TAU; return V3(Math.cos(w) * r, Math.sin(w) * r * Math.cos(kantel), Math.sin(w) * r * Math.sin(kantel)).applyAxisAngle(BOVEN, draai).add(V3(cx, cy, cz)); });
const rechthoekP = (cx, cy, cz, w, h, kantelX = 0, draaiY = 0) => { const hoek = [V3(-w / 2, -h / 2, 0), V3(w / 2, -h / 2, 0), V3(w / 2, h / 2, 0), V3(-w / 2, h / 2, 0)].map(q => q.applyAxisAngle(V3(1, 0, 0), kantelX).applyAxisAngle(BOVEN, draaiY).add(V3(cx, cy, cz))); const uit = []; for (let i = 0; i < 4; i++) for (let j = 0; j < 8; j++) uit.push(hoek[i].clone().lerp(hoek[(i + 1) % 4], j / 8)); return uit; };
const metLengte = (g, c) => { g.setAttribute('aL', new THREE.BufferAttribute(new Float32Array(g.attributes.position.count).fill(c.getLength()), 1)); return g; };
function bundel(curves, dik, mat) { const gs = curves.map(c => metLengte(merk(new THREE.TubeGeometry(c, Math.max(32, Math.min(700, Math.round(c.getLength() * 24))), dik * (0.8 + rnd() * 0.4), 6, false)), c)); return new THREE.Mesh(mergeGeometries(gs), mat); }
// boom van datakabels: uit de onderkant van de 8 groeien stammen die zich door de hele site vertakken, dichtbij en ver weg
const reisEl = document.getElementById('reis'), reisEind = () => reisEl.offsetTop + reisEl.offsetHeight - innerHeight;
const KABELS_AAN = false; // uit: onder de hero geeft de gloed de diepte
if (KABELS_AAN) {
  const bodem = yE - ((document.documentElement.scrollHeight - innerHeight - reisEind()) * kPx() * 1.25 + 4);
  const naarWereld = (x, y, d) => new THREE.Vector3(0, y, 0).addScaledVector(RE, x).addScaledVector(NA, -d); // d positief = de diepte in
  const klassen = [[], [], []], MAX = SMAL ? 8 : 18; let teller = 0;
  const bovenY = -1.0;
  function tak(x, y, d, dx, dd, niveau, lengte) {
    const p = [naarWereld(x, y, d)], fase = rnd() * TAU; let gegroeid = 0;
    while (y > bodem && gegroeid < lengte) {
      const stap = 0.6; y -= stap; gegroeid += stap;
      x += dx * stap + Math.sin(y * 0.5 + fase) * 0.06; d += dd * stap; dx *= 0.93; dd *= 0.93;
      d = Math.max(d, -rE + 0.7, Math.min(3.2, (bovenY - y) * 1.1)); // kabels zakken snel weg naar de verte
      p.push(naarWereld(x, y, d));
      if (teller < MAX && niveau < 3 && rnd() < [0.05, 0.035, 0.02][niveau]) { teller++; const kant = rnd() < .5 ? -1 : 1; tak(x, y, d, kant * (0.35 + rnd() * 0.6), (rnd() - .45) * 0.9, niveau + 1, niveau === 0 ? 6 + rnd() * 10 : 1.5 + rnd() * 4); }
    }
    if (p.length > 3) klassen[Math.min(niveau, 2)].push(kr(p));
  }
  const stammen = SMAL ? 3 : 4;
  for (let i = 0; i < stammen; i++) { const s0 = puntOp8(-1.0, 0.4), x0 = s0.dot(RE), d0 = -s0.dot(NA); tak(x0, s0.y, d0, (i - (stammen - 1) / 2) * 0.32, 0.35 + rnd() * 0.3, 0, 999); }
  scene.add(bundel(klassen[0], 0.008, wereldMat)); scene.add(bundel(klassen[1], 0.0045, wereldMat)); if (klassen[2].length) scene.add(bundel(klassen[2], 0.003, wereldMat));
}
// formaties per onderdeel: groot, over de hele breedte, met diepte
const FORMATIE = {
  'voor-wie': () => { const c = [], P = [V3(-1.6, 0.25, -0.8), V3(0, -0.3, 0.3), V3(1.7, 0.35, -1.6)]; P.forEach((q, i) => { for (let j = 0; j < 2; j++) c.push(kr(ringP(q.x, q.y, q.z, 0.45 + j * 0.08, j * 0.9 + i, j * 0.5), true)); }); for (let i = 0; i < 3; i++) { const A = P[i], B = P[(i + 1) % 3]; for (let j = 0; j < 2; j++) c.push(kr([A, A.clone().lerp(B, .5).add(V3((rnd() - .5) * .3, (rnd() - .5) * .6 + .2, (rnd() - .5) * .8)), B])); } return c; },
  dashboard: () => { const c = []; for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) c.push(kr(rechthoekP(-2.4 + i * 1.2, -0.5, -0.2 - j * 1.05, 1.0, 0.8, -Math.PI / 2.3), true)); return c; },
  kaart: () => { const c = [], P = (u, v) => V3(u, -0.4 + v * 0.22, -v * 1.5); for (let i = 0; i < 6; i++) { const pp = [...Array(4)].map(() => P((rnd() - .5) * 6, rnd() * 3)); c.push(kr(pp)); pp.forEach(q => c.push(kr(ringP(q.x, q.y + 0.08, q.z, 0.06, 0, 0, 20), true))); } return c; },
  klanten: () => { const c = []; for (let i = 0; i < 3; i++) c.push(kr(rechthoekP(-1.0 + i * 0.9, 0.15 - i * 0.1, -0.4 - i * 1.2, 1.6, 1.0, 0, 0.35), true)); return c; },
  register: () => { const c = [], E = [V3(-3.2, 1.1, -2.5), V3(-2.6, -1.0, 0.4), V3(3.4, 0.5, -3.5), V3(2.4, -1.1, 0.1)]; for (let j = 0; j < 2; j++) c.push(kr(ringP(0, 0, -0.4, 0.34 + j * 0.06, j * 1.0, j * 0.6), true)); E.forEach(e => { for (let j = 0; j < 2; j++) c.push(kr([V3(0, 0, -0.4), V3(0, 0, -0.4).lerp(e, .5).add(V3((rnd() - .5) * .3, (rnd() - .5) * .4, (rnd() - .5) * .4)), e])); c.push(kr(ringP(e.x, e.y, e.z, 0.2, 0.6, 0), true)); }); return c; },
  team: () => { const c = [], el = [...Array(64)].map((_, i) => { const w = i / 64 * TAU; return V3(Math.cos(w) * 2.3, Math.sin(w) * 0.35 - 0.1, Math.sin(w) * 1.7 - 1); }); c.push(kr(el, true)); for (let k = 0; k < 5; k++) { const w = k / 5 * TAU, q = V3(Math.cos(w) * 2.3, Math.sin(w) * 0.35 - 0.1, Math.sin(w) * 1.7 - 1); c.push(kr(ringP(q.x, q.y + 0.1, q.z, 0.24, 0.6, w), true)); } return c; },
  overstappen: () => { const c = []; for (let r = 0; r < 6; r++) c.push(kr([V3(-3.2, 0.7 - r * 0.28, -0.3), V3(-1.4, 0.7 - r * 0.28, -1.6)])); for (let k = 0; k < 5; k++) c.push(kr([V3(-3.2 + k * 0.45, 0.75, -0.3 - k * 0.33), V3(-3.2 + k * 0.45, -0.75, -0.3 - k * 0.33)])); for (let j = 0; j < 5; j++) { const y0 = 0.7 - j * 0.3; c.push(kr([V3(-1.4, y0, -1.6), V3(0.2, y0 * 0.4, -0.6 + rnd() * 0.4), V3(1.8, 0.1 + (rnd() - .5) * .5, -0.2), V3(3.6, 0.3 + (rnd() - .5) * .6, -1.2)])); } return c; },
  prijzen: () => { const c = []; for (let i = 0; i < 6; i++) { const h = 0.4 + i * 0.28; c.push(kr(rechthoekP(-2.2 + i * 0.9, -0.75 + h / 2, -0.3 - i * 0.65, 0.5, h), true)); } return c; },
  faq: () => { const c = []; for (let i = 0; i < 8; i++) { const z = -0.3 - i * 0.8, y = ((i % 4) - 1.5) * 0.32, f2 = rnd() * TAU; c.push(kr([...Array(9)].map((_, j) => V3(-4 + j, y + Math.sin(j * 0.8 + f2) * 0.12, z)))); } return c; },
  contact: () => { const c = []; for (let j = 0; j < 4; j++) { const off = (j - 1.5) * 0.045; c.push(kr([...Array(96)].map((_, i) => { const t = i / 96 * TAU, sn = Math.sin(t), cs = Math.cos(t), d = 1 + sn * sn; return V3(sn * cs / d * 1.25 + off, cs / d * 1.3, Math.sin(t * 2) * 0.35 - 0.6 + off); }), true)); } return c; }
};
const formaties = [], FORMATIES_AAN = false; // uit: alleen de boom van kabels loopt door de site
document.querySelectorAll('#meer .sectie').forEach((el, i) => {
  const maak = FORMATIES_AAN && FORMATIE[el.id]; if (!maak) return;
  const g = new THREE.Group(), binnen = new THREE.Group(); g.add(binnen); binnen.add(bundel(maak(), 0.0042, wereldMat));
  g.quaternion.setFromRotationMatrix(basis); scene.add(g);
  formaties.push({ el, g, binnen, kant: i % 2 ? 1 : -1 });
});
const bgKleur = new THREE.Color(), RUSTK = new THREE.Color(0x08090e);
// ── Het weekrooster onder de 8: dagen naast elkaar (langs RE), monteurs achter elkaar (langs NA) ──
const VLOER = -2.2, VAK = 0.8, roosterO = new THREE.Vector3(0, VLOER, 0).addScaledVector(NA, rE * 0.9 - 1.6);
const roosterG = new THREE.Group(); roosterG.position.copy(roosterO); roosterG.quaternion.setFromRotationMatrix(basis); scene.add(roosterG); // lokaal: x = dagen, z = monteurs (naar de camera)
const roosterU = { tijd: tijdU, donker: donkerU, zicht: { value: 0 } };
const roosterLijnMat = new THREE.ShaderMaterial({ uniforms: roosterU, transparent: true, depthWrite: false,
  vertexShader: 'varying float vD; varying vec3 vP; void main(){ vP = position; vec4 mv = modelViewMatrix * vec4(position, 1.0); vD = -mv.z; gl_Position = projectionMatrix * mv; }',
  fragmentShader: `uniform float tijd; uniform float donker; uniform float zicht; varying float vD; varying vec3 vP;
    void main(){ float a = zicht * exp(-max(vD - 4.5, 0.0) * 0.12) * (0.14 + 0.05 * sin(vP.x * 0.4 + tijd * 0.25));
      vec3 c = donker > 0.5 ? vec3(0.42, 0.62, 1.0) : vec3(0.2, 0.32, 0.8); if (donker < 0.5) a *= 1.6;
      gl_FragColor = vec4(c, a);
      #include <colorspace_fragment>
    }` });
{ const p = []; for (let i = -60; i <= 60; i++) p.push(new THREE.Vector3(i * VAK, 0, -7 * VAK), new THREE.Vector3(i * VAK, 0, 7 * VAK)); for (let j = -7; j <= 7; j++) p.push(new THREE.Vector3(-60 * VAK, 0, j * VAK), new THREE.Vector3(60 * VAK, 0, j * VAK)); roosterG.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(p), roosterLijnMat)); }
// opdrachtblokjes in het rooster, in de kleuren van de soorten werk; ze ademen heel langzaam
const SOORTEN = [new THREE.Color(0x4f6ef5), new THREE.Color(0x10b981), new THREE.Color(0xef4444), new THREE.Color(0x8b5cf6)];
const AANTAL_VAK = SMAL ? 80 : 150, vakMat = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 });
const vakGeo = new THREE.PlaneGeometry(VAK * 0.86, VAK * 0.6); vakGeo.rotateX(-Math.PI / 2);
const vakken = new THREE.InstancedMesh(vakGeo, vakMat, AANTAL_VAK), vakInfo = [], m4 = new THREE.Matrix4(), kc = new THREE.Color();
for (let i = 0; i < AANTAL_VAK; i++) { const dag = Math.round((rnd() - .5) * 110), mont = Math.round((rnd() - .5) * 12); if (dag === 8 && mont === 1) continue; m4.makeTranslation(dag * VAK + VAK / 2, 0.003, mont * VAK + VAK / 2); vakken.setMatrixAt(i, m4); vakInfo.push({ i, kl: SOORTEN[Math.floor(rnd() * 4)], fase: rnd() * TAU, snel: 0.12 + rnd() * 0.22 }); }
vakken.count = AANTAL_VAK; roosterG.add(vakken);
// het blokje waar de opdracht van Fam. de Wit landt
const landVakMat = new THREE.MeshBasicMaterial({ color: 0x7fe0f5, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
const landVak = new THREE.Mesh(vakGeo, landVakMat); landVak.position.set(8 * VAK + VAK / 2, 0.004, VAK * 1.5); roosterG.add(landVak);
const landPos = landVak.getWorldPosition(new THREE.Vector3());
const landHalo = new THREE.Sprite(new THREE.SpriteMaterial({ map: stip, color: 0x7fe0f5, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending })); landHalo.scale.set(0.9, 0.9, 1); landHalo.position.copy(landPos).y += 0.02; scene.add(landHalo);
const OPZIJ = 8 * VAK; // de planning ligt rechts van de 8; zo schuift de 8 links uit beeld
const camEindBasis = new THREE.Vector3(0, VLOER + 5.2, 0).addScaledVector(NA, rE * 0.9 + 1.4).addScaledVector(RE, OPZIJ), kijkEindBasis = roosterO.clone().addScaledVector(NA, -0.8).addScaledVector(RE, OPZIJ);
const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), opStart = new THREE.Vector3();

const wil = { a: K[0][1], y: K[0][2], r: K[0][3] }, cam = { ...wil };
function standpunt(p) { let i = 0; while (i < K.length - 2 && p > K[i + 1][0]) i++; const a = K[i], b = K[i + 1], f = glad(THREE.MathUtils.clamp((p - a[0]) / (b[0] - a[0]), 0, 1)); wil.a = a[1] + (b[1] - a[1]) * f; wil.y = a[2] + (b[2] - a[2]) * f; wil.r = a[3] + (b[3] - a[3]) * f; }
let sleep = 0, sleepDoel = 0;

function zetThema() {
  const d = html.dataset.thema === 'donker';
  scene.background = d ? bgKleur : null; donkerU.value = d ? 1 : 0;
  const bl = d ? THREE.AdditiveBlending : THREE.NormalBlending;
  [...vezelMats, gloedMat, knoopMat, halo.material, bundelMat].forEach(m => { m.blending = bl; m.needsUpdate = true; });
  knoopMat.color.set(d ? 0x9fdcff : 0x2f4bc8); knoopMat.opacity = d ? 1 : 0.55;
  kernMat.emissiveIntensity = d ? 0.35 : 0.05; kernMat.color.setScalar(d ? 1 : 0.82);
  halo.material.color.set(d ? 0x7fe0f5 : 0x4f6ef5); halo.material.opacity = d ? 0.5 : 0.25;
  kern.material.color.set(d ? 0xffffff : 0x2f4bc8); opRing.material.opacity = d ? 0 : 0.9;
  ringen.slice(1).forEach(r => r.material.color.set(d ? 0xbfefff : 0x2f4bc8));
  if (d && !composer) maakComposer();
}
zetThema();

const reis = document.getElementById('reis');
const voortgang = () => THREE.MathUtils.clamp(-reis.getBoundingClientRect().top / (reis.offsetHeight - innerHeight), 0, 1);
function naarStap(i) { scrollTo({ top: reis.offsetTop + STOP_P[i] * (reis.offsetHeight - innerHeight), behavior: 'smooth' }); }
document.querySelectorAll('[data-stap]').forEach(b => b.addEventListener('click', () => naarStap(+b.dataset.stap)));
document.querySelector('[data-ga]').addEventListener('click', () => naarStap(1));
doek.addEventListener('pointerdown', e => { sleep0 = e.clientX; });
let sleep0 = null;
addEventListener('pointerup', () => { sleep0 = null; sleepDoel = 0; });
addEventListener('pointermove', e => { if (sleep0 !== null) sleepDoel = THREE.MathUtils.clamp((e.clientX - sleep0) / innerWidth * 1.2, -0.6, 0.6); });

// ── Overlay ──
const intro = document.getElementById('intro'), outro = document.getElementById('outro'), podium = document.querySelector('.podium'), feiten = document.querySelector('.feiten'), horizonEl = document.querySelector('.horizon'), landingBlok = document.querySelector('.landing-blok'), vlakrand = document.querySelector('.vlakrand'), golfrand = document.querySelector('.golfrand'), gGloed = golfrand.querySelector('.g-gloed'), gLijn = golfrand.querySelector('.g-lijn'), golfGrad = document.getElementById('golfGrad'), gStops = [...golfGrad.querySelectorAll('stop')], overgang = document.querySelector('.overgang');
const uitleg = [...document.querySelectorAll('[data-uitleg]')], stappen = [...document.querySelectorAll('.menu3d li')], menu = document.querySelector('.menu3d');
const labels = [null, 'Kantoor', 'Monteur', 'Werkplaats', 'Klant'].map(n => { if (!n) return null; const el = document.createElement('div'); el.className = 'station'; el.textContent = n; podium.appendChild(el); return el; });
const proj = new THREE.Vector3();
let vorigActief = 0;
function overlay(p, sec) {
  intro.classList.toggle('weg', p > 0.05); feiten.style.opacity = p > 0.04 ? 0 : 1; horizonEl.style.opacity = 1 - THREE.MathUtils.smoothstep(p, 0.02, 0.1); outro.classList.toggle('aan', p > 0.955); overgang.style.opacity = 1 - THREE.MathUtils.smoothstep(p, 0.95, 0.995);
  let actief = 0; for (let i = 1; i <= 4; i++) if (Math.abs(p - STOP_P[i]) < 0.075) actief = i;
  uitleg.forEach(u => u.classList.toggle('aan', +u.dataset.uitleg === actief));
  stappen.forEach((li, i) => { li.classList.toggle('aan', i + 1 === actief); li.classList.toggle('klaar', p > STOP_P[i + 1] + 0.075); });
  menu.style.opacity = p > 0.05 && p < 0.93 ? 1 : 0;
  toonScherm(actief);
  if (actief && actief !== vorigActief) aankomstU.value.setComponent(actief - 1, sec);
  vorigActief = actief; actiefSt.value = actief - 1;
  for (let i = 1; i <= 4; i++) { proj.copy(stationPos[i]).project(camera); const x = (proj.x * .5 + .5) * doek.clientWidth, y = (-proj.y * .5 + .5) * doek.clientHeight; labels[i].style.transform = `translate(${x - 14}px,${y}px) translate(-100%,-50%)`; labels[i].style.opacity = proj.z < 1 && p > 0.1 && p < 0.83 && !actief ? 1 : 0; labels[i].classList.toggle('aan', actief === i); }
  return actief;
}
function maat() { const w = doek.clientWidth, h = doek.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); if (composer) { composer.setSize(w, h); bloom.resolution.set(w, h); } }
addEventListener('resize', () => { if ((innerWidth <= 820) !== SMAL) location.reload(); else maat(); }); maat();

let laatst = performance.now(), loopt = false, start0 = 0, n0 = 0, verlaagd = false, opU = U_START, opRich = 1;
const duikV = new THREE.Vector3(), duikP = new THREE.Vector3();
function teken(nu) {
  const dt = Math.min(0.05, (nu - laatst) / 1000); laatst = nu;
  const p = voortgang(); standpunt(p);
  const k = 1 - Math.exp(-dt * 4);
  sleep += (sleepDoel - sleep) * k; cam.a += (wil.a - cam.a) * k; cam.y += (wil.y - cam.y) * k; cam.r += (wil.r - cam.r) * k;
  const sec = nu / 1000, a = cam.a + sleep + Math.sin(sec * 0.21) * 0.015 + Math.max(0, scrollY - reisEind()) / innerHeight * 0.55;
  camera.position.set(Math.sin(a) * cam.r, cam.y + 0.1 + Math.sin(sec * 0.17) * 0.01, Math.cos(a) * cam.r);
  const introF = 1 - glad(THREE.MathUtils.clamp(p / 0.12, 0, 1)), omhoog = introF * (SMAL ? 1.45 : 0.14);
  const zij = SMAL ? 0 : THREE.MathUtils.smoothstep(p, 0.14, 0.24) * 0.12 - introF * 1.05;
  const kijk = v.set(0, cam.y + omhoog, 0).addScaledVector(rechts(a), zij);
  camera.lookAt(kijk);
  // nieuw vlak schuift omhoog; de rand bepaalt waar de 8 afbrokkelt
  { const W = doek.clientWidth, H = doek.clientHeight, band = SMAL ? 110 : 150, sl = SMAL ? -0.05 : -0.07;
    const brok = THREE.MathUtils.clamp((p - 0.84) / 0.15, 0, 1), yEind = -Math.abs(sl) * W / 2 - 20, yStart = H + band * 1.3;
    const yC = brok > 0 ? yStart + (yEind - yStart) * brok : 1e5;
    snedeU.value.set(1e5, sl, band, // de 8 loopt door onder het oppervlak (vervaagd door het vlak) in plaats van af te breken
       composer && html.dataset.thema === 'donker' ? composer._pixelRatio : renderer.getPixelRatio()); maatU.value.set(W, H); stofPR.value = renderer.getPixelRatio();
    const yy = Math.min(yC, H + 40);
    { proj.copy(lichtbundel.position).project(camera); const bx = ((proj.x * .5 + .5) * W + 0.1 * W) / (1.2 * W) * 100; vlakrand.style.setProperty('--bx', bx.toFixed(1) + '%'); vlakrand.style.top = yC + 'px'; vlakrand.style.transform = `rotate(${Math.atan(sl)}rad)`; vlakrand.style.opacity = brok > 0 && yC > -60 && yC < H + 20 ? (THREE.MathUtils.smoothstep(brok, 0, 0.08) * THREE.MathUtils.smoothstep(yC, -60, H * 0.05)).toFixed(3) : 0; }
    // golvende waterlijn: de rand van het vlak, met het licht van de bundel erop
    const golf = []; for (let i = 0; i <= 48; i++) { const x = i / 48 * W; golf.push([x, yy + sl * (x - W / 2) + Math.sin(x * 0.011 + sec * 1.5) * 8 + Math.sin(x * 0.026 - sec * 1.1) * 4]); }
    overgang.style.clipPath = 'polygon(' + golf.map(([x, y]) => x.toFixed(1) + 'px ' + y.toFixed(1) + 'px').join(',') + ', 100% 100%, 0 100%)';
    overgang.style.setProperty('--opp', yy.toFixed(1) + 'px');
    const pad = 'M' + golf.map(([x, y]) => x.toFixed(1) + ' ' + y.toFixed(1)).join(' L'); gGloed.setAttribute('d', pad); gLijn.setAttribute('d', pad);
    { proj.copy(lichtbundel.position).project(camera); const bf = THREE.MathUtils.clamp(proj.x * .5 + .5, 0.2, 0.8); golfGrad.setAttribute('x2', W); gStops[1].setAttribute('offset', (bf - 0.2).toFixed(3)); gStops[2].setAttribute('offset', bf.toFixed(3)); gStops[3].setAttribute('offset', (bf + 0.2).toFixed(3)); }
    golfrand.style.opacity = vlakrand.style.opacity;
    outro.style.transform = `translateY(${Math.max(0, Math.min(yC, H * 2) - yEind)}px)`;
    const boven = pos3 => { proj.copy(pos3).project(camera); return yC + sl * ((proj.x * .5 + .5) * W - W / 2) - (.5 - proj.y * .5) * H; };
    opdracht.visible = true;
    ringen.forEach(r => { if (r) r.visible = true; });
    knoopMat.opacity = (html.dataset.thema === 'donker' ? 1 : 0.55) * (1 - brok); }
  // na de reis zakt de camera door de lichtwereld; de pagina en de 3D lopen gelijk op
  const extra = Math.max(0, scrollY - reisEind()), zak = extra * kPx();
  // van de 8 naar de planning: de camera kantelt omlaag naar het rooster; daarna glij je zijwaarts door de weken
  const over = THREE.MathUtils.smoothstep(p, 0.84, 0.985), glij = extra * kPx() * 0.9;
  if (false) { // rooster (optie A) uit
    const e = over * over * (3 - 2 * over);
    tmpA.copy(camEindBasis).addScaledVector(RE, glij); tmpB.copy(kijkEindBasis).addScaledVector(RE, glij);
    camera.position.lerp(tmpA, e); kijk.lerp(tmpB, e); camera.lookAt(kijk);
  }
  if (zak > 0) { camera.position.y -= zak; kijk.y -= zak; camera.lookAt(kijk); } // de 8 scrolt omhoog uit beeld, gelijk met de pagina
  roosterU.zicht.value = 0; roosterG.visible = false; vakken.visible = false;
  vakMat.opacity = roosterU.zicht.value; vakMat.blending = html.dataset.thema === 'donker' ? THREE.AdditiveBlending : THREE.NormalBlending;
  for (const o of vakInfo) { kc.copy(o.kl).multiplyScalar(html.dataset.thema === 'donker' ? 0.04 + 0.08 * (0.5 + 0.5 * Math.sin(sec * o.snel + o.fase)) : 0.35 + 0.2 * Math.sin(sec * o.snel + o.fase)); vakken.setColorAt(o.i, kc); }
  if (vakken.instanceColor) vakken.instanceColor.needsUpdate = true;
  const geland = 0; landVakMat.opacity = geland * (html.dataset.thema === 'donker' ? 0.85 : 0.6); landHalo.material.opacity = geland * 0.35 * (0.85 + 0.15 * Math.sin(sec * 1.2));
  // de lichtbundel loopt door het nieuwe vlak de pagina in en dooft daar langzaam uit
  { const n = v.copy(camera.position).setY(0).normalize(); lichtbundel.position.set(-n.x * 0.9, -5.0, -n.z * 0.9); bundelMat.uniforms.warm.value += ((({ koraal: 1, combi: 0.6 })[html.dataset.accent] || 0) - bundelMat.uniforms.warm.value) * 0.08; lichtbundel.lookAt(camera.position.x, lichtbundel.position.y, camera.position.z);
    const introB = 1 - glad(THREE.MathUtils.clamp(p / 0.12, 0, 1)); const eindB = THREE.MathUtils.smoothstep(p, 0.84, 1); bundelMat.uniforms.sterkte.value = (0.28 + 0.45 * Math.max(introB, eindB)) * (1 - THREE.MathUtils.smoothstep(extra, innerHeight * 1.1, innerHeight * 1.8));
    // het blok onder de hero vangt de bundel op: geef de horizontale plek van de bundel door
    if (landingBlok) { proj.copy(lichtbundel.position).project(camera); const bxPx = (proj.x * .5 + .5) * innerWidth, rb = landingBlok.getBoundingClientRect(), nbx = ((bxPx - rb.left) / Math.max(1, rb.width)) * 100, nl = Math.round(bundelMat.uniforms.sterkte.value * 25) / 25;
      if (Math.abs(nbx - (landingBlok._bx ?? -99)) > 0.4) { landingBlok._bx = nbx; landingBlok.style.setProperty('--bx', nbx.toFixed(1) + '%'); }
      if (nl !== landingBlok._l) { landingBlok._l = nl; landingBlok.style.setProperty('--licht', nl.toFixed(2)); }
      bundelMat.uniforms.snij.value.set(rb.top < innerHeight + 200 ? rb.top : 1e5, snedeU.value.w); }
    { // de straal in schermruimte volgt de 3D-bundel: zelfde plek, sterkte en warmte
      proj.copy(lichtbundel.position).project(camera); const pr = snedeU.value.w, W2 = maatU.value.x, H2 = maatU.value.y;
      straalU.bx.value = (proj.x * .5 + .5) * W2; straalU.res.value.set(W2 * pr, H2 * pr); straalU.css.value.set(W2, H2);
      straalU.sterkte.value = bundelMat.uniforms.sterkte.value; straalU.warm.value = bundelMat.uniforms.warm.value;
      const rbT = landingBlok ? landingBlok.getBoundingClientRect().top : 1e5; straalU.snij.value = rbT < innerHeight + 200 ? rbT : 1e5; }
    doek.style.opacity = (1 - THREE.MathUtils.smoothstep(extra, innerHeight * 1.2, innerHeight * 2.3)).toFixed(3);
    { const aan = bundelMat.uniforms.sterkte.value > 0.01, donkerNu = html.dataset.thema === 'donker'; lichtbundel.visible = aan && !donkerNu; straal2.visible = aan && donkerNu; } }
  if (bloom) bloom.strength = 0.3 - 0.1 * THREE.MathUtils.smoothstep(zak, 0, 1.5); // in de wereld minder gloed
  { const k2 = kPx(), zicht = innerHeight * k2;
    for (const fm of formaties) {
      const b = fm.el.getBoundingClientRect(), ys = yE - ((b.top + scrollY + b.height / 2 - innerHeight / 2) - reisEind()) * k2;
      const f = (kijk.y - ys) / zicht, a2 = THREE.MathUtils.smoothstep(Math.abs(f), 0.15, 1.2);
      fm.g.visible = Math.abs(f) < 2.5;
      fm.g.position.set(0, ys, 0).addScaledVector(RE, fm.kant * a2 * 2.6);
      fm.binnen.rotation.y = fm.kant * f * 0.35 + Math.sin(sec * 0.15) * 0.06; fm.binnen.rotation.x = Math.sin(sec * 0.11) * 0.04;
    } }
  if (html.dataset.thema === 'donker') bgKleur.copy(NEVEL).lerp(RUSTK, THREE.MathUtils.smoothstep(p, 0.88, 0.99));
  tijdU.value = sec; flitsU.value = THREE.MathUtils.smoothstep(p, 0.76, 0.86) * (1 - 0.75 * THREE.MathUtils.smoothstep(p, 0.95, 1.0));
  // opdracht volgt de scroll, met een beetje vertraging
  const o = opdrachtU(p);
  if (p < 0.1) { opU += dt * 0.045; opRich = 1; } // in het openingsbeeld draait de opdracht rondjes
  else { const doelU = o.u + Math.round(opU - o.u); opU += (doelU - opU) * (1 - Math.exp(-dt * 6)); opRich = o.rich; }
  opdracht.position.copy(curve.getPointAt(((opU % 1) + 1) % 1));
  { const val = 0; if (val > 0) { tmpA.lerpVectors(opdracht.position, landPos, val); tmpA.y += Math.sin(val * Math.PI) * 0.4; opdracht.position.copy(tmpA); } } // de opdracht valt uit de 8 in het rooster
  kopU.value = opU; richtingU.value = opRich; spoorU.value = 1;
  const adem = 1 + Math.sin(sec * 2.4) * 0.08; halo.scale.setScalar(0.32 * adem); opRing.lookAt(camera.position); opRing.scale.setScalar(adem);
  const actief = overlay(p, sec);
  for (let i = 0; i < 4; i++) { const doel = actief === i + 1 ? 1 : 0, nu2 = groeiU.value.getComponent(i); groeiU.value.setComponent(i, nu2 + (doel - nu2) * (1 - Math.exp(-dt * (doel ? 1.4 : 3)))); }
  ringen.forEach((r, i) => { if (!r) return; const doel = actief === i ? 1.35 : 1; r.scale.setScalar(r.scale.x + (doel - r.scale.x) * k); r.material.opacity = actief === i ? 1 : 0.45; });
  if (composer && html.dataset.thema === 'donker') composer.render(); else renderer.render(scene, camera);
  if (!verlaagd) { if (!start0) start0 = nu; n0++; if (nu - start0 > 2000) { verlaagd = true; const fps = n0 / ((nu - start0) / 1000); if (fps < 40) { renderer.setPixelRatio(1); if (composer) composer.setPixelRatio(1); maat(); } if (fps < 28) composer = null; } }
  if (loopt) requestAnimationFrame(teken);
}
function begin() { if (loopt) return; loopt = true; laatst = performance.now(); requestAnimationFrame(teken); }
begin();
document.addEventListener('visibilitychange', () => document.hidden ? (loopt = false) : begin());
document.querySelectorAll('.pv button[data-f]').forEach(b => b.addEventListener('click', () => { html.dataset.font = b.dataset.f; document.querySelectorAll('.pv button[data-f]').forEach(x => x.classList.toggle('aan', x === b)); }));
document.querySelectorAll('.pv button[data-a]').forEach(b => b.addEventListener('click', () => { html.dataset.accent = b.dataset.a; document.querySelectorAll('.pv button[data-a]').forEach(x => x.classList.toggle('aan', x === b)); }));
document.querySelectorAll('.pv button[data-t]').forEach(b => b.addEventListener('click', () => { html.dataset.thema = b.dataset.t; document.querySelectorAll('.pv button[data-t]').forEach(x => x.classList.toggle('aan', x === b)); zetThema(); maat(); }));
window.__f8 = { scene, camera, renderer, stationU, U };
}
