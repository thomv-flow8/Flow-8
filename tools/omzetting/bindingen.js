/* Vult de {{ }}-bindingen door de pure render-methodes van de component zelf te
   draaien. Zo zijn de waarden gegarandeerd gelijk aan de live site in plaats van
   door mij overgetypt. Alleen renderVals/priceVals/buildSats/faqList worden
   aangeroepen — componentDidMount raakt de DOM en blijft dus ongemoeid. */
'use strict';
const fs = require('fs');
const SP = __dirname;

let src = fs.readFileSync(SP + '/live-logica.js', 'utf8');
src = src.replace(/class Component extends DCLogic/, 'class Component');

// Stubs voor alles wat de render-methodes van het framework of de DOM verwachten.
const voorzet = `
  constructor(){ this.state = { tab:'klanten', who:0, users:12, techs:5, faq:0 }; this._drops={}; }
  setState(){} setDrop(){} isDropOpen(){return false;} hoverOpen(){} hoverClose(){}
  applyAccent(){} scanReveal(){} sizeOrbit(){} layoutNav(){} closeDrops(){} toggleMenu(){}
  pickFaq(){} get props(){ return { accent:'#4f6ef5', motion:'standaard', particles:true }; }
`;
src = src.replace(/\{\s*\n\s*state = \{[^}]*\};/, '{\n' + voorzet);

const Component = new Function(src + '\nreturn Component;')();
const c = new Component();

const scope = Object.assign({}, c.renderVals(), {
  sats: c.buildSats(), faqs: c.faqList()
});

// Functiewaarden worden straks gebeurtenisnamen; hier alleen de naam bewaren.
const uit = {};
for (const [k, v] of Object.entries(scope)) uit[k] = (typeof v === 'function') ? { __fn: k } : v;

fs.writeFileSync(SP + '/live-bindingen.json', JSON.stringify(uit, null, 2));
const soort = (v) => Array.isArray(v) ? v.length + ' items'
  : (v && v.__fn) ? 'handeling' : JSON.stringify(v).slice(0, 42);
console.log('bindingen:', Object.keys(uit).length);
for (const k of Object.keys(uit).sort()) console.log('  ' + k.padEnd(16) + soort(uit[k]));
