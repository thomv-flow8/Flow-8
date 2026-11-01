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
  Header always set Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'"

  # Pas aanzetten als https op Cloud86 bewezen werkt — browsers onthouden dit een jaar:
  # Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>

# ── Caching ──
<IfModule mod_headers.c>
  <FilesMatch "\\.html$">
    Header set Cache-Control "public, max-age=0, must-revalidate"
  </FilesMatch>
  <FilesMatch "\\.(webp|png|jpg|svg|woff2|css)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
</IfModule>
`;

try {
  if (!fs.existsSync(BRON)) throw new Error('site/ bestaat niet');
  const lijst = bestanden(BRON);

  // ── Elke verwijzing in de HTML moet bestaan ───────────────────────────────
  const ontbreekt = [];
  for (const rel of lijst.filter(f => f.endsWith('.html'))) {
    const html = fs.readFileSync(path.join(BRON, rel), 'utf8');
    const verwijzingen = [...html.matchAll(/(?:src|href)="([^"#?:][^"]*)"/g)].map(m => m[1])
      .concat([...html.matchAll(/url\(([^)'"]+)\)/g)].map(m => m[1]));
    for (const v of new Set(verwijzingen)) {
      if (v.startsWith('/') || v.startsWith('#') || /^[a-z]+:/.test(v)) continue;
      if (!fs.existsSync(path.join(BRON, path.dirname(rel), v))) ontbreekt.push(rel + ' → ' + v);
    }
  }
  // Ook de CSS nalopen: die verwijst naar de lettertypes.
  for (const rel of lijst.filter(f => f.endsWith('.css'))) {
    const css = fs.readFileSync(path.join(BRON, rel), 'utf8');
    for (const m of css.matchAll(/url\(([^)'"]+)\)/g)) {
      const v = m[1].trim();
      if (/^(data:|https?:|\/)/.test(v)) continue;
      if (!fs.existsSync(path.join(BRON, path.dirname(rel), v))) ontbreekt.push(rel + ' → ' + v);
    }
  }
  if (ontbreekt.length) {
    throw new Error('ontbrekende verwijzingen:\n     ' + ontbreekt.join('\n     '));
  }

  for (const rel of lijst) schrijf(rel, fs.readFileSync(path.join(BRON, rel)));
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
