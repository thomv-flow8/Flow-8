class Site {
  constructor() {
    this.state = { tab: 'klanten', who: 0, users: 12, techs: 5, faq: 0, sent: false };
    this.props = { accent: '#4f6ef5', motion: 'standaard', particles: true };
    this._drops = {};
  }
  eur(v) { return '€ ' + v.toLocaleString('nl-NL'); }

  renderVals() {
    const t = this.state.tab, k = t === 'klanten';
    const chip = (on) => on ? 'var(--acc)' : 'transparent';
    return {
      isKlanten: k, isRapportage: !k,
      klantenBg: chip(k), klantenFg: k ? '#fff' : '#a8aec0',
      rapBg: chip(!k), rapFg: !k ? '#fff' : '#a8aec0',
      tabTitle: k ? 'Je klanten overzichtelijk bij elkaar.' : 'Inzicht in je hele operatie.',
      tabLead: k
        ? 'Van debiteuren tot vaste serviceklanten — contactgegevens, contracten en gekoppelde installaties op één plek, zodat je bij elke klant meteen de historie ziet.'
        : 'Van opdrachten en werkbonnen tot serviceklanten, werkorders en team — overzichtelijke rapportages met grafieken, verdelingen en cijfers per periode.',
      tabFeats: k
        ? ['Debiteuren en serviceklanten in één overzicht', 'Contactgegevens, contracten en locaties per klant', 'Gekoppelde installaties met onderhoudshistorie']
        : ['Opdrachten per monteur en per type', 'Afgehandeld, open en spoed in één oogopslag', 'Rapportages over team, klanten en werkorders'],
      showKlanten: () => this.setState({ tab: 'klanten' }),
      showRapportage: () => this.setState({ tab: 'rapportage' }),
      dropToggle0: () => this.setDrop(0, !this.isDropOpen(0)),
      dropOn0: () => this.hoverOpen(0),
      dropOff0: () => this.hoverClose(0),
      dropKey0: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.setDrop(0, !this.isDropOpen(0)); } if (e.key === 'Escape') this.setDrop(0, false); },
      dropToggle1: () => this.setDrop(1, !this.isDropOpen(1)),
      dropOn1: () => this.hoverOpen(1),
      dropOff1: () => this.hoverClose(1),
      dropKey1: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.setDrop(1, !this.isDropOpen(1)); } if (e.key === 'Escape') this.setDrop(1, false); },
      toggleMenu: () => this.toggleMenu(),

      sats: this.buildSats(),
      ...this.priceVals(),
      wbRows: [
        { t: 'Checklists', n: '4', d: 'M9 11l3 3 8-8 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' },
        { t: 'Uren', n: '2 u', d: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z M12 7v5l3 2' },
        { t: 'Materialen', n: '3', d: 'M21 8l-9-5-9 5 9 5 9-5z M3 8v8l9 5 9-5V8 M12 13v8' },
        { t: "Foto's", n: '5', d: 'M4 7h3l2-2h6l2 2h3v12H4z M12 16a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z' },
        { t: 'Documenten', n: '1', d: 'M6 3h8l4 4v14H6z M14 3v4h4' }
      ],
      steps: [
        { n: '1', when: 'Week 1', t: 'Intake & inrichting', p: 'We lopen je werkwijze door en richten opdrachttypes, checklists en werkbonlayout in op jouw manier van werken.', delay: 0 },
        { n: '2', when: 'Week 1 – 2', t: 'Je gegevens erin', p: 'Klanten, medewerkers, installaties en materialen komen via Excel binnen. Aanleveren mag in je eigen format.', delay: 90 },
        { n: '3', when: 'Week 2', t: 'Live met begeleiding', p: 'Planners en monteurs krijgen uitleg, de eerste week draaien we mee. Vragen tussendoor? Gewoon bellen.', delay: 180 }
      ],
      faqs: this.faqList(),
      checks: [{ i: 0, w: '68%' }, { i: 1, w: '84%' }, { i: 2, w: '54%' }],
      flyRows: [{ i: 0, top: '26%', w: '60%', c: '#4f6ef5' }, { i: 1, top: '46%', w: '76%', c: '#35c4e3' }, { i: 2, top: '66%', w: '52%', c: '#10b981' }],
      crew: [{ i: 0, n: 'SV', c: '#4f6ef5' }, { i: 1, n: 'KV', c: '#7c5cff' }, { i: 2, n: 'JB', c: '#10b981' }, { i: 3, n: 'MJ', c: '#35c4e3' }],
      sent: !!this.state.sent,
      notSent: !this.state.sent,
      submit: (e) => { e.preventDefault(); this.setState({ sent: true }); },
      resetForm: () => this.setState({ sent: false }),

      crews: [
        { init: 'SV', color: '#4f6ef5', name: 'S. de Vries', meta: '0/5 · 5u werk', rows: [
          { t: '08:30', job: 'Servicebeurt', place: 'Alphen a/d Rijn', status: 'Ingepland', bg: 'rgba(79,110,245,.15)', fg: '#93a6ff', bd: 'rgba(79,110,245,.3)' },
          { t: '10:15', job: 'Onderhoud', place: 'Gouda', status: 'Ingepland', bg: 'rgba(79,110,245,.15)', fg: '#93a6ff', bd: 'rgba(79,110,245,.3)' },
          { t: '11:45', job: 'Installatie', place: 'Moerkapelle', status: 'Onderweg', bg: 'rgba(53,196,227,.14)', fg: '#5fd6ef', bd: 'rgba(53,196,227,.32)' } ] },
        { init: 'KV', color: '#7c5cff', name: 'K. Visser', meta: '1/6 · 5,5u werk', rows: [
          { t: '08:15', job: 'Servicebeurt', place: 'Giessenburg', status: 'Afgerond', bg: 'rgba(16,185,129,.14)', fg: '#34d99f', bd: 'rgba(16,185,129,.32)' },
          { t: '09:40', job: 'Servicebeurt', place: 'Vianen', status: 'Ingepland', bg: 'rgba(79,110,245,.15)', fg: '#93a6ff', bd: 'rgba(79,110,245,.3)' },
          { t: '12:20', job: '1e onderhoud', place: 'Schelluinen', status: 'Ingepland', bg: 'rgba(79,110,245,.15)', fg: '#93a6ff', bd: 'rgba(79,110,245,.3)' } ] }
      ],
      absent: [
        { init: 'JS', color: '#3aa0a0', name: 'J. Smit', kind: 'Verlof', bg: 'rgba(79,110,245,.14)', fg: '#93a6ff', bd: 'rgba(79,110,245,.28)' },
        { init: 'PV', color: '#c05cc0', name: 'P. van Dijk', kind: 'Verlof', bg: 'rgba(79,110,245,.14)', fg: '#93a6ff', bd: 'rgba(79,110,245,.28)' },
        { init: 'RK', color: '#4f6ef5', name: 'R. Kuiper', kind: 'Verlof', bg: 'rgba(79,110,245,.14)', fg: '#93a6ff', bd: 'rgba(79,110,245,.28)' },
        { init: 'TB', color: '#b46b3a', name: 'T. Bos', kind: 'Ziek', bg: 'rgba(239,68,68,.14)', fg: '#f98a8a', bd: 'rgba(239,68,68,.3)' }
      ],
      opTiles: [
        { t: 'Planning & route', d: 'M3 11l19-9-9 19-2-8-8-2z', delay: 0 },
        { t: 'Werkbonnen', d: 'M6 3h12v18H6z M9 9h6 M9 13h6', delay: 50 },
        { t: 'Klantmails', d: 'M3 6h18v12H3z M3 7l9 6 9-6', delay: 100 },
        { t: 'Kaartoverzicht', d: 'M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11z M12 7.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z', delay: 150 },
        { t: 'Agenda', d: 'M3 5h18v16H3z M3 10h18 M8 3v4 M16 3v4', delay: 200 },
        { t: 'Storingsdienst', d: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z', delay: 250 },
        { t: 'Werkorders', d: 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z', delay: 300 },
        { t: 'Register & materialen', d: 'M4 4h16v16H4z M8 8h8 M8 12h8 M8 16h5', delay: 350 }
      ],
      teamTiles: [
        { t: 'Medewerkers', d: 'M9 4.8a3.2 3.2 0 1 1 0 6.4 3.2 3.2 0 0 1 0-6.4z M2.5 20v-1a5 5 0 0 1 5-5h3a5 5 0 0 1 5 5v1 M16 5a3 3 0 0 1 0 6 M21.5 20v-1a5 5 0 0 0-3.5-4.8' },
        { t: 'Verlof', d: 'M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z M12 2v2 M12 20v2 M4 12H2 M22 12h-2 M5.6 5.6 4.2 4.2 M19.8 19.8l-1.4-1.4 M5.6 18.4l-1.4 1.4 M19.8 4.2l-1.4 1.4' },
        { t: 'Overuren', d: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z M12 7v5l3 2' },
        { t: 'Onkosten', d: 'M5 3h14v18l-2.5-1.6L14 21l-2-1.6L10 21l-2.5-1.6L5 21z M9 8h6 M9 12h6' },
        { t: 'Verzuim', d: 'M3 12h4l2 6 4-13 2 7h6' }
      ],
      team: [
        { init: 'SV', color: '#3aa0a0', name: 'S. de Vries', role: 'Monteur · 40 u/wk', hours: '119,8u', pct: 75, barc: '#34d99f' },
        { init: 'JB', color: '#10b981', name: 'J. Bakker', role: 'Planner · 36 u/wk', hours: '23,5u', pct: 30, barc: '#e0b072' },
        { init: 'MJ', color: '#7c5cff', name: 'M. Jansen', role: 'Administratie · 32 u/wk', hours: '58,4u', pct: 55, barc: '#34d99f' },
        { init: 'KV', color: '#4f6ef5', name: 'K. Visser', role: 'Magazijn · 40 u/wk', hours: '160u', pct: 95, barc: '#34d99f' },
        { init: 'RG', color: '#c05cc0', name: 'R. de Groot', role: 'Verkoop · 40 u/wk', hours: '4,9u', pct: 8, barc: '#f98a8a' }
      ],
      kkSecs: [
        { t: 'Contactpersonen', sub: '1 · standaard', n: '1', d: 'M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8z M5 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1' },
        { t: 'Locaties', sub: 'alleen hoofdadres', n: '0', d: 'M12 21s7-6.5 7-11a7 7 0 1 0-14 0c0 4.5 7 11 7 11z M12 7.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5z' },
        { t: 'Installaties', sub: '8 in servicecontract', n: '8', d: 'M21 8l-9-5-9 5 9 5 9-5z M3 8v8l9 5 9-5V8 M12 13v8' }
      ],
      legend: [
        { c: '#4f6ef5', t: 'Servicebeurt', v: '48%' }, { c: '#34d99f', t: 'Installatie', v: '23%' },
        { c: '#f98a8a', t: 'Storing', v: '19%' }, { c: '#35c4e3', t: '1e Onderhoud', v: '8%' },
        { c: '#7a8091', t: 'Overig', v: '2%' }
      ],
      bars: [
        { v: '55', h: 30, m: 'Apr' }, { v: '153', h: 79, m: 'Mei' }, { v: '154', h: 80, m: 'Jun' },
        { v: '137', h: 71, m: 'Jul' }, { v: '141', h: 73, m: 'Aug' }
      ]
    };
  }

  priceVals() {
    const users = this.state.users;
    const t = Math.min(this.state.techs, users);
    const base = users * 9, add = t * 15, total = base + add;
    return {
      pUsers: users, pTechs: t, pTechMax: users,
      setUsers: (e) => { const v = +e.target.value; this.setState({ users: v, techs: Math.min(this.state.techs, v) }); },
      setTechs: (e) => this.setState({ techs: Math.min(+e.target.value, this.state.users) }),
      pBaseFmt: this.eur(base),
      pAddFmt: this.eur(add),
      pTotalFmt: this.eur(total),
      pSplit: t + ' × € 24 · ' + (users - t) + ' × € 9',
      pAvgFmt: '€ ' + (total / users).toFixed(2).replace('.', ',')
    };
  }
  faqList() {
    const defs = [
      { q: 'Werkt Flow8 op de telefoon van mijn monteurs?', a: 'Ja. Flow8 draait in de browser, dus op elke telefoon of tablet — Android en iPhone. Geen app-store, geen installatie: inloggen en beginnen.' },
      { q: 'Kan ik mijn huidige klantenbestand meenemen?', a: 'Ja, via Excel. Klanten, medewerkers, installaties en materialen importeren we in één keer. Je mag aanleveren in je eigen format; wij zetten het om.' },
      { q: 'Zijn er koppelingen met mijn boekhouding?', a: 'Nog niet. Vandaag werkt Flow8 met import en export via Excel. Koppelingen met boekhoudpakketten staan op de planning — we bouwen ze op volgorde van wat klanten daadwerkelijk gebruiken.' },
      { q: 'Hoe lang duurt het voor we live zijn?', a: 'Meestal twee weken: intake en inrichting in week één, gegevens importeren en live in week twee. De eerste week draaien we met je mee.' },
      { q: 'Wat gebeurt er met een werkbon als de monteur geen bereik heeft?', a: 'De bon blijft op zijn toestel staan en gaat door zodra er weer verbinding is. Hij hoeft niets over te typen.' },
      { q: 'Waar staan mijn gegevens?', a: 'Op servers binnen de Europese Unie, met dagelijkse back-ups. Je gegevens blijven van jou: je kunt ze op elk moment exporteren, en bij opzeggen krijg je een volledige export mee.' },
      { q: 'Zit ik ergens aan vast?', a: 'Nee. Maandelijks opzegbaar, en de eerste drie maanden draai je zonder kosten mee. Je gegevens blijven van jou en kun je altijd exporteren.' }
    ];
    return defs.map((f, i) => {
      const on = this.state.faq === i;
      return Object.assign({}, f, {
        toggle: () => this.setState({ faq: on ? -1 : i }),
        expanded: on ? 'true' : 'false',
        rows: on ? '1fr' : '0fr',
        rot: on ? '180deg' : '0deg',
        bd: on ? 'rgba(79,110,245,.34)' : '#e2e5ec',
        sh: on ? '0 14px 34px rgba(20,26,60,.08)' : 'none',
        iconBg: on ? 'var(--acc)' : 'rgba(79,110,245,.1)',
        iconFg: on ? '#fff' : 'var(--acc)'
      });
    });
  }
  buildSats() {
    const defs = [
      { t: 'Installatiebedrijven', short: 'Installatie-\nbedrijven', p: 'Kantoor en veld in één omgeving, met dezelfde gegevens aan beide kanten.', d: 'M3 21h18M5 21V8l7-5 7 5v13M10 21v-6h4v6' },
      { t: 'Serviceklanten', short: 'Service-\nklanten', p: 'Vaste klanten en terugkerend onderhoud bij elkaar, inclusief contract en historie.', d: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z M12 7v5l3 2' },
      { t: 'Machines & installaties', short: 'Machines &\ninstallaties', p: 'Gekoppeld aan de klant, inzichtelijk en klaar voor onderhoud of reparatie.', d: 'M21 8l-9-5-9 5 9 5 9-5z M3 8v8l9 5 9-5V8 M12 13v8' }
    ];
    return defs.map((s, i) => {
      const on = this.state.who === i, rot = -90 + i * 120;
      return Object.assign({}, s, {
        rot, antirot: -rot, hover: () => this.pick(i),
        rowBd: on ? 'rgba(79,110,245,.34)' : '#e2e5ec',
        rowBg: on ? '#fff' : 'rgba(255,255,255,.55)',
        rowSh: on ? '0 14px 34px rgba(20,26,60,.09)' : 'none',
        iconBg: on ? 'var(--acc)' : 'rgba(79,110,245,.1)',
        iconFg: on ? '#fff' : 'var(--acc)',
        chipBg: on ? 'var(--acc)' : '#fff',
        chipBd: on ? 'var(--acc)' : '#e2e5ec',
        chipSh: on ? '0 10px 26px rgba(79,110,245,.32)' : '0 6px 16px rgba(20,26,60,.09)',
        chipScale: on ? '1.06' : '1',
        chipIconFg: on ? '#fff' : 'var(--acc)'
      });
    });
  }
  pick(i) { this.setState({ who: i }); }

  /* ---------- motion helpers ---------- */
  get motion() { return this.props.motion || 'standaard'; }
  get reduced() { return this.motion === 'uit' || window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  componentDidMount() {
    this.applyAccent();
    this.initNav();
    this.initReveal();
    this.initResponsive();
    this.initParticles();
    this.initParallax();
    this.initScenes();
    this._onKey = (e) => { if (e.key === 'Escape') this.closeDrops(); };
    this._onDoc = (e) => { if (![...document.querySelectorAll('[data-drop]')].some(d => d.contains(e.target))) this.closeDrops(); };
    document.addEventListener('keydown', this._onKey);
    document.addEventListener('click', this._onDoc);
    if (this.reduced) document.querySelectorAll('[data-loop]').forEach(el => { el.style.animation = 'none'; });
  }
  componentDidUpdate() { this.applyAccent(); this.scanReveal(); this.sizeOrbit(); this.layoutNav(); }
  componentWillUnmount() {
    document.removeEventListener('keydown', this._onKey);
    document.removeEventListener('click', this._onDoc);
    clearInterval(this._scanTimer);
    cancelAnimationFrame(this._raf);
  }

  applyAccent() {
    const a = this.props.accent || '#4f6ef5';
    document.documentElement.style.setProperty('--acc', a);
    document.documentElement.style.setProperty('--acc2', this.lighten(a, .38));
  }
  lighten(hex, amt) {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!m) return '#8ea2ff';
    const c = [1, 2, 3].map(i => Math.round(parseInt(m[i], 16) + (255 - parseInt(m[i], 16)) * amt));
    return '#' + c.map(v => v.toString(16).padStart(2, '0')).join('');
  }

  /* ---------- nav ---------- */
  isDropOpen(i) { return !!(this._drops && this._drops[i]); }
  hoverOpen(i) {
    if (!window.matchMedia('(hover:hover)').matches) return;
    clearTimeout(this._closeT);
    this.setDrop(i, true);
  }
  hoverClose(i) {
    if (!window.matchMedia('(hover:hover)').matches) return;
    clearTimeout(this._closeT);
    this._closeT = setTimeout(() => { if (!document.querySelector('[data-drop]:hover')) this.setDrop(i, false); }, 320);
  }
  closeDrops() { this.setDrop(0, false); this.setDrop(1, false); }
  setDrop(i, open) {
    this._drops = this._drops || {};
    this._drops[i] = open;
    if (open) { Object.keys(this._drops).forEach(k => { if (+k !== i && this._drops[k]) this.setDrop(+k, false); }); }
    const menu = document.querySelector('[data-dropmenu="' + i + '"]');
    const chev = document.querySelector('[data-chev="' + i + '"]');
    const trig = document.querySelector('[data-drop="' + i + '"] [role="button"]');
    if (!menu) return;
    const mobile = window.innerWidth <= 1040;
    menu.style.opacity = open ? '1' : '0';
    menu.style.visibility = open ? 'visible' : 'hidden';
    menu.style.pointerEvents = open ? 'auto' : 'none';
    menu.style.display = mobile && !open ? 'none' : 'flex';
    const bridgeEl = document.querySelectorAll('[data-drop="' + i + '"] [data-bridge]')[0];
    if (bridgeEl) bridgeEl.style.display = !mobile && open ? 'block' : 'none';
    if (!mobile) menu.style.transform = 'translateX(-50%) translateY(' + (open ? '0' : '-6px') + ')';
    if (chev) chev.style.transform = open ? 'rotate(180deg)' : 'none';
    if (trig) trig.setAttribute('aria-expanded', String(open));
  }
  toggleMenu() {
    const links = document.querySelector('[data-navlinks]');
    const btn = document.querySelector('[data-navtoggle]');
    const open = links.getAttribute('data-open') !== '1';
    links.setAttribute('data-open', open ? '1' : '0');
    btn.setAttribute('aria-expanded', String(open));
    this.layoutNav();
  }
  initNav() {
    const nav = document.querySelector('[data-navbar]');
    const brand = document.querySelector('[data-navbrand]');
    const dot = document.querySelector('[data-navdot]');
    const pill = document.querySelector('[data-navlinks]');
    const links = [...document.querySelectorAll('[data-navlink]')];
    const login = document.querySelector('[data-navlogin]');
    const bands = [...document.querySelectorAll('[data-band]')];
    const modIds = ['dashboard', 'operationeel', 'inzicht', 'team', 'werkbon'];
    const secs = ['top', 'voor-wie', 'dashboard', 'operationeel', 'inzicht', 'team', 'werkbon', 'overstappen', 'prijzen', 'faq', 'contact']
      .map(id => ({ id, el: document.getElementById(id) })).filter(s => s.el);
    let lastLight = null, lastScrolled = null, lastSec = null;
    const apply = () => {
      const scrolled = window.scrollY > 12;
      let light = false;
      for (const b of bands) { const r = b.getBoundingClientRect(); if (r.top <= 38 && r.bottom > 38) { light = b.dataset.band === 'light'; break; } }
      let cur = secs[0].id;
      for (const s of secs) { const r = s.el.getBoundingClientRect(); if (r.top <= 140) cur = s.id; }
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 60) cur = 'contact';
      if (cur !== lastSec) {
        lastSec = cur;
        const contactIds = ['overstappen', 'faq', 'contact'];
        const wanted = modIds.indexOf(cur) > -1 ? 'modules' : (contactIds.indexOf(cur) > -1 ? 'contactgroep' : cur);
        links.forEach(l => {
          const href = l.dataset.navhref || (l.getAttribute('href') || '').replace('#', '');
          l.dataset.active = href === wanted ? '1' : '0';
        });
      }
      if (light === lastLight && scrolled === lastScrolled && cur === lastSec) { this.paintLinks(light); return; }
      lastLight = light; lastScrolled = scrolled;
      nav.style.background = scrolled ? (light ? 'rgba(245,246,248,.82)' : 'rgba(10,11,16,.72)') : 'transparent';
      nav.style.backdropFilter = scrolled ? 'blur(12px)' : 'none';
      nav.style.webkitBackdropFilter = scrolled ? 'blur(12px)' : 'none';
      nav.style.borderBottomColor = scrolled ? (light ? '#e2e5ec' : '#262b3d') : 'transparent';
      brand.style.color = light ? '#0d0f14' : '#f4f6fb';
      if (dot) dot.setAttribute('fill', light ? '#f5f6f8' : '#0a0b10');
      const mobileOpen = pill.getAttribute('data-open') === '1';
      if (!mobileOpen) {
        pill.style.background = light ? 'rgba(13,15,20,.04)' : 'rgba(255,255,255,.05)';
        pill.style.borderColor = light ? 'rgba(13,15,20,.09)' : 'rgba(255,255,255,.08)';
      }
      this._light = light;
      this.paintLinks(light);
      if (login) { login.style.background = light ? '#0d0f14' : '#0d0f14'; login.style.borderColor = light ? 'rgba(13,15,20,.14)' : 'rgba(255,255,255,.22)'; }
    };
    apply();
    window.addEventListener('scroll', apply, { passive: true });
    window.addEventListener('resize', apply, { passive: true });
    document.querySelectorAll('[data-navlinks] a').forEach(a => a.addEventListener('click', () => {
      if (window.innerWidth <= 1040) { const l = document.querySelector('[data-navlinks]'); l.setAttribute('data-open', '0'); this.layoutNav(); }
      this.closeDrops();
    }));
  }

  paintLinks(light) {
    const mob = window.innerWidth <= 1040;
    document.querySelectorAll('[data-navlink]').forEach(l => {
      const on = l.dataset.active === '1';
      if (mob) { l.style.color = '#f4f6fb'; l.style.background = on ? 'rgba(79,110,245,.16)' : 'transparent'; return; }
      l.style.color = on ? (light ? '#0d0f14' : '#fff') : (light ? '#5f6572' : '#a8aec0');
      l.style.background = on ? (light ? 'rgba(13,15,20,.06)' : 'rgba(255,255,255,.09)') : 'transparent';
      l.style.fontWeight = on ? '600' : '400';
    });
  }

  /* ---------- responsive (JS media queries, inline-style only) ---------- */
  initResponsive() {
    this.layoutNav();
    let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => this.layoutNav(), 120); }, { passive: true });
  }
  sizeOrbit() {
    const wrap = document.querySelector('[data-orbitwrap]');
    if (!wrap) return;
    const w = wrap.getBoundingClientRect().width;
    if (!w) return;
    const n = Math.max(48, Math.min(66, w * 0.13));
    document.querySelectorAll('[data-satarm]').forEach(el => { el.style.transform = 'translateX(' + (w * 0.32).toFixed(1) + 'px)'; });
    document.querySelectorAll('[data-satchip]').forEach(el => {
      el.style.width = el.style.height = n.toFixed(0) + 'px';
      const g = el.querySelector('svg'); if (g) g.style.width = g.style.height = (n * 0.42).toFixed(0) + 'px';
    });
  }
  layoutNav() {
    const w = window.innerWidth, mob = w <= 1040, narrow = w <= 620;
    const pill = document.querySelector('[data-navlinks]');
    const toggle = document.querySelector('[data-navtoggle]');
    const ctas = [...document.querySelectorAll('[data-navcta]')];
    const mobCta = document.querySelector('[data-mobcta]');
    const menus = [...document.querySelectorAll('[data-dropmenu]')];
    if (!pill) return;
    const open = pill.getAttribute('data-open') === '1';
    toggle.style.display = mob ? 'flex' : 'none';
    ctas.forEach(c => {
      const secondary = c.hasAttribute('data-navlogin');
      c.style.display = mob || (secondary && w <= 1200) ? 'none' : 'inline-flex';
    });
    if (mobCta) mobCta.style.display = mob ? 'flex' : 'none';
    if (mob) {
      pill.style.display = open ? 'flex' : 'none';
      pill.style.flexDirection = 'column'; pill.style.alignItems = 'stretch'; pill.style.gap = '2px';
      pill.style.position = 'fixed'; pill.style.top = '72px'; pill.style.left = '12px'; pill.style.right = '12px';
      pill.style.maxHeight = 'calc(100dvh - 88px)'; pill.style.overflowY = 'auto';
      pill.style.background = '#101320'; pill.style.border = '1px solid #262b3d';
      pill.style.borderRadius = '16px'; pill.style.padding = '10px'; pill.style.boxShadow = '0 24px 60px rgba(0,0,0,.5)';
      document.querySelectorAll('[data-navlink]').forEach(l => { l.style.color = '#f4f6fb'; l.style.padding = '12px 14px'; l.style.borderRadius = '10px'; l.style.width = '100%'; });
      menus.forEach(menu => { menu.style.position = 'static'; menu.style.transform = 'none'; menu.style.background = 'transparent'; menu.style.border = 'none'; menu.style.boxShadow = 'none'; menu.style.padding = '2px 0 8px 14px'; menu.style.minWidth = '0'; menu.style.display = this.isDropOpen(+menu.dataset.dropmenu) ? 'flex' : 'none'; });
    } else {
      pill.style.display = 'flex'; pill.style.flexDirection = 'row'; pill.style.alignItems = 'center'; pill.style.gap = '4px';
      pill.style.position = 'static'; pill.style.maxHeight = 'none'; pill.style.overflow = 'visible';
      pill.style.borderRadius = '100px'; pill.style.padding = '5px'; pill.style.boxShadow = 'none';
      pill.style.border = '1px solid rgba(255,255,255,.08)'; pill.style.background = 'rgba(255,255,255,.05)';
      document.querySelectorAll('[data-navlink]').forEach(l => { l.style.padding = '9px 16px'; l.style.width = 'auto'; });
      menus.forEach((menu, k) => { menu.style.display = 'flex'; menu.style.position = 'absolute'; menu.style.background = '#101320'; menu.style.border = '1px solid #262b3d'; menu.style.boxShadow = '0 24px 60px rgba(0,0,0,.5)'; menu.style.padding = '14px 10px'; menu.style.minWidth = k === 0 ? '230px' : '214px'; });
      if (this._wasMobile) this.closeDrops();
    }
    this._wasMobile = mob;
    document.querySelectorAll('[data-mod]').forEach(m => {
      m.style.gridTemplateColumns = w <= 980 ? '1fr' : (m.closest('#voor-wie') ? '1fr 1.02fr' : '1fr 1.05fr');
      m.style.gap = w <= 980 ? '38px' : '64px';
    });
    document.querySelectorAll('[data-grid="3"]').forEach(g => { g.style.gridTemplateColumns = w <= 900 ? '1fr' : 'repeat(3,1fr)'; });
    document.querySelectorAll('[data-grid="4"]').forEach(g => { g.style.gridTemplateColumns = w <= 900 ? (narrow ? '1fr 1fr' : 'repeat(2,1fr)') : 'repeat(4,1fr)'; });
    document.querySelectorAll('[data-dashmain]').forEach(g => { g.style.gridTemplateColumns = '1.7fr 1fr'; });
    document.querySelectorAll('[data-dashbottom]').forEach(g => { g.style.gridTemplateColumns = '1fr 1fr'; });
    document.querySelectorAll('[data-footgrid]').forEach(g => { g.style.gridTemplateColumns = w <= 900 ? '1fr' : '1.6fr 1fr 1fr'; });
    document.querySelectorAll('[data-calcgrid]').forEach(g => { g.style.gridTemplateColumns = w <= 820 ? '1fr' : '1.25fr 1fr'; });
    document.querySelectorAll('[data-calcside]').forEach(g => { g.style.borderLeft = w <= 820 ? 'none' : '1px solid #262b3d'; g.style.borderTop = w <= 820 ? '1px solid #262b3d' : 'none'; });
    document.querySelectorAll('[data-tiers]').forEach(g => { g.style.gridTemplateColumns = w <= 560 ? '1fr' : 'repeat(2,1fr)'; });
    document.querySelectorAll('[data-faqgrid]').forEach(g => { g.style.gridTemplateColumns = w <= 900 ? '1fr' : '.85fr 1.15fr'; g.style.gap = w <= 900 ? '34px' : '56px'; });
    document.querySelectorAll('[data-two]').forEach(g => { g.style.gridTemplateColumns = w <= 520 ? '1fr' : '1fr 1fr'; });
    document.querySelectorAll('[data-whygrid]').forEach(g => { const m = w <= 860; g.style.gridTemplateColumns = m ? '1fr' : '1fr 1fr'; g.style.gap = m ? '28px' : '44px'; g.style.padding = w <= 560 ? '24px' : '34px'; });
    document.querySelectorAll('[data-mockscroll]').forEach(g => {
      const narrow = w <= 900;
      g.style.overflowX = narrow ? 'auto' : 'visible';
      const inner = g.firstElementChild;
      if (inner) inner.style.minWidth = narrow ? '860px' : '100%';
    });
    document.querySelectorAll('[data-signcard]').forEach(g => {
      const col = g.closest('[data-parallax]');
      const wrap = g.closest('[data-phonewrap]');
      if (!col || !wrap) return;
      const colR = col.getBoundingClientRect(), wrapR = wrap.getBoundingClientRect();
      const cardW = 216;
      /* ruimte rechts van de telefoon binnen de kolom, plus de paginamarge buiten de container */
      const rightOfPhone = colR.right - wrapR.right;
      const offset = Math.max(0, Math.min(cardW * 0.5, rightOfPhone - 8));
      const overlap = cardW - offset;
      g.style.right = (-offset).toFixed(0) + 'px';
      g.style.display = (w <= 560 || overlap > 130) ? 'none' : 'block';
    });
    this.sizeOrbit();
    const cue = document.querySelector('[data-cue]'); if (cue) cue.style.display = mob ? 'none' : 'flex';
    const arcs = document.querySelector('[data-arcs]'); if (arcs) arcs.style.width = w <= 640 ? '200%' : '135%';
  }

  /* ---------- reveal + mock-animaties ---------- */
  initReveal() {
    this._seen = new WeakSet();
    this._io = new IntersectionObserver((es) => {
      es.forEach(e => { if (e.isIntersecting) { this.reveal(e.target); this._io.unobserve(e.target); } });
    }, { threshold: .16, rootMargin: '0px 0px -40px 0px' });
    this.scanReveal();
    let n = 0;
    this._scanTimer = setInterval(() => { this.scanReveal(); if (++n > 40) clearInterval(this._scanTimer); }, 400);
  }
  scanReveal() {
    document.querySelectorAll('[data-reveal]').forEach(el => {
      if (this._seen.has(el)) return;
      this._seen.add(el);
      if (this.reduced) { el.setAttribute('data-in', ''); this.animate(el); return; }
      this._io.observe(el);
    });
    /* React kan bij re-render inline eindwaarden wissen — opnieuw zetten */
    document.querySelectorAll('[data-anim]').forEach(s => { if (s.dataset.animDone === '1') this.applyFinals(s); });
  }
  applyFinals(scope) {
    const route = scope.querySelector('[data-route]'); if (route) route.style.strokeDashoffset = '0';
    scope.querySelectorAll('[data-pin]').forEach(p => { p.style.opacity = '1'; p.style.transform = 'none'; });
    scope.querySelectorAll('[data-bar]').forEach(b => { b.style.height = b.dataset.bar + 'px'; });
    scope.querySelectorAll('[data-fill]').forEach(f => { f.style.width = f.dataset.fill + '%'; });
    scope.querySelectorAll('[data-dash]').forEach(c => c.setAttribute('stroke-dasharray', c.dataset.dash));
    scope.querySelectorAll('[data-count]').forEach(el => { el.textContent = String(parseFloat(el.dataset.count)); });
  }
  reveal(el) {
    const d = +(el.dataset.delay || 0);
    el.setAttribute('data-in', '');
    setTimeout(() => this.animate(el), this.reduced ? 0 : d + 120);
  }
  animate(scope) {
    if (!scope.hasAttribute || !scope.hasAttribute('data-anim')) {
      if (scope.querySelector && scope.querySelector('[data-anim]')) scope = scope.querySelector('[data-anim]'); else return;
    }
    if (scope.dataset.animDone === '1') return;
    scope.dataset.animDone = '1';
    const inst = this.reduced;
    const route = scope.querySelector('[data-route]');
    if (route) {
      if (inst) route.style.strokeDashoffset = '0';
      else { route.style.transition = 'stroke-dashoffset 1.15s cubic-bezier(.4,0,.2,1)'; requestAnimationFrame(() => { route.style.strokeDashoffset = '0'; }); }
    }
    scope.querySelectorAll('[data-pin]').forEach((p, i) => {
      const go = () => { p.style.transition = 'opacity .3s ease,transform .45s cubic-bezier(.2,1.4,.4,1)'; p.style.opacity = '1'; p.style.transform = 'none'; };
      inst ? (p.style.opacity = '1', p.style.transform = 'none') : setTimeout(go, 420 + i * 110);
    });
    scope.querySelectorAll('[data-bar]').forEach((b, i) => {
      const h = b.dataset.bar + 'px';
      if (inst) { b.style.height = h; return; }
      b.style.transition = 'height .7s cubic-bezier(.2,.8,.3,1) ' + (i * 70) + 'ms';
      requestAnimationFrame(() => { b.style.height = h; });
    });
    scope.querySelectorAll('[data-fill]').forEach((f, i) => {
      const w = f.dataset.fill + '%';
      if (inst) { f.style.width = w; return; }
      f.style.transition = 'width .8s cubic-bezier(.2,.8,.3,1) ' + (120 + i * 80) + 'ms';
      requestAnimationFrame(() => { f.style.width = w; });
    });
    scope.querySelectorAll('[data-dash]').forEach((c, i) => {
      const v = c.dataset.dash;
      if (inst) { c.setAttribute('stroke-dasharray', v); return; }
      c.style.transition = 'stroke-dasharray .8s cubic-bezier(.3,.8,.3,1) ' + (i * 110) + 'ms';
      requestAnimationFrame(() => { c.setAttribute('stroke-dasharray', v); });
    });
    const sign = scope.querySelector('[data-sign]');
    if (sign) {
      if (inst) sign.style.strokeDashoffset = '0';
      else { sign.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.25,1) .4s'; requestAnimationFrame(() => { sign.style.strokeDashoffset = '0'; }); }
    }
    scope.querySelectorAll('[data-count]').forEach(el => this.countUp(el, inst));
  }
  countUp(el, inst, override) {
    const target = override !== undefined ? override : parseFloat(el.dataset.count);
    if (inst) { el.textContent = String(target); return; }
    const t0 = performance.now(), dur = 900;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(target * e));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- scènes bij de overstapstappen ---------- */
  initScenes() {
    const root = document.querySelector('[data-scenes]');
    if (!root) { setTimeout(() => this.initScenes(), 400); return; }
    if (this._scenesInit) return;
    this._scenesInit = true;
    new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { this.playScenes(); o.disconnect(); } }), { threshold: .25 }).observe(root);
  }
  playScenes() {
    const inst = this.reduced;
    const at = (ms, fn) => inst ? fn() : setTimeout(fn, ms);
    document.querySelectorAll('[data-check]').forEach((el, i) => at(250 + i * 380, () => {
      el.style.background = 'var(--acc)'; el.style.borderColor = 'var(--acc)';
      const g = el.querySelector('svg'); if (g) g.style.opacity = '1';
      const bar = document.querySelector('[data-checkbar="' + i + '"]');
      if (bar) bar.style.background = '#c9d2e8';
    }));
    const lane = document.querySelector('[data-flylane]');
    const dist = lane ? Math.max(40, lane.getBoundingClientRect().width - 56) : 60;
    document.querySelectorAll('[data-fly]').forEach((el, i) => at(350 + i * 240, () => {
      el.style.opacity = '1';
      el.style.transform = 'translateX(' + dist + 'px)';
      setTimeout(() => { el.style.opacity = '0'; }, 820);
    }));
    const c = document.querySelector('[data-scount]');
    if (c) at(450, () => this.countUp(c, inst, +c.dataset.scount));
    const ring = document.querySelector('[data-ring]');
    if (ring) at(300, () => { ring.style.strokeDashoffset = '0'; });
    document.querySelectorAll('[data-avatar]').forEach((el, i) => at(400 + i * 150, () => { el.style.opacity = '1'; el.style.transform = 'scale(1)'; }));
    const flag = document.querySelector('[data-liveflag]');
    if (flag) at(1150, () => { flag.style.opacity = '1'; });
  }

  /* ---------- subtiele parallax op de mockups ---------- */
  initParallax() {
    if (this.reduced || this.motion === 'subtiel') return;
    const els = [...document.querySelectorAll('[data-parallax]')];
    if (!els.length) return;
    let ticking = false;
    const run = () => {
      ticking = false;
      const vh = window.innerHeight;
      els.forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        if (el.hasAttribute('data-reveal') && !el.hasAttribute('data-in')) return;
        const p = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.willChange = 'transform';
        el.style.transitionProperty = 'opacity';
        el.style.transform = 'translateY(' + (p * -18).toFixed(2) + 'px)';
      });
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } }, { passive: true });
  }

  /* ---------- deeltjes-"8" (sprite-based) ---------- */
  initParticles() {
    if (this.props.particles === false) return;
    const canvas = document.querySelector('[data-fx]');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const reduce = this.reduced;
    const soft = this.motion === 'subtiel';
    let W = 0, H = 0, cx = 0, cy = 0, scale = 0, scaleCss = 0, DPR = 1, N = 0, running = false, raf = 0, time = 0;
    let parts = [];
    const REF = 130, THICK = .22;
    const mouse = { x: -9999, y: -9999, active: false };
    const lem = (t) => { const s = Math.sin(t), c = Math.cos(t), d = 1 + s * s; return { x: scale * c / d, y: scale * 1.35 * c * s / d }; };
    const col = (mix, a) => { const r = (127 + (109 - 127) * mix) | 0, g = (224 + (140 - 224) * mix) | 0, b = (245 + (255 - 245) * mix) | 0; return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')'; };
    const makeParts = () => {
      parts = [];
      for (let i = 0; i < N; i++) parts.push({
        t: Math.random() * Math.PI * 2,
        speed: (.0016 + Math.random() * .0036) * (Math.random() < .5 ? 1 : -1) * (soft ? .6 : 1),
        offAng: Math.random() * Math.PI * 2, offR: Math.pow(Math.random(), 1.6),
        size: Math.random() * 1.5 + .5, mix: Math.random(), tw: Math.random() * Math.PI * 2
      });
    };
    const setup = () => {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      W = canvas.width = Math.max(1, Math.round(rect.width * DPR));
      H = canvas.height = Math.max(1, Math.round(rect.height * DPR));
      cx = W / 2; cy = H / 2;
      scale = Math.min(W * .33, H * .82); scaleCss = scale / DPR;
      const want = Math.max(900, Math.min(2600, Math.round(scaleCss * 7)));
      if (!parts.length || Math.abs(want - N) > 150) { N = want; makeParts(); }
    };
    const place = (p) => { const b = lem(p.t), th = p.offR * scale * THICK; return { x: cx + b.x + Math.cos(p.offAng) * th, y: cy + b.y + Math.sin(p.offAng) * th }; };
    const paint = (moving) => {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      const sf = REF / scaleCss;
      const psz = DPR * Math.min(2.4, Math.max(1, Math.sqrt(scaleCss / REF)));
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (moving) p.t += p.speed * sf;
        let { x, y } = place(p);
        if (mouse.active) { const dx = x - mouse.x, dy = y - mouse.y, d2 = dx * dx + dy * dy, R = 95 * DPR; if (d2 < R * R) { const d = Math.sqrt(d2) || 1, f = (1 - d / R) * 20 * DPR; x += dx / d * f; y += dy / d * f; } }
        const a = moving ? .12 + .5 * (.5 + .5 * Math.sin(time * .03 + p.tw)) : .5;
        ctx.beginPath(); ctx.arc(x, y, p.size * psz, 0, 6.2832); ctx.fillStyle = col(p.mix, a); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    };
    const draw = () => { time++; paint(true); raf = requestAnimationFrame(draw); };
    const start = () => { if (running) return; running = true; if (reduce) paint(false); else raf = requestAnimationFrame(draw); };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    setup();
    new IntersectionObserver((es) => es.forEach(e => e.isIntersecting ? start() : stop()), { threshold: .01 }).observe(canvas);
    let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { setup(); if (reduce) paint(false); }, 150); }, { passive: true });
    if (window.innerWidth >= 700 && !reduce) {
      canvas.addEventListener('pointermove', (e) => { const r = canvas.getBoundingClientRect(); mouse.x = (e.clientX - r.left) * DPR; mouse.y = (e.clientY - r.top) * DPR; mouse.active = true; });
      canvas.addEventListener('pointerleave', () => { mouse.active = false; mouse.x = mouse.y = -9999; });
    }
  }
}


/* ── Eigen vervanging voor het framework ────────────────────────────────────
   setState past de toestand aan en werkt daarna precies die stukjes DOM bij die
   ervan afhangen. Dat zijn er vijf: de twee tabbladen, de cirkel "Voor wie", de
   vragenlijst, de prijsindicatie en het contactformulier. */
const SJABLONEN = {
  "sats": [
    {
      "alias": "s",
      "body": "\n          <div data-doe-mouseenter=\"{{ s.hover }}\" data-doe-click=\"{{ s.hover }}\" style=\"display:flex;align-items:flex-start;gap:14px;padding:15px 17px;border-radius:13px;transition:background .45s ease,border-color .45s ease,box-shadow .45s ease;border:1px solid {{ s.rowBd }};background:{{ s.rowBg }};box-shadow:{{ s.rowSh }}\">\n            <span style=\"width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:background .45s ease,color .45s ease;background:{{ s.iconBg }};color:{{ s.iconFg }}\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"width:18px;height:18px\"><path d=\"{{ s.d }}\"></path></svg></span>\n            <div><div style=\"font-size:15.5px;font-weight:600;letter-spacing:-.015em;line-height:1.3\">{{ s.t }}</div><div style=\"font-size:14px;line-height:1.5;color:#5f6572;margin-top:3px;text-wrap:pretty\">{{ s.p }}</div></div>\n          </div>\n        "
    },
    {
      "alias": "s",
      "body": "\n          <div style=\"position:absolute;top:50%;left:50%;width:0;height:0;transform:rotate({{ s.rot }}deg)\">\n            <div data-satarm=\"1\" style=\"transform:translateX(150px)\">\n              <div style=\"transform:rotate({{ s.antirot }}deg)\">\n                <div data-loop=\"1\" style=\"animation:vwOrbit 120s linear infinite reverse\">\n                  <div data-satchip=\"1\" data-doe-mouseenter=\"{{ s.hover }}\" title=\"{{ s.t }}\" aria-label=\"{{ s.t }}\" style=\"position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background .45s ease,border-color .45s ease,box-shadow .45s ease,scale .5s cubic-bezier(.2,.9,.3,1);background:{{ s.chipBg }};border:1px solid {{ s.chipBd }};box-shadow:{{ s.chipSh }};scale:{{ s.chipScale }}\">\n                    <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\" style=\"width:26px;height:26px;transition:color .45s ease;color:{{ s.chipIconFg }}\"><path d=\"{{ s.d }}\"></path></svg>\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        "
    }
  ],
  "tabFeats": [
    { "alias": "f", "body": "\n          <li style=\"position:relative;padding-left:24px;font-size:15px;color:#a8aec0;line-height:1.5\">{{ f }}<span style=\"position:absolute;left:0;top:8px;width:8px;height:8px;border-radius:50%;background:var(--acc);box-shadow:0 0 8px rgba(79,110,245,.5)\"></span></li>\n        " }
  ],
  "faqs": [
    {
      "alias": "q",
      "body": "\n        <div style=\"background:#fff;border:1px solid {{ q.bd }};border-radius:13px;overflow:hidden;transition:border-color .25s ease,box-shadow .25s ease;box-shadow:{{ q.sh }}\">\n          <button data-doe-click=\"{{ q.toggle }}\" aria-expanded=\"{{ q.expanded }}\" style=\"width:100%;display:flex;align-items:center;gap:14px;padding:17px 19px;background:transparent;border:none;cursor:pointer;font-family:inherit;text-align:left\">\n            <span style=\"flex:1;font-size:15.5px;font-weight:600;letter-spacing:-.015em;color:#0d0f14\">{{ q.q }}</span>\n            <span style=\"flex-shrink:0;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background .25s ease,color .25s ease,rotate .3s cubic-bezier(.2,.8,.3,1);background:{{ q.iconBg }};color:{{ q.iconFg }};rotate:{{ q.rot }}\">\n              <svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" style=\"width:13px;height:13px\"><path d=\"M6 9l6 6 6-6\"></path></svg>\n            </span>\n          </button>\n          <div style=\"overflow:hidden;transition:grid-template-rows .35s cubic-bezier(.2,.8,.3,1);display:grid;grid-template-rows:{{ q.rows }}\">\n            <div style=\"min-height:0\"><p style=\"padding:0 19px 18px;font-size:14.5px;line-height:1.6;color:#5f6572;text-wrap:pretty\">{{ q.a }}</p></div>\n          </div>\n        </div>\n      "
    }
  ]
};

Site.prototype.setState = function (veranderd) {
  Object.assign(this.state, veranderd);
  this.pas();
  this.componentDidUpdate();
};

/* Vult {{ }} in een sjabloon, met dezelfde regels als bij het omzetten. */
Site.prototype.vul = function (sjabloon, alias, item, i) {
  return sjabloon.replace(/\{\{\s*([a-zA-Z0-9_.]+)\s*\}\}/g, function (heel, uitdr) {
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
   In de export deed submit alleen `preventDefault` en "bedankt" tonen: elke
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
