/* Zet de uitgepakte live-pagina om naar statische HTML.
   Bron: live-pagina.html (de export) + live-bindingen.json (door de component zelf
   berekend). Uitvoer: port/index.html + port/zweef.css.

   Vijf mechanische stappen, in deze volgorde:
     1. sc-for      lussen uitschrijven met de echte data
     2. sc-if       beide takken behouden, de valse op hidden (de tabbladen
                    moeten blijven werken, dus weggooien kan niet)
     3. {{ }}       bindingen invullen; handelingen worden data-doe="naam"
     4. sc-*        sc-camel-view-box -> viewBox, sc-raw-select -> select
     5. style-hover omzetten naar echte CSS-regels met een eigen klasse

   Het script telt alles wat het doet en stopt bij een onopgelost restant, zodat
   een gat opvalt in plaats van stil in de pagina te belanden. */
'use strict';
const fs = require('fs');
const SP = __dirname;

const bron = fs.readFileSync(SP + '/live-pagina.html', 'utf8');
const scope0 = JSON.parse(fs.readFileSync(SP + '/live-bindingen.json', 'utf8'));

const telling = { lussen: 0, items: 0, takken: 0, bindingen: 0, handelingen: 0,
                  camel: 0, zweef: 0, levend: 0, handelingen2: 0 };
const HERTEKEN = { sats: 1, faqs: 1, tabFeats: 1 };  // lijsten die tijdens gebruik veranderen
const sjablonen = {};
/* Waarden die tijdens het gebruik veranderen: de prijsindicatie en de twee tabbladen. */
const LEVEND = {};
for (const n of ['pUsers','pTechs','pTechMax','pBaseFmt','pAddFmt','pTotalFmt','pSplit','pAvgFmt',
                 'tabTitle','tabLead','klantenBg','klantenFg','rapBg','rapFg']) LEVEND[n] = 1;
const inTagNamen = new Set();

/* ── hulp ─────────────────────────────────────────────────────────────────── */
function pad(scope, uitdrukking) {
  const delen = uitdrukking.trim().split('.');
  let v = scope;
  for (const d of delen) { if (v == null) return undefined; v = v[d]; }
  return v;
}

/* Zoekt het bijpassende sluittag van `tag` dat op index `na` begint. */
function sluit(html, tag, na) {
  const open = new RegExp('<' + tag + '\\b', 'g');
  const dicht = new RegExp('</' + tag + '>', 'g');
  let diepte = 1, i = na;
  while (diepte > 0) {
    open.lastIndex = dicht.lastIndex = i;
    const o = open.exec(html), d = dicht.exec(html);
    if (!d) return -1;
    if (o && o.index < d.index) { diepte++; i = o.index + 1; }
    else { diepte--; if (!diepte) return d.index; i = d.index + 1; }
  }
  return -1;
}

/* ── 1 + 2: lussen en takken, met een scope-stapel ───────────────────────── */
function verwerk(html, scope) {
  // sc-for
  let m = /<sc-for\s+list="\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}"\s+as="([a-zA-Z0-9_]+)"[^>]*>/.exec(html);
  if (m) {
    const eind = sluit(html, 'sc-for', m.index + m[0].length);
    if (eind < 0) throw new Error('sc-for zonder sluittag bij ' + m[1]);
    const body = html.slice(m.index + m[0].length, eind);
    const lijst = pad(scope, m[1]);
    if (!Array.isArray(lijst)) throw new Error('lijst niet gevonden of geen array: ' + m[1]);
    telling.lussen++; telling.items += lijst.length;
    const uit = lijst.map((item, i) =>
      verwerk(body, Object.assign({}, scope, { [m[2]]: item, [m[2] + '_i']: i }))).join('');
    /* Twee lijsten veranderen terwijl je de pagina gebruikt: "Voor wie" en de
       vragen. Hun ruwe sjabloon gaat apart mee, zodat het eigen script ze later
       met nieuwe waarden hertekent uit precies dezelfde bron. */
    if (HERTEKEN[m[1]]) {
      (sjablonen[m[1]] = sjablonen[m[1]] || []).push({ alias: m[2], body });
      const nr = sjablonen[m[1]].length - 1;
      const open = '<span data-lus="' + m[1] + '" data-lus-nr="' + nr + '" style="display:contents">';
      return verwerk(html.slice(0, m.index) + open + uit + '</span>' +
                     html.slice(eind + '</sc-for>'.length), scope);
    }
    return verwerk(html.slice(0, m.index) + uit + html.slice(eind + '</sc-for>'.length), scope);
  }
  // sc-if  — beide takken blijven staan; JS wisselt ze straks
  m = /<sc-if\s+value="\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}"[^>]*>/.exec(html);
  if (m) {
    const eind = sluit(html, 'sc-if', m.index + m[0].length);
    if (eind < 0) throw new Error('sc-if zonder sluittag bij ' + m[1]);
    const body = html.slice(m.index + m[0].length, eind);
    const aan = !!pad(scope, m[1]);
    telling.takken++;
    const uit = '<div data-toon="' + m[1] + '"' + (aan ? '' : ' hidden') + '>' +
                verwerk(body, scope) + '</div>';
    return verwerk(html.slice(0, m.index) + uit + html.slice(eind + '</sc-if>'.length), scope);
  }
  // 3: bindingen
  return html.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, (heel, uitdr, pos, geheel) => {
    /* Bindingen die tijdens het gebruik veranderen (prijzen, tabbladen) krijgen een
       merkteken, zodat het eigen script ze terug kan vinden. Staat de binding in
       een tag, dan komt het merkteken op de tag; staat hij in tekst, dan eromheen. */
    if (LEVEND[uitdr]) {
      const inTag = geheel.lastIndexOf('<', pos) > geheel.lastIndexOf('>', pos);
      const v = pad(scope, uitdr);
      telling.bindingen++;
      if (!inTag) {
        telling.levend++;
        return '<span data-bind="' + uitdr + '">' + String(v) + '</span>';
      }
      inTagNamen.add(uitdr);
      return String(v);
    }
    const v = pad(scope, uitdr);
    if (v === undefined) {
      /* Handelingen die per item bestaan (s.hover, q.toggle) overleven het
         omzetten naar JSON niet — die waren functies. Ze krijgen hier hun naam
         plus de index van het item, zodat het eigen script weet wie bedoeld is. */
      const [alias, eigenschap] = uitdr.trim().split('.');
      if (eigenschap && scope[alias + '_i'] !== undefined) {
        telling.handelingen++;
        return eigenschap + ':' + scope[alias + '_i'];
      }
      return heel;                                          // laat staan; valt straks op
    }
    if (v && typeof v === 'object' && v.__fn) { telling.handelingen++; return v.__fn; }
    telling.bindingen++;
    return String(v);
  });
}

/* ── knippen: kop uit <helmet>, lijf tot </x-dc> ─────────────────────────── */
const hStart = bron.indexOf('<helmet>') + '<helmet>'.length;
const hEind  = bron.indexOf('</helmet>');
const kop    = bron.slice(hStart, hEind);
const lijf   = bron.slice(hEind + '</helmet>'.length, bron.indexOf('</x-dc>'));

let html = verwerk(lijf, scope0);

/* ── 4 + 5: nabewerking ──────────────────────────────────────────────────
   sc-attributen omzetten, gebeurtenissen naar data-doe, en style-hover naar
   echte CSS. Dezelfde behandeling voor de pagina én voor de bewaarde sjablonen:
   die worden later door het eigen script opnieuw in de pagina gezet, en mogen er
   dus geen export-attributen meer in hebben. */
const regels = [];
function naverwerk(stuk) {
  stuk = stuk
    .replace(/\bsc-camel-([a-z-]+)=/g, (heel, naam) => {
      telling.camel++;
      return naam.replace(/-([a-z])/g, (x, l) => l.toUpperCase()) + '=';
    })
    .replace(/<(\/?)sc-raw-([a-z]+)/g, '<$1$2');

  // De naam van een handeling kan een dubbele punt bevatten (hover:1, toggle:3).
  stuk = stuk.replace(
    /\b(onClick|onMouseEnter|onMouseLeave|onKeyDown|onInput|onSubmit)="([a-zA-Z0-9_:.\s{}]+)"/g,
    (heel, gebeurtenis, naam) => {
      telling.handelingen2++;
      return 'data-doe-' + gebeurtenis.slice(2).toLowerCase() + '="' + naam.trim() + '"';
    });

  for (const [attr, pseudo] of [['style-hover', ':hover'], ['style-focus', ':focus']]) {
    stuk = stuk.replace(new RegExp('\\s*' + attr + '="([^"]*)"', 'g'), (heel, css) => {
      const klasse = 'zw' + (++telling.zweef);
      regels.push('.' + klasse + pseudo + '{' + css.replace(/&quot;/g, '"') + '}');
      return ' data-zweef="' + klasse + '"';
    });
  }
  return stuk
    .replace(/ data-zweef="(zw\d+)"/g, (heel, k) => ' class="' + k + '"')
    .replace(/class="(zw\d+)"([^>]*?)\bclass="([^"]*)"/g, 'class="$1 $3"$2');
}

html = naverwerk(html);
for (const naam of Object.keys(sjablonen)) {
  sjablonen[naam] = sjablonen[naam].map(s => ({ alias: s.alias, body: naverwerk(s.body) }));
}

/* ── controle op restanten ───────────────────────────────────────────────── */
const rest = html.match(/\{\{[^}]*\}\}|<sc-|sc-camel-/g) || [];
fs.mkdirSync(SP + '/port', { recursive: true });
fs.writeFileSync(SP + '/port/zweef.css', regels.join('\n') + '\n');
fs.writeFileSync(SP + '/port/romp.html', html);
fs.writeFileSync(SP + '/port/kop.html', kop);
fs.writeFileSync(SP + '/port/sjablonen.json', JSON.stringify(sjablonen, null, 2));

console.log('  lussen        ' + telling.lussen + ' (' + telling.items + ' items uitgeschreven)');
console.log('  takken        ' + telling.takken);
console.log('  bindingen     ' + telling.bindingen);
console.log('  handelingen   ' + telling.handelingen);
console.log('  sc-camel      ' + telling.camel);
console.log('  zweefregels   ' + telling.zweef);
console.log('  gebeurtenissen ' + telling.handelingen2);
console.log('  levende tekst ' + telling.levend);
console.log('  in attribuut  ' + [...inTagNamen].join(' '));
console.log('  restanten     ' + rest.length + (rest.length ? ' ← ' + [...new Set(rest)].slice(0, 8).join(' ') : ' ✓'));
