// Flow8 — verstuurMail Cloud Function
// Verstuurt mails direct via Resend, met optionele PDF-bijlage.
// Beveiliging: alleen ingelogde Flow8-gebruikers met een geldig profiel;
// elke verzending wordt gelogd naar flow8/bedrijven/{bedrijfId}/mailLog.

const { onRequest } = require('firebase-functions/v2/https');
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
function _inline(str) {
  let h = _esc(str);
  // Links eerst (voordat * / ** de haakjesinhoud raken). URL wordt gevalideerd.
  h = h.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(_, tekst, url){
    const schoon = String(url).trim();
    if (!/^(https?:\/\/|mailto:|tel:)/i.test(schoon)) return tekst; // onveilig → alleen de tekst
    return '<a href="' + schoon.replace(/"/g,'%22') + '" style="color:#1c5f9e;font-weight:600;text-decoration:underline;">' + tekst + '</a>';
  });
  // Vet vóór cursief (** moet niet als twee losse * gezien worden)
  h = h.replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#16202e;">$1</strong>');
  h = h.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return h;
}

// Zet de platte-tekst-body om naar HTML-blokken.
// Regels van de vorm "Label: waarde" die direct op elkaar volgen, worden samen
// als één uitgelijnd gegevensblok gerenderd. Overige tekst wordt alinea's.
function _bodyNaarHtml(body) {
  const regels = String(body || '').replace(/\r\n/g, '\n').split('\n');
  let html = '';
  let i = 0;

  // Een regel telt als "label:waarde" als hij begint met wat woorden, dan een
  // dubbele punt, dan (na spaties) een niet-lege waarde. Niet als de dubbele punt
  // aan het eind staat (dan is het een kop, bijv. "Werkzaamheden:").
  const labelRe = /^([A-Za-zÀ-ÿ0-9 .\/'-]{2,40}):\s*(\S.*)$/;

  while (i < regels.length) {
    const regel = regels[i];

    // Lege regel → verticale ruimte (sla dubbele lege regels samen)
    if (regel.trim() === '') { i++; continue; }

    // Kop:  "# Tekst"  → tussentitel
    if (/^#\s+/.test(regel)) {
      html += '<div style="font-size:16px;font-weight:800;color:#16202e;margin:24px 0 8px;">'
           +  _inline(regel.replace(/^#\s+/, '')) + '</div>';
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
        html += '<tr><td style="vertical-align:top;padding:0 10px 8px 0;color:#1c5f9e;font-weight:800;font-size:15px;line-height:1.6;">&bull;</td>'
             +  '<td style="vertical-align:top;padding:0 0 8px;font-size:15px;line-height:1.6;color:#3a4453;">' + _inline(it) + '</td></tr>';
      });
      html += '</tbody></table>';
      continue;
    }

    // Start van een gegevensblok?
    if (labelRe.test(regel)) {
      const rijen = [];
      while (i < regels.length && labelRe.test(regels[i])) {
        const m = regels[i].match(labelRe);
        rijen.push({ label: m[1].trim(), waarde: m[2].trim() });
        i++;
      }
      // Gestapeld: label klein bovenaan, waarde op volle breedte eronder. Werkt
      // betrouwbaar op elk toestel (geen media-query nodig, die stript Gmail toch)
      // en voorkomt dat lange waarden (adres, werkomschrijving) in een smalle kolom
      // worden geperst.
      html += '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fa;border:1px solid #e2e9f1;border-radius:12px;margin:4px 0 24px;"><tr><td style="padding:20px 22px;">';
      rijen.forEach(function(r, idx){
        if (idx > 0) html += '<div style="height:1px;background:#e2e9f1;margin:14px 0;"></div>';
        html += '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.8px;color:#8b96a6;font-weight:700;">' + _esc(r.label) + '</div>';
        html += '<div style="font-size:15px;color:#16202e;font-weight:600;margin-top:3px;line-height:1.45;">' + _inline(r.waarde) + '</div>';
      });
      html += '</td></tr></table>';
      continue;
    }

    // Anders: gewone alinea (verzamel opeenvolgende niet-lege regels die geen
    // label, kop of lijst zijn)
    const alinea = [];
    while (i < regels.length && regels[i].trim() !== '' && !labelRe.test(regels[i])
           && !/^#\s+/.test(regels[i]) && !/^-\s+/.test(regels[i])) {
      alinea.push(_inline(regels[i]));
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
'<tr><td style="padding:22px 32px 8px;">' + _bodyNaarHtml(bodyTekst) + '</td></tr>' +
// Logo in het witte deel, onder de ondertekening (als er een publieke URL is).
(logoFooter ? '<tr><td style="padding:6px 32px 0;">' + logoFooter + '</td></tr>' : '') +
'<tr><td style="padding:20px 32px 0;"></td></tr>' +
// footer
'<tr><td style="background:#f4f7fa;padding:26px 32px;border-top:1px solid #e2e9f1;">' +
'<div style="font-size:13px;font-weight:700;color:#16202e;">' + naam + '</div>' +
(adresregel ? '<div style="font-size:12px;color:#8b96a6;margin-top:3px;line-height:1.5;">' + _esc(adresregel) + '</div>' : '') +
(contactregel ? '<div style="font-size:12px;color:#8b96a6;margin-top:2px;line-height:1.5;">' + contactregel + '</div>' : '') +
'</td></tr>' +
'</table>' +
'<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;"><tr><td align="center" style="padding:14px 20px;">' +
'<span style="font-size:11px;color:#a2acba;">Deze e-mail is verstuurd via Flow8 namens ' + naam + '.</span>' +
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
        from: MAIL_FROM.value(),
        to: aan,
        subject: onderwerpStr,
        text: bodyStr,
        html: bouwMailHtml(bedrijf, onderwerpStr, bodyStr),
      };
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
//
// Waarom hybride: Firestore-rules kunnen token.rch.werkbonnen lezen; RTDB-rules
// kunnen dat NIET (geen geneste claim-toegang), maar wel token.ouRecht. Zo werkt
// elke database met wat hij aankan.
//
// DIT BLOK VERVANGT de vorige zetGebruikersClaim VOLLEDIG.
// admin.initializeApp() staat bovenaan al — NIET nog een keer toevoegen.
// ─────────────────────────────────────────────────────────────────────────────

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

      // 2. Eigen profiel lezen uit de RTDB (bron van waarheid)
      const profSnap = await admin.database().ref('flow8/gebruikers/' + decoded.uid).get();
      if (!profSnap.exists()) { res.status(403).json({ error: 'Geen Flow8-profiel gevonden' }); return; }
      const profiel = profSnap.val();
      const bedrijfId = profiel.bedrijfId;
      const rol = profiel.rol || null;
      const actief = profiel.actief === true;
      const email = (profiel.email || decoded.email || '').toLowerCase();
      if (!bedrijfId) { res.status(403).json({ error: 'Geen bedrijf gekoppeld aan profiel' }); return; }

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
      }

      // 5. Idempotent
      const rchGelijk = JSON.stringify(decoded.rch || {}) === JSON.stringify(rch);
      const gelijk =
        (decoded.bedrijfId || null) === bedrijfId &&
        (decoded.rol || null) === rol &&
        (decoded.actief === true) === actief &&
        (decoded.medId || null) === medId &&
        rchGelijk &&
        (decoded.ouRecht || 'g') === ouRecht &&
        (decoded.okRecht || 'g') === okRecht &&
        (decoded.vlRecht || 'g') === vlRecht &&
        (decoded.vzRecht || 'g') === vzRecht;
      if (gelijk) {
        res.json({ ok: true, gewijzigd: false, claim: { bedrijfId, rol, actief, medId, rch, ouRecht, okRecht, vlRecht, vzRecht } });
        return;
      }

      // 6. Claim zetten
      await admin.auth().setCustomUserClaims(decoded.uid, {
        bedrijfId, rol, actief, medId, rch, ouRecht, okRecht, vlRecht, vzRecht,
      });
      res.json({ ok: true, gewijzigd: true, claim: { bedrijfId, rol, actief, medId, rch, ouRecht, okRecht, vlRecht, vzRecht } });
    } catch (e) {
      const boodschap = (e && e.code === 'auth/id-token-expired')
        ? 'Sessie verlopen — log opnieuw in'
        : (e.message || 'Onbekende fout');
      res.status(500).json({ error: boodschap });
    }
  }
);