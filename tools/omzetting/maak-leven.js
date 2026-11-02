/* Bouwt port/leven.js uit de logica van de component zelf.
   De DOM-methodes (onthullen, navigatie, parallax, deeltjes, scènes) gaan
   ongewijzigd mee — dat is gewone DOM-code. Alleen de framework-haakjes
   (state, setState, props) worden vervangen door een eigen, kleine versie. */
'use strict';
const fs = require('fs');
const SP = __dirname;

let logica = fs.readFileSync(SP + '/live-logica.js', 'utf8');
const sjablonen = fs.readFileSync(SP + '/port/sjablonen.json', 'utf8');

// De klasse heeft geen framework-basis meer nodig.
logica = logica.replace(/^class Component extends DCLogic \{/m, 'class Site {');
// state = {...} als klasseveld werkt, maar we zetten hem expliciet in een constructor.
logica = logica.replace(/^\s*state = \{[^}]*\};\s*$/m,
  '  constructor() {\n' +
  "    this.state = { tab: 'klanten', who: 0, users: 12, techs: 5, faq: 0, sent: false };\n" +
  "    this.props = { accent: '#4f6ef5', motion: 'standaard', particles: true };\n" +
  '    this._drops = {};\n' +
  '  }');

const glue = `

/* ── Eigen vervanging voor het framework ────────────────────────────────────
   setState past de toestand aan en werkt daarna precies die stukjes DOM bij die
   ervan afhangen. Dat zijn er vijf: de twee tabbladen, de cirkel "Voor wie", de
   vragenlijst, de prijsindicatie en het contactformulier. */
const SJABLONEN = ${sjablonen};

Site.prototype.setState = function (veranderd) {
  Object.assign(this.state, veranderd);
  this.pas();
  this.componentDidUpdate();
};

/* Vult {{ }} in een sjabloon, met dezelfde regels als bij het omzetten. */
Site.prototype.vul = function (sjabloon, alias, item, i) {
  return sjabloon.replace(/\\{\\{\\s*([a-zA-Z0-9_.]+)\\s*\\}\\}/g, function (heel, uitdr) {
    const delen = uitdr.split('.');
    if (delen[0] !== alias) return heel;
    if (delen.length === 1) return String(item);
    const v = item[delen[1]];
    if (typeof v === 'function') return delen[1] + ':' + i;
    return v === undefined ? heel : String(v);
  });
};

Site.prototype.hertekenLijst = function (naam, lijst) {
  const self = this;
  document.querySelectorAll('[data-lus="' + naam + '"]').forEach(function (houder) {
    const sj = SJABLONEN[naam][+houder.dataset.lusNr];
    if (!sj) return;
    houder.innerHTML = lijst.map(function (item, i) {
      return self.vul(sj.body, sj.alias, item, i);
    }).join('');
  });
};

Site.prototype.pas = function () {
  const v = this.renderVals();

  // 1 + 2. Tabbladen: tak tonen/verbergen en de twee chips kleuren.
  document.querySelectorAll('[data-toon]').forEach(function (el) {
    el.hidden = !v[el.dataset.toon];
  });
  const chip = function (kies, bg, fg) {
    const b = document.querySelector('[data-doe-click="' + kies + '"]');
    if (b) { b.style.background = bg; b.style.color = fg; }
  };
  chip('showKlanten', v.klantenBg, v.klantenFg);
  chip('showRapportage', v.rapBg, v.rapFg);

  // 3. Lijsten die van toestand afhangen.
  this.hertekenLijst('sats', this.buildSats());
  this.hertekenLijst('faqs', this.faqList());
  this.hertekenLijst('tabFeats', v.tabFeats);

  // 4. Alle gemerkte tekstbindingen (prijzen, tabkop, tabinleiding).
  document.querySelectorAll('[data-bind]').forEach(function (el) {
    const w = v[el.dataset.bind];
    if (w !== undefined) el.textContent = String(w);
  });

  // 5. De twee schuifregelaars: waarde en bovengrens.
  const g = document.querySelector('[data-doe-input="setUsers"]');
  const m = document.querySelector('[data-doe-input="setTechs"]');
  if (g) g.value = v.pUsers;
  if (m) { m.max = v.pTechMax; m.value = v.pTechs; }

  this.koppel();
};

/* Koppelt de data-doe-* attributen aan de handelingen. Nieuw getekende items
   krijgen hun handeling hier ook weer, want koppel() draait na elke hertekening. */
Site.prototype.koppel = function () {
  const self = this;
  const vals = this.renderVals();
  const SOORT = { click: 'click', mouseenter: 'mouseenter', mouseleave: 'mouseleave',
                  keydown: 'keydown', input: 'input', submit: 'submit' };
  Object.keys(SOORT).forEach(function (soort) {
    document.querySelectorAll('[data-doe-' + soort + ']').forEach(function (el) {
      if (el['_doe_' + soort]) return;
      el['_doe_' + soort] = 1;
      const naam = el.getAttribute('data-doe-' + soort);
      el.addEventListener(soort, function (e) {
        const deel = naam.split(':');
        if (deel.length === 2) {                       // handeling per item
          const i = +deel[1];
          if (deel[0] === 'hover') return self.pick(i);
          if (deel[0] === 'toggle') return self.setState({ faq: self.state.faq === i ? -1 : i });
          return;
        }
        const eigen = self.eigenHandelingen();
        const fn = eigen[naam] || self.renderVals()[naam];
        if (typeof fn === 'function') fn(e);
      });
    });
  });
  void vals;
};

/* ── Het contactformulier ───────────────────────────────────────────────────
   In de export deed submit alleen \`preventDefault\` en "bedankt" tonen: elke
   aanvraag werd weggegooid. Hier gaat hij naar de eigen Cloud Function, die hem
   bewaart en doormailt. Pas bij een geslaagd antwoord verschijnt het bedankje —
   anders krijg je een foutmelding mét telefoonnummer, zodat niemand vastloopt. */
const DEMO_URL = 'https://europe-west1-flow8-715de.cloudfunctions.net/demoAanvraag';

Site.prototype.eigenHandelingen = function () {
  const self = this;
  return { submit: function (e) { return self.verstuurFormulier(e); } };
};

Site.prototype.verstuurFormulier = function (e) {
  e.preventDefault();
  const self = this, form = e.target;
  const knop = form.querySelector('button[type=submit]');
  const waarde = function (naam) {
    const el = form.querySelector('[name="' + naam + '"]');
    return el ? el.value : '';
  };

  let melding = form.querySelector('[data-melding]');
  if (!melding) {
    melding = document.createElement('p');
    melding.setAttribute('data-melding', '');
    melding.setAttribute('role', 'status');
    melding.style.cssText = 'margin-top:4px;font-size:13px;color:#ff9b9b;min-height:1px';
    form.appendChild(melding);
  }
  melding.textContent = '';

  const oudeTekst = knop ? knop.textContent : '';
  if (knop) { knop.disabled = true; knop.textContent = 'Versturen…'; }

  fetch(DEMO_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      naam: waarde('naam'), bedrijf: waarde('bedrijf'), email: waarde('email'),
      telefoon: waarde('tel'), vraag: waarde('bericht'), omvang: waarde('omvang'),
      website: waarde('website')            // het lokaasveld
    })
  })
    .then(function (r) { return r.json().catch(function () { return {}; })
      .then(function (d) { return { ok: r.ok, d: d }; }); })
    .then(function (a) {
      if (a.ok && a.d.ok) { self.setState({ sent: true }); return; }
      melding.textContent = a.d.error || 'Versturen mislukt. Bel ons gerust op 06 – 28 70 24 22.';
    })
    .catch(function () {
      melding.textContent = 'Geen verbinding. Bel ons gerust op 06 – 28 70 24 22.';
    })
    .then(function () {
      if (knop) { knop.disabled = false; knop.textContent = oudeTekst; }
    });
};

/* Start. */
document.addEventListener('DOMContentLoaded', function () {
  const site = new Site();
  window.flow8 = site;
  site.koppel();
  site.componentDidMount();
});
`;

fs.writeFileSync(SP + '/port/leven.js', logica + glue);
console.log('port/leven.js — ' + (logica + glue).split('\n').length + ' regels');
