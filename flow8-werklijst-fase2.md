# Flow8 — Werklijst eindfase 2

Bestand: `flow8-v2.html` · 34.801 regels · JS-syntax ✓
Opgesteld: 2 augustus 2026 · Laatst bijgewerkt: 15 augustus 2026

> ## ⚑ ACTUELE STAND (15 augustus 2026) — leidend boven oudere backlog-notities
>
> **Onderstaande oudere "Nog open"-secties zijn deels ACHTERHAALD.** Deze zaken zijn
> inmiddels AF (geverifieerd in de code) en tellen niet meer als openstaand:
> - ✅ **Werkplaats → Firestore**: de werkplaatsmodule is vervangen door de nieuwe module
>   **Werkorders**, volledig in Firestore. Opdrachten zijn aan de werkbonnen gekoppeld.
> - ✅ **Werkbonformulier**: een monteur maakt een eigen werkbon aan via de + knop rechtsboven
>   in de werkbonnen-module (`wb-nieuw`, alleen eigen werkbonnen bij recht 'eigen').
> - ✅ **Rapportages werkbonnen/werkorders**: werkorder-rapportage is gebouwd.
> - ✅ **Foto-compressie vóór upload**: dynamische kwaliteit op aantal foto's (r19836-19839) + canvas-compressie.
> - ✅ **PDF-preview iOS**: opgelost met PDF.js (rendert alle pagina's i.p.v. iframe-pagina-1).
>
> **Echt nog open (grote trajecten, elk eigen sessie/analyse waard):**
> - **Punt 4B** — aanvullend/optioneel contracttype structureel (datamodel + migratie). Analyse: `flow8-register-workflow-analyse.md`.
> - **Maillog fase 3** — Resend delivery-status via webhook + geplande/automatische mails. Analyse: `flow8-maillog-analyse.md`.
> - **Goedkeuring stap B** — meerdere verplichte goedkeurders (~49 plekken met `goedgekeurd`).
> - **H12** — credits/licenties (server-side).
> - **Firebase rules fase 2 voor Firestore** — per bedrijf + monteur-rol clean opzetten (RTDB-kant is al gedaan).
> - **Offline upload veldwerk** — foto's bufferen, uploaden bij netwerk.
>
> **Klein/laag:**
> - ✅ Register-export toont alleen standaardvelden — OPGELOST (22 aug): export losgekoppeld van kolom-zichtbaarheid, exporteert nu alle ingestelde velden.
>
> **Praktisch te doen:**
> - Laatste `flow8-v2.html` naar GitHub Pages publiceren.
> - Cloud Function mail-wrapper deployen (huisstijl fase 1/1b/2).


> ## Voortgang
>
> **Blok 1 — afgerond op 2 augustus 2026.** D4, F10, C3, A1 en E6 doorgevoerd in
> `flow8-v2.html` (32.055 regels, JS-syntax ✓). **Live getest op 2 augustus — akkoord.**
> **Blok 2 — afgerond op 2 augustus 2026.** D5, B2, F8 en E7 doorgevoerd
> (32.112 regels, JS-syntax ✓). Nog niet live getest.
> **Blok 2 getest op 2 augustus — E7 en F8 akkoord.** B2 had nog een restpunt
> (popup toonde het hoofdadres); opgelost, plus de zoeklijst op de kaart.
> Koelperiode op de reistijdencache toegevoegd (32.157 regels, JS-syntax ✓).
> **Firebase rules fase 2 — afgerond op 10 augustus 2026.** Multi-tenant-beveiliging over
> de hele linie dichtgezet; alles live getest en akkoord.
>
> - **2A** — cascade-fout in de RTDB-rules gedicht: `.write` op `$bedrijfId`-niveau verruimde
>   naar alle childnodes, waardoor een monteur zichzelf via de console rechten kon geven.
>   Schrijfrechten opgesplitst per key; config-nodes admin-only, `locaties` per uid,
>   `reistijdCache` eigen write, datakeys via `$overig`. → `flow8-rules-rtdb-2a.json`.
> - **2B** — `platformBeheer`-vlag boven admin (client-onschrijfbaar via `".validate": false`,
>   alleen handmatig in de Console). Administratiewisselaar hersteld en omgebouwd naar
>   `flow8/bedrijvenIndex` i.p.v. de volledige bedrijvenboom. App: `isPlatformBeheer()` +
>   `_bedrijfIndexBijwerken()`; wisselblok en "nieuwe administratie" platform-only.
>   → `flow8-rules-rtdb-2b.json`. Vlag staat op `thomv374@hotmail.com`.
> - **Firestore + Storage niveau 1** — bedrijfsscheiding via custom claim op het token.
>   Cloud Function `zetGebruikersClaim` gedeployed; app roept die aan na login en ververst
>   het token vóór `laadData()`. Rules checken `request.auth.token.bedrijfId == bedrijfId`.
>   → `cloud-function-zetGebruikersClaim.js`, `flow8-rules-firestore-niveau1.txt`,
>   `flow8-rules-storage-niveau1.txt`.
> - **Bugfix `_gewijzigdDoor`** (r5061) — schreef `undefined` bij profielen zonder `uid`-veld
>   (handmatige admin had het onder `id`); RTDB weigert undefined, schrijfactie hing. Nu uit
>   `AUTH.currentUser.uid` met terugval.
>
> **Openstaand:** niveau 2 (rol-onderscheid per module); auth-opschoning (losse `demo`-knoop
> onder `flow8`; handmatige admin-profielen); uitrol-aandachtspunt: iedereen moet ná uitrol
> één keer opnieuw inloggen voor de claim. Bewust NIET gebouwd: klanten zelf meerdere
> administraties laten aanmaken (te vroeg).
>
> **Niveau 2 werkbonnen — afgerond op 10 augustus 2026.** Rol-/toewijzing-afhankelijke
> afscherming: een monteur ziet en muteert alleen werkbonnen waaraan hij is toegewezen,
> nu ook afgedwongen in de database (niet enkel in de UI). Live getest en akkoord.
>
> - **Cloud Function v3** — `zetGebruikersClaim` zet nu ook `medId`, `wbSchrijf` en
>   `wbEigen` op het token. medId via email→medewerker (zelfde logica als getMijnMedId);
>   de wb-vlaggen afgeleid uit de rollenmatrix (`rechten.werkbonnen`: schrijven→wbSchrijf,
>   eigen-zonder-schrijven→wbEigen). Rules werken zo op rechtVLAGGEN, niet op rolnamen —
>   klopt automatisch voor elke (ook zelf aangemaakte) rol.
>   → `cloud-function-zetGebruikersClaim-v3.js`.
> - **Firestore-rules niveau 2** — `read` gesplitst in `get` (streng, isToegewezen op
>   resource.data) en `list` (op de vlaggen). Nodig omdat een isToegewezen-check op
>   resource.data élke query breekt (resource.data bestaat nog niet bij een list).
>   Gerichte inzage in andermans bon = geweigerd; cross-bedrijf blijft dicht (niveau 1).
>   → `flow8-rules-firestore-niveau2.txt`.
> - **Bugfix migratie** (r5366) — een "eenmalige" migratie draaide bij ELKE load en zette
>   monteur/magazijn werkbonnen telkens terug op `schrijven:true`, waardoor 'schrijven uit
>   + eigen aan' nooit bewaard bleef. Nu: vult alleen aan als er nog géén werkbonnen-recht
>   is; bestaande keuze blijft staan.
> - **Deel 2 (verwijderknop)** — bleek al te kloppen: verwijderen in de werkbonlijst zat
>   al niet achter een rechtencheck, alleen achter status (niet-afgehandeld). Geen wijziging.
>
> **Uitrol-aandachtspunt:** na een rechtenwijziging moet een gebruiker opnieuw inloggen
> zodat de wb-vlaggen op zijn token bijwerken. Monteur moet op minstens één bon in
> `monteurIds` staan, anders ziet hij (correct) niets.
>
> **Opgeruimd tijdens de sessie:** scheve mailLog-pad in de Cloud Function rechtgetrokken
> (`flow8/{bedrijfId}/mailLog` → `flow8/bedrijven/{bedrijfId}/mailLog`); oude losse
> `flow8/demo/mailLog`-knoop verwijderd.
>
> **Openstaand (genoteerd, geen haast):**
> - Optie 2: list-query waterdicht maken met query-constraint-checks (nu kan een monteur
>   via de console bon-titels binnen zijn eigen bedrijf oplijsten — get + cross-bedrijf
>   blijven wél dicht).
> - Migratieblok r5359 e.v. achter een 'gedraaid'-vlag zetten (draait nu bij elke load).
> - Niveau 2 voor de overige modules: verlof, overuren, onkosten, verzuim (RTDB-kant).
>
> **Niveau 2 overuren/onkosten/verlof — afgerond op 11 augustus 2026.** Zelf-indienen door
> monteurs met status-slot na goedkeuring, afgedwongen in de RTDB. Live getest en akkoord.
>
> - **Cloud Function v5** — `zetGebruikersClaim` zet nu een hybride claim-set: `rch` (compact
>   object per module, voor FIRESTORE-rules) plus platte per-module strings `ouRecht`,
>   `okRecht`, `vlRecht`, `vzRecht` (voor RTDB-rules). Reden: RTDB-rules kunnen GEEN geneste
>   claim-objecten lezen, alleen primitieve waarden — Firestore wél. Codering overal 's'/'e'/'g'
>   (schrijven-of-admin / eigen / geen). → `cloud-function-zetGebruikersClaim-v5.js`.
>   Vervangt v3/v4; werkbon-Firestore-rules mee omgezet naar `rch.werkbonnen`.
> - **RTDB-rules niveau 2** — overuren/onkosten/verlof uit `$overig` gelicht, eigen `.write`
>   per record (`$id`): schrijver (`ouRecht=='s'` etc.) mag alles; eigen-recht (`'e'`) mag
>   alleen eigen record (`medId==token.medId`) én alleen zolang oude status 'aangevraagd' én
>   nieuw record moet status 'aangevraagd' hebben. Lezen blijft bedrijfsbreed (RTDB kan niet
>   per-record filteren op lezen). → `flow8-rules-rtdb-niveau2.json`.
> - **App: bewerkknoppen gespiegeld** — overuren (r16929) en onkosten (r17383, incl. verwijder)
>   bewerkknop nu achter conditie: goedkeurder/schrijver/admin altijd, anders eigen record én
>   status 'aangevraagd'. Verlof had het al dicht (achter magSchrijven). Voorkomt de knop die
>   stil door de rules werd geweigerd.
> - **Getest:** monteur dient in (lukt), wijzigt zolang aangevraagd (lukt), na goedkeuring
>   geweigerd (status-slot ✓), andermans record → PERMISSION_DENIED ✓. Bewerkknop verdwijnt
>   na goedkeuring.
>
> **Statuswaarde:** open-status is `aangevraagd` (niet `ingediend`); `goedgekeurd`/`afgewezen`
> = op slot. Alle 151 bestaande records (45 overuren, 1 onkosten, 105 verlof) hebben een medId.
>
> **Verzuim bewust NIET meegenomen:** bijzondere persoonsgegevens (AVG) → apart traject.
> `vzRecht` staat al op het token; alleen de RTDB-rule ontbreekt nog. Model: inzien-only voor
> monteurs (niet indienen); volledige inzage vraagt de expliciete `inzageAlle`/I-vlag.
>
> **Openstaand (genoteerd):**
> - Verzuim niveau 2 (RTDB-rule op `vzRecht=='s'` voor schrijven; lezen apart afwegen ivm AVG).
> - UI: I-recht (inzageAlle) verduidelijken in de rollen-interface; per-module uitleg van wat
>   L/E/S/I doen.
> - Eerder genoteerd: optie 2 (werkbon-list waterdicht), migratieblok r5359 achter gedraaid-vlag.
>
> **Niveau 2 verzuim — afgerond op 11 augustus 2026.** Optie C: schrijven dichtgezet, lezen
> operationeel breed (planning/dashboard hebben verzuim nodig), details client-side verborgen.
>
> - **RTDB-rule** — verzuim uit `$overig` gelicht; `.write` alleen met `vzRecht=='s'` (HR/admin).
>   Geen eigen-schrijf-tak: monteurs kunnen verzuim NIET schrijven (inzien-only). Lezen loopt
>   via de bedrijfsbrede `.read` \u2014 nodig omdat planning (r14744 e.v.), dashboard-chip
>   (r7806) en medewerkersoverzicht (r12555) op verzuim leunen om zieken te tonen.
>   → `flow8-rules-rtdb-niveau2.json` (nu compleet met alle vier de modules).
> - **App** — verzuim-bewerk/verwijderknop (r17800) achter `kanBeheren`. Toevoegknoppen zaten
>   al goed. Details blijven via `filterEigen`/`inzageAlle` verborgen voor wie geen I-vlag heeft.
> - **v5-functie** zette `vzRecht` al op het token; functie hoefde niet opnieuw.
> - **Getest:** monteur ziet dashboard-chip + planning-markeringen (lezen werkt), geen toevoeg/
>   bewerkknop, console-schrijftest → PERMISSION_DENIED ✓.
>
> **Rollen-interface verduidelijkt** — nieuw uitlegblok voor E en S toegevoegd (naast de
> bestaande I- en B-blokken): E betekent bij werkbonnen 'toegewezen', bij overuren/onkosten/
> verlof 'eigen aanvraag met status-slot na goedkeuring'; verzuim kan niet met E worden
> ingediend. In dezelfde stijl als de I/B-blokken.
>
> ─────────────────────────────────────────────────────────────────────
> **RECHTEN/BEVEILIGING VOLLEDIG AF** (2A, 2B, niveau 1, niveau 2 alle modules). Openstaand
> zijn alleen verscherpingen, geen gaten:
> - Verzuim optie D (record splitsen: operationeel deel breed leesbaar, gevoelig deel echt
>   afgeschermd) — voor volledige AVG-dekking, relevant bij groei voorbij testfase.
> - Werkbonnen optie 2 (list-query waterdicht met query-constraint-checks).
> - Migratieblok r5359 achter een 'gedraaid'-vlag (draait nu bij elke load).
> ─────────────────────────────────────────────────────────────────────
>
> **Werkorder-rapportage — afgerond op 13 augustus 2026.** Nieuw tabblad in de rapportage,
> in dezelfde stijl als de andere rapporten. `renderRapWerkorders` naast `renderRapServiceklanten`.
>
> - **Databron** — werkorders staan in Firestore (niet in het geheugen zoals APP.opdrachten).
>   Rapport laadt eerst via `Promise.all([laadWerkorderTypenCache, laadWerkordersCache])` (spinner),
>   dan renderen. Dit is het enige structurele verschil met de andere rapporten.
> - **Metrieken** — 4 statkaarten (totaal/afgehandeld/open/gem. doorlooptijd), 2 donuts (type,
>   status), 2 staafdiagrammen (totalen per maand + per type per maand), tabel per type
>   (aantal, afgehandeld, gem. doorlooptijd, som uren).
> - **Doorlooptijd** = aanmaak (`aangemaaktOp`) → moment van eindstatus (uit `statusHistorie`),
>   alleen voor afgehandelde werkorders. Oude data zonder statusHistorie telt niet mee (toont '—').
> - **Uren** — `_woRapUrenSom()` telt recursief alle `antwoorden.{scope}._uren[]`-regels op.
> - **Werkbonnen-rapport bewust overgeslagen** (overlap met opdrachten-rapport).
>
> **Werkorder-types kleur** — kleurkiezer toegevoegd aan `_openWerkorderTypeEditor` (8 presets +
> eigen kleur, veld `kleur`), want types hadden geen kleur → alles viel op grijze fallback in de
> donut. Bestaande types krijgen kleur zodra ze 1x opgeslagen worden. Kleur is nu ook elders
> herbruikbaar (bijv. werkorderlijst — nog niet gedaan, optioneel).
>
> **Geleerd:** grafiek-tooltips (`initGrafiekInteractie`) + count-up (`triggerCountUp`) moeten ná
> el.innerHTML worden aangeroepen — bij een ASYNCHROON renderend rapport (laad-dan-render) mis je
> die als je ze niet expliciet in de `.then()` zet; de andere (synchrone) rapporten doen het direct.
>
> **Klantmail fase 2 — opmaak-werkbalk (weg B) — afgerond op 13 augustus 2026.** Beperkte opmaak
> voor templates via een werkbalk; bewust GEEN volledige rich-text-editor (Outsmart-stijl), omdat
> je zo'n editor "1x instelt en er nooit meer aan zit".
>
> - **Vijf opmaakvormen** gekozen uit de Outsmart-set: vet, cursief, kop, lijst, link. Bewust
>   NIET: afbeelding invoegen, tabel, broncode/rauwe HTML (foutgevoelig, mailbrekend).
> - **Wrapper** — `_inline()` herkent `**vet**`, `*cursief*`, `[tekst](url)`; `_bodyNaarHtml()`
>   herkent `# Kop` en `- lijst`. Volgorde bewust: eerst escapen, dan opmaak omzetten → een klant
>   kan via een template geen rauwe HTML injecteren. Link-URL gevalideerd (alleen http/https/
>   mailto/tel; `javascript:` geweigerd). → `cloud-function-mail-wrapper.js`.
> - **App** — werkbalk (B/I/Kop/Lijst/Link) boven het tekstveld in `openMailTemplateEditor`,
>   zelfde cursor-invoeg-mechanisme als de variabele-chips. Link-knop vraagt om URL (gevalideerd).
>   Legenda-regel onder het veld legt de tekens uit. Nieuwe-template-modal bewust simpel gehouden
>   (opmaak gebeurt bij bewerken). Getest: opmaak komt door in de mail.
>
> **Ook deze sessie afgerond:** gegevensblok GESTAPELD (label boven, waarde eronder) i.p.v.
> 2-koloms — lost mobiele weergave op waar lang adres/werkomschrijving in smalle kolom werd
> geperst. Geen media-query (Gmail stript die) → altijd gestapeld, werkt op elk toestel.
>
> **Openstaand mail:**
> - **Logo oogt klein in de mail.** max-height opgehoogd naar 64px/200px breed, maar logo blijft
>   klein — vermoedelijk is het logo-BRONBESTAND zelf klein (max-height rekt niet op). Later:
>   afmetingen van geüpload logo checken (Instellingen → Bedrijf); evt. groter logo of oprekken.
> - Logo-Storage-URL moet publiek leesbaar zijn (checken bij gebroken logo bij ontvanger).
> - Fase 3 (optioneel): status-change triggers (automatisch mailen bij statuswijziging).
>
> **Klantmail fase 1b — instelbare huisstijlkleur — afgerond op 12 augustus 2026.**
>
> - **App** — kleurkiezer in Instellingen → Bedrijf (bij logo): 8 presets + eigen-kleurkiezer,
>   live mini-preview van de e-mailkop. Slaat op in `instellingen/bedrijf/mailKleur` (admin-only
>   via bestaande rules). Helper `_leesbareTekstKleur(hex)` (WCAG-luminantie) bepaalt wit/donker.
>   `verstuurMailDirect` stuurt `mailKleur` mee.
> - **Wrapper** — gebruikt `bedrijf.mailKleur` i.p.v. de vaste kleur; `_geldigeKleur()` valt terug
>   op #1c3d5a bij lege/ongeldige invoer; `_leesbareTekst()` zet header-tekst automatisch wit of
>   donker zodat een klant nooit een onleesbare mail maakt. → `cloud-function-mail-wrapper.js`.
> - **Getest:** kleur werkt door in de mail, tekst past zich aan (donkere kleur→wit, lichte→donker).
>   Geen opnieuw inloggen nodig (kleur gaat in de payload, niet via token-claim).
>
> **Klantmail HTML-huisstijl (fase 1) — afgerond op 12 augustus 2026.** Alle mails krijgen nu
> een nette huisstijl-wrapper; bestaande platte-tekst-templates ongewijzigd bruikbaar.
>
> - **Cloud Function wrapper** — `bouwMailHtml(bedrijf, onderwerp, body, label)` in index.js,
>   boven verstuurMail. Zet platte-tekst-body om naar HTML: gewone regels → alinea's,
>   aaneengesloten 'Label: waarde'-regels → uitgelijnd gegevensblok. Herkenning tolerant voor
>   wel/geen spatie na de dubbele punt (template had `Werkzaamheden:{...}` zonder spatie).
>   Alle user-tekst ge-escaped. Header: bedrijfsnaam in wit op accentkleur (#1c3d5a, vast in
>   fase 1). Logo in het WITTE deel onder de ondertekening (niet in de header — wit logo stak
>   af op donker; niet in grijze footer). → `cloud-function-mail-wrapper.js`.
> - **verstuurMail** — `html`-veld toegevoegd aan de Resend-payload (naast `text` als fallback).
>   → instructie in `cloud-function-verstuurMail-aanpassing.md`.
> - **App** — `verstuurMailDirect` stuurt nu `bedrijf` (naam/logo/adres/contact uit
>   APP.bedrijfGegevens) mee in de payload. Eén plek, geldt voor alle mails.
> - **Getest op mobiel:** huisstijl komt goed door, gegevensblok correct, logo in wit deel.
>   Logo komt uit bestaand `bedrijfGegevens.logo` (zelfde als werkbon-PDF; klant kan zelf
>   uploaden via Instellingen → Bedrijf).
>
> **Sluit aan op bestaand systeem:** `MAIL_TEMPLATES_DEFAULT` + `vulMailIn()` + klantmails-tab
> + opdrachttype-koppeling blijven ongewijzigd; de wrapper is puur een opmaaklaag eromheen.
>
> **Openstaand mail:**
> - Logo-URL moet publiek leesbaar zijn in Storage — checken bij gebroken logo bij ontvanger.
> - Fase 2 (optioneel): rijkere sjablonen met iconen-blok (eerste preview-ontwerp).
> - Fase 3 (optioneel): status-change triggers (automatisch mailen bij statuswijziging).
>
> **Blok 3 afgerond (11 augustus 2026):** G11 (contracten-import) en F9 (register configureerbaar) zijn beide gebouwd en werken.
>
> Volgende openstaand: blok 4 (H12 credits/licenties) en goedkeuring stap B (meerdere goedkeurders).

Legenda status: **✓ oorzaak vastgesteld** = in de code teruggevonden ·
**? te onderzoeken** = hypothese, moet bevestigd worden · **○ ontwerp** = nieuw werk, geen bug.

---

## ✅ BULK-MAIL: één overzicht i.p.v. losse modals 15 augustus 2026

Waarneming Thomas: bij klantmails → meerdere selecteren → "Verstuur selectie" opende voorheen
per mail een aparte modal (achterhaalde "elke mail apart in Outlook"-flow; sinds Resend niet
meer nodig). Bij 20 mails onwerkbaar. Wens: één modal met overzicht van alle ontvangers,
adressen aanpasbaar, alles in 1x versturen.

**Uitvoering (backup /tmp/flow8-voor-bulkmail):**
- Nieuwe `openBulkMailModal(opdrachtIds)`: verzamelt per opdracht klant, e-mailadres, de
  juiste template (per opdrachttype — behouden), ingevuld onderwerp+body (`vulMailIn`), en de
  maillog-ref (deb via debId/skId). Overzichtsmodal met per regel: klantnaam + template,
  aanpasbaar e-mailveld, checkbox. Klanten zonder geldig adres zijn disabled + rood; live
  e-mailvalidatie schakelt de checkbox aan zodra een geldig adres is ingevuld.
- één "Verstuur alle"-knop: verstuurt sequentieel via `verstuurMailDirect`, met voortgangs-
  teller, logt elke mail (`logVerzondenMail`) + markeert de opdracht. Sluit af met samenvatting
  (X verstuurd / Y mislukt).
- Bulk-verzend-handler opent nu deze modal i.p.v. de oude setTimeout-lus met losse modals.
- Outlook-tekst vervangen door "Overzicht met alle ontvangers, in één keer verstuurd".

**Bug gefixt tijdens test:** "0 verstuurd, 2 mislukt" — `aan` werd als string doorgegeven,
maar de Cloud Function verwacht een array (zoals de werkende enkel-mail-weg). Fix: `aan:[r.email]`.
Tevens de echte foutmelding nu getoond bij mislukking (i.p.v. stil 'mislukt'). Getest ✅.

---

## ✅ KAART: TOGGLE SERVICEKLANT-SPELDEN 15 augustus 2026

Wens Thomas: bij veel serviceklanten wordt de kaart onoverzichtelijk; een toggle om de
serviceklant-spelden aan/uit te zetten (routes + opdrachten blijven).

**Uitvoering (backup /tmp/flow8-voor-sk-toggle):**
- State `_toonSkMarkers` (standaard true) naast `_locMap`/`_locFilter`.
- `_plaatsSkMarker`: nieuwe marker respecteert de toggle (`map:(_toonSkMarkers?map:null)`),
  ook markers die asynchroon via geocoding binnenkomen terwijl de toggle uit staat.
- Knop "Klanten" in de kaart-filterbalk (naast monteur-filter + refresh). Ghost = aan
  (pin-icoon), primary = uit (doorgestreept oog).
- Handler toont/verbergt alle `sk_`-markers via `setMap` ZONDER kaart-herlaad (behoudt zoom/
  positie). Alleen serviceklant-spelden; opdracht-markers (`op_`/`sk_opdracht`) + routes blijven.

Getest ✅ (Thomas): toggle werkt, opdrachten/routes blijven, geen herlaad-sprong.

---

## ✅ MAILLOG fase 2b — centraal overzicht 15 augustus 2026

Onderdeel van de maillog. Derde tab "Verzonden" in de klantmails-module (naast Planning +
Templates). Backup /tmp/flow8-voor-maillog-fase2b.

- `_renderMailVerzondenTab()`: tabel van alle `APP.mailLog`-records, nieuwste eerst, met
  kolommen Datum / Klant / Onderwerp / Ontvanger / Door (laatste twee `hide-mobile`).
  Zoekveld filtert op klant, onderwerp, ontvanger, afzender (`_mailVerzZoek`). Klik op rij →
  `toonMailInhoud(mailId)` (zelfde modal als bij de debiteur).
- `_mailKlantNaam(m)`: leidt de klantnaam af via de ref (debiteur direct, of via opdracht →
  debId/skId → debiteur). Toont altijd consistent de debiteur-naam, ook bij serviceklant-mails.
- `_bindMailVerzondenTab(el)`: rij-clicks + zoekveld met cursor-herstel na hertekenen.

Getest ✅ (Thomas): tabel, kolommen incl. klantnaam-afleiding, zoekfilter, klik-door naar
inhoud, mobiel leesbaar.

**Maillog nu compleet: fase 1 (loggen) + 2a (bij debiteur) + 2b (centraal overzicht).**
Nog open — fase 3 (later): Resend delivery-status via webhook; geplande verzending +
automatische mails (service-uitnodiging etc.). Losse oude records met ref=undefined uit de
begintijd blijven onschadelijk in de log staan (verschijnen niet bij een klant).

---

## ✅ MAIL-TEMPLATE CATEGORIEËN OPGESCHOOND 15 augustus 2026

Waarneming Thomas: bij de klantmail-templates stonden filter-chips "Alle/Planning/Werkplaats"
en een categorie-keuze in het "Nieuwe template"-formulier — overblijfselen van oude hardcoded
modules. Werkbon/werkorder-mails lopen al via de template-koppeling bij Instellingen →
Opdrachttypes, dus de categorie was functioneel dood (alle templates zijn 'planning'; er
bestaan geen werkplaats-templates meer in `MAIL_TEMPLATES_DEFAULT`).

**Uitvoering (backup /tmp/flow8-voor-mailcat-opschonen):**
- Filter-chips (Alle/Planning/Werkplaats) verwijderd uit `_renderMailTemplatesTab` → lijst
  toont gewoon alle templates, met korte uitleg erboven.
- Categorie-label (gekleurd tagje) per template weggehaald; alleen "Standaard"-tag blijft.
- Categorie-keuze uit `openMailTemplateNieuw` gehaald; nieuwe templates krijgen stil
  `categorie:'planning'` zodat ze koppelbaar blijven aan opdracht-/werkordertypes (filter
  r28319/28379 laat `!categorie||'planning'` door).
- Chip-filter-binding + ongebruikte `_tplCatFilter`/`catFilter` opgeruimd.
Standaard-templates blijven beschermd (niet verwijderbaar, "Standaard"-label) — bewust gedrag,
door Thomas akkoord bevonden. Getest ✅.

---

## ✅ MAILLOG fase 1 + 2a 15 augustus 2026

Doel (Thomas): verzonden klantmails centraal loggen en terugzien vanuit debiteuren/planning/
klantmails. Geïnspireerd op Outsmart (Klantcommunicatie-tab), maar breder kantoor-perspectief.
Keuzes: weergave bij debiteuren + centraal in klantmails (niet primair werkbon = monteur);
metadata + onderwerp + BODY loggen (voor "hoe zag de mail eruit"); geplande verzending +
Resend-status + automatische mails = later. Analyse: `flow8-maillog-analyse.md`.

**Fase 1 — centrale mailLog (backup /tmp/flow8-voor-maillog-fase1):**
- Nieuwe collectie `APP.mailLog` (array), geladen via `dbLoad('mailLog','mailLog')`, opgeslagen
  per record via `dbSaveItem('mailLog', id, rec)` (multi-tenant dbPath).
- `logVerzondenMail(gegevens)` schrijft één record: datum, aan[], cc[], onderwerp, body, methode
  ('direct'|'mailto'), door/doorEmail, ref, refType, refId, templateId, status ('verzonden').
  In try-catch — loggen mag nooit de verzending blokkeren.
- `_mailRefParse(ref)` normaliseert zowel string-refs ('deb:123') als object-refs
  ({type:'werkbon',id:...}) naar {type,id,raw}. Mapping deb→debiteur, wo→werkorder.
- Aangeroepen centraal in `openMailVerzendModal` in BEIDE verzendpaden (mailto r19662 +
  direct r19681), zodat elke mail wordt gelogd ongeacht herkomst.

**Fase 2a — weergave bij debiteur (backup /tmp/flow8-voor-maillog-fase2a):**
- Inklapbare sectie "Verzonden mails (X)" in `openDebPanel`, zelfde stijl als pompen-sectie
  (`_dpSectieKop`, sleutel 'mails' in `_dpOpen`). Verzamelt mails die bij de klant horen: via
  `deb:<id>` ÓF via opdrachten van de klant (`opdracht:<id>` waarbij die opdracht dezelfde
  debId/skId heeft). Nieuwste eerst.
- Klik op een mailregel → `toonMailInhoud(mailId)`: modal met aan/cc/onderwerp/datum/door/
  methode + de volledige body (Outsmart-wens "hoe zag de mail eruit").
- Helper `_dpMailDatumKort(iso)` voor "DD-MM-JJJJ uu:mm".

**Bug gefixt tijdens test:** ref wees naar `opdracht:` i.p.v. `deb:` bij serviceklant-mails
(opdracht heeft skId, geen debId). `stuurMail` leidt nu de debId af via de serviceklant
(`_mailDebId = o.debId || klant.debId || sk.debId`); klant-sectie neemt ook opdrachten via
skId mee. Getest ✅ met diagnose (`_mailDebug`, daarna verwijderd): Molecaten 471 toont 3 mails.

Nog open: **fase 2b** (centrale "Verzonden"-tab in klantmails-module, totaaloverzicht +
filter). **Fase 3 later** (Resend delivery-status via webhook; geplande/automatische mails).

---

## ✅ POMPEN MEE-VERWIJDEREN BIJ DEBITEUR (extra) 15 augustus 2026

Waarneming Thomas: bij het verwijderen van een debiteur/serviceklant bleven de gekoppelde
register-pompen staan (wees-pompen met een debId naar een verdwenen klant). Voorstel Thomas:
ernaar vrágen i.p.v. hard automatisch — pompen kunnen historie/documenten bevatten.

**Uitvoering (backup /tmp/flow8-voor-pomp-verwijder-vraag):**
- `bevestigActie` uitgebreid met optionele 5e param `extraHtml` (na de tekst ingevoegd, niet
  ge-escaped, alleen intern). De callback krijgt nu de checkbox-staat mee als argument.
  Volledig achterwaarts compatibel: de 74 bestaande aanroepen negeren het extra argument en
  geven geen extraHtml mee.
- `verwijderDeb`: telt de pompen van de klant (`p.debId===id`), toont een checkbox "Ook de X
  gekoppelde [pompen] uit het register verwijderen" (STANDAARD UIT = behouden). Bij aanvinken
  worden ze mee verwijderd, met backup zodat de bestaande 6-sec undo ook de pompen terugzet.
  Toast vermeldt wat verwijderd is. Gebruikt instelbare itemnaam (registerItemMeervoud).

Getest ✅ (Thomas): behouden (checkbox uit), mee-verwijderen (aan), undo incl. pompen, geen
checkbox bij klant zonder pompen.

---

## ✅ AANMAKEN IN REGISTER vanuit serviceklant (punt 1+2) 15 augustus 2026

Onderdeel van het register-workflow traject. Aanpak A gekozen door Thomas (auto-tussenopslag;
geen geneste modal-stack, want één modal-container — een tweede openModal overschrijft de
eerste, dus het debiteurformulier zou verloren gaan).

**Flow (backup /tmp/flow8-voor-aanmaken-register):** derde knop "Aanmaken in register" naast
de radio's Handmatig/Uit register in de pompsectie van het debiteurformulier. Bij klik:
1. `saveDeb(id, {stil:true})` — nieuwe stille modus: slaat de debiteur op ZONDER modal te
   sluiten/renderen en geeft `data.id` terug (of null bij validatiefout). Zo is er een debId
   om aan te koppelen, ook bij een nieuwe klant.
2. `openPompModal(null, {debIdVoor, naSluiten})` — nieuwe opties-parameter: `debIdVoor` vult
   de klant voor; `naSluiten(pompId)` wordt ná opslaan aangeroepen i.p.v. naar het register
   te navigeren.
3. Callback koppelt de nieuwe pomp aan het servicecontract (`sk.pompIds` + `pompKeuze='register'`)
   en heropent het debiteurformulier (`openDebModal(debId)`) — pomp staat aangevinkt in de
   "Uit register"-lijst. Meerdere pompen achter elkaar: gewoon opnieuw klikken.
Kernfunctie `_dfAanmakenInRegister(debId)` vlak vóór `openDebModal`.

**Getest ✅ (Thomas):** bestaande debiteur (1), meerdere pompen (3), koppeling zichtbaar als
"✓ contract" in klant-detail (4), nieuwe debiteur met auto-tussenopslag (2), validatie bij
ontbrekende naam/nummer (5) — allemaal goed.

**Bug gefixt tijdens test:** dubbele verwijder-bevestiging in de registerlijst — twee
identieke `.pr-del-btn` forEach-handlers bonden allebei een click → twee dialogen over elkaar.
Samengevoegd tot één (esc-veilig + waarschuwing documenten/onderdelen + instelbare itemnaam).

Nog open in dit traject: **punt 4B** (aanvullend/optioneel contracttype structureel; vervangt
de hardcoded `heeftBContract`-boolean door een contracttype-markering; datamodel-wijziging +
migratie; apart traject).

---

## ✅ REGISTER ↔ CONTRACT KOPPELEN (punt 3) 15 augustus 2026

Onderdeel van het register-workflow traject (4 punten, analyse in
`flow8-register-workflow-analyse.md`). Punt 3 als eerste opgepakt.

**Begripshelder (hoe de koppeling werkt):** een pomp heeft `debId` = koppeling aan de KLANT.
`sk.pompIds` (op de serviceklant) = koppeling aan het CONTRACT. Los daarvan de vlag
`p.toonOpWerkbon`. De werkbon toont een pomp via OF-logica (`_wbKlantObjecten`, r3091):
in contract (`sk.pompIds`) ÓF in een object (`pr_objecten`) ÓF `toonOpWerkbon===true`.

**Punt 3 gebouwd (backup /tmp/flow8-voor-contractkoppel):** in de register-pompdetail naast
"Tonen op werkbon" een nieuwe checkbox **"Gekoppeld aan servicecontract"**. Verschijnt alleen
als er een serviceklant met contract voor de `debId` bestaat (anders korte uitleg dat het niet
kan). Toont de huidige staat (in `sk.pompIds`), groene rand indien gekoppeld. Bij opslaan
wordt `sk.pompIds` bijgewerkt (aanvinken=toevoegen, uitvinken=verwijderen, laatste weg=null;
`await dbSaveItem('serviceklanten',...)`). Getest ✅.

**Twee bugs gevonden en gefixt tijdens test:**
1. "Pomp registreren"-knop werkte niet bij nieuwe pomp → mijn contract-checkbox verwees naar
   `debId` die in de render-scope niet bestond (alleen in de opslag-handler) → ReferenceError
   crashte de modal. Fix: `_pmDebId = pomp && pomp.debId ? pomp.debId : null`.
2. Klantnaam in register liep niet mee met een naamswijziging bij debiteuren → `p.klantnaam`
   werd als KOPIE getoond. Fix: overal de LIVE naam uit de debiteur (`debNaam(_d)` via `debId`)
   als bron van waarheid, terugval op de kopie alleen zonder debId. Aangepast: register-lijst,
   pomp-detail, export én zoekfilter. Getest ✅.

Nog open in dit traject: punt 1+2 (aanmaken in register vanuit serviceklant, met auto-
tussenopslag debiteur + automatische contractkoppeling) en punt 4B (aanvullend contracttype
structureel, apart traject met datamodel-migratie).

---

## ✅ REGISTER NEUTRAAL/CONFIGUREERBAAR 14 augustus 2026

Doel (Thomas): de app breder inzetbaar maken voor andere installatiebedrijven die niet met
pompen werken. Het woord "pompen" mag niet hardcoded in de UI staan, en variabele velden
mogen niet vast in de snelle weergave zitten.

**Instelbare itemnaam (weg B).** Leunt op het bestaande configureerbare labelsysteem
(`getRegisterInst()`, F9). Toegevoegd: `itemEnkel` (standaard 'Pomp') en `itemMeervoud`
(standaard 'Pompen'), met helpers `registerItemEnkel(cap)` / `registerItemMeervoud(cap)`.
Instellingen → Register: nieuwe card "Naam van de registratie" (enkelvoud + meervoud).
Alle zichtbare "pompen"-labels vervangen door de instelbare term: klant-detail-sectie,
werkbon-modal ("Pompen uit register"), opdracht/serviceklant-formulieren, register-statCards
("Pompen totaal", "Pompen in objecten"), objecten-kolomkop, lege-staten, koppel-knoppen.
De module-naam in de navigatie was al "Register" (r5677); de resterende "Pompregister"-
treffers zijn functienamen/comments (niet zichtbaar) → bewust niet hernoemd (cosmetisch,
zou risico toevoegen).

**Configureerbaar extra veld in snelle weergave.** De snelle weergave (klant-detail modal +
werkbon-modal in planning) toonde het variabele veld serienummer hardcoded. Nu: alleen de
twee VASTE velden (type = veld1 = titel, besturing = veld2) + één instelbaar extra veld naar
keuze. Toegevoegd: `snelWeergaveVeld` (key van een veld uit `velden`, of leeg = geen;
standaard 'serienummer' zodat Homa niets ziet veranderen). Helper `registerSnelVeldTekst(p)`
levert "Label: waarde eenheid" (serienummer krijgt "SN:"-prefix, overige velden hun label,
eenheid komt mee). Instellingen → Register: dropdown "Extra veld in snelle weergave" met de
variabele velden + "Geen". Bij de pickers (pomp koppelen/kiezen in bewerkscherm/werkbon)
blijft het serienummer WEL staan — daar help je de juiste pomp herkennen (bewuste keuze,
bevestigd door Thomas).

Getest ✅ (Thomas): itemnaam past overal aan; snelle weergave toont vaste velden + gekozen
extra veld; "Geen" toont alleen vaste velden; standaard serienummer behouden voor Homa.
Backups: /tmp/flow8-voor-register-label, /tmp/flow8-voor-snelweergaveveld.

---

## ✅ POMPEN IN KLANT-DETAIL 14 augustus 2026

**Wens (Thomas):** de aan het servicecontract gekoppelde pompen waren alleen zichtbaar via
Bewerken. Nu ook direct in het klant-detail-popup (`openDebPanel`), net als de secties
Contactpersonen en Locaties.

**Uitvoering (backup /tmp/flow8-voor-pompen-popup):** nieuwe inklapbare sectie "Pompen (X)"
tussen Locaties en Werkbonnen. Gebruikt de bestaande `_dpSectieKop`-helper en de generieke
`.dp-sectie-kop` toggle (sleutel 'pompen' in `_dpOpen`, geïnitialiseerd bij paneel-reset).
Toont alle pompen van de debiteur (`APP.wp_pompen` op `p.debId`), contract-pompen
(`sk.pompIds`) bovenaan met groen "✓ contract"-label, per pomp `type` + "SN: … · besturing"
— consistent met het bewerkscherm. Read-only (wijzigen blijft via Bewerken). Getest ✓.

---

## ✅ REISTIJD-UNIFICATIE 14 augustus 2026 — planning ↔ slimme dagplanning

**Probleem (Thomas):** reistijden in de planning weken af van de slimme dagplanning (bv.
Wendell dagplanning 94/14/68 vs planning 86/14/76; Arjan 37 min tussen buuradressen in
Maasbommel). Conclusie Thomas: twee systemen rekenen verschillend.

**Diagnose:** de rekenkern is gelijk (Google Directions, bedrijf als origin+destination,
zelfde adres-opbouw, geen verkeer-params). Het verschil is de VOLGORDE van de waypoints:
de dagplanning kan optimaliseren (`optimizeWaypoints`), de planning niet. Bovendien sloeg
"Tijden overnemen" (`_dpOverneemTijden`) alleen tijdVan/tijdTot op, NIET de berekende
reistijd → de planning herberekende zelf op tijd-volgorde i.p.v. de geoptimaliseerde route.

**Keuze Thomas: optie A (hybride).** Planning geeft altijd een eigen reistijd-indicatie,
maar gebruikt de opgeslagen dagplanning-waarde als die er is. Dagplanning = rekenplek +
optimalisatie; planning = weergave die het resultaat overneemt.

**Implementatie (4 onderdelen, backup /tmp/flow8-voor-reistijd-opslag):**
1. `_dpVerwerkLegs`: naast `_dpReistijd`/`_dpKm` nu ook `_dpReistijdVan` (idx0='bedrijf',
   rest='vorige') en `_dpRetourKm`.
2. `_dpOverneemTijden`: slaat `orig.reistijden[monteurId] = {min,km,van,retourMin,retourKm}`
   op — PER MONTEUR, want een gedeelde klus rijdt bij elke monteur een andere v/vorige-leg.
   Ook naar Firebase (`dbPath('opdrachten',id,'reistijden',monteurId)`).
3. Planning-weergave (adres-case): opgeslagen `o.reistijden[clusterMonteur]` heeft VOORRANG
   (toont "X min · Y km v/van"); alleen zonder opgeslagen waarde → bestaande live-berekening.
4. Handmatig opslaan (`_doSaveOpdracht`): wist `data.reistijden` als adres/postcode/tijdVan/
   tijdTot/monteurIds wijzigde (`_routeGewijzigd`-check). Bewust NIET in `invalideerReistijden`
   gezet (zou een lus geven bij elke save: dagplanning slaat op → listener → wist meteen).

**Getest ✓ (Thomas):** na dagplanning berekenen + "Tijden overnemen" toont de planning
identieke tijden. Losse opdracht zonder dagplanning → live indicatie. `dbListen('opdrachten')`
laadt het reistijden-veld automatisch mee.

Analyse: `flow8-reistijd-unificatie-analyse.md`.

---

## ✅ PLANNING-FIXES 14 augustus 2026 — clustering, reistijd, route

Groot samenhangend spoor. Drie waarnemingen van Thomas, met gedeelde wortel: alles hing aan
`monteurId` (de toevallig eerst aangeklikte primaire monteur) i.p.v. de werkelijke situatie.

**1. Monteur-clustering (opgelost).** Clustersleutel (r14308) ging van `o.monteurId` naar de
gesorteerde monteur-SET (`monteurIds.sort().join('|')`). Gevolg: een gedeelde klus (Jimmy+Arjan)
komt in een eigen cluster, los van de solo-klussen van elke monteur. Voorheen viel de gedeelde
klus in de cluster van wie eerst was aangeklikt, en "besmette" die de header. Cluster-lookup en
sortering aangepast om de set-sleutel te interpreteren (eerste monteur voor `getMed`, solo-cluster
vóór gedeelde bij zelfde eerste monteur). Header (`_mhSet`) leest de set van de cluster.
- Geleerd: `monteurId = monteurIds[0]` (r15969) = de EERST aangeklikte. Puur toeval welke.

**2. Reistijd "v/bedrijf" + volgorde (opgelost, taai).** Kernketen:
- Reistijd berekend per monteur+datum via `berekenReistijdenVoorPlanning`; filtert op ALLE
  betrokken monteurs (primair + mede), sorteert op `_planRouteVolgorde` (tijdVan||blokVan||99:99).
- Cluster sorteert nu OOK op `_planRouteVolgorde` (tijd) — de leesbare volgorde. NIET op de
  route-cache-volgorde (die kan verouderd zijn). Eerdere pogingen (route-index leidend,
  planVolgorde-veld) teruggedraaid: te complex / verkeerde aanname (opdrachten hébben tijden).
- Label "v/bedrijf" = eerste rij van de cluster (oidx===0); reisleg-waarde via opzoek-op-id in
  de cache. Bij multi-cluster (monteur in gedeeld + solo) is dit fysiek correct: de tweede
  cluster toont "v/vorige" want de monteur komt daar van zijn vorige klus, niet van het bedrijf.
- **De echte bug: verouderde reistijd-cache.** Cache-sleutel is `monteurId_datum` en verandert
  niet als tijden/volgorde binnen de dag wijzigen (bijv. na autoplanner-run). Oude legs bleven
  gekoppeld → verwisselde reistijden. **Fix:** vóór elke reistijd-trigger (r14277-gebied)
  valideren of de cache-`ops` (id-volgorde) nog overeenkomt met de huidige opdrachten op tijd;
  bij verschil `delete _locReistijden[sleutel]` + DB-cache `_rtCachePad` verwijderen → verse
  berekening. Ook `invalideerReistijden` toegevoegd aan `_apAanmaken` (autoplanner-overname
  gebruikt bulk-`update`, triggert r5070 dbSaveItem-invalidatie niet).
- Reistijd berekent nu voor ALLE betrokken monteurs (r14264-gebied), niet alleen de primaire —
  anders kreeg de 2e monteur van een gedeelde klus geen eigen dagroute.

**3. Route-optimalisatie kiest niet de allersnelste (GEEN bug, geparkeerd).** Google's
waypoint-heuristiek met vaste start/eind (bedrijf); ~2 min verschil met handmatig is inherent.
Optioneel later: tijdblokken laten respecteren in de optimalisatie. Thomas akkoord: laten.

**Aanpak-keuze bevestigd door Thomas:** clustering is een VISUELE groepering; de reistijd volgt
de FYSIEKE dagroute per monteur (één route langs al zijn stops, niet twee keer vanaf het bedrijf).
Praktijk: 2 monteurs samen naar 1 klus, daarna elk een solo — komt voor, nu correct weergegeven.

Analyse-documenten: `flow8-clustering-reistijd-route-analyse.md`,
`flow8-reistijd-volgorde-oplossing.md`.

---

## ✅ OPSCHOONRONDE 13 augustus 2026 — status A–H geverifieerd in code

Bij een systematische controle tegen de code bleken de meeste A–H-punten al geïmplementeerd
(analyse én uitvoering). Actuele status:

| Punt | Status | Bevestiging in code |
|---|---|---|
| A1 — statusknoppen/spoed/mail achter recht | ✅ klaar | statusknoppen+spoed achter `if(kanPlannen)` (r15054); mail achter `kanPlannen\|\|magSchrijven('klantmails')`; dashboard-klik achter magLezen |
| B2 — SK-marker debiteur-standaardlocatie | ✅ klaar | maakSkMarker r24574, gebruikt debiteur-locatie |
| C3 — gedeelde `_planbaar()` | ✅ klaar | r11536, overal gebruikt |
| D4 — reistijd-cache invalideren | ✅ klaar | `_rtVerouderd`-mechanisme + DB-remove + koelperiode |
| D5 — losse geocoders → geocodeMetCache | ✅ klaar | enige `new Geocoder()` zit ín de helper (r24454) |
| E6 — dagheader donkerder | ✅ klaar | `--dagkop` aangepast (r31) |
| E7 — mobiel inputs 16px + 100dvh | ✅ klaar | r632 media-query 16px!important; 100dvh overal |
| F8 — Pompregister → Register (labels) | ✅ klaar | labels 'Register', interne sleutel `pompregister` intact |
| F9 — register volledig configureerbaar | ✅ klaar | getRegisterVelden/registerVeldWaarde/-Label + 'Veld toevoegen'-UI |
| F10 — onderdelenlijst live tellen | ✅ klaar | `_prVindOnderdelenlijstDoc` (r21642) |
| G11 — contract-import | ✅ klaar | bevestigd vorige sessie |
| H12 — credits/licenties | ○ groot, strategisch | server-side traject, geen bugfix |

**Uit A–H is nu alles af behalve H12** (groot, strategisch licentie-traject). A1 bleek bij
controle óók al gedaan (rechtenchecks staan er). H12 blijft een apart traject voor later.

---

## A — Rechten & Dashboard

### A1. ✅ Monteur kan vanaf dashboard opdrachten openen en muteren zonder rechten
**✓ oorzaak vastgesteld** · omvang: klein · risico: laag

De klikhandler op regel 7036 roept `openOpdrachtPanel(item.dataset.id)` aan **zonder enige
rechtencheck**. Binnen dat paneel is de afscherming halfslachtig:

| Actie | Regel | Afgeschermd? |
|---|---|---|
| Statusknoppen (`panel-status-btn`) | 13859 | ✗ nee |
| Spoed-toggle | 13160 | ✗ nee |
| Mail versturen | 13875 | ✗ nee |
| Herplannen | 13876 | ✓ `magSchrijven('planning')` |
| Bewerken / Verwijderen | 13879–13881 | ✓ `magSchrijven('planning')` |

`toonPagina()` blokkeert wél een module zonder `magLezen`, maar monteurs hébben leesrecht op
planning — dus dat vangnet grijpt hier niet.

**Aanpak:** statusknoppen, spoed-toggle en mail achter `magSchrijven('planning')` zetten, en de
dashboardklik alleen toestaan bij `magLezen('planning')`. Voor een monteur zonder schrijfrecht
wordt het paneel puur informatief.

---

## B — Kaart & Locaties

### B2. ✅ Welk adres gebruikt het kaartoverzicht voor serviceklanten?
**✓ beantwoord** · omvang: klein–middel

`maakSkMarker()` (regel 22841) bouwt het adres op als `k.adres + ' ' + k.postcode` — dus het
**hoofdadres van de serviceklant**. De standaard-/voorkeurslocatie wordt niet gebruikt.

Belangrijk: locaties bestaan alleen op **debiteur**-niveau (`deb.locaties[...]`, met een
`isStandaard`-vlag, regels 8873–8877). Serviceklanten hebben geen eigen locatielijst. Als een
serviceklant hoort bij een debiteur met een afwijkende standaardlocatie, staat de marker dus op
het verkeerde punt.

**Aanpak:** in `maakSkMarker` eerst de gekoppelde debiteur zoeken via `k.debId`, en als die een
locatie met `isStandaard` heeft, dát adres gebruiken. Anders terugvallen op `k.adres`.
Let op: `_geoAdres` is de cachesleutel, dus bestaande coördinaten hergeocoderen automatisch zodra
het adres wijzigt. Geen migratie nodig.

---

## C — Planning

### C3. ✅ Opdrachten met status "actie vereist" uitsluiten van dagplanning en route-optimalisatie
**✓ oorzaak vastgesteld** · omvang: klein

`_dpLaadOpdrachten()` filtert op `o.status !== 'afgehandeld'`. Statussen `actie` en `verwerkt`
komen dus gewoon mee. Er is een tweede optimalisatiepad (`_optimaliseerPostcode` / de routewizard
rond regel 12451) met een eigen selectie — die moet dezelfde regel krijgen, anders wijken de twee
schermen van elkaar af.

**Aanpak:** één gedeelde helper `_planbaar(o)` en die op beide plekken gebruiken, zodat de regel
op één plek staat.

---

## D — Route & Google API

### D4. ✅ Reistijden pas zichtbaar na opnieuw inloggen
**✓ oorzaak vastgesteld** · omvang: klein · dit is de kern van je klacht

`_locReistijden` wordt **nergens ingevalideerd** — geen enkele `delete` in het hele bestand.
Zodra een monteur/datum-combinatie één keer berekend is, blijft die uitkomst staan tot de pagina
herlaadt. Voeg je daarna een opdracht toe aan diezelfde dag, dan wordt de oude route getoond en
ontbreekt de reistijd voor de nieuwe stop. Herladen = opnieuw inloggen: dan is de cache leeg en
klopt het weer.

Extra: bij een mislukte aanroep wordt een **lege** uitkomst gecached (regel 23011). Ook die blijft
dan permanent staan.

**Aanpak:** bij opslaan, verplaatsen of verwijderen van een opdracht de sleutel
`monteurId + '_' + datum` wissen — voor zowel de oude als de nieuwe monteur/datum bij een
verplaatsing. Daarna herberekent hij vanzelf bij de eerstvolgende render.

### D5. ✅ Google Maps API wordt te vaak aangeroepen
**✓ oorzaak vastgesteld** · omvang: middel · dit kost direct geld

Er is een prima cachehelper `geocodeMetCache()` (regel 22721, met geheugencache én opslag van
`_geoLat`/`_geoLng` in de database). Maar er zijn **vier Geocoder-instanties die eromheen gaan**:

- regel 11695 — dagplanning
- regel 19947 — pompregister
- regel 20570 — pompregister
- regel 23511 — locatiekaart

Daarnaast 8 losse `DirectionsService`-aanroepen, waarvan een deel dezelfde route berekent
(`berekenReistijdenVoorPlanning` op 22991 en `tekenMonteurRoute` op 23051 doen bijvoorbeeld
hetzelfde rondje voor vandaag).

**Aanpak:** alle vier de losse geocoders door `geocodeMetCache` vervangen, en een vergelijkbare
cachelaag om DirectionsService zetten met dezelfde sleutel als `_locReistijden`. Combineer dit
met D4 — het is dezelfde cache.

**Openstaand van vorige sessie (nog niet opgelost):**
- Geen spreiding bij retry: vijf monteurs die tegelijk `OVER_QUERY_LIMIT` krijgen, retryen
  allemaal na exact 700 ms — dus opnieuw gelijktijdig.
- Laadt het Maps-script niet binnen ~3 s (traag 4G), dan stopt de retrylus stil en blijft
  "laden…" staan; er wordt dan niets in de cache gezet.

---

## E — UI

### E6. ✅ Dagheader donkerder
**✓ eenvoudig** · omvang: zeer klein

Er is een designtoken: `--dagkop:#1c2438` (donker, regel 31) en `#e8ebf2` (licht, regel 38+121).
De planning gebruikt `background:var(--dagkop)` op regel 13171. Aanpassen op één plek volstaat —
mits beide themavarianten meegenomen worden.

**Aanpak:** twee tot drie kandidaatwaarden naast elkaar in een preview, dan kiezen.

### E7. ✅ Mobiel verspringt bij zoomen/verschuiven; bovenste knoppen onbereikbaar
**? hypothese, sterk onderbouwd** · omvang: middel · risico: raakt de hele app

Twee waarschijnlijke oorzaken, waarschijnlijk allebei tegelijk:

1. **`.input{font-size:13px}`** (regel 50). iOS Safari zoomt automatisch in bij focus op een veld
   kleiner dan 16px. `user-scalable=no` in de viewport-meta (regel 5) wordt door iOS sinds versie 10
   genegeerd. Gevolg: de pagina zoomt, scrollt mee omhoog, en de vaste topbar valt buiten beeld.
2. **6× `100vh`** in de CSS (o.a. `.panel`, regel 310). Op mobiel is `100vh` de hoogte *zonder*
   adresbalk; bij het in- en uitschuiven van die balk verspringt de layout. Er wordt al 2× `dvh`
   gebruikt, dus de oplossingsrichting staat al in het bestand.

**Aanpak:** inputs op mobiel naar 16px via een media-query (visueel bijna identiek), en `100vh`
vervangen door `100dvh` met een `vh`-fallback. Dit raakt veel schermen — eerst een preview, dan
testen op je iPhone én Android voordat het definitief wordt.

---

## F — Register (voorheen Pompregister)

### F8. ✅ Hernoemen Pompregister → Register
**✓ omvang bekend** · omvang: klein–middel · risico: gemiddeld

45 voorkomens van "ompregister": 12× `Pompregister` (labels) en 37× `pompregister` (identifiers).
Die laatste zijn géén tekst maar **sleutels**: paginanaam in `NAV`, de router-tabel in
`toonPagina()`, en — kritiek — de **rechtenmodule-sleutel** die in Firebase per rol is opgeslagen.

**Aanpak:** alleen de zichtbare labels hernoemen, de interne sleutel `pompregister` intact laten.
Anders verliest iedere gebruiker zijn rechten op die module en moeten alle rollen opnieuw ingesteld
worden. Dit scheelt ook een datamigratie.

### F9. Register volledig configureerbaar maken
**○ ontwerp** · omvang: groot · dit is het zwaarste punt van de lijst

Wat je vraagt:
- 2 vaste velden waarvan de beheerder de naam bepaalt (nu hard: pomptype en besturing)
- die 2 bovenaan tonen
- overige velden dynamisch samen te stellen (nu hard: waaier, spanning, amperage, …)
- de 2 vaste velden ook tonen bij *Debiteur aanmaken → heeft servicecontract*
- een instellingenpagina om dit per bedrijf te beheren

Dit is een datamodelwijziging, geen UI-klus. Het raakt: het register zelf, de detailweergave, de
kolomkiezer, export, zoeken, de serviceklant-velden `pomptype`/`besturing`, en de PDF's.

**Aanpak:** eerst een concept + schema, geen code — conform de werkwijze bij grote features.
Fasering: (1) veldendefinitie in instellingen, (2) register leest die definitie, (3) debiteur/
serviceklant volgt, (4) export en PDF volgen. Voorstel: pas oppakken ná de bugfixes.

### F10. ✅ "Met onderdelenlijst" blijft op 2 staan
**✓ oorzaak vastgesteld** · omvang: klein · schoolvoorbeeld

Regel 20212 telt op `p._ondCount` — een **cacheveld** dat alleen wordt gezet bij handmatig
toevoegen of verwijderen van een onderdeel (regels 21013, 21626, 21829). Pompen die hun onderdelen
via een gekoppeld artikel/Materialen krijgen, of die van vóór dit veld dateren, hebben `_ondCount`
helemaal niet → ze tellen niet mee. De teller staat op 2 omdat dat de enige twee pompen zijn die je
sindsdien handmatig hebt bewerkt.

Dit is precies het principe uit de werkwijze: *leid afgeleide waarden live af uit de bron*.

**Aanpak:** live tellen via een helper die zowel `pomp.onderdelen` als de onderdelen van het
gekoppelde artikel meeneemt (`_prVindOnderdelenlijstDoc` op regel 21634 doet die koppeling al).
`_ondCount` daarna als sorteerhulp laten staan of geheel schrappen.

---

## G — Contracten

### G11. Bij import wordt alleen Contract B aangevinkt
**✓ oorzaak vastgesteld** · omvang: middel · datamodel, geen bug

De serviceklant kent maar **één** onderhoudscontract: `contractType` is een enkele string
(regel 9703), en `heeftBContract` is een losse boolean (regel 9704). B is dus als enige apart
opgeslagen — vandaar dat alleen die "automatisch aangevinkt" lijkt.

Heeft een klant méér dan één A/C-contract, dan komt hij in `a.conflict` terecht en wordt er
bewust **niets** gewijzigd; de importmelding vraagt je zelf te kiezen welk contract leidend is.
Het gedrag is dus opzettelijk, maar past niet meer bij wat je wilt.

**Aanpak:** `contractType` (string) uitbreiden naar `contractTypes` (array), met `contractType`
als afgeleide voor backward compatibility. Raakt: import, serviceklantformulier, filters,
statkaarten, export, contractoverzicht en de planningslogica die op contracttype de frequentie
bepaalt. Vraagt een eigen analyse voor we beginnen.

---

## H — SaaS & Licenties

### H12. Credits-/licentiesysteem met prijsdifferentiatie
**○ ontwerp** · omvang: groot · strategisch, geen bugfix

Onderscheid tussen administratief personeel en monteurs/werkbongebruikers.

Dit hangt samen met het multi-tenant traject en met de Firestore-rules die nog openstaan. Zonder
serverzijde is een licentiesysteem client-side niet af te dwingen — dat vraagt een tussenlaag
(conform de werkwijze: externe integraties als apart project behandelen).

**Aanpak:** eerst een conceptnotitie: prijsmodel, wat een "seat" is, hoe je telt, waar je
afdwingt. Geen code in deze fase.

---

# Voorgestelde volgorde

**Blok 1 — bugs met vastgestelde oorzaak (klein, direct waarde)**
1. D4 — reistijdencache invalideren *(jouw hoofdergernis)*
2. F10 — teller onderdelenlijsten live berekenen
3. C3 — actie-opdrachten uit dagplanning en optimalisatie
4. A1 — rechten dashboard en opdrachtpaneel
5. E6 — dagheader donkerder

**Blok 2 — middelgroot, eerst preview/testen**
6. D5 — API-aanroepen bundelen achter de cache *(sluit aan op D4)*
7. B2 — kaart naar standaardlocatie
8. E7 — mobiele viewport *(preview + test op echt toestel)*
9. F8 — hernoemen naar Register, labels only

**Blok 3 — datamodel, aparte analyse per punt**
10. G11 — meerdere contracten per serviceklant
11. F9 — configureerbaar register

**Blok 4 — ontwerp, geen code**
12. H12 — credits/licenties

---

# Afsluitende controle

Na elk blok: JS-syntaxcontrole, en na blok 1 en 2 een testronde op iOS, Android en desktop.


---

# Uitgevoerd — blok 1 (2 augustus 2026)

| Punt | Wat er is gewijzigd |
|---|---|
| **D4** | Helpers `invalideerReistijden(o)` en `invalideerReistijdenVoorId(id)` naast de cachedeclaratie; ingehaakt in `dbSaveItem` en `dbRemove`, dus alle 15 schrijfpunten in één keer gedekt. Wist zowel de nieuwe monteur/datum-sleutels als elke entry die de opdracht nog in zijn opgeslagen `ops` heeft — daarmee klopt ook verplaatsen naar een andere monteur of dag. Invalidatie gebeurt vóór de netwerkaanroep, dus ook offline correct. |
| **F10** | Helper `_pompHeeftOnderdelen(p)`, gemodelleerd naar het bestaande `_pompDocAantal`: eigen onderdelen → `_ondCount` als fallback → onderdelenlijst-document op pomp of gekoppeld artikel. Dat laatste was de ontbrekende schakel. Statkaart telt nu live. |
| **C3** | Gedeelde helper `_planbaar(o)` met `_NIET_PLANBAAR = ['actie','afgehandeld','verwerkt']`. Toegepast op `_dpLaadOpdrachten`, op `_genRouteVoorstel` (routewizard) én op de teller in de monteur-dropdown, die anders een ander aantal toonde dan er geladen werd. `verwerkt` is meegenomen omdat de rest van de app `['afgehandeld','verwerkt']` op 14 plekken als afgerond behandelt. |
| **A1** | Dashboardklik vereist `isAdmin() \|\| magLezen('planning')`; zonder recht vervalt ook de pointer. In het opdrachtpaneel staan statusknoppen en spoed-toggle achter `kanPlannen` — verborgen in plaats van uitgezet, omdat status en spoed al als tag in de paneelkop staan. Mail achter `kanPlannen \|\| magSchrijven('klantmails')`, zodat planners hun bestaande recht houden. Werkbon openen ongemoeid. |
| **E6** | Donker thema ongewijzigd (`#1c2438`); licht thema van `#e8ebf2` naar `#d2d9e6`, op beide plekken waar de `body.light`-regel voorkomt (regels 38 en 121 zijn duplicaten). |

## Getest (blok 1) — alle punten akkoord

1. **D4** — opdracht toevoegen aan een dag waarvan de reistijden al berekend zijn: de nieuwe stop moet direct verschijnen, zonder herladen. Idem na verplaatsen naar een andere monteur: beide routes moeten opnieuw berekenen.
2. **F10** — de statkaart "Met onderdelenlijst" zou nu hoger moeten staan dan 2. Let op: de artikelencache laadt lazy, dus de teller kan een fractie later bijspringen.
3. **C3** — zet een opdracht op "Actie vereist" en open de dagplanning: hij hoort te verdwijnen uit zowel de lijst als het aantal achter de monteursnaam.
4. **A1** — inloggen als monteur zonder schrijfrecht op planning: geen statusknoppen, geen spoed-toggle, geen mailknop, wel de werkbon.
5. **E6** — lichte thema, planning in lijstweergave.

## Bekend restpunt (uit vorige sessie, nog open)

- Geen spreiding bij retry op `OVER_QUERY_LIMIT`: gelijktijdige aanvragen retryen ook weer gelijktijdig.
- Laadt het Maps-script niet binnen ~3 s, dan stopt de retrylus stil en blijft "laden…" staan.

Beide horen bij **D5** in blok 2.


---

# Uitgevoerd — blok 2 (2 augustus 2026)

| Punt | Wat er is gewijzigd |
|---|---|
| **D5 geocoding** | Alle vijf geocode-aanroepen lopen door `geocodeMetCache`; geen losse `new google.maps.Geocoder()` meer. Helper geeft nu ook `label` (`formatted_address`) terug — dat had de afstandzoeker nodig om op de cache te kunnen. Gelijktijdige aanvragen voor hetzelfde adres worden gebundeld via `_geoBezig`. Markers krijgen een schone `{lat,lng}` zonder `label`. |
| **D5 routes** | `_vraagRoute(sleutel, request, cb)` + `_routeCache`, met `_routeVerzoekVoor(ops)` en `_routeAdres(o)` voor de gedeelde verzoekopbouw. Kaart en planning vroegen dezelfde dagroute los van elkaar op; nu delen ze één sleutel en één request. Gekoppeld aan de D4-invalidatie via `_wisRouteSleutel(k)`. Retry heeft nu spreiding (700/1400/2100 ms + 0–400 ms willekeur). Maps-laadlus wacht tot ~10,5 s en cachet leeg bij opgeven. Dode `waypoints`-variabele en overbodige `poging`-parameter verwijderd. |
| **D5 bewust niet** | Zes DirectionsService-aanroepen in dagplanning, routewizard en afstandzoeker. Die gebruiken `optimizeWaypoints` en draaien alleen op knopdruk; cachen levert weinig op en riskeert verouderde volgordes. |
| **B2** | `maakSkMarker` gebruikt nu `_apKlantAdres(k)` — dezelfde helper als de adresplanner. Volgorde: standaardlocatie van de gekoppelde debiteur → andere locatie → adres op klant of debiteur. Eén definitie van "waar is het werk". Klanten met een debiteurlocatie worden eenmalig hergeocodeerd (`_geoAdres` wijkt af); klanten zonder locatie houden dezelfde string en kosten niets. |
| **F8** | 12 zichtbare labels hernoemd naar Register: navigatie, twee terugknoppen, kolomkiezer, back-upoverzicht, rechtenmatrix, debiteur-servicecontract (radio + checkbox), toast, lege staat, onderdelenlijst-melding, CSV-bestandsnaam. De sleutel `pompregister` blijft overal staan — die zit in de rechtenmatrix per rol in Firebase, NAV-id, router, SVGS en `activePage`-checks. Hernoemen zou iedere gebruiker zijn rechten op de module kosten. |
| **E7** | `interactive-widget=resizes-content` in de viewport-meta: het toetsenbord verkleint nu de layout in plaats van hem te verschuiven. Zes keer `100vh` → `100dvh` met `vh`-fallback (`body.app-active`, `#app` desktop én mobiel, `#sidebar`, `.panel`, locatiekaart-`calc`). Tijdveld bij Werktijden van `13px !important` naar de standaard 16px. |

## Correctie op de oorspronkelijke analyse (E7)

De hypothese dat `.input{font-size:13px}` de zoom veroorzaakte klopte maar half: verderop
in hetzelfde mediablok stond al `.input,input,select,textarea{font-size:16px!important}`.
Die afdekking was er dus al. Eén regel doorbrak hem — het tijdveld in Werktijden, met
`font-size:13px !important`. Dat is nu de enige aanpassing op dat vlak; de rest van de
oplossing zit in `dvh` en de viewport-meta. Verwachting: de winst komt vooral van `dvh`.

## Te testen (blok 2)

1. **B2** — locatiekaart openen: serviceklanten met een afwijkende standaardlocatie moeten verspringen naar het juiste punt. Eenmalige hergeocodering, dus de eerste keer iets trager.
2. **D5** — kaart openen en daarna de planning: de route van vandaag hoort uit de cache te komen. In het logvenster één `OK REISTIJD` per monteur/datum, niet twee.
3. **D5** — na een opdrachtwijziging moet de route wél opnieuw berekenen (D4-invalidatie raakt nu beide caches).
4. **F8** — menu, terugknoppen, kolomkiezer, rechtenmatrix en debiteur-servicecontract tonen "Register". Rechten op de module moeten ongewijzigd werken.
5. **E7** — op iOS: scrollen en zoomen in de planning, en een tijdveld openen bij Instellingen → Werktijden. Topbar moet bereikbaar blijven. Ook Android controleren, daar werkt `interactive-widget` het meest merkbaar.


---

# Naleveringen (2 augustus 2026)

| Punt | Wat er is gewijzigd |
|---|---|
| **B2-restpunt** | De InfoWindow op de kaart toonde `k.adres` terwijl de speld al op het werkadres stond — marker en popup spraken elkaar tegen. Popup gebruikt nu `_apKlantAdres(k)`, met postcode/plaats op een tweede regel. Ook de klantzoeker op de kaartpagina: de weergave toont het werkadres, en het zoekfilter doorzoekt bewust *beide* adressen, zodat je de klant vindt of je nu het hoofdadres of het locatieadres kent. |
| **Koelperiode** | `_wisRouteSleutel` markeert een sleutel nu als verouderd in plaats van hem direct te wissen; na 3 seconden zonder nieuwe mutatie worden ze gezamenlijk opgeruimd (`_RT_KOELTIJD_MS`, `_rtVerouderd`, `_vernieuwVerouderdeRoutes`). Tien opdrachten inplannen op dezelfde dag kost zo één route-aanvraag in plaats van tien. Bijeffect: de reistijdkolom klopt pas na die drie seconden — bewust geaccepteerd, want het voorkomt ook geknipper. |

## Kostenbeeld Google Maps (augustus 2026)

- Geocoding: ongeveer $5 per 1.000 requests.
- Directions **met waypoints** valt in een duurdere categorie dan losse punt-tot-punt-routes. Flow8's dagroute gebruikt waypoints, dus de routecache is per aanvraag meer waard dan de geocache.
- Het oude $200-maandtegoed is in maart 2025 vervangen door vrije contingenten per SKU. Er is **geen harde bovengrens**: zonder zelf ingesteld quotum loopt de meter door.

**Actie buiten de code:** stel in Google Cloud Console een dagquotum en een budgetwaarschuwing in. Dat is de enige echte rem.

**Grootste resterende besparing:** `_locReistijden` is puur geheugen — elke pagina-herlaad begint leeg. Routes van gisteren en vandaag veranderen niet meer, dus die zijn persistent op te slaan per monteur+datum, net zoals `_geoLat`/`_geoLng` bij serviceklanten al gebeurt. Dat scheelt structureel meer dan alles wat we tot nu toe hebben gedaan. Nog niet ingepland.


---

# Reistijden: bereik, cache en kostenbeeld (2 augustus 2026)

## Werkelijk verbruik

Het Google-verbruik van Homa was afgelopen maand **4 cent**. Het verbruik valt dus ruim
binnen de gratis contingenten per SKU. Kosten zijn geen sturend criterium voor Flow8 in
de huidige omvang — snelheid en volledigheid wegen zwaarder.

Dit blijft wél relevant voor **H12 (licentiemodel)**: het verbruik schaalt met het aantal
planners, niet met het aantal bedrijven. Bij tientallen tenants verandert het beeld.

## Wat er is gebouwd

| Onderdeel | Toelichting |
|---|---|
| **Instellingen → Planning** | Twee velden onder "Reistijden — bereik en bewaartermijn": *vooruit berekenen* (standaard 21 dagen, max 60) en *bewaren* (standaard 14 dagen, hard begrensd op 30). Opgeslagen als `planningInst.reistijdDagenVooruit` en `planningInst.reistijdCacheDagen`. |
| **Reistijdvenster** | `_binnenReistijdVenster(datum)` begrenst welke monteur/dag-combinaties worden opgehaald. Dagen in het verleden altijd overslaan. Buiten het venster verschijnt géén "laden…" — dat zou permanent blijven staan. |
| **Persistente cache** | `reistijdCache/{monteurId}_{datum}` in RTDB met `ts`, opdracht-id's en per traject alleen `duration`/`distance` (tekst + waarde). Geen polylines of routebeschrijvingen. `laadReistijdCache()` draait 300 ms na `laadData()` en ruimt verlopen entries lokaal én in de database op. Bij een opdrachtmutatie wordt de sleutel ook uit de database verwijderd. |
| **Vervaldatum coördinaten** | `_geoNogGeldig(rec, adresStr)` met `_geoTijd`-stempel en een grens van 30 dagen. Records van vóór deze wijziging hebben geen stempel en gelden als verlopen — die worden eenmalig opnieuw opgehaald. |
| **Koelperiode** | Bijgesteld van 3000 ms naar **1000 ms**: genoeg om een reeks wijzigingen te bundelen, zonder dat de reistijdkolom merkbaar achterloopt. |

## Waarom de defaults zijn bijgesteld

De eerste versie stond op 7 dagen vooruit en 3 seconden koeltijd — gekozen om aanvragen
te sparen. Bij een verbruik van 4 cent per maand is dat de verkeerde ruil: het kost
zichtbare reistijden bij verder vooruit plannen, en een kolom die achterloopt na elke
wijziging. Nu 21 dagen en 1 seconde. Wie ooit wél tegen een limiet aanloopt, zet het
bereik in de instellingen omlaag.

## Nog open

- **Firebase-rules:** de nieuwe `reistijdCache`-node valt onder dezelfde regels als de
  rest en is nog niet afgeschermd. Meenemen bij het dichtzetten van de rules.
- **Voorwaarden:** de 30-dagengrens komt uit de openbare Google-voorwaarden. Of
  reistijden (naast lat/lng en place_id) onder cachebare content vallen, is niet
  eenduidig; voor EER-klanten gelden aparte voorwaarden. Verifiëren in de eigen
  overeenkomst als dit ooit juridisch relevant wordt.

## Te testen

1. Logvenster bij opstarten: regel met aantal routes uit cache en aantal verlopen.
2. Herladen: de planning zou géén nieuwe `OK REISTIJD` moeten produceren.
3. Instellingen → Planning: bereik en bewaartermijn opslaan, en controleren dat een
   ingevoerde waarde boven 30 wordt teruggezet naar 30.
4. Eerste keer kaart openen: eenmalige piek doordat coördinaten zonder `_geoTijd`
   opnieuw worden opgehaald.


---

# Stand van zaken — einde 2 augustus 2026

Canoniek bestand: `flow8-v2.html`, 32.492 regels, JS-syntax ✓.

## Afgerond en getest

Blok 1 (D4, F10, C3, A1, E6) en blok 2 (D5, B2, E7, F8), plus:

- **RTDB-rules fase 1** gepubliceerd. Vier lekken gedicht: zelfpromotie, alle bedrijven
  leesbaar/beschrijfbaar voor elke admin, en het ontbreken van een activatiecheck.
  De administratie-switcher werkt hierdoor niet meer — bewust geaccepteerd.
- **Gebruikersbeheer** uitgebreid: rolkeuze bij aanmaken, rol wijzigen per rij,
  toegang aan/uit, lijst met medewerkers zonder login, foutafhandeling op alle
  schrijfacties. De oude accounts zonder profiel zijn opgeruimd.
- **Functietitel** met suggesties uit bestaande waarden; rollabels verduidelijkt
  ("Rol (planning en beschikbaarheid)" vs "Rol (rechten in de app)").
- **G11 contracten** — bleek geen datamodelprobleem maar een bug: de debiteur bewaarde
  een eigen kopie `d.skContractType` die de import niet bijwerkte. Kopie verwijderd,
  formulieren lezen nu de serviceklant. Beide formulieren slaan voortaan de **code** op
  in plaats van het id, net als de import. Import werkt.

## Openstaand — hier gaan we morgen verder

### Goedkeuring, stap A (klein, eerst doen)

**Bevinding:** de goedkeuringsinstelling doet nu vrijwel niets.

| Module | Huidige check |
|---|---|
| Verlof | `isAdmin() \|\| magSchrijven('verlof')` — instelling niet geraadpleegd |
| Overuren | `isAdmin() \|\| magSchrijven('overuren')` — instelling niet geraadpleegd |
| Onkosten | `isAdmin() \|\| magGoedkeuren('onkosten') \|\| magSchrijven('onkosten')` |
| Verzuim | `isAdmin() \|\| magGoedkeuren('verzuim') \|\| magSchrijven('verzuim')` |

Bovendien kijkt `magGoedkeuren()` niet naar wie de aanvrager is: sta je bij één
medewerker ingesteld, dan mag je ieders aanvraag in die module goedkeuren.
Ook de notificatie bij een verlofaanvraag gaat naar iedereen met schrijfrecht,
niet naar de ingestelde goedkeurder.

**Te bouwen:** `magGoedkeuren(mod, aanvragerMedId)` — admin altijd, anders alleen de
ingestelde goedkeurder van díe aanvrager. `|| magSchrijven(...)` vervalt bij goedkeuren.
Zichtbaarheid blijft ongemoeid. Plus een waarschuwing in de instellingentabel waar nog
geen goedkeurder is ingevuld.

**Vóór uitrol:** de tabel bij Instellingen → Goedkeuring compleet invullen, anders valt
goedkeuring voor die medewerkers terug op alleen admin.

**Nog te beslissen:** zichtbaarheid bij **verzuim**. Nu ziet iedereen met schrijfrecht
alle dossiers — bijzondere persoonsgegevens onder de AVG. Los te beoordelen van de
goedkeuringsketen.

### Goedkeuring, stap B (groot, later)

Meerdere verplichte goedkeurders, bijvoorbeeld overuren door hoofd planning én directeur.
Instelling wordt een lijst per medewerker per module; per aanvraag bijhouden wie akkoord
is; status pas `goedgekeurd` als iedereen getekend heeft, met tussenweergave "1 van 2".
Raakt vier modules met elk hun eigen statusafhandeling (49 plekken met `'goedgekeurd'`).

### F9 — configureerbaar register

**Uitgangspunt (van Thomas):**
- 2 vaste velden met instelbare namen. Dat zijn nu `pomp.type` en `pomp.besturing` —
  dezelfde velden als `pomptype`/`besturing` in het debiteurformulier, dus die koppeling
  bestaat al.
- Beide bovenaan in het registerformulier, dan serienummer, gekoppeld artikel en klant,
  daaronder de extra velden.
- Extra velden instelbaar via Instellingen → Register: naam, type, eenheid, volgorde.

**Aanpak:** bestaande velden (fabrikant, bouwjaar, waaierD, inom, unom, vermogen) worden
standaard-velddefinities met een verwijzing naar hun huidige kolom, zodat er niets
gemigreerd hoeft te worden. Nieuwe velden komen in een apart `extra`-object.

Raakt naast het formulier ook de kolomkiezer, lijstweergave, export en PDF's.
Vier stappen: velddefinities + instellingenpagina → registerformulier → debiteurformulier
→ lijst en export.

**Nog te beantwoorden:** hoeveel extra velden verwacht je? Rond de tien, of meer? Dat
bepaalt of de lijstweergave anders moet.

## Niet vergeten

- **Push naar GitHub.** De werkomgeving is leeg bij een nieuwe sessie; vanochtend is het
  bestand hersteld uit `thomv-flow8/Flow-8`. Zonder push loopt die achter.
- Google-verbruik was 4 cent afgelopen maand — kosten zijn geen sturend criterium.
- De `reistijdCache`-node valt onder de rules maar is nog niet apart afgeschermd.


---

# Goedkeuring stap A — uitgevoerd en getest (3 augustus 2026)

`flow8-v2.html`, 32.594 regels, JS-syntax ✓.

| Onderdeel | Wijziging |
|---|---|
| `magGoedkeuren(mod, aanvragerMedId)` | Gerichte controle: alleen de ingestelde goedkeurder van díe medewerker tekent, admin overruled. Eigen aanvraag nooit zelf. Zonder aanvrager blijft de ruime variant voor het tonen van kolommen en knoppen. |
| `heeftGoedkeurder(medId, mod)` | Nieuw, voor de waarschuwing in de instellingen. |
| Verlof, overuren, onkosten | Goed-/afkeurknoppen alleen bij eigen aanvragers; anders "Wacht op \<naam\>". |
| Beheer ongemoeid | Verwijderen, uitbetalen, compenseren en invoeren namens een ander blijven aan schrijfrecht hangen. |
| Vangnetten | `keurVerlof`, `keurOveruren`, `keurOnkosten` weigeren zelf ook, niet alleen de UI. |
| Verlofnotificatie | Gaat naar de ingestelde goedkeurder in plaats van naar iedereen met schrijfrecht; valt terug op beheerders als er niemand staat. |
| Instellingen → Goedkeuring | Waarschuwing met het aantal lege vakjes. |

**Bewust niet aangeraakt:** verzuim. Daar stuurt `kanBeheren` de hele module aan (dossiers
aanmaken, hersteldatums) — dat is beheer, geen handtekening. Beperken zou de registratie breken.

## Nog open

- **Zichtbaarheid verzuim.** Iedereen met schrijfrecht ziet alle dossiers; bijzondere
  persoonsgegevens onder de AVG. Losse afweging, niet technisch gedreven.
- **Stap B — meerdere verplichte goedkeurders.** Overuren door hoofd planning én directeur.
  Instelling wordt een lijst per medewerker per module; per aanvraag bijhouden wie akkoord
  is; status pas `goedgekeurd` als iedereen getekend heeft, met tussenweergave "1 van 2".
  Raakt vier modules en 49 plekken met `'goedgekeurd'`.
- **F9 — configureerbaar register.** Uitgangspunten staan hierboven vastgelegd.


---

# F9 — configureerbaar register (3 augustus 2026, getest)

`flow8-v2.html`, 32.862 regels, JS-syntax ✓.

## Datamodel

`APP.registerInst` onder `instellingen/registerInst`:

```
{ veld1Label, veld2Label, velden:[{key,label,type,eenheid,bron?,verplicht?}],
  serienummerVerplaatst }
```

- **Twee vaste velden**: `pomp.type` en `pomp.besturing` — alleen het label is instelbaar.
  Dezelfde velden als `pomptype`/`besturing` in het debiteurformulier.
- **Extra velden**: maximaal 10. Types tekst, getal, datum, ja/nee. Per veld een eenheid
  en een verplicht-vlag.
- Velden met `bron` schrijven naar hun oorspronkelijke kolom (`serienummer`, `fabrikant`,
  `bouwjaar`, `waaierD`, `iNom`, `uNom`, `vermogen`); zelf toegevoegde velden komen in
  `pomp.extra[key]`. Daardoor was er geen datamigratie nodig.
- Een veld verwijderen haalt het uit de formulieren maar wist de gegevens niet;
  `migreerRegisterSerienummer()` draait eenmalig en respecteert een bewuste verwijdering.

## Waar het doorwerkt

Registerformulier (vaste velden bovenaan → artikel → klant → blok Gegevens),
detailpaneel van een pomp, debiteurformulier bij "Ook serviceklant", serviceklantformulier
en de detailweergave daarvan.

## Geleerd

**`sectieKop` is lokaal aan `renderInstPlanning`, niet globaal.** De nieuwe
instellingenpagina bleef daardoor leeg: de syntaxcontrole gaat prima, de fout ontstaat pas
bij uitvoeren. Bij hergebruik van een helper voortaan controleren *waar* die gedefinieerd
staat, niet alleen dát hij bestaat.

## Nog open bij het register

- **Kolomkiezer en export** gebruiken nog de vaste kolomdefinities (`_prKol` rond regel
  19004, export rond 20488). Zelf toegevoegde velden verschijnen daar nog niet.

## Overige openstaande punten

- **Goedkeuring stap B** — meerdere verplichte goedkeurders.
- **Zichtbaarheid verzuim** — iedereen met schrijfrecht ziet alle dossiers.


---

# Zichtbaarheid persoonsgegevens (3 augustus 2026)

`flow8-v2.html`, 32.930 regels, JS-syntax ✓.

## Uitgangspunt (Thomas)

- **L + E** → alleen eigen gegevens
- **L + S** → alles zien en schrijven
- Geldt voor verlof, overuren, onkosten én verzuim.
- Dát iemand ziek is mag iedereen op het dashboard en in de planning zien; de details
  (datum ziekmelding, duur, type) horen in de verzuimmodule en zijn daar al afgeschermd.

## Wijzigingen

| Plek | Was | Nu |
|---|---|---|
| `renderRapOveruren`, `renderRapOnkosten`, `renderRapVerlof`, `renderRapVerzuim` | lazen `APP.*` rechtstreeks | via `filterEigen(..., mod)` |
| `openRapMedPanel` — tabs overuren, onkosten, verlof, verzuim | idem | idem |
| `renderRapPersoonlijk` | telde totalen over álle actieve medewerkers | alleen jezelf zonder schrijfrecht op een van de vier modules |

Die laatste was de subtielste: bronlijsten filteren helpt daar niet, omdat de aggregatie
zelf lekt — je zou zien dát een collega 14 verzuimdagen heeft zonder het dossier te kunnen
openen.

**Teruggedraaid:** een eerdere poging om "Ziek" te vervangen door "Afwezig" op dashboard
en planning. Dat ging verder dan gevraagd en maakte de planning onnodig vaag.

## Dashboard

Opdrachten van vandaag tonen naast type en plaats nu ook straat en postcode.

## Uitgezocht, bewust niet gewijzigd: reistijd bij een tussendoor-storing

`berekenReistijdenVoorPlanning` filtert **niet** op status. De route is: bedrijfsadres →
alle opdrachten van die monteur op die dag, gesorteerd op `tijdVan` → terug naar het
bedrijf. Een afgehandelde opdracht telt dus gewoon mee als tussenstop.

Gevolg: een storing die later op de dag binnenkomt, krijgt zijn reistijd gerekend vanaf de
laatste (afgehandelde) stop — niet vanaf het bedrijf of vanaf waar de monteur werkelijk is.

Overwogen alternatieven en waarom niet gekozen:
- *Afgehandelde opdrachten overslaan* → het getal bij een openstaande opdracht verschuift
  zodra een eerdere wordt afgevinkt, zonder dat de planning wijzigt. Bovendien moet de
  cache dan invalideren bij elke statuswijziging.
- *Vertrekpunt terugzetten naar het bedrijf na de laatste afgehandelde stop* → dichter bij
  de praktijk, maar maakt de logica moeilijker uitlegbaar.

Besluit: laten zoals het is. De reistijd is een routeplanningsgetal, geen actuele ETA.


---

# Mobiele weergave + opmaak (4 augustus 2026)

`flow8-v2.html`, 33.116 regels, JS-syntax ✓.

## Structureel opgelost

| Onderwerp | Oorzaak |
|---|---|
| **Topbar viel buiten beeld** | Breder dan het scherm; `#app{overflow:hidden}` kapte hem af zónder scrollmogelijkheid. Administratie-switcher, "Testen als" en log-knop verborgen op mobiel. |
| **Instellingenpanelen te smal** | `.inst-wrap` had `align-items:flex-start`. In rij-richting onschadelijk, maar op mobiel (`flex-direction:column`) bepaalt dat de bréédte — het paneel kromp mee met zijn inhoud. Opgelost met `align-items:stretch`. |
| **Zebra-strepen inconsistent** | Register en planning zetten de kleur inline op de `tr`, de algemene CSS zette dezelfde kleur op de `td`. Die stapelden (.04 over .04 ≈ .078) — vandaar dat register blauwer oogde. Nu één bron op `.08`. |
| **Planning: blokken in één kleur** | Twee tellingen door elkaar: inline telde per opdracht, CSS telde álle rijen inclusief monteurkoppen en retourregels. Bovendien won `body.light tbody tr:nth-child(even) td` op specificiteit. Planning gebruikt nu een class op de rij (`rij-alt`), met regels ná de themaregels. |
| **Kop/data-mismatch bij tabellen** | Serviceklanten had geen `data-col` op de `th`; klantmails had `mail-check` op de checkbox in plaats van op de cel, waardoor de rij een kolom opschoof. |

## Verder doorgevoerd

- 16 knoppen (export, kolommen, import) verborgen op mobiel via `.hide-mobile`.
- Debiteuren en serviceklanten op mobiel: drie kolommen (naam, plaats, contract), rijhoogte naar ~44px, contract-chips en actieknoppen verborgen.
- Klantmails op mobiel: klant, datum, status + mailknop.
- Instellingen: accordions volle breedte, goedkeuringstabel in `.table-wrap` (scrollt nu op iOS), registervelden als blokjes in plaats van een tabel met zeven kolommen, contracttypes-kop mag afbreken.
- Storingsdienst: kolom "Periode" verborgen op mobiel.
- Planning: zoekveld eigen regel, dagkop compacter, "+ Opdracht" naast Vandaag (mobiel) of rechts in de eerste rij (desktop); Dagplanning/Kolommen/Export naar de eerste rij.
- Menu-iconen 19px en op `var(--text)` in plaats van gedempt grijs.
- Toolbars van verlof, medewerkers en materialen gelijkgetrokken met verzuim/onkosten/overuren: zoekveld links, knoppen rechts, boven de statkaarten.
- Dubbele modulenaam weg bij werkbonnen, materialen en werkorders.
- Werkorderknop miste `btn-sm` (was daardoor groter dan elders).
- Agenda-afspraken van 10 naar 11,5px.

## Bugs opgelost

**Werkbon pas zichtbaar na modulewissel** — `fsSpiegelWerkbon()` werd niet afgewacht; de lijst laadde vóór de schrijfactie klaar was. Nu via `Promise.resolve(...).then(...)`.

**Offline-balk bleef hangen** — twee oorzaken. Er waren twee bannerbeheerders (`.info/connected` én `online`/`offline` met `navigator.onLine`) die elkaar tegenspraken; nu één functie `zetOfflineBanner()`, gevoed door `.info/connected`. En Firebase merkt een dode websocket niet na slaapstand of netwerkwissel: `forceerHerverbinding()` doet een korte `goOffline()`/`goOnline()`, aangeroepen bij het `online`-event, bij terugkeer op de voorgrond, elke 20 seconden zolang het aanhoudt, en via een nieuwe knop "Opnieuw proberen" in de balk.

## Nog open

**Werkbonformulier.** Handmatig aanmaken gaat nu via `openOpdrachtModal` — hetzelfde scherm als een planningsopdracht. Thomas kijkt hoe Outsmart dit doet. Wens: een monteur kan alleen een werkbon voor zichzelf aanmaken (geen andere monteurs kiesbaar), en het formulier past beter bij de werkbonnenmodule.

Eerder genoemd en nog niet ingepland: goedkeuring stap B (meerdere verplichte goedkeurders), H12 (credits/licenties), rapportages voor werkbonnen en werkorders (P2/P3).


---

# Statkaarten naar pillen (4 augustus 2026)

`flow8-v2.html`, 33.128 regels, JS-syntax ✓.

**Afweging.** Vijf varianten voorgelegd (ringen, pillen, verdeelbalk, vakkenbalk, halve
ringen). Doorslaggevend: ringen en balken tonen een *deel van een geheel*. Dat klopt bij
debiteuren en serviceklanten, maar niet bij overuren — daar zijn "open", "gecompenseerd"
en "uitbetaald" losse metingen die niet optellen. Pillen en vakken claimen geen
verhouding en werken daarom overal. Keuze: **pillen**.

**Uitvoering.** Eén functie (`statCard`) en één CSS-klasse (`.stats-grid`) raakten alle
51 statkaarten:

- `statCard()` bouwt nu een pil: rond icoon 24px, getal en label naast elkaar.
- `.stats-grid` van `grid-template-columns:repeat(4,1fr)` naar `display:flex;flex-wrap:wrap`.
- Mobiele override naar twee kolommen vervallen — pillen wikkelen vanzelf.
- Klikbare varianten (`wo-sc`, `wp-sc`): actieve staat via class `.actief` met rand in de
  eigen kleur, in plaats van een `box-shadow` van 2px die de ronding niet volgde.
- Hoogte: van 118px naar ~43px.

**Dashboard-kaarten bovenaan** gingen niet via `statCard()` maar hadden eigen HTML met een
derde regel context. Ook omgezet via nieuwe helper `_dashPil()`; de context staat nu in het
label ("188 u · verlof · ≈23,5 dagen"). Blijven klikbaar naar hun module. Restanten
opgeruimd: `.dash-top-row` gridkolommen, `min-height`, inline hover-handlers.

## Overige wijzigingen deze ronde

- Exportknoppen: 8× "Exporteer CSV"/"Export CSV" → "Export". `csvExport()` schrijft in
  werkelijkheid xlsx via SheetJS; CSV is alleen de terugval.
- Werkorder-zoekbalk: 260px, links boven de statkaarten, zonder icoon — gelijk aan de rest.

## Nog open

- **Werkbonformulier** — Thomas bekijkt hoe Outsmart dit doet. Wens: monteur kan alleen
  voor zichzelf een werkbon aanmaken; formulier in de stijl van de module.
- Goedkeuring stap B (meerdere verplichte goedkeurders).
- H12 credits/licenties.
- Rapportages werkbonnen en werkorders (P2/P3) — vraagt eerst analyse: opdrachten in RTDB,
  werkbonnen en werkorders in Firestore.


---

# Tabelstijl: zebra → scheidingslijnen (4 augustus 2026)

`flow8-v2.html`, 33.124 regels, JS-syntax ✓.

**Afweging.** Zebra-strepen helpen bij brede tabellen (planning heeft acht kolommen: van
naam links naar status rechts is een oversteek). Bij smalle lijsten voegen ze niets toe.
Variant met scheidingslijnen én ruimere rijen bleek rustiger zonder houvast te verliezen —
de extra regelruimte doet het werk dat de kleurband deed.

| Was | Nu |
|---|---|
| `td{padding:13px 14px;border-bottom:none}` | `padding:15px 14px;border-bottom:1px solid var(--border)` |
| `tbody tr:nth-child(even) td{background:rgba(74,108,247,.08)}` (2×, donker + licht) | verwijderd |
| `tr:hover td{...,.14}` | `.09` — zonder banden hoeft hover minder hard te werken |
| Planning: `rij-alt` per opdracht | vervallen; alleen `rij-spoed` blijft (dat is een signaal, geen zebra) |
| Mobiel: `.deb-tabel td` 13px | 15px, gelijk aan desktop |

`tbody tr:last-child td{border-bottom:none}` voorkomt een dubbele lijn onderaan, bijvoorbeeld
bij de retourregel in de planning.


---

# Werkbonnen, timer en extern nummer (5–6 augustus 2026)

`flow8-v2.html`, 33.753 regels, JS-syntax ✓.

## Bugs opgelost

| Bug | Oorzaak |
|---|---|
| Bevindingen vertraagd op ondertekenscherm | `fsWerkbonBijwerken()` schrijft naar Firestore maar werkt `state.wb` niet bij; het overzicht las die verouderde kopie. Lokale kopie loopt nu mee bij elke toetsaanslag; bij afronden wordt een wachtende opslag eerst afgemaakt. Ook toegepast op het interne memoveld. |
| Werkbon pas zichtbaar na modulewissel | `fsSpiegelWerkbon()` werd niet afgewacht. |
| Archief niet op nieuwste | Alle bonnen hebben dezelfde status, dus viel sortering terug op uitvoerdatum. Nu op `gewijzigdOp` (moment van afronden). |
| Omschrijving kwam niet op de werkbon | Opgeslagen als `omschrijving`, maar `fsSpiegelWerkbon` leest `werkomschrijving`. |
| Slepen werkte niet bij werkorders | Verkeerde container-id (`wov-velden-lijst` vs `wbv-lijst`); er zijn twee veldeneditors. Beide nu gekoppeld. |
| Klant niet te wissen in aanmaakvenster | Geen wisknop; bij rechts uitgelijnde tekst viel het begin van een lange naam buiten beeld. |

## Nieuw

- **Slepen om velden te herordenen** — `maakSleepbaar()` met Pointer Events (werkt op muis én touch, in tegenstelling tot de HTML5 drag-API). Toegepast in checklist-sjablonen, beide werkorder-veldeneditors en het register.
- **Formuliertitel per werkbon aanpasbaar** — met meerdere formulieren op één bon onderscheid maken ("Onderhoud opvoerinstallatie — unit keuken"). Wijzigt alleen die bon, niet het sjabloon.
- **Timer** — compacte balk op mobiel, ring op tablet/desktop (beide in de DOM, per CSS getoond). Kleur volgt het type.
- **Reistijd** — instelling per bedrijf (standaard uit). Keuze werk/reis bij het starten, type ligt vast zodra de timer loopt. Urenregels krijgen een `type`; bestaande regels gelden als werktijd. Op de PDF een kolom "Soort" en aparte totalen — alleen als er reistijd op de bon staat.
- **Handmatige werkbon aanmaken** — eigen venster in rijstijl, in plaats van het volledige planningsformulier. Monteur staat vast op jezelf; wie planning mag beheren krijgt een keuzelijst. Locatiekeuze verschijnt bij meerdere adressen. Tijden weggelaten (die komen uit de urenregistratie).
- **Extern nummer** — één vrij veld `externNummer` op de opdracht, gaat mee naar de werkbon. Instelbaar label per bedrijf. Zichtbaar in opdrachtformulier (onder klant), handmatig bonformulier, op de werkbon en op de PDF. Meezoekbaar in de planning.

## PDF-verbeteringen

Logo van 40×20 naar 52×26mm · eenheid bij getalvelden wordt getoond · meer regelruimte
(4,8mm regelhoogte, 3,4mm tussenruimte) · vraag vet, antwoord normaal · kopteksten in
accentkleur met lijn eronder.

## Overig

Exportknoppen: "Exporteer CSV" → "Export" (8×), want `csvExport()` schrijft xlsx via
SheetJS. Werkorder-zoekbalk naar 260px boven de statkaarten.


---

# Stabiliteit op mobiel (6 augustus 2026)

`flow8-v2.html`, 33.887 regels, JS-syntax ✓.

## Opgelost

**PDF-viewer liet iOS de app ontladen.** `_pdfRenderPaginas()` maakte voor élke pagina een
canvas en hield ze allemaal vast. Bij ~50 A4-pagina's op retina loopt dat op tot honderden
MB; iOS ontlaadt dan de hele webpagina — wat op een crash lijkt. Nu lazy renderen via
`IntersectionObserver` (rootMargin 600px), pagina's buiten beeld worden gewist, en bij
sluiten zet `_pdfViewerOpruimen()` alle canvassen op 0×0 (alleen verwijderen geeft het
geheugen niet vrij).

**Terugkomen op het dashboard na herlaad.** `_bewaarPagina()` / `_laatstePagina()` in
localStorage, vervalt na een uur, met rechtencheck bij herstel.

**Offline-balk bleef hangen (mobiel).** Vertrouwen op `.info/connected` volstaat niet:
Safari legt de websocket stil bij app-wissel en de status blijft daarna op 'offline'
hangen. Nu `testVerbinding()` — een echte `once()` op `.info/serverTimeOffset` met 5s
tijdslimiet — aangeroepen bij `online`, `visibilitychange`, `pageshow` (bfcache), elke 15s
zolang het probleem aanhoudt, en via de knop "Opnieuw proberen" in de balk. Slaagt de
test, dan gaat de balk weg; faalt hij, dan volgt `forceerHerverbinding()`
(`goOffline()`/`goOnline()`).

**Werkbon bij debiteur** opent nu de PDF in plaats van de werkbon zelf.

**Uitvoerende rollen.** `urenRollen` bepaalde alleen wie je kon kiezen bij het registreren
van uren; dezelfde lijst geldt nu ook voor de monteurkeuze bij het handmatig aanmaken van
een werkbon. Eén helper `werkbonMedewerkers(altijdId)`, sleutel blijft `urenRollen`, label
in instellingen is nu "Uitvoerende rollen".

---

# Foto-compressie in PDF's (9 augustus 2026)

`flow8-v2.html`, 33.924 regels, JS-syntax ✓.

## Analyse

De uploadkant was al goed: `comprimeerFotoVoorUpload()` (1600px, JPEG 0.75) wordt op alle
tien uploadplekken gebruikt. Het knelpunt zat in de PDF-generatie, waar twee generatoren
elk hun eigen vaste instellingen hadden: werkbon 1200px/0.60 (≈120 kB per foto), werkorder
1400px/0.82 (≈350–450 kB per foto). `verstuurMailDirect()` weigert boven ~14 MB base64, dus
de reparatiebon liep daar al vanaf ruwweg 25 foto's tegenaan — de werkbon pas rond de 80.

## Opgelost

**Gedeeld compressieprofiel.** Nieuwe helper `_fotoPdfProfiel(aantal)` schaalt met het
aantal foto's: ≤10 → 1400px/0.78, 11–25 → 1100px/0.68, 26–50 → 900px/0.58, 50+ →
800px/0.50. Bij weinig foto's dus juist bétere kwaliteit dan de werkbon voorheen had;
alleen bij veel foto's zakt hij. Ook 100 foto's blijft ruim onder de limiet, dus geen
hergeneratie-lus nodig.

De vaste constanten `WB_PDF_FOTO_MAX` / `WB_PDF_FOTO_KWALITEIT` zijn van globaal naar
lokaal verplaatst en worden nu per bon uit het profiel gezet — de plaatsingscode bleef
daardoor ongewijzigd. Het aantal telt losse foto's én checklist-foto's. In de werkorder-PDF
bepaalt `_woFotoProfiel` (uit `Object.keys(_woFotoCache).length`) hetzelfde in `_fotoAlsJpeg`.

**Meldingen.** De harde foutmelding boven 14 MB noemt nu een concrete uitweg (zonder foto's
versturen of foto's verwijderen). Nieuw is een zachte waarschuwing in de verzendmodal boven
10 MB, zodat de monteur weet dat het even kan duren.

## Nog open bij foto's

- `genereerWerkorderPDF` laadt álle foto's als `Image` in `_woFotoCache` vóór generatie —
  hetzelfde geheugenpatroon dat de PDF-viewer op iOS liet ontladen. Bij 40+ foto's kan het
  crashen vóór de groottecheck. Clean fix: één voor één laden en na inbedden vrijgeven.

---

# Offline-balk: één bron van waarheid (9 augustus 2026)

`flow8-v2.html`, 33.942 regels, JS-syntax ✓.

## Klacht

Rode balk bleef lang staan nadat de verbinding hersteld was; ging pas weg na meerdere keren
tussen modules wisselen.

## Oorzaak (twee fouten)

**`testVerbinding()` testte niets.** Hij las `.info/serverTimeOffset`, maar `.info/*` is een
lokaal gesynthetiseerde node in de SDK — die `once()` lost altijd op uit het clientgeheugen,
met of zonder netwerk. De "actieve verbindingstest" gaf dus vrijwel altijd goed terug zonder
dat er iets het toestel verliet.

**De hersteltimer stond achter `navigator.onLine`.** Op iOS blijft die na vliegtuigmodus-uit
vaak minutenlang op `false`, en het `online`-event komt pas als er echt verkeer loopt. De
15-seconden-timer sloeg dus over; zonder app-wissel gebeurde er niets. Pas bij het wisselen
van module deed de app een Firebase-lees, herstelde de websocket zich en sprong
`.info/connected` op true — precies het waargenomen gedrag.

## Opgelost

`.info/connected` is nu de énige bron voor de balk (het is precies het signaal dat bepaalt of
een schrijfactie de server haalt). In plaats van die melding te overrulen met een neptest
forceren we actief herstel: `probeerHerverbinden()` roept `forceerHerverbinding()`
(goOffline/goOnline) aan en plant via `_herstelPlan()` de volgende poging met oplopende
pauzes (5s, 10s, 20s, daarna 30s). Getriggerd door `online`, terugkeer naar de voorgrond,
`pageshow`, de knop, én door `zetOfflineBanner(false)` zelf — zodat de cyclus ook start als
geen enkel event afgaat. `_herstelStop()` bij herstel.

`navigator.onLine` is volledig uit de bannerlogica verwijderd: `_updateOfflineBanner()`
gebruikt alleen nog `_fbVerbonden`, het browser-`offline`-event zet de balk niet meer zelf
aan maar start een herstelpoging, en `dbSaveItem` telt wachtende wijzigingen nu op
`_fbVerbonden` (dat telde eerder verkeerd).

`testVerbinding()` en `controleerVerbinding()` zijn vervallen — geen resten meer in het
bestand.

## Te testen

- Vliegtuigmodus aan → balk binnen enkele seconden rood
- Vliegtuigmodus uit, zonder iets aan te raken → balk weg binnen ~5–10 seconden
- App-wissel tijdens offline en terug → directe herstelpoging
- Wijziging opslaan tijdens offline → teller "1 wijziging wacht op synchronisatie" klopt

---

# Reistijd-label "v/bedrijf" op verkeerde rij (9 augustus 2026)

`flow8-v2.html`, 33.955 regels, JS-syntax ✓.

## Klacht

In het planningoverzicht stond "v/bedrijf" een paar keer bij de láátste opdracht van een
monteur, terwijl "v/bedrijf" altijd bij de eerste stop hoort (screenshot: Raingelo, 4
opdrachten, v/bedrijf bij Paardenwater 19 i.p.v. Stationsweg 14).

## Oorzaak

De reistijd-kolom koppelt elke leg aan een opdracht via de index in de route-array
(`_locReistijden[key].ops`) — route-index 0 = "v/bedrijf". Die array werd gesorteerd met
`(tijdVan||'99:99')`. Een opdracht met alleen een tijdblok (`blokVan`/`blokTot`) heeft geen
`tijdVan` en kreeg dus '99:99' — waardoor hij achteraan in de route belandde terwijl de
tabel hem op zijn werkelijke tijd toonde. Route-index en zichtbare volgorde liepen uiteen,
en "v/bedrijf" plakte op de verkeerde rij. Dezelfde `99:99`-sortering stond op vijf plekken,
waaronder `tekenMonteurRoute` (schrijft óók naar `_locReistijden` voor vandaag) en de
kaart-markernummering.

## Opgelost

Eén gedeelde sorteerhelper `_planRouteVolgorde` (met `_planRouteSleutel` = `tijdVan` →
`blokVan` → '99:99'), stabiel bij gelijke tijd op id. Toegepast op alle relevante plekken:
`berekenReistijdenVoorPlanning`, `tekenMonteurRoute`, de dagplanning-startsortering
(`_dpOpdrachten`), het dagoverzicht op het dashboard en de genummerde kaartmarkers. Zo staat
`ops` overal in dezelfde chronologie als wat de gebruiker ziet, en horen leg + label altijd
bij de juiste stop — ook als de tabel op een andere kolom is gesorteerd (de koppeling loopt
via het opdracht-id, niet via de tabelrij).

## Nog open in dit gebied (besproken, niet gebouwd)

- **Dagplanning-modal groter maken met kaartweergave.** Bredere modal met de route zichtbaar
  op een kaart, reistijden ernaast. Los te concipiëren (concept + preview vóór code).
- **API-aanroepen bij toevoegen opdracht.** Nagekeken: bij toevoegen wordt Google niet
  aangeroepen — `dbSaveItem` → `invalideerReistijden` wíst juist de cache. De berekening
  gebeurt bij het renderen van de planning (inline reistijdkolom) en apart bij de
  dagplanning-knop. Reistijdkolom blijft voorlopig behouden (keuze Thomas).

---

# Dagplanning met kaart — Fase 1 (9 augustus 2026)

`flow8-v2.html`, 33.998 regels, JS-syntax ✓. Backup: `/tmp/flow8-voor-dagplanfase1`.

Concept + fasering: zie `flow8-dagplanning-kaart-bouwplan.md`. Akkoord: lijst links, kaart
rechts, kaart laadt na "Bereken tijden", sleepbare markers (herbereken op loslaten).

## Fase 1 — layout-ombouw, nog zonder kaart (klaar, te testen)

- Nieuwe CSS-variant `.modal.modal-xl` (min(1180px,96vw)) los van `modal-breed`. In de xl-modal
  wordt de body een flex-kolom (`overflow:hidden`) zodat de linkerkolom intern scrollt.
- `openModal(title, body, footer, breed, xl)` — vijfde parameter `xl` toegevoegd; bestaande
  aanroepen ongewijzigd.
- `_renderDagplanning()` gesplitst: controls-balk bovenaan over de volle breedte; de content
  (stats + start + opdrachtenlijst + waarschuwingen + retour) staat nu in `content` (was `b`) en
  wordt bij een gekozen monteur mét opdrachten (`_dpToonKaartKolom`) in `.dp-split` gegoten —
  links `.dp-col-lijst` met scroll, rechts `.dp-col-kaart` met een placeholder. Lege staten
  (geen monteur / geen opdrachten) blijven één kolom.
- Drag-and-drop en pin-picker ongewijzigd — selectors (`#dp-lijst`, `.dp-card`) werken
  document-breed, dus de verhuizing naar de linkerkolom raakt ze niet.
- Responsief: onder 920px stapelt de split (placeholder onder de lijst).

## Fase 1 — getest en akkoord (9 augustus). Losse fix meegenomen:
- Tijdsturing-picker: "Sluiten" bij Vrij werkte pas na een tab-omweg. Oorzaak: OK/Annuleren/
  Sluiten werden document-breed opgezocht (`getElementById`) terwijl de picker bij de eerste
  render nog niet in de DOM hing. Opgelost door binnen de picker te zoeken
  (`picker.querySelector`).

## Fase 2 — kaart tekenen (klaar, te testen)

- `_dpRouteResult` bewaart het `DirectionsResult` in alle drie de berekenpaden (standaard,
  geoptimaliseerd, gepinde-finaal). De kaart hergebruikt dat → géén extra Directions-call,
  alleen Dynamic-Maps-tiles.
- `_dpTekenKaart()`: `google.maps.Map` in `#dp-kaart-container`, route via `DirectionsRenderer`
  (`suppressMarkers`, monteurkleur-polyline), bedrijf-startmarker (groen huisje) op
  `legs[0].start_location`, genummerde markers per opdracht op `legs[idx].end_location`
  (pin=oranje, blok=blauw, spoed=rood, anders monteurkleur). `fitBounds` op de route. Géén
  geocoding nodig — coördinaten komen uit het routeresultaat.
- Donkere kaartstijl (`_dpKaartStijlDonker`) passend bij het app-thema; roadmap bij lichte modus.
- Rechterkolom toont de kaart-container zodra `_dpBerekend && _dpRouteResult`, anders de
  placeholder. Kaart wordt getekend via `requestAnimationFrame` zodat de container eerst
  hoogte krijgt (anders 0×0).
- Opruimen: `_dpKaartOpruimen()` (markers/renderer los) en `_dpResetBerekening()` (bij openen +
  monteur/datum-wissel). Cancel-knop ruimt ook op.

## Fase 2b — sleepvolgorde + klik-info (9 augustus, na testfeedback)

Twee punten uit de test opgelost:

1. **Volgorde slepen werd niet goed op de kaart meegenomen.** Oorzaak: de kaart (en de
   reistijden in de lijst) werden getekend uit het bewaarde `_dpRouteResult`, dat na een swap
   nog de oude volgorde had — `legs[idx]` wees naar de oude locatie. Opgelost met
   `_dpHerberekenNaHerorden()`: na een sleepactie wordt de route opnieuw opgehaald in de nieuwe
   volgorde (zónder optimalisatie, de gebruiker bepaalt de volgorde zelf) en updaten lijst + kaart
   samen. Eén Directions-call per herordening. `_dpBedrijfsAdres()` losgetrokken zodat zowel de
   herberekening als de bestaande paden hetzelfde adres gebruiken.
2. **Klik op marker → klantgegevens**, net als in de kaartweergave-module. `_dpTekenKaart` geeft
   elke marker een InfoWindow (één gedeelde `_dpKaartInfoWindow`) met klantnaam, adres, type,
   reistijd, pin/tijdblok en pomptype/notitie. Wordt meegenomen in `_dpKaartOpruimen`.

## Fase 2 — getest en akkoord (9 augustus)
Kaart met route, genummerde markers, bedrijf-startmarker, sleepvolgorde die kaart + reistijden
bijwerkt, en klik-op-marker met klantgegevens. Allemaal werkend bevonden.

## Fase 3 — koppeling lijst ↔ kaart (klaar, te testen)

- Klik op een lijstkaart → `_dpSelecteerStop(idx)`: kaart pant naar de marker, opent de
  InfoWindow en zet `.dp-card.actief` op die kaart. Klik op een marker doet hetzelfde via
  `_dpToonInfoWindow(idx)` — beide richtingen delen dezelfde highlight (`_dpMarkeerLijstkaart`).
- Opdracht-markers apart bijgehouden in `_dpKaartOpdrachtMarkers[idx]` (los van de bedrijf-
  marker) voor betrouwbare index-lookup; InfoWindow-content hangt aan de marker
  (`marker._dpInfoContent`). Meegenomen in de opruiming.
- Klik op de pin-knop of sleep-handle triggert géén selectie (eigen gedrag behouden).
- **Meegenomen fix:** pre-existing bug waarbij de km-tekst in de reistijd-indicator naar de
  verkeerde accumulator (`b` i.p.v. `content`) ging en dus niet in de lijst verscheen.

## Fase 3 — getest en akkoord (9 augustus)
Klik lijst ↔ marker werkt in beide richtingen; km-getal terug in de lijst.

## Fase 4 — overgeslagen (bewust)
Sleepbare kaartmarkers voegen weinig toe nu herordenen in de lijst goed werkt en slepen op
een kaart fiddly is op tablet. Kan later alsnog, maar niet nu.

## Fase 5 — afronding (klaar, te testen)

- **Geen bedrijfsadres:** `_dpBedrijfsAdres()` geeft nu `null` bij een multi-tenant bedrijf
  zonder adres → nette melding "Geen bedrijfsadres ingesteld". De historische Homa-installatie
  (geen/`homa` bedrijfId of naam met "homa") behoudt de vaste fallback, dus bestaande werking
  blijft intact. Ook `g.adres` zonder postcode wordt nu geaccepteerd.
- **Opdracht zonder adres:** `_dpValideerVoorRoute()` checkt vooraf en meldt concreet wélke
  opdracht(en) geen adres hebben, i.p.v. een kale foutcode ná een mislukte (betaalde) call.
  Ingehaakt in `_dpBerekenReistijden` én `_dpHerberekenNaHerorden`.
- **Bedrijfsadres gecentraliseerd:** de inline afleiding in `_dpBerekenReistijden` vervangen
  door de helper (één bron van waarheid).
- **Thema-wissel:** de dagplanning-kaart (indien open) beweegt nu mee via
  `setOptions({styles})` op de theme-toggle — geen herbouw nodig.
- **0×0-kaart vangnet:** 250ms na init een `resize`-trigger + `fitBounds`, zodat een container
  die bij init nog geen hoogte had alsnog goed rendert.

## Nog te testen (Fase 5)
- Opdracht zonder adres in de dag → "Bereken tijden" geeft nette melding met de klantnaam.
- Eén opdracht in de dag → kaart en reistijd kloppen.
- Thema wisselen terwijl de kaart open is → kaartstijl beweegt mee.
- Modal 10× openen/sluiten → geen haperen of oplopend geheugen.
- (Regressie) Homa met adres → route werkt exact als voorheen.

---

# Kleine wijzigingen (9 augustus, na Fase 5)

- **Opdracht-modal:** Type en Extern nummer omgewisseld — Type nu links, Extern nummer rechts
  (op verzoek, `flow8-v2.html` rond regel 15145).
- Openstaand punt "oude bonnen met omschrijving in verkeerd veld" van de Klein-lijst gehaald.
- **Agenda week/dag:** afspraken vergroot naar hetzelfde formaat als de maandweergave. Week en
  dag delen de klassen `.agw-afspr` (getimede afspraken) en `.agw-chip` (hele-dag balkjes) →
  font 10→11.5px, padding en line-height gelijkgetrokken met maand. Minimumhoogte van een
  getimed blokje van 16/18 naar 22px zodat de grotere tekst netjes op één regel past.

---

# Op de agenda (besproken 9 augustus, nog niet gestart)

## Klantmail: HTML-opmaak + statustriggers
Bestaande infra: Cloud Function via Resend (`verstuurMailDirect`, `MAIL_FUNCTIE_URL` naar
`flow8-715de.cloudfunctions.net/verstuurMail`), centrale `openMailVerzendModal`, templates met
placeholders, bijlage-ondersteuning. Wat ontbreekt:
1. **HTML-mail** i.p.v. platte tekst (Outsmart-stijl). Resend ondersteunt een `html`-veld;
   nodig: bevestigen dat de Cloud Function dat doorgeeft → **functie-code (`resend-functions/`)
   opvragen** vóór de bouw.
2. **Statusgestuurde mails**: automatisch mailen bij statusovergang (ingepland→klaargezet) en
   bij annulering. RISICO: ongewenste mails bij een per ongeluk teruggezette status. Vereist
   waarborgen: bevestiging vooraf en/of per-overgang instelling welke wél mailen. Bouwplan-blok,
   eerst concept + preview.

## Marketingwebsite met animaties (Higgsfield-connector)
Staat los van flow8-v2.html (andere codebase/tools). Nodig van Thomas vóór de bouw:
doel (marketing/lead of ook klantportaal), doelgroep, secties (hero/features/prijzen/
screenshots/demo-aanvraag), merk (naam Flow8, logo, kleuren — app-accent #4a6cf7), screenshots
van de mooiste schermen (planning, dagplanning-kaart, werkbon), en of er al een domein is.

## Live gaan
Eigen hosting + domein, live voor klanten. Pas ná bovenstaande.

---

# Verzuim-inzage (AVG) — model B (9 augustus 2026)

`flow8-v2.html`, JS-syntax ✓. Backup: `/tmp/flow8-voor-verzuim`.

## Probleem
Verzuim bevat bijzondere persoonsgegevens (ziektegegevens), maar `filterEigen` gaf volledige
inzage aan iedereen met generiek lees- óf schrijfrecht. Zo zag elke rol met verzuim-leesrecht
alle ziektedossiers.

## Opgelost (model B: expliciete inzage-vlag per rol)
- Nieuwe helper `magVerzuimInzageAlle()`: true voor admin en rollen met
  `rechten.verzuim.inzageAlle`. `filterEigen('verzuim')` en `zietAlleenEigen('verzuim')`
  gebruiken die; zonder de vlag ziet iemand alleen zijn eigen dossier.
- Standaardrollen: admin + administratie krijgen de vlag. Overige rollen niet.
- **Migratie behoudt huidige zichtbaarheid:** bestaande rollen die nu alle dossiers zien
  (leesrecht zonder 'eigen') krijgen `inzageAlle:true`; wie al beperkt was tot eigen dossier
  niet. Draait vóór de eigen-forcering zodat administratie niet als 'eigen' wordt gezien.
- Rechtenmatrix-UI: rood "I"-vinkje bij verzuim (patroon van de "B"-vlag), opslaan-logica en
  uitlegblok. Legenda uitgebreid.
- `renderVerzuim`: `vzAlleenEigen` gebruikt nu `!magVerzuimInzageAlle()`.

## Bewuste keuze (niet gewijzigd)
Dashboard "Afwezig vandaag" toont ziekteverzuim met naam + reden voor iedereen die het
dashboard ziet. Bewust zo gelaten: operationeel relevant (wie is er vandaag niet), en het toont
geen dossierdetails — die zitten in de nu afgeschermde verzuimmodule. Heroverwegen bij
multi-tenant als de AVG-vraag terugkomt.

## Te testen
- Log in als admin → alle verzuimdossiers zichtbaar (ongewijzigd).
- Rol met verzuim-leesrecht zonder "I" (bijv. planner met leesrecht) → alleen eigen dossier.
- Administratie/HR → nog steeds alle dossiers (migratie).
- Rechtenmatrix → "I"-vinkje bij verzuim, opslaan werkt, uitleg zichtbaar.
- Monteur → alleen eigen dossier (ongewijzigd).

---

# OPENSTAANDE PUNTEN

## Getest en akkoord (9 augustus)
- ~~PDF-viewer met een groot document~~ — goed
- ~~Terugkeren op de laatst bezochte pagina na herlaad~~ — goed
- ~~Offline-balk (herbouw 9 augustus)~~ — goed, pakt vanzelf op zonder module-wissel
- ~~Foto-compressie (gedeeld profiel)~~ — gebouwd en akkoord

## Groot
1. **Goedkeuring stap B** — meerdere verplichte goedkeurders (bijv. overuren door hoofd
   planning én directeur). Per aanvraag bijhouden wie akkoord is, tussenstatus "1 van 2".
   Raakt vier modules en ~49 plekken met 'goedgekeurd'.
2. ~~**Rapportages werkbonnen en werkorders (P2/P3)**~~ — WERKORDERS afgerond 13 augustus 2026.
   Werkbonnen bewust NIET gebouwd: die worden vanuit opdrachten ingevuld, dus een werkbon-
   rapport zou grotendeels het bestaande opdrachten-rapport dubbelen. Werkorders zijn wél een
   eigen stroom (werkplaats/intern) → nieuw tabblad `renderRapWerkorders` in de rapportage.
   Zie het afronding-blok bovenaan.
3. **H12 credits/licenties** — prijsmodel, definitie van een seat, afdwingmechanisme.
   Moet server-side; client-side niet af te dwingen.

## Middel
4. **Firebase rules fase 2** — per-module rechten in de rules. Vereist eerst opschoning van
   alle Auth-accounts. `reistijdCache` valt onder bedrijfsdata maar is niet apart
   afgeschermd.
5. ~~**Zichtbaarheid verzuim**~~ — opgelost 9 augustus. Zie hieronder.
6. **ERP-koppeling** — veld `externNummer` ligt klaar. Bij automatische aanlevering wil je
   kunnen controleren of een nummer al bestaat, anders komt dezelfde order dubbel binnen.

## Klein
7. ~~**Spoed-status refactor**~~ — al gedaan (bevestigd 13 augustus 2026). `spoed` is een losse
   prioriteitsvlag `o.spoed` via helper `_isSpoed(o)` (r7370), met fallback op oude
   `status==='spoed'`-data en opschoning bij bewerken (r15114). Toggle in het opdrachtpaneel,
   aparte `tagSpoed()`-badge náást de statusbadge. Geen losse status-checks meer gevonden.
8. ~~**Foto-compressie**~~ — opgelost 9 augustus (gedeeld profiel `_fotoPdfProfiel`).
   Opvolgpunt: geheugengebruik van `_woFotoCache` bij veel foto's.

---

# Styling huisstijl — Fase 1 (22 augustus 2026)

Bron: `Flow8_app_-_stijl_overdracht.md`. Doel: app in huisstijl flow-8.nl, geen functionele
wijzigingen. `flow8-v2.html` · JS-syntax ✓. Backups: `/tmp/flow8-voor-stijl-fase1` (pre-fase-1),
`/tmp/flow8-na-fase1` (na 1a-1d, voor collapse-mark).

**Uitgevoerd (1a-1d + collapse-mark):**
- **1a tokens** — nieuw `:root`: neutraal-donkere vlakken (--bg #0a0b10 etc.), accent #4f6ef5,
  accent2 #35c4e3, leesbare `-t`-tekstvarianten van statuskleuren, vaste --muted/--muted2,
  --radius-lg/--radius-pill, één rustige gloed i.p.v. twee vlekken.
- **1b typografie** — vier fonts → twee: font-link nu Instrument Sans (400;500;600) +
  Space Mono; **Syne alleen behouden voor het FLOW 8-woordmerk** (`&family=Syne:wght@300;800`,
  dekt login- én zijbalk-logo). `body`, `.sidebar-logo-text`, `.panel-title`,
  `.wbx-md-terug`, `.wbx-md-titel` → Instrument Sans, koppen weight 800→600 + letterspacing.
- **1c** — `.text-xxs` 10→11px, `.text-xs` 11→11.5px.
- **1d JS-string sweep** — 18 font-verwijzingen binnen gegenereerde HTML-strings van
  `DM Sans`/`Syne` → `Instrument Sans` (escaped quotes zodat JS-strings geldig blijven;
  login- en zijbalk-logo bewust NIET aangeraakt). Na afloop: `DM Sans` 0×, `Syne` alleen in
  font-link + 4 logo-regels.
- **Collapse-mark** (markup + CSS, buiten strikte fase 1 op verzoek) — bij ingeklapt menu
  blijft nu de flow-mark (met lopend bolletje) bovenin staan; woordmerk FLOW 8 + subtitel weg.
  Woordmerk in `<g class="sb-woordmerk">` gewikkeld; `.sidebar-logo` ingeklapt → verticale
  gecentreerde stack; `#sb-logo-svg` gecropt tot 44px. Geen JS-logica geraakt, animatie loopt door.
- **Zijbalk-logo gelijk aan login (22 aug, na akkoord)** — statische donkere stip via
  `.sb-logo-dot{fill:var(--surface)}` (klopt in beide thema's), "FLOW" helder `#f4f6fb`,
  font `'Syne',sans-serif` (Arial-fallback weg). **Animatie verwijderd**: `sb-inf-path`/`sb-inf-dot`
  weg uit de SVG → `startSbAnim` valt vanzelf stil (JS ongewijzigd, nu inert; later te verwijderen).

**Bewuste afwijking van de leidraad:** geen `/* OUD: */`-commentaren in de productiecode
(compactheid); reversibiliteit via de twee `/tmp`-backups + het stijl-document. Op verzoek
alsnog toe te voegen.

**Openstaand:** fase 2 (componentstijlen: knoppen pill+vlak, inputs, tabellen monospace-koppen,
tags, kaarten, tegels, zijbalk, modals, topbar/toast), fase 3 (details + licht thema compleet +
reduced-motion), fase 4 (focus-visible, mobiele raakvlakken, lege/laad-states, radii, icon-stroke).
Elke fase pas na test-akkoord van de vorige.

**Te testen (fase 1):** iPhone + desktop — indeling identiek, kleuren neutraler, grijstinten
leesbaarder; logo login/zijbalk ongewijzigd; menu inklappen toont alleen de flow-mark.

---

# Styling huisstijl — Fase 2 (22 augustus 2026)

Componentstijlen, alleen CSS. `flow8-v2.html` · JS-syntax ✓. Backup: `/tmp/flow8-voor-stijl-fase2`.

**Uitgevoerd (2a-2i):**
- **2a knoppen** — pill-vorm (`--radius-pill`), vlak i.p.v. gradient+shadow; primary = effen accent
  met brightness-hover; ghost = subtiele rand; danger = zachte rode variant met `--red-t`.
  `transition:all` → eigenschappenlijst. Dubbele `.btn{transition:all cubic-bezier}` (Punt 11) verwijderd.
- **2b inputs** — grotere radius/padding, focusring op nieuw accent, `::placeholder` op --muted2,
  labels in Space Mono kleinkapitaal.
- **2c tabellen** — koppen in Space Mono kleinkapitaal, 2px→1px onderrand, `td.num/.td-uren/.td-aantal/
  .td-bedrag` + `.td-datum` tabular-nums. Rijstructuur/hover behouden; **hover-kleur** op de échte
  `tr:hover td`-regels (147/170/175) naar nieuw accent i.p.v. gemaskeerde nieuwe regel (bewuste afwijking).
- **2d tags** — pill + bolletje via `::before`; leesbare `-t`-tekstkleuren + randen; `.tag-gereserveerd`
  vereenvoudigd (dashed). `.tag.heeft-icoon::before{display:none}` als vluchtklep meegenomen
  (statuslabels zijn nu tekst-only, dus bolletje veilig universeel).
- **2e kaarten** — grotere radius, geen box-shadow; hover alléén op interactieve kaarten
  (`[data-nav]/[onclick]/a/button`).
- **2f tegels** — pill, subtiele achtergrond, hover-rand; waarde weight 800→600.
- **2g zijbalk** — nav-sectie in Space Mono; nav-item lichter/rustiger; **bestaande** `.nav-item:hover`
  aangepast (geen duplicaat); actief item zonder streepje (`::before{content:none}`) en zonder inset-shadow.
- **2h modals** — geen overshoot-animatie meer; 18px radius; titel weight 600; `.modal-close` met rode hover.
- **2i topbar/toast** — topbar 56→60px, titel weight 600; toast pill-vorm met schaduw.

**Openstaand:** fase 3 (details: klikcursor-selector, licht thema compleet, reduced-motion breed),
fase 4 (focus-visible, mobiele raakvlakken, lege/laad-states, radii opruimen, icon-stroke).
Pas na test-akkoord fase 2.

**Te testen (fase 2):** knoppen pill+vlak, hover primary/ghost/danger; inputs + focusring;
tabelkoppen monospace, cijfers uitgelijnd, rijranden/hover intact; tags met bolletje leesbaar;
kaarten alleen hover waar klikbaar; zijbalk actief-item zonder streepje; modal opent rustig,
sluitknop rode hover; toast pill. iPhone + desktop.

---

# Styling — licht-thema fixes na test (22 augustus 2026)

Test op iPhone (licht thema) toonde: fase 1/2 waren donker-first, waardoor op wit veel randen/
kleuren onzichtbaar werden. `flow8-v2.html` · JS-syntax ✓. Backup: `/tmp/flow8-voor-stijl-fix`.

**Opgelost (CSS):**
- **A · ghost-knoprand thema-bewust** — `.btn-ghost` border `rgba(255,255,255,.18)` → `var(--border)`,
  hover → `var(--muted2)`. `.btn-ghost` wordt 344× gebruikt → herstelt ALLE "witte knoppen zonder rand":
  toolbars (dagplanning/kolommen/export, register, materialen, debiteuren, serviceklanten, medewerkers,
  verlof/overuren/onkosten/verzuim, administraties, contracten), PDF/handtekening-knoppen, bewerk/verwijder-
  iconen (`btn-ghost btn-icon`), annuleer-knoppen in modals, verwijder-popups, checklist/werkorder-knoppen.
- **B · tag-muted zichtbaar** — `rgba(255,255,255,.05)` → `rgba(120,130,150,.16)`. Herstelt statuschips
  **Klaargezet** en **Spoed-uit** (beide `tag-muted` met inline `border:none`) in beide thema's.
- **C · licht thema compleet (fase 3b vervroegd)** — nieuw `body.light`: `--muted2` + donkere `-t`
  tekstvarianten (`--green-t #0f9d6f` etc.), steviger `--border #e2e5ec`, schaduw-uit op kaarten,
  stat-card wit, nav/tabel-hover licht. **Pre-existing duplicaat `body.light` (regel 160) verwijderd**
  (overschreef anders de nieuwe waarden). → fase 3b hiermee gedaan.
- **D · snelweergave tel/mail links** — `--accent2` (cyaan, te licht op wit) → `--accent` (blauw), 2 plekken.

**Nog te bekijken (NIET veroorzaakt door styling — losse analyse nodig):**
- Klantmails "pillen" (52 opdrachten / te versturen / verstuurd / zonder e-mail) zijn info-`<span>`s,
  géén knoppen — waren nooit klikbaar. Wens = filters? → los feature-punt.
- Notificatie-toggles in instellingen "werken niet goed" — functioneel, geen styling-raakvlak.
- Instellingen → opdrachttypes → "nieuw type"-knop werkt niet — functioneel.
- Blokkadedag: tabblad sluit na opslaan — functioneel.
- Werkorder-type modal: beschrijvingstekst onder grijze velden loopt door de velden heen — spacing,
  markup nog na te kijken.

---

# Styling + functionele fixes — ronde 2 (22 augustus 2026)

Na 2e testronde (licht thema). `flow8-v2.html` · JS-syntax ✓. Backup: `/tmp/flow8-voor-fixronde2`.

**Styling:**
- **Dagkop-knoppen (+Opdracht/Dagplan) zonder rand** — dagkop-achtergrond `--dagkop #e4e9f2` ligt te
  dicht bij `--border #e2e5ec` → rand viel weg. Fix: `.dagkop-tekst .btn-ghost{border-color:var(--muted2)}`.
- **Prioriteit → Spoed nu rood** — chip was `tag-muted` (grijs) bij uit; nu altijd `tag-red`,
  actief = rode ring (outline) + bold + vinkje. Consistent met de statuschips.

**Functioneel (waren pre-existing bugs, niet door styling):**
- **Notificatie-toggles schoven niet** — de `<label>` toggelt de checkbox al native, én er was een
  extra `track.click → cb.click()` → klik op de schakelaar toggelde **2×** en hief zichzelf op.
  Redundante handler verwijderd → toggles werken.
- **Blokkadedag: tabblad sloot na opslaan** — `renderInstPlanning()` re-rendert en de "Wanneer werken"-
  accordion (waar blokkadedagen in zitten) klapte dicht. Fix: na add/del de accordion gericht heropenen
  via `#blokkade-lijst`.closest('.inst-acc').
- **Opdrachttype "Nieuw type"-knop deed niets** — `#ot-add` had géén click-handler (wel `.ot-edit` etc.).
  Handler toegevoegd die `openOpdrachtTypeModal()` opent.
- **Werkorder-type modal: beschrijving liep door de velden** — beschrijvingsteksten hadden `margin:-6px`
  (getuned op oude veldhoogte, vóór fase 2b). Alle 5 → `margin:3px 0`.

**Nog open:** klantmails-"pillen" zijn info-spans (waren nooit klikbaar) — evt. als filter klikbaar
maken = los feature-punt. Fase 3 (rest: reduced-motion, focus-visible) en fase 4 nog te doen.

---

# Styling — Fase 3 & 4 (deel) — 22 augustus 2026

`flow8-v2.html` · JS-syntax ✓. Backup: `/tmp/flow8-voor-fase34`.

**Uitgevoerd (veilige CSS):**
- **3c reduced-motion breed** — was alleen `#login-screen`; nu app-breed via
  `@media(prefers-reduced-motion:reduce)` op `*` (animation/transition-duration .001ms).
- **4a focus-visible** — toetsenbordfocus zichtbaar: globale `:focus-visible` outline + specifiek op
  `.btn/.nav-item/.stat-card`; `.input` houdt eigen focusring.
- **4b mobiele raakvlakken** — binnen bestaande `@media(max-width:768px)`: `.btn-icon` 44×44,
  `.kolom-btn` 40×40, `.modal-close` 40×40.

**Al gedekt / overgeslagen:**
- **3b** licht thema — al gedaan (fixronde).
- **4c lege staten** — al gedekt door bestaande `legeStaat()` (gestylede empty states, 14+ plekken).
  Skelet-laadstaten optioneel, apart.

**Bewust apart gehouden (risico/audit/markup — niet blind doen):**
- **3a klikcursor versmallen** — veel `-rij`/`-kaart` zijn JS-klikbaar zónder `onclick`/`data-nav`;
  blind versmallen haalt pointer weg bij echt-klikbare rijen. Vereist audit + taggen (`data-nav`/`is-klikbaar`).
- **4a tabindex op nav-items** — markup; eerst bevestigen of nav-items `<div>` zijn (niet focusbaar).
- **4c skelet-laadstaten** — CSS + markup per scherm.
- **4d hoekradii opruimen** — brede audit van alle `border-radius:` (veel inline in JS) → aparte zorgvuldige pass.
- **4e icon-stroke consistent** — brede SVG-audit op `stroke-width` (doel 1.7).

---

# Mobiel — horizontale scroll Planning/Materialen (22 augustus 2026)

Melding: kleine horizontale scroll op mobiel bij Planning en Materialen na 4b. `flow8-v2.html` · JS ✓.
Backup: `/tmp/flow8-voor-4b-fix`.

**Analyse:** níet 4b — de `.btn-icon`/verwijder-knoppen zijn op mobiel in die twee lijsten verborgen
(`_acties`-kolom hidden, materialen-verwijder is `hide-mobile`), en `.kolom-btn` als class bestaat niet.
Echte oorzaak: `.content` clipt al (`overflow-x:hidden`), dus de scroll komt uit de tabel-`.table-wrap`.
Debiteuren/serviceklanten/mail-tabellen hadden al een mobiele padding-override (`…8px`), maar
`.plan-tabel` en de materialen-tabel niet → die gebruiken de basis-`td` padding, die in fase 2c van
14→15px horizontaal ging. Bij die toch al krappe tabellen tikt dat net over de schermrand.

**Fix:** in `@media(max-width:768px)`: `td,th{padding-left:10px;padding-right:10px}`. Class-specifieke
overrides (deb/sk/mail/ct) winnen en blijven ongemoeid; alleen tabellen op basis-padding (planning,
materialen, e.a.) worden smaller en passen weer.

---

# Styling — 4e icon-stroke unificatie (22 augustus 2026)

`flow8-v2.html` · JS-syntax ✓. Backup: `/tmp/flow8-voor-iconstroke`. Keuze: **1.8** (na preview-vergelijking).

**Audit:** 439 inline SVG's, lijndikten door elkaar (2 ×232, 2.5 ×130, 1.5 ×22, 3/2.2/1.8 ×15, staart).
Gekoppeld aan grootte: hoofdgroep 12–24px (mix 2/2.2/2.5), grote illustraties 34–48px (uniform 1.5),
logo 5.5 (op paths), mini-iconen 9–11px (dikker voor leesbaarheid).

**Uitgevoerd:** per `<svg>`-tag, iconen met breedte 12–24px én stroke ≥2 → **1.8** (335 stuks).
Script met `(?<!stroke-)width=` lookbehind zodat de `width` binnen `stroke-width` niet meetelt;
alleen stroke-width óp de svg-tag, niet op child-`<path>`/`<line>` (logo blijft 5.5).

**Bewust behouden (geverifieerd):** logo 5.5 (4×), grote illustraties 1.5 (22×), speciaal 8 (2×),
mini-iconen 9–11px, en ~17 CSS-gesizede SVG's zonder breedte-attribuut (grootte niet bepaalbaar →
apart te doen als er ergens een te-zwaar icoon opvalt).

**Styling-routekaart nu:** fase 1, 2, 3 (3a apart), 4a/4b/4c/4e gedaan. Openstaand: **3a klikcursor**
(vereist audit JS-klikbare rijen) en **4d radii opruimen** (geval-voor-geval sweep).

---

# Styling — 4d radii (scoped) — 22 augustus 2026

`flow8-v2.html` · JS-syntax ✓. Backup: `/tmp/flow8-voor-radii`.

**Audit:** 639 border-radius. Cirkels 50% (79, behouden), pil-hacks 980/999/99/100px (24),
multi-corner (behouden), en een kleine-radius-berg 4–11px (~450) op vooral generieke inline `<div>`'s.

**Uitgevoerd — alleen 1-op-1 token-matches (ZERO zichtbare verandering):**
- pil-hacks 980/999/99/100px → `var(--radius-pill)` (24)
- 12px → `var(--radius)` (21)
- 14px → `var(--radius-lg)` (6)
Regex met terminator-lookahead `[;"}'!]` zodat multi-corner radii (`12px 0 0 0`) intact bleven (geverifieerd).

**Bewust NIET gedaan (eerlijke afweging):** de kleine-berg 4–11px blind naar één token forceren.
Die zitten contextafhankelijk op generieke boxjes; forceren maakt mini-elementen te rond met
regressierisico, tegen nauwelijks zichtbare winst. Ook 16/20/24px (gemengd) en 50%/modal-18px gelaten.
Losse, preview-gated pass per scherm mogelijk als ergens een radius opvalt.

**Routekaart:** fase 1/2/3(-3a)/4a/4b/4c/4d(scoped)/4e klaar. Enige echt-open: **3a klikcursor**
(vereist audit JS-klikbare rijen).

---

# Styling — 3a klikcursor (audit + scoped) — 22 augustus 2026

`flow8-v2.html` · JS-syntax ✓. Backup: `/tmp/flow8-voor-3a`.

**Audit-uitkomst (beslissend):** géén enkele `-rij`/`-kaart` gebruikt `onclick=` of `data-nav`;
alle klikbare rijen krijgen hun handler via `addEventListener` (`querySelectorAll('.wo-rij')` etc., 16+ types).
De leidraad-narrowing naar `[onclick],[data-nav]` zou dus de pointer weghalen bij vrijwel álle klikbare
rijen → onveilig. De brede regel `[class*="-rij"],[class*="-kaart"]` is voor deze app dus correct.

**Enige echte valse-positief:** `inst-kop-rij` (header-rij, niet klikbaar). De `cl-tabel-rij-*`-matches
zijn knoppen (pointer terecht).

**Uitgevoerd:** `[class*="kop-rij"]{cursor:default}` toegevoegd ná de brede regel — haalt het misleidende
handje van header-rijen, zonder de klikbare rijen te raken. Brede regel bewust behouden.

**Styling-routekaart: VOLLEDIG afgerond** (1, 2, 3, 4). 4d bewust scoped, 3a scoped na audit.

---

# Kleine fixes — 22 augustus 2026

`flow8-v2.html` · JS-syntax ✓. Backup: `/tmp/flow8-voor-kleinefixes`.

- **Migratieblok 'gedraaid'-vlag** — NIET nodig gebleken. Beide load-migraties zijn al bewaakt:
  `migreerVerlofNaarUren()` schrijft alleen bij `verlofSaldoUren==null`, de rechten-migratie alleen
  `if(gewijzigd)`. Ze stoppen vanzelf na de eerste keer; een aparte vlag zou redundante state zijn.
  Oude werklijst-notitie achterhaald door bestaande per-record guards.
- **Werkorder-type kleur in de lijst** — gekleurd bolletje vóór de typenaam, in de tabel (`_woRenderLijst`,
  8px) én de mobiele kaart (`_mk`, 7px). Kleur uit `_typeVan(w).kleur`, fallback `#6b7694`. Left-border
  bleef gereserveerd voor prioriteit (rood).
- **Icon-stroke edge-cases** — 13 CSS-gesizede content-iconen (12–18px, via `style="width:…"`) van
  `2`→`1.8`. De 11px mini's en 2 zonder grootte-info bewust gelaten.

---

# Klantmails-pillen als filter — 22 augustus 2026

`flow8-v2.html` · JS-syntax ✓. Backup: `/tmp/flow8-voor-km-filter`.

- **4c/4d verduidelijkt:** lege staten (legeStaat) en radii-tokenisatie waren al klaar; skelet-laadstaten
  en per-scherm-radii waren optionele extra's, geen openstaande todo's.
- **Pillen klikbaar als filter** (renderKlantmails, planning-tab). Was info-`<span>`s; nu klikbare pillen:
  "opdrachten" (alles), "te versturen", "verstuurd", "zonder e-mail". Klik filtert de lijst op die status;
  actieve pil krijgt een ring (outline in eigen kleur); nogmaals klikken of "opdrachten" = alles.
- **Mechaniek:** per opdracht `o._mailStatus` in de stats-loop (op de enrichSortVelden-KOPIEËN, dus geen
  Firebase-vervuiling); `_mailStatusFilter`-state; `opdrachtenMaand` gefilterd ná de stats (pillen tonen
  altijd de volledige maand-tellingen). Bulk-mail/selecteren werkt nu op de gefilterde selectie.
