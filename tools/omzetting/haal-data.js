/* Haalt de datalijsten van de huidige live site uit de bundel.
   Elke lijst is een gewoon array-literal. Voor de zekerheid wordt elke plak eerst
   gecontroleerd op alles wat géén data is; pas dan wordt hij uitgelezen. Faalt die
   controle, dan komt de lijst er niet in — liever een gat dan gokwerk. */
'use strict';
const fs = require('fs');

const BRON = '/Users/thomas/Projects/Flow-8/Flow8-website.html';
const bron = fs.readFileSync(BRON, 'utf8')
  .replace(/\\n/g, '\n')        // de bundel bevat letterlijke \n-reeksen
  .replace(/\\u002F/g, '/')
  .replace(/\\"/g, '"');

/* Pakt het array-literal dat op positie `start` begint, met een haakjesteller die
   strings overslaat (anders breekt een '[' binnen een SVG-pad of tekst het af). */
function pakArray(start) {
  let i = bron.indexOf('[', start);
  if (i < 0) return null;
  let diepte = 0, inStr = null;
  for (let j = i; j < bron.length; j++) {
    const c = bron[j];
    if (inStr) { if (c === inStr && bron[j - 1] !== '\\') inStr = null; continue; }
    if (c === '"' || c === "'") { inStr = c; continue; }
    if (c === '[') diepte++;
    else if (c === ']') { diepte--; if (!diepte) return bron.slice(i, j + 1); }
  }
  return null;
}

/* Controleer de syntaxis buiten de teksten, niet losse woorden erbinnen: een
   Nederlandse zin als "materialen importeren we" is gewoon data. Wat overblijft als
   je alle strings weghaalt mag alleen uit haakjes, komma's, dubbele punten, namen en
   getallen bestaan — geen ronde haakjes, pijlfuncties of backticks. */
function lees(naam, tekst) {
  if (!tekst) return { fout: 'niet gevonden' };
  const geraamte = tekst.replace(/'(?:\\[\s\S]|[^'\\])*'|"(?:\\[\s\S]|[^"\\])*"/g, '""');
  if (!/^[\s\[\]{},:"a-zA-Z0-9_.+-]*$/.test(geraamte))
    return { fout: 'bevat code in plaats van data: ' + JSON.stringify((geraamte.match(/[^\s\[\]{},:"a-zA-Z0-9_.+-]+/) || [])[0]) };
  try { return { waarde: new Function('return (' + tekst + ')')() }; }
  catch (e) { return { fout: e.message }; }
}

const uit = {}, fout = [];

/* 1. Gewone lijsten: `naam: [ … ]` */
for (const naam of ['crews','absent','opTiles','teamTiles','team','wbRows',
                    'checks','flyRows','crew','steps','kkSecs','legend','bars']) {
  const m = new RegExp('(?:^|[\\s{,])' + naam + ':\\s*\\[').exec(bron);
  const r = lees(naam, m ? pakArray(m.index) : null);
  if (r.fout) fout.push(naam + ' — ' + r.fout); else uit[naam] = r.waarde;
}

/* 2. Lijsten die in een methode zitten: `naam() { const defs = [ … ]` */
for (const [sleutel, methode] of [['sats','buildSats'], ['faqs','faqList']]) {
  const m = new RegExp(methode + '\\s*\\(\\s*\\)\\s*\\{[\\s\\S]{0,80}?const defs\\s*=\\s*\\[').exec(bron);
  const r = lees(sleutel, m ? pakArray(m.index + methode.length) : null);
  if (r.fout) fout.push(sleutel + ' — ' + r.fout); else uit[sleutel] = r.waarde;
}

/* 3. tabFeats is een keuze tussen twee lijsten (tabblad Klanten of Rapportage). */
{
  const i = bron.indexOf('tabFeats:');
  if (i < 0) fout.push('tabFeats — niet gevonden');
  else {
    const a = lees('tabFeats.klanten', pakArray(i));
    const na = bron.indexOf('[', bron.indexOf(':', bron.indexOf('?', i)));
    const b = lees('tabFeats.rapportage', pakArray(na - 1));
    if (a.fout || b.fout) fout.push('tabFeats — ' + (a.fout || b.fout));
    else uit.tabFeats = { klanten: a.waarde, rapportage: b.waarde };
  }
}

fs.writeFileSync(process.argv[2], JSON.stringify(uit, null, 2));
for (const k of Object.keys(uit)) {
  const v = uit[k];
  console.log('  ✓ ' + k.padEnd(10) + (Array.isArray(v) ? v.length + ' items'
    : Object.keys(v).map(n => n + ':' + v[n].length).join(' · ')));
}
if (fout.length) { console.log('\n  niet gelukt:'); fout.forEach(f => console.log('  ✗ ' + f)); }
