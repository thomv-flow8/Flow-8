// Flow8 marketingsite — gegenereerd uit de goedgekeurde preview (site-3d-draai-preview.html).
// De 3D-wereld: de liggende 8 als kabelbundel, de reis langs de vier stations en de vaste lichtstraal in het midden.
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
    const ruimte = innerWidth - 32;
    if (innerWidth <= 820) { const ruimteH = innerHeight - 128 - 250; sc = Math.min(ruimte / b, ruimteH / h); if (!staand && innerWidth <= 640) sc = Math.min(Math.max(sc, 0.8), ruimteH / h); }
    else sc = staand ? Math.min(innerHeight * 0.66 / h, 1.1) : Math.min(innerWidth * 0.42 / b, innerHeight * 0.62 / h, 1.25);
    const snij = innerWidth <= 640 && b * sc > ruimte + 1; s.classList.toggle('bijgesneden', snij);
    s.style.setProperty('--s', sc.toFixed(3)); s.style.width = (snij ? ruimte : b * sc) + 'px'; s.style.height = h * sc + 'px';
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
const scene = new THREE.Scene(), bgKleur = new THREE.Color(0x030407); scene.background = bgKleur;
scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;
const camera = new THREE.PerspectiveCamera(34, 1, 0.05, 120); scene.add(camera);
let zaad = 7; const rnd = () => (zaad = (zaad * 16807) % 2147483647) / 2147483647;
const tijdU = { value: 0 }, donkerU = { value: 1 }, maatU = { value: new THREE.Vector2(1, 1) };
const glad = x => x * x * x * (x * (x * 6 - 15) + 10);
const stip = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.2, 'rgba(255,255,255,.7)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();

// ── De liggende 8 als bundel kabels ──
// Lemniscaat in het vlak van het scherm; de twee strengen kruisen op verschillende diepte.
const S8 = 3.0;
function lemni(t, uit = new THREE.Vector3()) { const s = Math.sin(t), c = Math.cos(t), d = 1 + s * s; return uit.set(c / d * S8, s * c / d * S8 * 1.2, 0.3 * s); }
class Liggend extends THREE.Curve { getPoint(u, uit = new THREE.Vector3()) { return lemni(u * TAU, uit); } }
const curve = new Liggend();
const N = 1400, FR = curve.computeFrenetFrames(N, true), P = []; for (let i = 0; i <= N; i++) P.push(curve.getPointAt(i / N));
const kopU = { value: 0.62 }, spoorU = { value: 1 };
const kabelMat = new THREE.ShaderMaterial({ uniforms: { tijd: tijdU, kop: kopU, spoor: spoorU },
  vertexShader: `attribute float aF; attribute float aS; attribute float aT; varying float vU; varying float vF; varying float vS; varying float vT; varying vec3 vN; varying vec3 vV;
    void main(){ vU = uv.x; vF = aF; vS = aS; vT = aT; vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
  fragmentShader: `uniform float tijd; uniform float kop; uniform float spoor; varying float vU; varying float vF; varying float vS; varying float vT; varying vec3 vN; varying vec3 vV;
    void main(){
      vec3 L = normalize(vec3(0.3, 0.8, 0.6));
      float diff = clamp(dot(vN, L), 0.0, 1.0), rim = pow(clamp(1.0 - abs(dot(vN, vV)), 0.0, 1.0), 2.4);
      float spec = pow(clamp(dot(vN, normalize(L + vV)), 0.0, 1.0), 48.0);
      vec3 kleur = mix(vec3(0.50, 0.88, 0.96), vec3(0.31, 0.43, 0.96), 0.5 - 0.5 * cos(vU * 6.2832));
      vec3 mantel = mix(vec3(0.03, 0.05, 0.14), kleur * 0.55, 0.3 + 0.7 * vT);       // blauwe kabelmantel, per kabel net anders
      vec3 col = mantel * (0.35 + 0.85 * diff) + kleur * rim * 0.75 + kleur * 0.06 + vec3(0.75, 0.9, 1.0) * spec * 0.4;
      // heel subtiele, trage lichtpulsen die door elke kabel lopen
      float puls = pow(0.5 + 0.5 * cos(6.2832 * (vU * 2.0 - tijd * vS + vF)), 70.0);
      col += mix(kleur, vec3(0.92, 0.98, 1.0), 0.5) * puls * (0.45 + 0.6 * vT);
      // het spoor dat de opdracht door de bundel trekt
      float d = fract(vU - kop), staart = (1.0 - smoothstep(0.0, 0.07, d)) * smoothstep(0.0, 0.004, d) * spoor;
      col += vec3(0.75, 0.95, 1.0) * staart * (0.5 + 0.6 * vT);
      gl_FragColor = vec4(max(col, vec3(0.0)), 1.0);
      #include <colorspace_fragment>
    }` });
{
  const NK = SMAL ? 22 : 44, geos = [];
  for (let k = 0; k < NK; k++) {
    const laag = k / NK, r = 0.012 + 0.11 * Math.sqrt(laag), a0 = rnd() * TAU, draai = 3, dik = 0.006 + (1 - laag) * 0.008 + rnd() * 0.003, p = [];   // strak gebundeld, alle kabels in dezelfde slag
    for (let i = 0; i < N; i += 2) { const a = a0 + draai * TAU * (i / N); p.push(P[i].clone().addScaledVector(FR.normals[i], Math.cos(a) * r).addScaledVector(FR.binormals[i], Math.sin(a) * r)); }
    const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(p, true), SMAL ? 520 : 900, dik, 6, true), n = g.attributes.position.count;
    g.setAttribute('aF', new THREE.BufferAttribute(new Float32Array(n).fill(rnd()), 1));
    g.setAttribute('aS', new THREE.BufferAttribute(new Float32Array(n).fill(0.02 + rnd() * 0.05), 1));
    g.setAttribute('aT', new THREE.BufferAttribute(new Float32Array(n).fill(rnd()), 1));
    geos.push(g);
  }
  scene.add(new THREE.Mesh(mergeGeometries(geos), kabelMat));
  // kabelbinders: smalle metalen banden die de bundel bij elkaar houden
  const binderMat = new THREE.MeshPhysicalMaterial({ color: 0x8fa6c8, metalness: 0.85, roughness: 0.3, clearcoat: 0.6 });
  const binder = new THREE.TorusGeometry(0.14, 0.01, 8, 48);
  for (let i = 0; i < 16; i++) { const u = (i + 0.5) / 16, q = curve.getPointAt(u), m = new THREE.Mesh(binder, binderMat); m.position.copy(q); m.lookAt(q.clone().add(curve.getTangentAt(u))); scene.add(m); }
}

// ── Stations van links naar rechts: kantoor, monteur, werkplaats, klant ──
const STATION_U = [null, 0.5, 0.425, 0.075, 0.0];
const stationPos = STATION_U.map(u => u === null ? null : curve.getPointAt(u));
const ringMat = new THREE.MeshBasicMaterial({ color: 0xbfefff, transparent: true, opacity: 0.5, toneMapped: false });
const ringen = [null];
for (let i = 1; i <= 4; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.007, 8, 72), ringMat.clone()); r.position.copy(stationPos[i]); r.lookAt(stationPos[i].clone().add(curve.getTangentAt(STATION_U[i]))); scene.add(r); ringen.push(r); }

// ── De opdracht: een lichtpunt dat door de bundel van links naar rechts reist ──
const opdracht = new THREE.Group(); scene.add(opdracht);
opdracht.add(new THREE.Mesh(new THREE.SphereGeometry(0.05, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false })));
const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: stip, color: 0x7fe0f5, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.6 })); halo.scale.set(0.6, 0.6, 1); opdracht.add(halo);
opdracht.add(new THREE.PointLight(0x7fe0f5, 1.2, 1.6, 2));
const STOP_P = [null, 0.26, 0.44, 0.62, 0.80], RUST = 0.045, U_START = 0.62, U_EIND = -0.125;   // na Klant tot het laagste punt van de rechterlus
function opdrachtU(p) {
  if (p <= STOP_P[1] - RUST) return U_START + (STATION_U[1] - U_START) * glad(THREE.MathUtils.clamp((p - 0.1) / (STOP_P[1] - RUST - 0.1), 0, 1));
  for (let i = 1; i <= 4; i++) {
    if (p <= STOP_P[i] + RUST) return STATION_U[i];
    const vp = i < 4 ? STOP_P[i + 1] - RUST : 0.93, vu = i < 4 ? STATION_U[i + 1] : U_EIND;   // na Klant nog een stukje door de onderste lus
    if (p <= vp) return STATION_U[i] + (vu - STATION_U[i]) * glad((p - STOP_P[i] - RUST) / (vp - STOP_P[i] - RUST));
  }
  return U_EIND;
}

// ── De lichtstraal: vast in het midden van het scherm, van boven naar beneden ──
const snedeU = { value: new THREE.Vector4(1e5, 0, 0, 1) };
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
      // één doorlopende regel: het raakpunt ligt eerst net onder het scherm en schuift met de slotzin mee omhoog,
      // zodat de straal naar onder steeds even geleidelijk breder wordt en nergens versmalt
      float inslagY = mix(css.y + 200.0, snij, landt), naar = exp(-max(inslagY - cp.y, 0.0) / (css.y * 0.42));
      float bw = 20.0 + 250.0 * naar;
      float kern = exp(-dx * dx / 3.0) * boven * (0.6 + 0.4 * hoog), kernZacht = exp(-dx * dx / 70.0) * boven * 0.3;
      float puls = pow(0.5 + 0.5 * cos(6.2832 * (-cp.y / 700.0 - tijd * 0.1)), 12.0) * exp(-dx * dx / 8.0) * boven;
      // bovenin vooral een was van wolken rond de straal, onderaan de waas met het fijne raster
      float waas = exp(-dx * dx / (bw * bw)) * bovenZacht * (0.05 + 0.95 * naar);
      float rookZone = exp(-abs(dx) / mix(460.0, 230.0, naar)) * bovenZacht;
      float waaier = landt * exp(-abs(dy) / 30.0) * exp(-dx * dx / (230.0 * 230.0));
      vec3 col = vec3(0.0);
      if (waas + rookZone + waaier > 0.01) {
        // stromende wolken in de waas (zakken omlaag) en een fijn raster in plaats van korrel
        vec2 q = vec2(dx * 0.010, (cp.y - tijd * 40.0) * 0.005);
        float wolk = smoothstep(0.22, 0.86, fbm(q + 0.8 * fbm(q * 1.6 + vec2(0.0, tijd * 0.05))));
        vec2 bin = abs(fract(cp / 3.0) - 0.5); float raster = 1.0 - 0.32 * step(0.36, max(bin.x, bin.y));
        // grote, trage rookwolken rond de straal, door het licht beschenen
        vec2 q2 = vec2(cp.x * 0.0021 + tijd * 0.004, cp.y * 0.0027 - tijd * 0.011);
        float rook = smoothstep(mix(0.3, 0.46, naar), 0.95, fbm(q2 + 0.7 * fbm(q2 * 2.1 - vec2(tijd * 0.008))));
        float bt = clamp(abs(dx) / max(bw, 1.0), 0.0, 1.0);
        vec3 kB = mix(vec3(0.8, 0.96, 1.0), vec3(0.3, 0.62, 1.0), smoothstep(0.0, 0.5, bt));
        kB = mix(kB, vec3(0.5, 0.36, 1.0), smoothstep(0.5, 1.0, bt));
        kB = mix(kB, vec3(1.0, 0.54, 0.39), warm * 0.55 * naar * smoothstep(0.25, 0.95, bt));
        vec3 kRook = mix(mix(vec3(0.16, 0.24, 0.6), vec3(0.1, 0.16, 0.48), naar), vec3(0.3, 0.24, 0.66), rook);
        vec3 kWaaier = mix(vec3(0.85, 0.96, 1.0), vec3(1.0, 0.78, 0.66), warm * 0.6);
        // van donker bovenin naar licht onderin: wolken en waas worden pas naar onder toe helder
        float verloop = mix(0.18, 1.0, smoothstep(0.05, 0.8, hoog));
        col = (kB * waas * (0.3 + 0.95 * wolk) * raster * 0.85 + kRook * rook * rookZone * mix(0.42, 0.38, naar)) * verloop + kWaaier * waaier * 0.9;
      }
      col += vec3(0.92, 0.98, 1.0) * (kern * 1.2 + kernZacht + puls * 1.2);
      gl_FragColor = vec4(col * sterkte * 1.35, 1.0);
    }`,
  defines: { OCT: SMAL ? 3 : 4 } });
const straal2 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), straalMat2); straal2.frustumCulled = false; straal2.renderOrder = -3; scene.add(straal2);
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
      float a = smoothstep(0.35, 0.85, w) * (0.03 + 0.08 * midden) * donker * mix(1.0, 0.2, smoothstep(0.45, 0.72, vUv.y));   // bovenin donkerder
      a *= 0.85 + 0.3 * h(floor(gl_FragCoord.xy) + floor(tijd * 10.0));
      gl_FragColor = vec4(c, a);
      #include <colorspace_fragment>
    }` });
const nevel = new THREE.Mesh(new THREE.PlaneGeometry(60, 34), nevelMat); nevel.renderOrder = -2; nevel.position.set(0, 0, -24); camera.add(nevel); scene.add(camera);

let composer = null, bloom = null;
if (!SMAL) { composer = new EffectComposer(renderer); composer.setPixelRatio(Math.min(1.5, PR)); composer.addPass(new RenderPass(scene, camera)); bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.35, 0.45, 0.84); composer.addPass(bloom); composer.addPass(new OutputPass()); }

// ── Camerapad: een reis door de bundel. De camera vliegt achter de opdracht aan, langs de kabels,
// door het kruispunt en de lichtstraal heen; aan het begin en eind het overzicht van de hele 8.
const V = (x, y, z) => new THREE.Vector3(x, y, z), NAAR_KIJKER = V(0, 0, 1), AS_Y = V(0, 1, 0);
// startbeeld: dicht op de 8, schuin langs de rechterlus naar het kruispunt en de lus die erachter wegloopt; langzaam drijvend
const OVERZICHT = SMAL ? { pos: V(1.6, 1.0, 5.2), kijk: V(-0.6, -0.1, 0) } : { pos: V(3.6, 1.2, 4.3), kijk: V(-2.4, -0.15, 0) };
// eind: door het kruispunt, dan omlaag kijken langs de lichtbundel naar de slotzin
const EIND = SMAL ? { pos: V(0, 0.9, 2.2), kijk: V(0, -2.4, 0.2) } : { pos: V(0, 0.85, 1.7), kijk: V(0, -2.4, 0.2) };
const omU = u => ((u % 1) + 1) % 1;
function reisPose(u, uit) {
  const C = curve.getPointAt(omU(u)), vooruit = curve.getTangentAt(omU(u)).multiplyScalar(-1);   // de opdracht reist naar lagere u
  const opzij = vooruit.clone().cross(NAAR_KIJKER).normalize(), zwaai = Math.sin(u * TAU * 1.5);
  const achter = vooruit.clone(); achter.y *= 0.3;   // achter de opdracht vooral horizontaal, zodat de camera niet op en neer gaat
  uit.pos.copy(C).addScaledVector(achter, SMAL ? -1.7 : -1.45).addScaledVector(NAAR_KIJKER, SMAL ? 1.5 : 1.15).addScaledVector(opzij, 0.55 * zwaai).add(V(0, 0.25, 0));
  uit.kijk.copy(curve.getPointAt(omU(u - 0.045))).add(V(0, 0.05, 0));
  return uit;
}
const KL = reisPose(STATION_U[4], { pos: V(), kijk: V() });             // het beeld bij Klant: begin van de slotboog
const NAAR_BUNDEL = SMAL ? { pos: V(0.5, -1.9, 5.2), kijk: V(0, -2.5, 0) } : { pos: V(0.9, -1.75, 3.6), kijk: V(-0.15, -2.2, 0) };   // onder de 8, op middelafstand, de straal in het midden
const reisDoel = { pos: V(), kijk: V() }, camPos = OVERZICHT.pos.clone(), camKijk = OVERZICHT.kijk.clone(), wilPos = V(), wilKijk = V();
function standpunt(p, u) {
  reisPose(u, reisDoel);
  const sec = performance.now() / 1000, drift = V(Math.sin(sec * 0.11) * 0.35, Math.sin(sec * 0.08) * 0.15, Math.cos(sec * 0.11) * 0.25);
  const start = { pos: OVERZICHT.pos.clone().add(drift), kijk: OVERZICHT.kijk };
  if (p < 0.1) { wilPos.copy(start.pos); wilKijk.copy(start.kijk); return; }
  if (p < 0.21) { const f = glad((p - 0.1) / 0.11); wilPos.lerpVectors(start.pos, reisDoel.pos, f); wilKijk.lerpVectors(start.kijk, reisDoel.kijk, f); return; }
  const pEind = STOP_P[4] + RUST;
  if (p < pEind) { wilPos.copy(reisDoel.pos); wilKijk.copy(reisDoel.kijk); return; }
  // na Klant: langs de kabel door de onderste lus omlaag, zoals de rest van de reis (de opdracht reist daar ook)
  if (p < 0.93) { wilPos.copy(reisDoel.pos); wilKijk.copy(reisDoel.kijk); return; }
  // op het laagste punt laat de camera de kabel los en glijdt in dezelfde richting door naar de lichtbundel onder de 8
  const g = glad(THREE.MathUtils.clamp((p - 0.93) / 0.07, 0, 1));
  wilPos.lerpVectors(reisDoel.pos, NAAR_BUNDEL.pos, g); wilKijk.lerpVectors(reisDoel.kijk, NAAR_BUNDEL.kijk, g);
}

const reisEl = document.getElementById('reis'), reisEind = () => reisEl.offsetTop + reisEl.offsetHeight - innerHeight;
const voortgang = () => THREE.MathUtils.clamp(-reisEl.getBoundingClientRect().top / (reisEl.offsetHeight - innerHeight), 0, 1);
function naarStap(i) { scrollTo({ top: reisEl.offsetTop + STOP_P[i] * (reisEl.offsetHeight - innerHeight), behavior: 'smooth' }); }
document.querySelectorAll('[data-stap]').forEach(b => b.addEventListener('click', () => naarStap(+b.dataset.stap)));
document.querySelector('[data-ga]').addEventListener('click', () => naarStap(1));

// ── Overlay: kaarten, schermen, tijdlijn en stationslabels ──
const intro = document.getElementById('intro'), podium = document.querySelector('.podium'), feiten = document.querySelector('.feiten'), horizonEl = document.querySelector('.horizon'), landingBlok = document.querySelector('.landing-blok');
const uitleg = [...document.querySelectorAll('[data-uitleg]')], stappen = [...document.querySelectorAll('.menu3d li')], menu = document.querySelector('.menu3d');
const labels = [null, 'Kantoor', 'Monteur', 'Werkplaats', 'Klant'].map(n => { if (!n) return null; const el = document.createElement('div'); el.className = 'station'; el.textContent = n; podium.appendChild(el); return el; });
const proj = new THREE.Vector3();
function overlay(p) {
  intro.classList.toggle('weg', p > 0.05); feiten.style.opacity = p > 0.04 ? 0 : 1; if (horizonEl) horizonEl.style.opacity = 1 - THREE.MathUtils.smoothstep(p, 0.02, 0.1);
  let actief = 0; for (let i = 1; i <= 4; i++) if (Math.abs(p - STOP_P[i]) < 0.075) actief = i;
  uitleg.forEach(u => u.classList.toggle('aan', +u.dataset.uitleg === actief));
  stappen.forEach((li, i) => { li.classList.toggle('aan', i + 1 === actief); li.classList.toggle('klaar', p > STOP_P[i + 1] + 0.075); });
  menu.style.opacity = p > 0.05 && p < 0.93 ? 1 : 0;
  toonScherm(actief);
  for (let i = 1; i <= 4; i++) { proj.copy(stationPos[i]).project(camera); const x = (proj.x * .5 + .5) * doek.clientWidth, y = (-proj.y * .5 + .5) * doek.clientHeight; labels[i].style.transform = `translate(${x}px,${y - 34}px) translate(-50%,-100%)`; labels[i].style.opacity = proj.z < 1 && p > 0.1 && p < 0.9 && !actief ? 1 : 0; }
  return actief;
}
function maat() { const w = doek.clientWidth, h = doek.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); if (composer) { composer.setSize(w, h); bloom.resolution.set(w, h); } maatU.value.set(w, h); snedeU.value.w = composer ? composer._pixelRatio : renderer.getPixelRatio(); }
addEventListener('resize', () => { if ((innerWidth <= 820) !== SMAL) location.reload(); else maat(); }); maat();

let laatst = performance.now(), loopt = false, opU = U_START, start0 = 0, n0 = 0, verlaagd = false;
function teken(nu) {
  const dt = Math.min(0.05, (nu - laatst) / 1000); laatst = nu; const sec = nu / 1000; tijdU.value = sec;
  const p = voortgang(), extra = Math.max(0, scrollY - reisEind());
  const k = 1 - Math.exp(-dt * 3.5);
  // de opdracht volgt de scroll met een beetje vertraging; in het openingsbeeld drijft hij rustig rond
  if (p < 0.1) opU += dt * 0.02; else { const doel = opdrachtU(p), d = doel + Math.round(opU - doel); opU += (d - opU) * (1 - Math.exp(-dt * 5)); }
  const uu = ((opU % 1) + 1) % 1; opdracht.position.copy(curve.getPointAt(uu)); kopU.value = uu;
  standpunt(p, opU); const kc = 1 - Math.exp(-dt * 5); camPos.lerp(wilPos, kc); camKijk.lerp(wilKijk, kc);
  camera.position.copy(camPos).add(proj.set(Math.sin(sec * 0.13) * 0.08, Math.sin(sec * 0.17) * 0.05, 0)); 
  const kijk = camKijk.clone();
  // aan het eind draait de 8 subtiel door in 3D (de camera cirkelt rustig om de as), zodat het niet stilstaat
  const eindW = THREE.MathUtils.smoothstep(p, 0.9, 1);
  if (eindW > 0) { const th = eindW * (0.16 * Math.sin(sec * 0.12) + Math.min(extra / innerHeight, 1.5) * 0.35); camera.position.applyAxisAngle(AS_Y, th); kijk.applyAxisAngle(AS_Y, th); }
  // na de reis schuift alles gelijk met de pagina omhoog uit beeld
  const afstand = camera.position.distanceTo(kijk), kPx = 2 * afstand * Math.tan(THREE.MathUtils.degToRad(17)) / innerHeight, zak = extra * kPx;
  camera.position.y -= zak; kijk.y -= zak; camera.lookAt(kijk);
  halo.scale.setScalar(0.5 * (1 + Math.sin(sec * 2.4) * 0.08));
  const actief = overlay(p);
  ringen.forEach((r, i) => { if (!r) return; const doel = actief === i ? 1.25 : 1; r.scale.setScalar(r.scale.x + (doel - r.scale.x) * k); r.material.opacity = actief === i ? 1 : 0.35; });
  // de straal: vast in het midden; bij de slotzin waaiert hij uit
  const introB = 1 - glad(THREE.MathUtils.clamp(p / 0.12, 0, 1)), eindB = THREE.MathUtils.smoothstep(p, 0.84, 1);
  const sterkte = (0.45 + 0.35 * Math.max(introB, eindB)) * (1 - THREE.MathUtils.smoothstep(extra, innerHeight * 1.1, innerHeight * 1.8));
  const W2 = maatU.value.x, H2 = maatU.value.y, pr = snedeU.value.w;
  straalU.bx.value = W2 / 2; straalU.res.value.set(W2 * pr, H2 * pr); straalU.css.value.set(W2, H2); straalU.sterkte.value = sterkte; straalU.warm.value = 0.6;
  if (landingBlok) { const rb = landingBlok.getBoundingClientRect(); straalU.snij.value = rb.top < innerHeight + 200 ? rb.top : 1e5;
    const nbx = ((W2 / 2 - rb.left) / Math.max(1, rb.width)) * 100, nl = Math.round(sterkte * 25) / 25;
    if (Math.abs(nbx - (landingBlok._bx ?? -99)) > 0.4) { landingBlok._bx = nbx; landingBlok.style.setProperty('--bx', nbx.toFixed(1) + '%'); }
    if (nl !== landingBlok._l) { landingBlok._l = nl; landingBlok.style.setProperty('--licht', nl.toFixed(2)); } }
  straal2.visible = sterkte > 0.01;
  doek.style.opacity = (1 - THREE.MathUtils.smoothstep(extra, innerHeight * 1.2, innerHeight * 2.3)).toFixed(3);
  if (composer) composer.render(); else renderer.render(scene, camera);
  if (!verlaagd) { if (!start0) start0 = nu; n0++; if (nu - start0 > 2000) { verlaagd = true; const fps = n0 / ((nu - start0) / 1000); if (fps < 40) { renderer.setPixelRatio(1); if (composer) composer.setPixelRatio(1); maat(); } if (fps < 28) composer = null; } }
  if (loopt) requestAnimationFrame(teken);
}
function begin() { if (loopt) return; loopt = true; laatst = performance.now(); requestAnimationFrame(teken); }
begin();
document.addEventListener('visibilitychange', () => document.hidden ? (loopt = false) : begin());
window.__f8 = { scene, camera, renderer };
}
