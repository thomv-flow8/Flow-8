/* Zet kop + romp + stijlen + script samen tot één losstaande pagina in port/.
   Doet ook de lettertypevervanging, zodat die niet verloren gaat als de omzetter
   opnieuw draait (kop.html wordt daar elke keer vers weggeschreven). */
'use strict';
const fs = require('fs');
const SP = __dirname, UIT = SP + '/port';

let kop     = fs.readFileSync(UIT + '/kop.html', 'utf8');
const romp  = fs.readFileSync(UIT + '/romp.html', 'utf8');
const zweef = fs.readFileSync(UIT + '/zweef.css', 'utf8');

/* ── Lettertypes: zelf hosten in plaats van losse bestanden met een UUID-naam ── */
const start = kop.indexOf('<style>');
const eind  = kop.indexOf('</style>', start) + '</style>'.length;
if (!/@font-face/.test(kop.slice(start, eind))) {
  throw new Error('eerste style-blok is niet het lettertypeblok — niets gewijzigd');
}
const face = (naam, bestand, gewicht) =>
  `@font-face{font-family:'${naam}';src:url(fonts/${bestand}) format('woff2');` +
  `font-weight:${gewicht};font-style:normal;font-display:swap}`;

kop = kop.slice(0, start) + `<style>
/* Zelf gehost, geen externe lettertypedienst — zelfde keuze als bij ViVo (AVG).
   De export laadde ze als losse bestanden met een UUID als naam; hier komen ze
   uit @fontsource. Syne (alleen het FLOW 8-woordmerk, gewicht 300 en 800)
   ontbreekt nog:  npm install --no-save @fontsource/syne  */
${face('Instrument Sans', 'InstrumentSans-400.woff2', 400)}
${face('Instrument Sans', 'InstrumentSans-500.woff2', 500)}
${face('Instrument Sans', 'InstrumentSans-600.woff2', 600)}
${face('Instrument Sans', 'InstrumentSans-700.woff2', 700)}
${face('Space Mono', 'SpaceMono-400.woff2', 400)}
${face('Space Mono', 'SpaceMono-700.woff2', 700)}
${face('Syne', 'Syne-400.woff2', 400)}
${face('Syne', 'Syne-800.woff2', 800)}
</style>` + kop.slice(eind);

/* ── Lokaasveld tegen bots ───────────────────────────────────────────────────
   Een mens ziet dit veld niet en laat het leeg; een bot vult alles in. De functie
   gooit elke inzending weg waarin het ingevuld is. Buiten beeld gezet in plaats van
   display:none, want sommige bots slaan verborgen velden juist over. */
const lokaas =
  '<input name="website" tabindex="-1" autocomplete="off" aria-hidden="true" ' +
  'style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">';
const formOpen = /(<form\b[^>]*>)/;
if ((romp.match(/<form\b/g) || []).length !== 1) {
  throw new Error('verwacht precies één formulier op de pagina');
}
const rompMetLokaas = romp.replace(formOpen, '$1\n        ' + lokaas);

const html = `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${kop.trim()}
<style>
/* Zweefstijlen: in de export stonden die in een style-hover-attribuut, hier als
   gewone CSS-regels met een eigen klasse per element. */
${zweef.trim()}
</style>
</head>
<body>
${rompMetLokaas.trim()}
<script src="leven.js" defer></script>
</body>
</html>
`;
fs.writeFileSync(UIT + '/index.html', html);
console.log('port/index.html — ' + html.split('\n').length + ' regels, ' +
            (Buffer.byteLength(html) / 1024).toFixed(0) + ' kB');
