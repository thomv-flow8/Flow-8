#!/usr/bin/env node
// Flow8 — bouwt de marketingsite van site/ naar docs/site/.
//
// site/ is de bron en wordt nooit beschreven. docs/site/ is de uitvoer en is wat Cloud86
// publiceert. Dezelfde scheiding als bij ViVo en THNK; daar liep het een keer mis doordat
// bron en uitvoer hetzelfde bestand waren en de tweede ronde over zijn eigen werk heen ging.
//
// Het script controleert elke verwijzing in de HTML. Ontbreekt er een bestand, dan stopt het
// zonder iets weg te schrijven — liever geen uitvoer dan een site met gaten.
//
// Gebruik: node tools/bouw-site.js [--uit=<map>] [--controleer]

'use strict';
const fs = require('fs');
const path = require('path');

const WORTEL = path.resolve(__dirname, '..');
const BRON   = path.join(WORTEL, 'site');
const arg    = (n) => (process.argv.find(a => a.startsWith('--' + n + '=')) || '').split('=')[1];
const UIT    = path.resolve(WORTEL, arg('uit') || 'docs/site');
const ALLEEN_CONTROLE = process.argv.includes('--controleer');

let gewijzigd = 0;
const gedaan = [];

function bestanden(map, basis = map) {
  return fs.readdirSync(map, { withFileTypes: true }).flatMap(d => {
    const vol = path.join(map, d.name);
    if (d.isDirectory()) return bestanden(vol, basis);
    return [path.relative(basis, vol)];
  });
}

function schrijf(rel, inhoud) {
  const vol = path.join(UIT, rel);
  fs.mkdirSync(path.dirname(vol), { recursive: true });
  const oud = fs.existsSync(vol) ? fs.readFileSync(vol) : null;
  if (oud && Buffer.compare(oud, inhoud) === 0) { gedaan.push('  = ' + rel); return; }
  gewijzigd++;
  gedaan.push('  ' + (oud === null ? '+' : '~') + ' ' + rel);
  if (!ALLEEN_CONTROLE) fs.writeFileSync(vol, inhoud);
}

// ── .htaccess ────────────────────────────────────────────────────────────────
const HTACCESS = `# Flow8 marketingsite — gegenereerd door tools/bouw-site.js, niet met de hand aanpassen.

DirectoryIndex index.html

# ── https afdwingen ──
# Het controlepad van Let's Encrypt blijft bewust over http bereikbaar.
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteCond %{REQUEST_URI} !^/\\.well-known/acme-challenge/
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]

# ── Compressie ──
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/javascript application/json image/svg+xml
</IfModule>

# ── Beveiligingskoppen ──
<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "DENY"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(), interest-cohort=()"

  # Deze site laadt alles van zichzelf: geen externe scripts, geen Google Fonts.
  # Daarom kan de CSP hier wél streng, anders dan bij de app. 'self' en niet 'none'
  # voor script-src, omdat rekenmodule.js de prijsindicatie levend maakt; dat is één
  # eigen bestand, geen inline code, dus 'unsafe-inline' blijft eruit.
  # connect-src staat de eigen Cloud Function toe: daar gaat het contactformulier
  # heen. Zonder die regel valt hij terug op default-src 'self' en blokkeert de
  # browser de aanvraag — stil, met alleen een melding in de console.
  Header always set Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://europe-west1-flow8-715de.cloudfunctions.net; form-action 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'"

  # Pas aanzetten als https op Cloud86 bewezen werkt — browsers onthouden dit een jaar:
  # Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>

# ── Caching ──
<IfModule mod_headers.c>
  <FilesMatch "\\.html$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>
  # JavaScript altijd opnieuw laten controleren (een 304 kost bijna niets); de HTML verwijst er
  # bovendien met ?v=<hash> naar, zodat een nieuwe versie direct een nieuwe URL heeft.
  <FilesMatch "\\.js$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>
  <FilesMatch "\\.(webp|png|jpg|svg|woff2|css)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
</IfModule>
`;

try {
  if (!fs.existsSync(BRON)) throw new Error('site/ bestaat niet');
  const lijst = bestanden(BRON)
    .filter(f => !f.split('/').some(deel => deel.startsWith('_')));

  // ── Gedeelde delen invoegen ───────────────────────────────────────────────
  // Menu, footer en de gemeenschappelijke kop staan één keer in site/_delen/. Een pagina zegt
  // <!-- deel:naam --> en krijgt hier de inhoud. {{w}} is het pad naar de wortel ('./' of '../'),
  // zodat dezelfde delen in elke map kloppen; data-pagina="x" wordt aria-current op de eigen pagina.
  const DELEN = path.join(BRON, '_delen');
  const deel = naam => {
    const vol = path.join(DELEN, naam + '.html');
    if (!fs.existsSync(vol)) throw new Error('deel ontbreekt: _delen/' + naam + '.html');
    return fs.readFileSync(vol, 'utf8').replace(/\n$/, '');
  };
  const uitgevouwen = {};
  const html = rel => {
    if (uitgevouwen[rel] !== undefined) return uitgevouwen[rel];
    const diepte = rel.split('/').length - 1, w = diepte ? '../'.repeat(diepte) : './';
    const pagina = diepte ? rel.split('/')[0] : 'home';
    const h = fs.readFileSync(path.join(BRON, rel), 'utf8')
      .replace(/<!-- deel:([a-z]+) -->/g, (m, naam) => deel(naam))
      .replace(/\{\{w\}\}/g, w)
      .replace(/ data-pagina="([a-z]+)"/g, (m, p) => p === pagina ? ' aria-current="page"' : '');
    return (uitgevouwen[rel] = h);
  };

  // ── Elke verwijzing in de HTML moet bestaan ───────────────────────────────
  const ontbreekt = [];
  for (const rel of lijst.filter(f => f.endsWith('.html'))) {
    const inhoud = html(rel);
    // De attribuutnaam moet aan een spatie of tagbegin grenzen: anders wordt
    // data-navhref="modules" als href gelezen en zoekt het script een bestand
    // dat nooit bestaan heeft.
    const verwijzingen = [...inhoud.matchAll(/(?:^|[\s])(?:src|href)="([^"#?:][^"]*)"/g)].map(m => m[1])
      .concat([...inhoud.matchAll(/url\(([^)'"]+)\)/g)].map(m => m[1]));
    for (const v of new Set(verwijzingen)) {
      // Overslaan: absolute paden, ankers, schema's (http:, data:) en alles wat
      // uit een percent-gecodeerde data-URI komt (daarin staat url(%23g) voor een
      // anker binnen dezelfde SVG, geen bestand).
      if (v.startsWith('/') || v.startsWith('#') || /^[a-z]+:/.test(v)) continue;
      if (v.includes('%')) continue;
      if (!fs.existsSync(path.join(BRON, path.dirname(rel), v.split('#')[0] || '.'))) ontbreekt.push(rel + ' → ' + v);
    }
  }
  // Ook de CSS nalopen: die verwijst naar de lettertypes.
  for (const rel of lijst.filter(f => f.endsWith('.css'))) {
    const css = fs.readFileSync(path.join(BRON, rel), 'utf8');
    for (const m of css.matchAll(/url\(([^)'"]+)\)/g)) {
      const v = m[1].trim();
      if (/^(data:|https?:|\/)/.test(v)) continue;
      if (v.startsWith('#') || v.includes('%')) continue;   // anker binnen een ingebouwde SVG, geen bestand
      if (!fs.existsSync(path.join(BRON, path.dirname(rel), v))) ontbreekt.push(rel + ' → ' + v);
    }
  }
  if (ontbreekt.length) {
    throw new Error('ontbrekende verwijzingen:\n     ' + ontbreekt.join('\n     '));
  }

  // ── De opgegeven afmetingen moeten kloppen met het bestand ────────────────
  // Eerder stond er 2000x1293 bij een beeld van 1972x1150, overgenomen uit een
  // document in plaats van gemeten. In combinatie met width:100% rekte dat het
  // beeld vier keer te hoog uit. Sindsdien controleert het script het zelf.
  const scheef = [];
  for (const rel of lijst.filter(f => f.endsWith('.html'))) {
    const inhoud = html(rel);
    const re = /<(?:img|source)[^>]*?(?:src|srcset)="([^"]+\.(?:webp|png|jpg|jpeg))"[^>]*?width="(\d+)"[^>]*?height="(\d+)"/g;
    for (const m of inhoud.matchAll(re)) {
      const vol = path.join(BRON, path.dirname(rel), m[1]);
      let W, H;
      try {
        const uit = require('child_process').execFileSync('sips',
          ['-g', 'pixelWidth', '-g', 'pixelHeight', vol], { encoding: 'utf8' });
        W = +/pixelWidth: (\d+)/.exec(uit)[1];
        H = +/pixelHeight: (\d+)/.exec(uit)[1];
      } catch (e) { continue; }   // geen sips (niet-macOS): sla de controle over
      if (W !== +m[2] || H !== +m[3]) {
        scheef.push(m[1] + ': opgegeven ' + m[2] + '×' + m[3] + ', bestand ' + W + '×' + H);
      }
    }
  }
  if (scheef.length) {
    throw new Error('afmetingen kloppen niet met het bestand:\n     ' + scheef.join('\n     '));
  }

  // Cachebreker: elke verwijzing naar een eigen .js- of .css-bestand krijgt ?v=<inhoudshash>.
  // De HTML wordt altijd opnieuw gecontroleerd (max-age=0), dus een gewijzigd script heeft meteen
  // een nieuwe URL. Zonder dit hield een browser het oude wereld.js vast, omdat Apache voor .js geen
  // Cache-Control meestuurt en de browser dan zelf gokt hoe lang het bestand vers blijft.
  const crypto = require('crypto');
  const metVersie = (rel, html) => html.replace(/((?:^|[\s])(?:src|href)=")([^"#?:]+\.(?:js|css))"/g, (m, voor, v) => {
    const vol = path.join(BRON, path.dirname(rel), v);
    if (!fs.existsSync(vol)) return m;
    return voor + v + '?v=' + crypto.createHash('sha1').update(fs.readFileSync(vol)).digest('hex').slice(0, 10) + '"';
  });
  for (const rel of lijst) {
    const inhoud = fs.readFileSync(path.join(BRON, rel));
    schrijf(rel, rel.endsWith('.html') ? Buffer.from(metVersie(rel, html(rel))) : inhoud);
  }
  schrijf('.htaccess', Buffer.from(HTACCESS));

  if (ALLEEN_CONTROLE) {
    if (gewijzigd === 0) { console.log('✓ docs/site is bij'); process.exit(0); }
    console.error('✗ docs/site loopt achter op site/:');
    console.error(gedaan.filter(r => !r.startsWith('  =')).join('\n'));
    console.error('   Draai "node tools/bouw-site.js" voordat je commit.');
    process.exit(1);
  }
  console.log(gedaan.join('\n'));
  console.log('\nalle verwijzingen gevonden — ' + gewijzigd + ' bestand' + (gewijzigd === 1 ? '' : 'en') + ' bijgewerkt in ' + path.relative(WORTEL, UIT) + '/');
} catch (e) {
  console.error('\n✗ Bouwen afgebroken.\n   ' + e.message);
  process.exit(1);
}
