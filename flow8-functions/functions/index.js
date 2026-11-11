// Flow8 — verstuurMail Cloud Function
// Verstuurt mails direct via Resend, met optionele PDF-bijlage.
// Kent daarnaast een preview-modus (`preview: true` in de payload): die bouwt alleen de
// huisstijl-HTML op en geeft die terug, zonder te versturen of te loggen. Zo kan de
// template-editor laten zien wat de klant krijgt zonder de wrapper na te bouwen.
// Beveiliging: alleen ingelogde Flow8-gebruikers met een geldig profiel;
// elke verzending wordt gelogd naar flow8/bedrijven/{bedrijfId}/mailLog.

const { onRequest } = require('firebase-functions/v2/https');
const { onValueWritten } = require('firebase-functions/v2/database');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { defineSecret, defineString } = require('firebase-functions/params');
const admin = require('firebase-admin');

admin.initializeApp();

const RESEND_API_KEY = defineSecret('RESEND_API_KEY');
// Afzender — moet een geverifieerd domein in Resend zijn. Instellen via .env (zie README).
const MAIL_FROM = defineString('MAIL_FROM', { default: 'Flow8 <werkplaats@voorbeeld.nl>' });

const MAX_ONTVANGERS = 10;
const MAX_BIJLAGE_BYTES = 15 * 1024 * 1024; // 15 MB (base64-lengte benadering)

// ─────────────────────────────────────────────────────────────────────────────
// Flow8 — HTML-mailwrapper voor verstuurMail
//
// Deze helper hoort BOVEN de verstuurMail-functie in index.js (na de const-regels
// en admin.initializeApp(), vóór "exports.verstuurMail = ...").
//
// bouwMailHtml() zet een platte-tekst-body om naar een nette huisstijl-mail:
//  - header met logo (of bedrijfsnaam als tekst-fallback) + accentkleur
//  - body: gewone regels → alinea's; aaneengesloten "Label: waarde"-regels → net
//    uitgelijnd gegevensblok
//  - footer met bedrijfsgegevens
// Alle door de gebruiker aangeleverde tekst wordt ge-escaped (HTML-veilig).
// ─────────────────────────────────────────────────────────────────────────────

const MAIL_ACCENT_DEFAULT = '#1c3d5a'; // terugval als een bedrijf geen kleur heeft ingesteld

// Witte of donkere tekst, afhankelijk van hoe licht de achtergrondkleur is (WCAG-benadering).
function _leesbareTekst(hex) {
  let h = String(hex || '').replace('#', '');
  if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  if (h.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(h)) return '#ffffff';
  const r = parseInt(h.substr(0,2),16), g = parseInt(h.substr(2,2),16), b = parseInt(h.substr(4,2),16);
  const lum = (0.299*r + 0.587*g + 0.114*b) / 255;
  return lum > 0.6 ? '#16202e' : '#ffffff';
}

// Valideert een hex-kleur; valt terug op de standaard bij ongeldige invoer.
function _geldigeKleur(hex) {
  const h = String(hex || '').trim();
  return /^#[0-9a-fA-F]{6}$/.test(h) ? h : MAIL_ACCENT_DEFAULT;
}

// ── Kleuren afleiden van de accentkleur ────────────────────────────────────
// E-mail kent geen CSS-kleurfuncties, dus alles wordt hier server-side uitgerekend
// tot vaste hex-waarden.
function _hexNaarRgb(hex) {
  let h = String(hex || '').replace('#', '');
  if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  if (!/^[0-9a-fA-F]{6}$/.test(h)) h = MAIL_ACCENT_DEFAULT.replace('#', '');
  return [parseInt(h.substr(0,2),16), parseInt(h.substr(2,2),16), parseInt(h.substr(4,2),16)];
}
function _rgbNaarHex(r, g, b) {
  const f = (n) => ('0' + Math.max(0, Math.min(255, Math.round(n))).toString(16)).slice(-2);
  return '#' + f(r) + f(g) + f(b);
}
// Mengt de accentkleur met wit. deel = 0 geeft de kleur zelf, 1 geeft wit.
// Zo krijgt elk bedrijf een vlak en een randlijn in zijn eigen kleur, zonder dat het schreeuwt.
function _metWit(hex, deel) {
  const [r, g, b] = _hexNaarRgb(hex);
  return _rgbNaarHex(r + (255-r)*deel, g + (255-g)*deel, b + (255-b)*deel);
}
// Donkert de accentkleur af tot hij leesbaar is als tekst op wit. Nodig omdat een bedrijf
// een lichte kleur kan kiezen (geel, lichtgroen) — die is prima als vlak, maar onleesbaar
// als letterkleur. Tegenhanger van _leesbareTekst(), dat de andere kant op werkt.
function _tekstOpWit(hex) {
  let [r, g, b] = _hexNaarRgb(hex);
  let lum = (0.299*r + 0.587*g + 0.114*b) / 255;
  let ronde = 0;
  while (lum > 0.45 && ronde < 12) {
    r *= 0.85; g *= 0.85; b *= 0.85;
    lum = (0.299*r + 0.587*g + 0.114*b) / 255;
    ronde++;
  }
  return _rgbNaarHex(r, g, b);
}

// Tekst die in een mailheader belandt: regeleindes en aanhalingstekens eruit.
// Zonder dit kan een bedrijfsnaam met een regeleinde er een extra header (bijv. bcc)
// achteraan plakken — de naam komt uit de database en is dus niet per definitie braaf.
function _headerVeilig(tekst) {
  return String(tekst == null ? '' : tekst)
    .replace(/[\r\n\t]+/g, ' ')
    .replace(/["<>]/g, '')
    .trim()
    .slice(0, 78);
}

// Afzender: het ADRES komt uit MAIL_FROM (het geverifieerde domein), de NAAM ervoor
// uit de bedrijfsgegevens. Zo leest de ontvanger "Homa Pompen B.V." in plaats van Flow8,
// terwijl er maar één domein geverifieerd hoeft te zijn. De naam staat tussen
// aanhalingstekens, want punten en komma's (B.V.) horen in een display-name geciteerd.
function _mailAfzender(bedrijf) {
  const basis = String(MAIL_FROM.value() || '').trim();
  const gevonden = basis.match(/<([^>]+)>\s*$/);
  const adres = (gevonden ? gevonden[1] : basis).trim();
  const naam = _headerVeilig((bedrijf || {}).naam);
  if (!naam || !adres) return basis;
  return '"' + naam + '" <' + adres + '>';
}

// Antwoordadres: het algemene adres van het bedrijf, met de verzender als terugval.
// Zonder reply_to komt een antwoord van een klant op het Flow8-adres terecht en dus
// nergens. Alleen een adres dat er als adres uitziet wordt doorgegeven.
function _mailAntwoordAdres(bedrijf, verzenderEmail) {
  const kandidaten = [(bedrijf || {}).email, verzenderEmail];
  for (const kandidaat of kandidaten) {
    const adres = String(kandidaat == null ? '' : kandidaat).replace(/[\r\n\t]+/g, '').trim();
    if (/^[^\s@,;<>]+@[^\s@,;<>]+\.[a-zA-Z]{2,}$/.test(adres)) return adres;
  }
  return null;
}

function _esc(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Inline-opmaak binnen een regel: eerst escapen (veilig), dan de opmaaktekens
// omzetten naar HTML. Volgorde is bewust: escapen kan nooit door opmaak omzeild
// worden, dus een klant kan via een template geen rauwe HTML injecteren.
//   **vet**        → <strong>
//   *cursief*      → <em>
//   [tekst](url)   → <a href> (alleen http/https/mailto/tel toegestaan)
function _inline(str, linkKleur) {
  const _lk = linkKleur || _tekstOpWit(MAIL_ACCENT_DEFAULT);
  let h = _esc(str);
  // Links eerst (voordat * / ** de haakjesinhoud raken). URL wordt gevalideerd.
  h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(_, tekst, url){
    const schoon = String(url).trim();
    if (!/^(https?:\/\/|mailto:|tel:)/i.test(schoon)) return tekst; // onveilig → alleen de tekst
    return '<a href="' + schoon.replace(/"/g,'%22') + '" style="color:' + _lk + ';font-weight:600;text-decoration:underline;">' + tekst + '</a>';
  });
  // Vet vóór cursief (** moet niet als twee losse * gezien worden)
  h = h.replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#16202e;">$1</strong>');
  h = h.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return h;
}

// Zet de platte-tekst-body om naar HTML-blokken.
// Regels van de vorm "Label: waarde" die direct op elkaar volgen, worden samen
// als één uitgelijnd gegevensblok gerenderd. Overige tekst wordt alinea's.
// `accent` is de huisstijlkleur van het bedrijf. Stond hiervoor niet in deze functie,
// waardoor alles onder de header vastzat op grijsblauw en de mail in twee helften uiteenviel:
// een gekleurde kop en een neutrale rest.
function _bodyNaarHtml(body, accent) {
  const kl = _geldigeKleur(accent);
  const klTekst  = _tekstOpWit(kl);      // leesbaar als letterkleur op wit
  const klVlak   = _metWit(kl, 0.94);    // zachte achtergrond voor het gegevensblok
  const klRand   = _metWit(kl, 0.80);    // randlijn eromheen
  const klLijn   = _metWit(kl, 0.86);    // scheidingslijntjes binnen het blok
  const regels = String(body || '').replace(/\r\n/g, '\n').split('\n');
  let html = '';
  let i = 0;

  // Een regel telt als "label:waarde" als hij begint met wat woorden, dan een
  // dubbele punt, dan (na spaties) een niet-lege waarde. Niet als de dubbele punt
  // aan het eind staat (dan is het een kop, bijv. "Werkzaamheden:").
  const labelRe = /^([A-Za-zÀ-ÿ0-9 .\/'-]{2,40}):\s*(\S.*)$/;

  // Een kale URL matcht het label-patroon ook: 'https' + dubbele punt + '//www...'.
  // Dat leverde een gegevensrij op met "HTTPS" als label. In markdown-vorm,
  // [tekst](https://...), gaat het wel goed — die wordt eerder afgevangen door _inline.
  function _isGegevensRegel(r) {
    const mm = String(r).match(labelRe);
    if (!mm) return false;
    return !/^(https?|mailto|tel|ftp)$/i.test(mm[1].trim());
  }

  // Begint op deze positie een gegevensblok? Zowel de blok-tak als de alinea-lus hieronder
  // gebruiken deze ene controle. Toen die twee uit elkaar liepen — de blok-tak eiste twee
  // regels, de alinea-lus weigerde nog elke label-regel — viel een losse "Let op:"-regel
  // tussen wal en schip: geen blok, geen alinea, en de teller schoof niet op. Dat is een
  // oneindige lus, en in een Cloud Function een vastloper.
  function _startBlok(idx) {
    return idx + 1 < regels.length && _isGegevensRegel(regels[idx]) && _isGegevensRegel(regels[idx + 1]);
  }

  while (i < regels.length) {
    const regel = regels[i];

    // Lege regel → verticale ruimte (sla dubbele lege regels samen)
    if (regel.trim() === '') { i++; continue; }

    // Kop:  "# Tekst"  → tussentitel
    if (/^#\s+/.test(regel)) {
      html += '<div style="font-size:16px;font-weight:800;color:#16202e;margin:24px 0 8px;">'
           +  _inline(regel.replace(/^#\s+/, ''), klTekst) + '</div>';
      i++;
      continue;
    }

    // Lijst:  regels die met "- " beginnen  → opsomming
    if (/^-\s+/.test(regel)) {
      const items = [];
      while (i < regels.length && /^-\s+/.test(regels[i])) {
        items.push(regels[i].replace(/^-\s+/, ''));
        i++;
      }
      html += '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 18px;"><tbody>';
      items.forEach(function(it){
        html += '<tr><td style="vertical-align:top;padding:0 10px 8px 0;color:' + klTekst + ';font-weight:800;font-size:15px;line-height:1.6;">&bull;</td>'
             +  '<td style="vertical-align:top;padding:0 0 8px;font-size:15px;line-height:1.6;color:#3a4453;">' + _inline(it, klTekst) + '</td></tr>';
      });
      html += '</tbody></table>';
      continue;
    }

    // Start van een gegevensblok? Pas vanaf TWEE opeenvolgende regels. Een echt blok heeft
    // altijd meerdere rijen (Datum, Tijdstip, Adres...), terwijl een losse zin als
    // "Let op: de installatie moet bereikbaar zijn" of "Bel ons op: 0183 - 123456" ook aan
    // het patroon voldoet maar gewoon een zin is. Die viel hiervoor in een gegevensblok.
    // Zo hoeft er geen lijst met toegestane labels te worden bijgehouden, en blijft het
    // uitlegbaar: twee onder elkaar is een blok, één is een zin.
    if (_startBlok(i)) {
      const rijen = [];
      while (i < regels.length && _isGegevensRegel(regels[i])) {
        const m = regels[i].match(labelRe);
        rijen.push({ label: m[1].trim(), waarde: m[2].trim() });
        i++;
      }
      // Gestapeld: label klein bovenaan, waarde op volle breedte eronder. Werkt
      // betrouwbaar op elk toestel (geen media-query nodig, die stript Gmail toch)
      // en voorkomt dat lange waarden (adres, werkomschrijving) in een smalle kolom
      // worden geperst.
      html += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:' + klVlak + ';border:1px solid ' + klRand + ';border-left:4px solid ' + klTekst + ';border-radius:12px;margin:4px 0 24px;"><tr><td style="padding:20px 22px;">';
      rijen.forEach(function(r, idx){
        if (idx > 0) html += '<div style="height:1px;background:' + klLijn + ';margin:14px 0;"></div>';
        html += '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:#5a6575;font-weight:700;">' + _esc(r.label) + '</div>';
        html += '<div style="font-size:15px;color:#16202e;font-weight:600;margin-top:3px;line-height:1.45;">' + _inline(r.waarde, klTekst) + '</div>';
      });
      html += '</td></tr></table>';
      continue;
    }

    // Anders: gewone alinea (verzamel opeenvolgende niet-lege regels die geen
    // label, kop of lijst zijn)
    const alinea = [];
    while (i < regels.length && regels[i].trim() !== '' && !_startBlok(i)
           && !/^#\s+/.test(regels[i]) && !/^-\s+/.test(regels[i])) {
      alinea.push(_inline(regels[i], klTekst));
      i++;
    }
    html += '<p style="margin:0 0 20px;font-size:15px;line-height:1.72;color:#3a4453;">'
         +  alinea.join('<br>') + '</p>';
  }

  return html;
}

// Bouw de volledige HTML-mail. `gegevens` = bedrijfsgegevens (naam, logo, adres,
// postcode, plaats, telefoon, email). `label` = kort woord rechtsboven (optioneel).
function bouwMailHtml(gegevens, onderwerp, bodyTekst, label) {
  const g = gegevens || {};
  const naam = _esc(g.naam || 'Flow8');
  const accent = _geldigeKleur(g.mailKleur);
  const headerTekst = _leesbareTekst(accent);

  // Header: alleen de bedrijfsnaam in lichte tekst op de accentkleur (geen wit
  // logoblok meer — dat stak af). Het logo staat in de footer op wit.
  const merk = '<span style="font-size:20px;font-weight:800;color:' + headerTekst + ';letter-spacing:-.3px;">' + naam + '</span>';
  // Logo voor de footer (alleen als er een publieke URL is). Weergave binnen
  // 220x64px met behoud van verhouding. De afmetingen meet de app bij het uploaden;
  // expliciete width/height zijn nodig voor Outlook (Windows), dat max-width negeert.
  // Zonder afmetingen (oud logo, SVG): de oude, begrensde weergave.
  const lb = Number(g.logoBreedte) || 0, lh = Number(g.logoHoogte) || 0;
  let logoB = 0, logoH = 0;
  if (lb > 0 && lh > 0) {
    logoH = 64; logoB = Math.round(lb * 64 / lh);
    if (logoB > 220) { logoB = 220; logoH = Math.max(1, Math.round(lh * 220 / lb)); }
  }
  const logoFooter = (g.logo && /^https?:\/\//.test(g.logo))
    ? (logoB
        ? '<img src="' + _esc(g.logo) + '" alt="' + naam + '" width="' + logoB + '" height="' + logoH + '" style="width:' + logoB + 'px;height:auto;max-width:100%;display:block;border:0;">'
        : '<img src="' + _esc(g.logo) + '" alt="' + naam + '" style="max-height:64px;max-width:200px;width:auto;height:auto;display:block;">')
    : '';

  // Footer-regel met contactgegevens (alleen tonen wat bestaat)
  const adresregel = [g.adres, [g.postcode, g.plaats].filter(Boolean).join(' ')].filter(Boolean).join(' · ');
  const contactregel = [g.telefoon, g.email, g.website].filter(Boolean).map(_esc).join(' · ');

  const labelHtml = label
    ? '<span style="font-size:12px;color:' + headerTekst + ';opacity:.75;font-weight:600;text-transform:uppercase;letter-spacing:1.2px;">' + _esc(label) + '</span>'
    : '';

  return '' +
'<!DOCTYPE html><html lang="nl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>' +
'<body style="margin:0;background:#e9ecf1;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,Helvetica,Arial,sans-serif;">' +
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e9ecf1;"><tr><td align="center" style="padding:36px 12px;">' +
'<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 4px rgba(20,30,50,.08);">' +
// header
'<tr><td style="background:' + accent + ';padding:28px 32px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>' +
'<td style="vertical-align:middle;">' + merk + '</td>' +
'<td align="right" style="vertical-align:middle;">' + labelHtml + '</td>' +
'</tr></table></td></tr>' +
// titel
'<tr><td style="padding:36px 32px 8px;"><h1 style="margin:0;font-size:18px;line-height:1.35;color:#16202e;font-weight:700;letter-spacing:-.2px;">' + _esc(onderwerp) + '</h1></td></tr>' +
// body
'<tr><td style="padding:22px 32px 8px;">' + _bodyNaarHtml(bodyTekst, accent) + '</td></tr>' +
// Logo in het witte deel, onder de ondertekening (als er een publieke URL is).
(logoFooter ? '<tr><td style="padding:6px 32px 0;">' + logoFooter + '</td></tr>' : '') +
'<tr><td style="padding:20px 32px 0;"></td></tr>' +
// footer
'<tr><td style="background:' + _metWit(accent, 0.94) + ';padding:26px 32px;border-top:1px solid ' + _metWit(accent, 0.80) + ';">' +
'<div style="font-size:13px;font-weight:700;color:#16202e;">' + naam + '</div>' +
(adresregel ? '<div style="font-size:12px;color:#5a6575;margin-top:3px;line-height:1.5;">' + _esc(adresregel) + '</div>' : '') +
(contactregel ? '<div style="font-size:12px;color:#5a6575;margin-top:2px;line-height:1.5;">' + contactregel + '</div>' : '') +
'</td></tr>' +
'</table>' +
'<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;"><tr><td align="center" style="padding:14px 20px;">' +
'<span style="font-size:11px;color:#5a6575;">Deze e-mail is verstuurd via Flow8 namens ' + naam + '.</span>' +
'</td></tr></table>' +
'</td></tr></table></body></html>';
}

exports.verstuurMail = onRequest(
  { region: 'europe-west1', secrets: [RESEND_API_KEY], cors: true, memory: '256MiB', timeoutSeconds: 60 },
  async (req, res) => {
    try {
      if (req.method !== 'POST') { res.status(405).json({ error: 'Alleen POST toegestaan' }); return; }

      // ── 1. Authenticatie: Firebase ID-token verifiëren ──
      const authHeader = req.headers.authorization || '';
      const m = authHeader.match(/^Bearer (.+)$/);
      if (!m) { res.status(401).json({ error: 'Geen autorisatie-token' }); return; }
      const decoded = await admin.auth().verifyIdToken(m[1]);

      // ── 2. Autorisatie: alleen gebruikers met een Flow8-profiel + bedrijf ──
      const profSnap = await admin.database().ref('flow8/gebruikers/' + decoded.uid).get();
      if (!profSnap.exists()) { res.status(403).json({ error: 'Geen Flow8-profiel gevonden' }); return; }
      const profiel = profSnap.val();
      const bedrijfId = profiel.bedrijfId;
      if (!bedrijfId) { res.status(403).json({ error: 'Geen bedrijf gekoppeld aan profiel' }); return; }
      // Gedeactiveerd account met een nog geldig token mag niet meer mailen.
      if (profiel.actief !== true) { res.status(403).json({ error: 'Account is niet actief' }); return; }

      // ── 2b. Preview: alleen de HTML opbouwen en teruggeven ──
      // Bewust ná de authenticatie en de actief-check: de huisstijl en de bedrijfsgegevens
      // zijn bedrijfsgebonden. Bewust vóór de ontvanger-validatie: bij een preview zijn er
      // geen ontvangers. Raakt Resend niet aan, gebruikt de API-sleutel niet en schrijft
      // niets naar mailLog — het is puur opmaak teruggeven.
      // Hierdoor bestaat de wrapper maar één keer: zou de app hem nabouwen voor een preview,
      // dan lopen die twee na verloop van tijd uiteen en toont de preview iets anders dan
      // de klant ontvangt.
      if (req.body && req.body.preview === true) {
        const bgSnapPrev = await admin.database().ref('flow8/bedrijven/' + bedrijfId + '/instellingen/bedrijf').get();
        const bedrijfPrev = bgSnapPrev.exists() ? (bgSnapPrev.val() || {}) : {};
        const onderwerpPrev = String((req.body.onderwerp) || '').slice(0, 300);
        const bodyPrev = String((req.body.body) || '');
        res.json({
          ok: true,
          preview: true,
          html: bouwMailHtml(bedrijfPrev, onderwerpPrev, bodyPrev),
          van: _mailAfzender(bedrijfPrev),
          replyTo: _mailAntwoordAdres(bedrijfPrev, profiel.email || decoded.email) || null,
        });
        return;
      }

      // ── 3. Payload valideren ──
      const { aan, cc, onderwerp, body, bijlage, ref } = req.body || {};
      if (!Array.isArray(aan) || !aan.length) { res.status(400).json({ error: 'Geen ontvanger opgegeven' }); return; }
      const totaal = aan.length + (Array.isArray(cc) ? cc.length : 0);
      if (totaal > MAX_ONTVANGERS) { res.status(400).json({ error: 'Te veel ontvangers (max ' + MAX_ONTVANGERS + ')' }); return; }
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const ongeldig = aan.concat(Array.isArray(cc) ? cc : []).find((a) => !emailRe.test(String(a)));
      if (ongeldig) { res.status(400).json({ error: 'Ongeldig e-mailadres: ' + ongeldig }); return; }
      if (bijlage && bijlage.inhoudBase64 && bijlage.inhoudBase64.length > MAX_BIJLAGE_BYTES) {
        res.status(400).json({ error: 'Bijlage te groot (max 15 MB)' }); return;
      }

      // ── 4. Versturen via Resend ──
      // Naast de platte tekst (text, als fallback) ook een HTML-versie met de Flow8-huisstijl.
      // De bedrijfsgegevens komen van de server, niet uit de payload: anders kan een ingelogde
      // gebruiker via de console een mail opmaken namens een ander bedrijf.
      const bgSnap = await admin.database().ref('flow8/bedrijven/' + bedrijfId + '/instellingen/bedrijf').get();
      const bedrijf = bgSnap.exists() ? (bgSnap.val() || {}) : {};
      const onderwerpStr = String(onderwerp || '').slice(0, 300);
      const bodyStr = String(body || '');
      const payload = {
        from: _mailAfzender(bedrijf),
        to: aan,
        subject: onderwerpStr,
        text: bodyStr,
        html: bouwMailHtml(bedrijf, onderwerpStr, bodyStr),
      };
      const antwoordAdres = _mailAntwoordAdres(bedrijf, profiel.email || decoded.email);
      if (antwoordAdres) payload.reply_to = antwoordAdres;
      if (Array.isArray(cc) && cc.length) payload.cc = cc;
      if (bijlage && bijlage.inhoudBase64) {
        payload.attachments = [{ filename: bijlage.bestandsnaam || 'bijlage.pdf', content: bijlage.inhoudBase64 }];
      }

      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + RESEND_API_KEY.value(), 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        res.status(502).json({ error: 'Resend: ' + (data.message || ('HTTP ' + resp.status)) });
        return;
      }

      // ── 5. Loggen naar mailLog van het bedrijf ──
      await admin.database().ref('flow8/bedrijven/' + bedrijfId + '/mailLog').push({
        aan,
        cc: Array.isArray(cc) && cc.length ? cc : null,
        onderwerp: payload.subject,
        bijlage: bijlage ? (bijlage.bestandsnaam || true) : null,
        ref: ref || null,
        door: decoded.uid,
        doorNaam: profiel.naam || decoded.email || '',
        op: admin.database.ServerValue.TIMESTAMP,
        resendId: data.id || null,
      });

      res.json({ ok: true, id: data.id || null });
    } catch (e) {
      const boodschap = (e && e.code === 'auth/id-token-expired') ? 'Sessie verlopen — log opnieuw in' : (e.message || 'Onbekende fout');
      res.status(500).json({ error: boodschap });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Flow8 — zetGebruikersClaim Cloud Function (v5: rch-object + platte RTDB-claims)
//
// Zet op het auth-token:
//   bedrijfId, rol, actief, medId
//   rch : compact rechten-object per module ('s'/'e'/'g') — voor FIRESTORE-rules,
//         die in geneste objecten kunnen kijken (werkbonnen, later werkorders).
//   platte per-module claims voor RTDB-rules, die GEEN geneste objecten kunnen
//   lezen — alleen primitieve waarden. Daarom staan de RTDB-modules óók als losse
//   top-level strings op het token:
//     ouRecht (overuren), okRecht (onkosten), vlRecht (verlof), vzRecht (verzuim)
//   met dezelfde 's'/'e'/'g'-codering.
//   vzInzage : apart van vzRecht, want inzage in verzuim is een EIGEN recht in de
//         rechtenmatrix (het vinkje 'I' = rechten.verzuim.inzageAlle). Verzuimdossiers
//         bevatten bijzondere persoonsgegevens, dus lees- of schrijfrecht geeft hier
//         bewust géén inzage in andermans dossier — alleen 'I' doet dat. 'a' = alle
//         dossiers, 'g' = geen. Spiegelt magVerzuimInzageAlle() in de app; die twee
//         moeten exact hetzelfde zeggen, anders krijg je lege schermen of geweigerde
//         acties die niemand kan verklaren.
//
// Waarom hybride: Firestore-rules kunnen token.rch.werkbonnen lezen; RTDB-rules
// kunnen dat NIET (geen geneste claim-toegang), maar wel token.ouRecht. Zo werkt
// elke database met wat hij aankan.
//
// DIT BLOK VERVANGT de vorige zetGebruikersClaim VOLLEDIG.
// admin.initializeApp() staat bovenaan al — NIET nog een keer toevoegen.
// ─────────────────────────────────────────────────────────────────────────────

// Claims van één account, uit het profiel in de RTDB (bron van waarheid). Gedeeld door zetGebruikersClaim
// (bij inloggen) en licZetClaims (de server zet ze meteen opnieuw na een wijziging).
async function berekenClaims(uid, tokenEmail) {
  // 2. Eigen profiel lezen uit de RTDB (bron van waarheid)
  const profSnap = await admin.database().ref('flow8/gebruikers/' + uid).get();
  if (!profSnap.exists()) return { fout: 403, error: 'Geen Flow8-profiel gevonden' };
  const profiel = profSnap.val();
  const bedrijfId = profiel.bedrijfId;
  const rol = profiel.rol || null;
  const actief = profiel.actief === true;
  const email = (profiel.email || tokenEmail || '').toLowerCase();
  if (!bedrijfId) return { fout: 403, error: 'Geen bedrijf gekoppeld aan profiel' };

  // 3. medId opzoeken (email → medewerker), zelfde logica als getMijnMedId
  let medId = null;
  if (email) {
    const medSnap = await admin.database()
      .ref('flow8/bedrijven/' + bedrijfId + '/medewerkers').get();
    if (medSnap.exists()) {
      const meds = medSnap.val() || {};
      for (const sleutel of Object.keys(meds)) {
        const med = meds[sleutel] || {};
        const medEmail = (med.email || '').toLowerCase();
        if (medEmail && medEmail === email) {
          medId = (med.id != null) ? String(med.id) : String(sleutel);
          break;
        }
      }
    }
  }

  // 4. Rechten afleiden uit de rollenmatrix → per module 's'/'e'/'g'
  function letterVoor(r, isAdmin) {
    r = r || {};
    if (isAdmin || r.schrijven === true || r.beheren === true) return 's';
    if (r.eigen === true) return 'e';
    return 'g';
  }

  const rch = {};
  let ouRecht = 'g', okRecht = 'g', vlRecht = 'g', vzRecht = 'g';
  let vzInzage = 'g';
  if (rol) {
    const rolSnap = await admin.database()
      .ref('flow8/bedrijven/' + bedrijfId + '/rollen/' + rol + '/rechten').get();
    const rechten = rolSnap.exists() ? (rolSnap.val() || {}) : {};
    const isAdmin = (rol === 'admin');

    // rch (Firestore): alle modules in de matrix
    Object.keys(rechten).forEach(function(mod){
      rch[mod] = letterVoor(rechten[mod], isAdmin);
    });
    if (isAdmin) {
      ['werkbonnen','werkorders','overuren','onkosten','verlof','verzuim',
       'medewerkers','planning','agenda','serviceklanten','debiteuren','instellingen']
        .forEach(function(mod){ rch[mod] = 's'; });
    }

    // Platte RTDB-claims: de vier submodules apart
    ouRecht = isAdmin ? 's' : letterVoor(rechten.overuren, false);
    okRecht = isAdmin ? 's' : letterVoor(rechten.onkosten, false);
    vlRecht = isAdmin ? 's' : letterVoor(rechten.verlof, false);
    vzRecht = isAdmin ? 's' : letterVoor(rechten.verzuim, false);

    // Inzage in verzuim staat los van schrijfrecht: alleen admin of het vinkje 'I'.
    // Zelfde formule als magVerzuimInzageAlle() in de app.
    vzInzage = (isAdmin || (rechten.verzuim && rechten.verzuim.inzageAlle === true)) ? 'a' : 'g';
  }

  // lic: de soort licentie ('werkbon'/'kantoor'), alleen als het bedrijf een abonnement heeft. Zonder abonnement
  // of voor platformbeheer geen lic: dan geldt er straks ook geen beperking (licentiemanager fase 2).
  let lic = null;
  if (profiel.platformBeheer !== true
      && (await admin.database().ref('flow8/licenties/' + bedrijfId + '/abonnement').get()).exists()) {
    lic = licSoort(profiel);
  }
  const claims = { bedrijfId, rol, actief, medId, rch, ouRecht, okRecht, vlRecht, vzRecht, vzInzage };
  if (lic) claims.lic = lic;
  return { claims };
}
// Zelfde claims als nu op het token? Dan hoeft er niets te gebeuren.
function claimsGelijk(oud, c) {
  oud = oud || {};
  return (oud.bedrijfId || null) === c.bedrijfId &&
    (oud.rol || null) === c.rol &&
    (oud.actief === true) === c.actief &&
    (oud.medId || null) === c.medId &&
    JSON.stringify(oud.rch || {}) === JSON.stringify(c.rch) &&
    (oud.ouRecht || 'g') === c.ouRecht &&
    (oud.okRecht || 'g') === c.okRecht &&
    (oud.vlRecht || 'g') === c.vlRecht &&
    (oud.vzRecht || 'g') === c.vzRecht &&
    (oud.vzInzage || 'g') === c.vzInzage &&
    (oud.lic || null) === (c.lic || null);
}

exports.zetGebruikersClaim = onRequest(
  { region: 'europe-west1', cors: true, memory: '256MiB', timeoutSeconds: 30 },
  async (req, res) => {
    try {
      if (req.method !== 'POST') { res.status(405).json({ error: 'Alleen POST toegestaan' }); return; }

      // 1. Token verifiëren
      const authHeader = req.headers.authorization || '';
      const m = authHeader.match(/^Bearer (.+)$/);
      if (!m) { res.status(401).json({ error: 'Geen autorisatie-token' }); return; }
      const decoded = await admin.auth().verifyIdToken(m[1]);

      // 2. Claims berekenen (profiel, medewerker, rechten, licentie)
      const r = await berekenClaims(decoded.uid, decoded.email);
      if (r.fout) { res.status(r.fout).json({ error: r.error }); return; }

      // 3. Idempotent: alleen zetten als er iets verandert
      if (claimsGelijk(decoded, r.claims)) { res.json({ ok: true, gewijzigd: false, claim: r.claims }); return; }
      await admin.auth().setCustomUserClaims(decoded.uid, r.claims);
      res.json({ ok: true, gewijzigd: true, claim: r.claims });
    } catch (e) {
      const boodschap = (e && e.code === 'auth/id-token-expired')
        ? 'Sessie verlopen — log opnieuw in'
        : (e.message || 'Onbekende fout');
      res.status(500).json({ error: boodschap });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// demoAanvraag — het contactformulier van de marketingsite (flow-8.nl)
//
// Apart van verstuurMail, en dat is met opzet: verstuurMail eist een ingelogde
// Flow8-gebruiker. Die is er op de marketingsite niet. verstuurMail daarvoor
// openzetten zou er een open spamrelay van maken — iedereen zou er dan via jouw
// domein post mee kunnen versturen.
//
// Daarom staat hier een eigen, publieke functie met een smalle taak en vier sloten:
//   1. de ontvanger staat vást in de instellingen, nooit in het verzoek;
//   2. alleen de eigen domeinen mogen hem aanroepen (CORS-lijst);
//   3. een verborgen veld ("website") dat een mens leeg laat en een bot invult;
//   4. hoogstens vijf aanvragen per uur per afzender-IP.
//
// De aanvraag wordt éérst weggeschreven en dán gemaild. Gaat Resend onderuit,
// dan staat de lead nog steeds in de database in plaats van verloren te zijn.
// ─────────────────────────────────────────────────────────────────────────────

// Waar de aanvragen heen gaan. Via .env aanpasbaar zonder de code te wijzigen.
const DEMO_NAAR = defineString('DEMO_NAAR', { default: 'info@flow-8.nl' });

const DEMO_HERKOMST = [
  'https://flow-8.nl',
  'https://www.flow-8.nl',
  'http://localhost:8794',   // lokale preview tijdens het bouwen
  'http://localhost:8792',
];

const DEMO_VELDEN = {
  naam:     { verplicht: true,  max: 100 },
  bedrijf:  { verplicht: false, max: 100 },
  email:    { verplicht: true,  max: 160 },
  telefoon: { verplicht: false, max: 40 },
  omvang:   { verplicht: false, max: 40 },
  vraag:    { verplicht: false, max: 2000 },
};

function _demoSchoon(waarde, max) {
  return String(waarde == null ? '' : waarde).replace(/\s+/g, ' ').trim().slice(0, max);
}

/* Hoogstens vijf aanvragen per uur per IP. Het IP zelf bewaren we niet: er gaat een
   hash overheen, zodat de teller werkt zonder dat er adressen in de database staan. */
async function _demoTeVaak(ip) {
  const sleutel = require('crypto').createHash('sha256').update('flow8:' + ip).digest('hex').slice(0, 24);
  const ref = admin.database().ref('flow8/demoAanvragen/teller/' + sleutel);
  const nu = Date.now(), uur = 60 * 60 * 1000;

  // Een transactie, geen lees-dan-schrijf: twee aanvragen die tegelijk binnenkomen
  // zouden anders allebei langs de teller glippen.
  const uitkomst = await ref.transaction((huidig) => {
    // RTDB geeft een lijst soms als object terug (bij gaten in de nummering).
    const eerder = Array.isArray(huidig) ? huidig : (huidig ? Object.values(huidig) : []);
    const recent = eerder.filter((t) => typeof t === 'number' && nu - t < uur);
    if (recent.length >= 5) return;        // undefined breekt de transactie af
    recent.push(nu);
    return recent;
  });
  return !uitkomst.committed;              // afgebroken = grens bereikt
}

exports.demoAanvraag = onRequest(
  { region: 'europe-west1', secrets: [RESEND_API_KEY], cors: DEMO_HERKOMST,
    memory: '256MiB', timeoutSeconds: 30 },
  async (req, res) => {
    try {
      if (req.method !== 'POST') { res.status(405).json({ error: 'Alleen POST toegestaan' }); return; }
      const body = req.body || {};

      // Slot 3 — verborgen veld. Een bot vult alles in; een mens ziet dit niet eens.
      // Stilletjes "ok" teruggeven: een bot hoeft niet te weten dat hij betrapt is.
      if (_demoSchoon(body.website, 50)) { res.json({ ok: true }); return; }

      // Velden opschonen en begrenzen
      const velden = {};
      for (const [naam, regel] of Object.entries(DEMO_VELDEN)) {
        velden[naam] = _demoSchoon(body[naam], regel.max);
        if (regel.verplicht && !velden[naam]) {
          res.status(400).json({ error: 'Veld ontbreekt: ' + naam }); return;
        }
      }
      if (!/^[^@\s]+@[^@\s.]+\.[^@\s]{2,}$/.test(velden.email)) {
        res.status(400).json({ error: 'Ongeldig e-mailadres' }); return;
      }

      // Slot 4 — snelheidsbegrenzing
      const ip = String(req.headers['x-forwarded-for'] || req.ip || '').split(',')[0].trim() || 'onbekend';
      if (await _demoTeVaak(ip)) {
        res.status(429).json({ error: 'Te veel aanvragen. Probeer het over een uur opnieuw, of bel ons.' });
        return;
      }

      // Eerst bewaren, dan pas mailen — zo gaat een lead nooit verloren.
      const bewaard = await admin.database().ref('flow8/demoAanvragen/log').push({
        ...velden, op: admin.database.ServerValue.TIMESTAMP, verstuurd: false,
      });

      const regels = [
        'Naam: ' + velden.naam,
        velden.bedrijf  ? 'Bedrijf: ' + velden.bedrijf   : null,
        'E-mail: ' + velden.email,
        velden.telefoon ? 'Telefoon: ' + velden.telefoon : null,
        velden.omvang   ? 'Aantal medewerkers: ' + velden.omvang : null,
      ].filter(Boolean).join('\n');
      const tekst = regels + (velden.vraag ? '\n\nVraag:\n' + velden.vraag : '');
      const onderwerp = _headerVeilig('Demo-aanvraag — ' + (velden.bedrijf || velden.naam));

      // Slot 1 — de ontvanger komt uit de instellingen, nooit uit het verzoek.
      const resp = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + RESEND_API_KEY.value(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: MAIL_FROM.value(),
          to: [DEMO_NAAR.value()],
          reply_to: velden.email,
          subject: onderwerp,
          text: tekst,
          html: bouwMailHtml({ naam: 'Flow 8', mailKleur: '#4f6ef5', website: 'flow-8.nl' },
                             onderwerp, tekst, 'Via de website'),
        }),
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        // De aanvraag staat al in de database; dat is hier het belangrijkste.
        console.error('demoAanvraag — Resend faalde:', data.message || resp.status);
        res.status(502).json({ error: 'Versturen mislukt. Bel ons gerust op 06 – 28 70 24 22.' });
        return;
      }
      await bewaard.update({ verstuurd: true });
      res.json({ ok: true });
    } catch (e) {
      console.error('demoAanvraag:', e);
      res.status(500).json({ error: 'Er ging iets mis. Bel ons gerust op 06 – 28 70 24 22.' });
    }
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// Licentiemanager, fase 1 (concept 11-11-2026): tellen en de einddatum bewaken.
// flow8/licenties/{bedrijfId}: abonnement + regels (Thomas, platformbeheer), gebruik/status/log (alleen deze functies),
// opzeggingen/{uid} en opzegging (de beheerder van het bedrijf, per de einddatum).
// ─────────────────────────────────────────────────────────────────────────────
const LIC_DB = 'flow8-715de-default-rtdb';
const LIC_REGIO = 'europe-west1';

// Soort licentie van een account: vastgelegd op het profiel, anders uit de rol (wie werkbonnen uitvoert = werkbon)
function licSoort(p) {
  if (p.licentie === 'werkbon' || p.licentie === 'kantoor') return p.licentie;
  return (p.rol === 'monteur' || p.rol === 'extern') ? 'werkbon' : 'kantoor';
}
// Datum als jjjj-mm-dd in Nederlandse tijd (de einddatum in de rules en de app is ook zo geschreven)
function licVandaag() { return new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Amsterdam' }); }
function licPlusDagen(iso, n) { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }

async function licTel(bedrijfId) {
  if (!bedrijfId) return;
  const db = admin.database();
  if (!(await db.ref('flow8/licenties/' + bedrijfId + '/abonnement').get()).exists()) return;   // geen abonnement: niets te tellen
  const snap = await db.ref('flow8/gebruikers').orderByChild('bedrijfId').equalTo(bedrijfId).get();
  const g = { kantoor: 0, werkbon: 0 };
  snap.forEach((c) => { const p = c.val() || {}; if (p.actief === true && p.platformBeheer !== true) g[licSoort(p)]++; });
  await db.ref('flow8/licenties/' + bedrijfId + '/gebruik').set({ kantoor: g.kantoor, werkbon: g.werkbon, bijgewerkt: Date.now() });
}

// Claims van één account meteen opnieuw zetten (zelfde berekening als bij inloggen). Het token van een ingelogde
// gebruiker neemt ze over bij de volgende verversing (binnen een uur, of direct als de app ververst).
async function licZetClaims(uid) {
  let gebruiker;
  try { gebruiker = await admin.auth().getUser(uid); } catch (e) { return; }   // geen Auth-account bij dit profiel
  const r = await berekenClaims(uid, gebruiker.email);
  if (r.fout || claimsGelijk(gebruiker.customClaims, r.claims)) return;
  await admin.auth().setCustomUserClaims(uid, r.claims);
}
async function licZetClaimsBedrijf(bedrijfId) {
  const snap = await admin.database().ref('flow8/gebruikers').orderByChild('bedrijfId').equalTo(bedrijfId).get();
  const uids = []; snap.forEach((c) => { uids.push(c.key); });
  const uit = await Promise.allSettled(uids.map(licZetClaims));
  uit.filter((x) => x.status === 'rejected').forEach((x) => console.error('licZetClaimsBedrijf:', x.reason));
}

// Een profiel verandert (actief, rol, bedrijf of soort): beide betrokken bedrijven opnieuw tellen en de claims bijwerken
exports.licentieGebruik = onValueWritten({ ref: 'flow8/gebruikers/{uid}', instance: LIC_DB, region: LIC_REGIO }, async (event) => {
  const voor = event.data.before.val() || {}, na = event.data.after.val() || {};
  if (voor.actief === na.actief && voor.rol === na.rol && voor.bedrijfId === na.bedrijfId && voor.licentie === na.licentie) return;
  for (const bid of new Set([voor.bedrijfId, na.bedrijfId].filter(Boolean))) await licTel(bid);
  // Vangnet: telde dit account eerder niet mee in deze soort bij dit bedrijf, dan moet er een licentie vrij zijn
  if (na.actief === true && na.platformBeheer !== true && na.bedrijfId) {
    const soort = licSoort(na);
    const teldeAl = voor.actief === true && voor.platformBeheer !== true && voor.bedrijfId === na.bedrijfId && licSoort(voor) === soort;
    if (!teldeAl) await licVangnet(na.bedrijfId, event.params.uid, soort, na);
  }
  if (event.data.after.exists()) await licZetClaims(event.params.uid);
});
// Een abonnement wordt vastgelegd of gewijzigd: meteen tellen. Komt het erbij of verdwijnt het, dan verandert de
// claim lic voor iedereen van het bedrijf.
exports.licentieAbonnement = onValueWritten({ ref: 'flow8/licenties/{bedrijfId}/abonnement', instance: LIC_DB, region: LIC_REGIO }, async (event) => {
  const bid = event.params.bedrijfId;
  if (event.data.after.exists()) await licTel(bid);
  if (event.data.before.exists() !== event.data.after.exists()) await licZetClaimsBedrijf(bid);
});

// Licenties van een soort op een datum: de regels die dan lopen (zelfde regel als _licAantal in de app)
function licAantal(regels, soort, op) {
  return Object.values(regels || {}).filter((r) => r && r.soort === soort && r.van && r.van <= op && (!r.tot || r.tot >= op))
    .reduce((t, r) => t + (Number(r.aantal) || 0), 0);
}
async function licVangnet(bedrijfId, uid, soort, p) {
  const db = admin.database();
  const v = (await db.ref('flow8/licenties/' + bedrijfId).get()).val() || {};
  if (!v.abonnement) return;
  const aantal = licAantal(v.regels, soort, licVandaag()), gebruik = (v.gebruik || {})[soort] || 0;
  if (gebruik <= aantal) return;
  await db.ref('flow8/gebruikers/' + uid + '/actief').set(false);   // telt daarna vanzelf opnieuw
  const woord = soort === 'werkbon' ? 'werkbonlicentie' : 'kantoorlicentie';
  await licLog(bedrijfId, { wat: 'geen licentie vrij', uid, email: p.email || null, soort });
  await licMeldBeheerders(bedrijfId, 'Geen ' + woord + ' vrij',
    (p.naam || p.email || 'Een account') + ' staat weer op inactief: alle ' + aantal + ' ' + woord + 's zijn in gebruik. Zeg bij Instellingen › Abonnement een licentie op bij iemand die stopt, of neem er een bij.');
}
// Melding bij het belletje van elke beheerder (zelfde plek als stuurNotificatie in de app: per medewerker, anders per uid)
async function licMeldBeheerders(bedrijfId, titel, tekst) {
  const db = admin.database();
  const prof = (await db.ref('flow8/gebruikers').orderByChild('bedrijfId').equalTo(bedrijfId).get()).val() || {};
  const meds = (await db.ref('flow8/bedrijven/' + bedrijfId + '/medewerkers').get()).val() || {};
  const medVan = (email) => { email = String(email || '').toLowerCase(); if (!email) return null;
    const k = Object.keys(meds).find((x) => String((meds[x] || {}).email || '').toLowerCase() === email);
    return k ? String(meds[k].id != null ? meds[k].id : k) : null; };
  const ts = Date.now();
  for (const uid of Object.keys(prof)) {
    const p = prof[uid] || {};
    if (p.rol !== 'admin' || p.actief !== true || p.platformBeheer === true) continue;
    const sleutel = medVan(p.email) || uid;
    await db.ref('flow8/bedrijven/' + bedrijfId + '/notificaties/' + sleutel + '/n_' + ts + '_' + Math.random().toString(36).slice(2, 6))
      .set({ type: 'abonnement', titel, tekst, nav: 'instellingen', ts, gelezen: false });
  }
}
async function licLog(bedrijfId, regel) {
  await admin.database().ref('flow8/licenties/' + bedrijfId + '/log').push(Object.assign({ ts: Date.now() }, regel));
}
// Licentie van één account voorbij de einddatum: account op inactief, opzegging weg, gelogd
async function licStopAccount(bedrijfId, uid, o) {
  const db = admin.database(), prof = db.ref('flow8/gebruikers/' + uid);
  const p = (await prof.get()).val();
  if (p && p.bedrijfId === bedrijfId && p.actief === true) await prof.child('actief').set(false);   // telt daarna vanzelf opnieuw
  await db.ref('flow8/licenties/' + bedrijfId + '/opzeggingen/' + uid).remove();
  await licLog(bedrijfId, { wat: 'licentie gestopt', uid, email: (p && p.email) || null, per: o.per });
}
// Hele abonnement voorbij de einddatum: status gestopt, 90 dagen alleen bekijken en exporteren
async function licStopAbonnement(bedrijfId, o, reden) {
  const tot = licPlusDagen(o.per, 90);
  await admin.database().ref('flow8/licenties/' + bedrijfId).update({ status: 'gestopt', gestoptOp: licVandaag(), gestoptReden: reden || 'opzegging', alleenLezenTot: tot });
  await licLog(bedrijfId, { wat: reden === 'proef' ? 'proef afgelopen' : 'abonnement gestopt', per: o.per, alleenLezenTot: tot });
}
function licNL(iso) { return String(iso || '').split('-').reverse().join('-'); }   // dd-mm-jjjj
function licDagenTot(iso, vandaag) { return Math.round((Date.parse(iso + 'T12:00:00Z') - Date.parse(vandaag + 'T12:00:00Z')) / 864e5); }
// Melding over het einde van de proef, één keer per drempel en per proefdatum (verlengen = opnieuw melden)
async function licProefMelding(bedrijfId, proefTot, drempel, dagen) {
  await admin.database().ref('flow8/licenties/' + bedrijfId + '/proefGemeld/d' + drempel).set(proefTot);
  await licMeldBeheerders(bedrijfId, dagen === 0 ? 'Proef eindigt vandaag' : 'Proef eindigt over ' + dagen + (dagen === 1 ? ' dag' : ' dagen'),
    'De gratis proef van Flow8 loopt tot en met ' + licNL(proefTot) + '. Wil je daarna verder, spreek dat dan af met Flow8. Doe je niets, dan stopt Flow8 en kun je nog 90 dagen alles bekijken en exporteren.');
  await licLog(bedrijfId, { wat: 'proef melding', drempel, proefTot });
}

exports.licentieDagelijks = onSchedule({ schedule: 'every day 02:30', timeZone: 'Europe/Amsterdam', region: LIC_REGIO }, async () => {
  const vandaag = licVandaag(), taken = [];
  (await admin.database().ref('flow8/licenties').get()).forEach((b) => {
    const bid = b.key, v = b.val() || {};
    Object.entries(v.opzeggingen || {}).forEach(([uid, o]) => { if (o && o.per && o.per < vandaag) taken.push(licStopAccount(bid, uid, o)); });
    const a = v.abonnement || {};
    if (v.opzegging && v.opzegging.per && v.opzegging.per < vandaag && v.status !== 'gestopt') taken.push(licStopAbonnement(bid, v.opzegging));
    else if (a.proefTot && v.status !== 'gestopt') {
      const d = licDagenTot(a.proefTot, vandaag), gemeld = v.proefGemeld || {};
      if (d < 0) taken.push(licStopAbonnement(bid, { per: a.proefTot }, 'proef'));
      else if (d <= 3) { if (gemeld.d3 !== a.proefTot) taken.push(licProefMelding(bid, a.proefTot, 3, d)); }
      else if (d <= 14) { if (gemeld.d14 !== a.proefTot) taken.push(licProefMelding(bid, a.proefTot, 14, d)); }
    }
  });
  const uit = await Promise.allSettled(taken);
  uit.filter((x) => x.status === 'rejected').forEach((x) => console.error('licentieDagelijks:', x.reason));
});
