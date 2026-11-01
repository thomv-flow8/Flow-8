#!/usr/bin/env node
// Flow8 — publiceren naar docs/ voor Cloud86.
//
// De hoofdmap blijft de BRON en blijft canoniek: flow8-v2.html, sw.js en Flow8-website.html
// worden hier nooit gewijzigd. Dit script maakt daar de Cloud86-versies van in docs/, met de
// paden omgezet van /Flow-8/ (de submap op GitHub Pages) naar / (de hoofdmap van het domein).
//
// Daardoor kan de oude omgeving gewoon blijven draaien zolang de verhuizing loopt: Pages
// serveert de bronbestanden met /Flow-8/, Cloud86 serveert docs/ met /.
//
//   docs/site/   → flow-8.nl        (marketingsite)
//   docs/app/    → app.flow-8.nl    (de applicatie)
//
// Draai het script twee keer: de tweede keer hoort "0 bestanden bijgewerkt" te geven. Staat
// daar iets anders, dan is de uitvoer niet stabiel en klopt er iets niet.
//
// Gebruik: node publiceer.js             publiceren
//          node publiceer.js --controleer  alleen kijken of docs/ bij is (schrijft niets)
//
// De controlemodus zit in check.sh. Zo kan docs/ niet stilletjes achterlopen bij de bron —
// anders serveert Cloud86 een oude app terwijl de hoofdmap al bijgewerkt is.

'use strict';
const fs = require('fs');
const path = require('path');

const WORTEL = __dirname;
const APP_HOST = 'app.flow-8.nl';
const ALLEEN_CONTROLE = process.argv.includes('--controleer');

let gewijzigd = 0;
const gedaan = [];

// ── Hulpmiddelen ─────────────────────────────────────────────────────────────

// Vervangt en controleert het aantal. Klopt het aantal niet, dan stopt het script zonder
// iets weg te schrijven — liever geen uitvoer dan stilletjes de verkeerde uitvoer.
function vervang(tekst, oud, nieuw, verwacht, waar) {
  const n = tekst.split(oud).length - 1;
  if (n !== verwacht) {
    throw new Error(
      `${waar}: ${n} voorkomens van ${JSON.stringify(oud.slice(0, 60))}, verwacht ${verwacht}.\n` +
      '   De bron is gewijzigd. Pas publiceer.js aan voordat je publiceert.'
    );
  }
  return tekst.split(oud).join(nieuw);
}

// Schrijft alleen als de inhoud echt anders is, zodat een tweede ronde "0 bijgewerkt" geeft.
function schrijf(relPad, inhoud) {
  const vol = path.join(WORTEL, relPad);
  fs.mkdirSync(path.dirname(vol), { recursive: true });
  const oud = fs.existsSync(vol) ? fs.readFileSync(vol, 'utf8') : null;
  if (oud === inhoud) { gedaan.push(`  = ${relPad}`); return; }
  gewijzigd++;
  gedaan.push(`  ${oud === null ? '+' : '~'} ${relPad}`);
  if (ALLEEN_CONTROLE) return;
  fs.writeFileSync(vol, inhoud);
}

function lees(naam) {
  return fs.readFileSync(path.join(WORTEL, naam), 'utf8');
}

// ── .htaccess ────────────────────────────────────────────────────────────────

// Gedeeld deel: https afdwingen en compressie. Identiek voor beide sites.
const HTACCESS_BASIS = `
# ── https afdwingen ──
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]

# ── Compressie ──
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/javascript application/json image/svg+xml
</IfModule>
`.trim();

// Waarom hier (nog) geen Content-Security-Policy staat. Deze uitleg hoort in het bestand
// zelf, want anders zet iemand hem er over een half jaar alsnog "even" bij.
const CSP_UITLEG = `
# ── Content-Security-Policy: bewust NIET in deze ronde ──
# De app praat met Firebase (auth, database, opslag, functions), Google Maps, PDOK en twee
# CDN's, draait een web worker voor PDF.js, maakt blob-URL's voor pdf's en zet een verborgen
# iframe op flow8-715de.firebaseapp.com neer om in te loggen. Een CSP die daar één regel van
# mist breekt stil het inloggen of de kaart. Tijdens een verhuizing is dat niet te scheiden
# van een hostingprobleem.
# Volgende ronde: eerst Content-Security-Policy-Report-Only, een week de meldingen lezen,
# en pas daarna afdwingen.
`.trim();

const HSTS_UITLEG = `
# Pas aanzetten als https op Cloud86 bewezen werkt — browsers onthouden dit een jaar:
# Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
`.trim();

const HTACCESS_APP = `# Flow8 app (${APP_HOST}) — gegenereerd door publiceer.js, niet met de hand aanpassen.

# De app heet flow8-v2.html, net als op GitHub Pages. Daardoor komt de service worker op beide
# plekken bij hetzelfde bestand uit. Dit laat / ook gewoon werken.
DirectoryIndex flow8-v2.html

${HTACCESS_BASIS}

# ── Beveiligingskoppen ──
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "DENY"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  # LET OP: geolocation moet (self) zijn — de planning en het kaartoverzicht gebruiken
  # navigator.geolocation. Op () gezet breekt "mijn locatie" zonder foutmelding.
  Header always set Permissions-Policy "camera=(self), microphone=(), geolocation=(self), interest-cohort=()"

${CSP_UITLEG.split('\n').map(r => '  ' + r).join('\n')}

${HSTS_UITLEG.split('\n').map(r => '  ' + r).join('\n')}
</IfModule>

# ── Caching ──
# De app is één bestand van ruim 2 MB. Het moet elke keer gecontroleerd worden — een 304 is
# goedkoop, opnieuw downloaden niet. De service worker mag NOOIT uit de cache komen, anders
# houdt een oude versie zichzelf in stand en krijgt niemand nog een update te zien.
<IfModule mod_headers.c>
  <FilesMatch "\\.html$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>
  <Files "sw.js">
    Header set Cache-Control "no-store, max-age=0"
  </Files>
</IfModule>
`;

const HTACCESS_SITE = `# Flow8 marketingsite (flow-8.nl) — gegenereerd door publiceer.js, niet met de hand aanpassen.

DirectoryIndex index.html

${HTACCESS_BASIS}

# ── Beveiligingskoppen ──
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "DENY"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), interest-cohort=()"

  # Ook hier nog geen CSP: de marketingsite is een gebundelde export met een verwijzing naar
  # React op unpkg.com in een JSON-blok. Of die bij het laden echt opgehaald wordt is van
  # buitenaf niet met zekerheid te zien, dus eerst Report-Only, dan pas afdwingen.

${HSTS_UITLEG.split('\n').map(r => '  ' + r).join('\n')}
</IfModule>

# ── Caching ──
<IfModule mod_headers.c>
  <FilesMatch "\\.html$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>
</IfModule>
`;

// ── Bouwen ───────────────────────────────────────────────────────────────────

try {
  // 1. De app. Drie paden in het manifest (start_url en twee snelkoppelingen).
  let app = lees('flow8-v2.html');
  app = vervang(app, '/Flow-8/flow8-v2.html', '/flow8-v2.html', 3, 'flow8-v2.html (manifest)');
  schrijf('docs/app/flow8-v2.html', app);

  // 2. De service worker. Drie plekken, elk met een eigen reden, dus stuk voor stuk.
  let sw = lees('sw.js');
  sw = vervang(sw,
    "const OFFLINE_URL = '/Flow-8/flow8-v2.html';",
    "const OFFLINE_URL = '/flow8-v2.html';",
    1, 'sw.js (OFFLINE_URL)');
  sw = vervang(sw,
    "  '/Flow-8/flow8-v2.html',",
    "  '/flow8-v2.html',",
    1, 'sw.js (PRECACHE)');
  // Op Cloud86 staat de app in de hoofdmap, dus de aparte /Flow-8/-controle vervalt; de
  // controle op '/' die er al naast stond dekt hem af.
  sw = vervang(sw,
    "url.endsWith('/') || url.endsWith('/Flow-8/')",
    "url.endsWith('/')",
    1, 'sw.js (navigatiecontrole)');
  schrijf('docs/app/sw.js', sw);

  schrijf('docs/app/.htaccess', HTACCESS_APP);

  // 3. De marketingsite. De drie knoppen naar de app wijzen nu naar het eigen subdomein.
  let site = lees('Flow8-website.html');
  site = vervang(site,
    'https://thomv-flow8.github.io/Flow-8/flow8-v2.html',
    `https://${APP_HOST}/flow8-v2.html`,
    3, 'Flow8-website.html (knoppen naar de app)');
  schrijf('docs/site/index.html', site);

  schrijf('docs/site/.htaccess', HTACCESS_SITE);

  if (ALLEEN_CONTROLE) {
    if (gewijzigd === 0) { console.log('✓ docs/ is bij'); process.exit(0); }
    console.error('✗ docs/ loopt achter op de bron:');
    console.error(gedaan.filter(r => !r.startsWith('  =')).join('\n'));
    console.error('   Draai "node publiceer.js" voordat je commit.');
    process.exit(1);
  }
  console.log(gedaan.join('\n'));
  console.log(`\n${gewijzigd} bestand${gewijzigd === 1 ? '' : 'en'} bijgewerkt.`);
} catch (e) {
  console.error('\n✗ Publiceren afgebroken.\n   ' + e.message);
  process.exit(1);
}
