// Flow8 marketingsite — gegenereerd uit de goedgekeurde preview (site-3d-draai-preview.html).
// Alles buiten de 3D: menu, onthullen bij scrollen, tabbladen, rekenhulp, formulier.
// ── Secties onder de reis: binnenkomen, schalen, tabs, rekenhulp, formulier ──
(function () {
  const toon = document.querySelectorAll('.toon');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('zichtbaar'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -10% 0px' });
    toon.forEach(el => io.observe(el));
  } else toon.forEach(el => el.classList.add('zichtbaar'));

  // vaste mockups schalen naar de breedte van hun kolom
  const schalen = [...document.querySelectorAll('.schaal')];
  function schaal() { schalen.forEach(s => { const b = +s.dataset.b, h = +s.dataset.h, cs = getComputedStyle(s.parentElement), w = (s.parentElement.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)) || b, sc = Math.min(w / b, 1.4); s.style.setProperty('--s', sc.toFixed(3)); s.style.width = b * sc + 'px'; s.style.height = h * sc + 'px'; }); }
  schaal(); addEventListener('resize', schaal);

  // tabs met pijltjestoetsen
  document.querySelectorAll('[role=tablist]').forEach(lijst => {
    const knoppen = [...lijst.querySelectorAll('[role=tab]')];
    const kies = k => { knoppen.forEach(b => { const aan = b === k; b.setAttribute('aria-selected', aan); b.tabIndex = aan ? 0 : -1; document.getElementById(b.getAttribute('aria-controls')).hidden = !aan; }); schaal(); };
    knoppen.forEach((b, i) => { b.addEventListener('click', () => kies(b)); b.addEventListener('keydown', e => { const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (d) { const n = knoppen[(i + d + knoppen.length) % knoppen.length]; n.focus(); kies(n); } }); });
  });

  // rekenhulp prijzen
  const g = document.getElementById('pr-gebr'), w = document.getElementById('pr-wb');
  const euro = n => '€ ' + n.toLocaleString('nl-NL');
  function reken() {
    const n = +g.value; w.max = n; if (+w.value > n) w.value = n; const m = +w.value;
    document.getElementById('pr-gebr-uit').textContent = n; document.getElementById('pr-wb-uit').textContent = m;
    document.getElementById('pr-r1').textContent = `Basistoegang · ${n} × € 9`; document.getElementById('pr-b1').textContent = euro(n * 9);
    document.getElementById('pr-r2').textContent = `Werkbonlicentie · ${m} × € 15`; document.getElementById('pr-b2').textContent = euro(m * 15);
    document.getElementById('pr-tot').textContent = euro(n * 9 + m * 15);
  }
  if (g) { g.addEventListener('input', reken); w.addEventListener('input', reken); reken(); }

  // contactformulier: naar de eigen Cloud Function, die de aanvraag bewaart en doormailt.
  // Pas bij een geslaagd antwoord het bedankje; anders een melding mét telefoonnummer.
  const DEMO_URL = 'https://europe-west1-flow8-715de.cloudfunctions.net/demoAanvraag';
  const f = document.getElementById('demo-form');
  if (f) f.addEventListener('submit', e => {
    e.preventDefault(); let goed = true;
    f.querySelectorAll('[required]').forEach(i => { const ok = i.checkValidity(); i.setAttribute('aria-invalid', !ok); if (!ok && goed) { i.focus(); goed = false; } });
    if (!goed) return;
    const waarde = n => { const el = f.querySelector('[name="' + n + '"]'); return el ? el.value : ''; };
    let melding = f.querySelector('.melding');
    if (!melding) { melding = document.createElement('p'); melding.className = 'melding'; melding.setAttribute('role', 'status'); f.querySelector('button[type=submit]').after(melding); }
    melding.textContent = '';
    const knop = f.querySelector('button[type=submit]'), oud = knop.textContent;
    knop.disabled = true; knop.textContent = 'Versturen…';
    fetch(DEMO_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
      naam: waarde('naam'), bedrijf: waarde('bedrijf'), email: waarde('email'), telefoon: waarde('tel'),
      vraag: waarde('bericht'), omvang: waarde('omvang'), website: waarde('website') }) })
      .then(r => r.json().catch(() => ({})).then(d => ({ ok: r.ok, d })))
      .then(a => { if (a.ok && a.d.ok) { f.querySelectorAll('.veld, button[type=submit], .klein, .melding').forEach(el => { el.hidden = true; }); f.querySelector('.bedankt').hidden = false; return; }
        melding.textContent = a.d.error || 'Versturen mislukt. Bel ons gerust op 06 – 28 70 24 22.'; })
      .catch(() => { melding.textContent = 'Geen verbinding. Bel ons gerust op 06 – 28 70 24 22.'; })
      .then(() => { knop.disabled = false; knop.textContent = oud; });
  });
})();

// ── Diepte bij het scrollen: beelden, kaarten en tekst bewegen met eigen snelheid en kantelen licht ──
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const meer = document.getElementById('meer'); if (!meer) return;
  const lagen = [];
  meer.querySelectorAll('.sectie').forEach(sec => {
    sec.querySelectorAll('.beeld').forEach(el => lagen.push({ el, y: 50, kantel: 0, zij: true }));
    sec.querySelectorAll('.sectie-kop, .tekst').forEach(el => lagen.push({ el, y: 22, kantel: 0 }));
    sec.querySelectorAll('.tegel, .stappen3 li, .pakketten article, .reken, .kaartbeeld, .formulier, .waarom, .vragen, .modules').forEach((el, i) => lagen.push({ el, y: 36 + (i % 3) * 18, kantel: 3 }));
  });
  let loopt = false;
  const nav = document.querySelector('.nav');
  const banden = [...document.querySelectorAll('.band-licht')];
  addEventListener('scroll', () => { nav.classList.toggle('gescrold', scrollY > 12); nav.classList.toggle('op-licht', banden.some(bd => { const r = bd.getBoundingClientRect(); return r.top <= 34 && r.bottom >= 34; })); }, { passive: true });
  function stap() {
    const vh = innerHeight;
    for (const l of lagen) {
      const b = l.el.getBoundingClientRect(); if (b.bottom < -200 || b.top > vh + 200) continue;
      const q = Math.max(-1.2, Math.min(1.2, ((b.top + b.height / 2) - vh / 2) / vh)); // -1 boven, 0 midden, 1 onder
      if (l.zij) { // beelden komen vanaf hun eigen kant binnen en draaien in 3D bij
        if (l.kant === undefined) l.kant = l.el.closest('.omgekeerd') ? -1 : 1;
        const a = Math.min(1, Math.max(0, Math.abs(q) - 0.35) * 1.6); // in het midden van het scherm staat het blok recht en stil
        l.el.style.translate = `${(l.kant * a * a * 7).toFixed(2)}vw ${(q * l.y * 0.6).toFixed(1)}px`; l.el.style.rotate = `y ${(l.kant * a * 10).toFixed(2)}deg`; continue;
      }
      l.el.style.translate = `0 ${(q * l.y).toFixed(1)}px`;
      if (l.kantel) l.el.style.rotate = `x ${(q * l.kantel).toFixed(2)}deg`;
    }
    if (loopt) requestAnimationFrame(stap);
  }
  new IntersectionObserver(e => { if (e[0].isIntersecting) { if (!loopt) { loopt = true; requestAnimationFrame(stap); } } else loopt = false; }).observe(meer);
})();

// ── Onderdelen: spotlight, oplopende cijfers, lichtlijn bij overstappen ──
(function () {
  const stil = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.licht-kaart, .tegel, .stappen3 li, .reken, .pakketten article, .formulier').forEach(el => el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.setProperty('--mx', (e.clientX - r.left) + 'px'); el.style.setProperty('--my', (e.clientY - r.top) + 'px'); }));
  const tellers = [...document.querySelectorAll('[data-tot]')];
  if (!stil && 'IntersectionObserver' in window) {
    tellers.forEach(t => t.textContent = '0');
    const io = new IntersectionObserver(es => es.forEach(e => { if (!e.isIntersecting) return; io.unobserve(e.target); const doel = +e.target.dataset.tot, t0 = performance.now(), duur = 1400; const stap = nu => { const f = Math.min(1, (nu - t0) / duur), w = 1 - Math.pow(1 - f, 3); e.target.textContent = Math.round(doel * w).toLocaleString('nl-NL'); if (f < 1) requestAnimationFrame(stap); }; requestAnimationFrame(stap); }), { threshold: 0.6 });
    tellers.forEach(t => io.observe(t));
  }
  const stappen = document.querySelector('.stappen3');
  if (stappen) {
    const lis = [...stappen.children];
    const werk = () => { const r = stappen.getBoundingClientRect(), v = Math.max(0, Math.min(1, (innerHeight * 0.75 - r.top) / (r.height + innerHeight * 0.35))); stappen.style.setProperty('--voortgang', v.toFixed(3)); lis.forEach((li, i) => li.classList.toggle('bereikt', v >= i / Math.max(1, lis.length - 1) - 0.02)); };
    addEventListener('scroll', werk, { passive: true }); werk();
  }
})();

// ── Het blok onder de hero: de planning uit de eerste stop, groot; speelt af zodra het in beeld komt ──
(function () {
  const doel = document.querySelector('.landing-schaal .binnen'), bron = document.querySelector('.scherm[data-scherm="1"] .binnen');
  if (!doel || !bron) return;
  doel.innerHTML = bron.innerHTML;
  const schaal = doel.parentElement;
  const maat = () => { const w = Math.min(1100, innerWidth - 48), sc = w / 600; schaal.style.width = w + 'px'; schaal.style.height = 384 * sc + 'px'; doel.style.transform = 'scale(' + sc + ')'; doel.style.transformOrigin = '0 0'; };
  maat(); addEventListener('resize', maat);
  if ('IntersectionObserver' in window) { const io = new IntersectionObserver(e => { if (e[0].isIntersecting) { doel.firstElementChild.classList.add('speel'); doel.classList.add('speel'); io.disconnect(); } }, { threshold: 0.4 }); io.observe(schaal); }
})();

// uitklapmenu Product: klikken (aanraakschermen), Escape en klikken ernaast sluiten het
(function () {
  const sub = document.querySelector('.menu-sub'); if (!sub) return;
  const knop = sub.querySelector('.sub-knop');
  const zet = open => { sub.classList.toggle('open', open); knop.setAttribute('aria-expanded', open); };
  knop.addEventListener('click', () => zet(!sub.classList.contains('open')));
  document.addEventListener('click', e => { if (!sub.contains(e.target)) zet(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && sub.classList.contains('open')) { zet(false); knop.focus(); } });
  sub.querySelectorAll('.sub a').forEach(a => a.addEventListener('click', () => zet(false)));
})();

// hamburgermenu: openen/sluiten, Product uitklappen, Escape en een link kiezen sluiten het
(function () {
  const nav = document.querySelector('.nav'), knop = document.querySelector('.menu-knop'), paneel = document.getElementById('mobiel-menu');
  if (!knop || !paneel) return;
  let dicht = null;
  const zet = open => {
    clearTimeout(dicht); knop.setAttribute('aria-expanded', open); knop.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
    nav.classList.toggle('menu-open', open); document.body.style.overflow = open ? 'hidden' : '';
    if (open) { paneel.hidden = false; requestAnimationFrame(() => paneel.classList.add('open')); }
    else { paneel.classList.remove('open'); dicht = setTimeout(() => { paneel.hidden = true; }, 300); }
  };
  knop.addEventListener('click', () => zet(knop.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && knop.getAttribute('aria-expanded') === 'true') { zet(false); knop.focus(); } });
  paneel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => zet(false)));
  const sk = paneel.querySelector('.mm-sub-knop'), sub = document.getElementById('mm-product');
  sk.addEventListener('click', () => { const open = sk.getAttribute('aria-expanded') !== 'true'; sk.setAttribute('aria-expanded', open); sub.hidden = !open; });
  matchMedia('(min-width:821px)').addEventListener('change', e => { if (e.matches) zet(false); });
})();
