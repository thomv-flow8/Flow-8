# Flow8 — projectcontext voor Claude Code

Flow8 is een multi-tenant SaaS PWA voor de installatie- en servicebranche: planning met
routeoptimalisatie, digitale werkbonnen, klantbeheer, teamadministratie, rapportage en HR.
Planners werken op kantoor, monteurs in het veld. Eigenaar en solo-ontwikkelaar: Thomas.
Primaire test-tenant: Homa Pompen B.V. (`bedrijfId: demo`).

**Taal: alle communicatie én alle UI-tekst is Nederlands.**

---

## Verplichte werkwijze (niet onderhandelbaar)

Elke inhoudelijke reactie volgt deze vier stappen, in deze volgorde:

1. **Analyse** — herformuleer wat er precies gevraagd wordt. Ga niet meteen implementeren.
2. **Gevolgen** — afhankelijkheden, risico's en systeem-brede impact. Welke andere onderdelen
   raakt dit? Wat kan er stukgaan? Welke aannames zitten erin?
3. **Oplossing** — beschrijf de aanpak vóór je iets doet. Weeg alternatieven af.
4. **Uitvoering** — pas hierna uitvoeren, en verifieer het resultaat.

Ga **nooit** direct implementeren zonder analyse. Bij grote of onomkeerbare stappen: **eerst
bevestiging vragen** en pas uitvoeren na expliciet akkoord ("ja" / "is goed" / "graag").
Thomas keurt elke stap goed; presenteer opties en analyse, laat Thomas beslissen — neem niets aan.

## Kwaliteitsborging (na élke wijziging)

- **JS-syntaxcheck na elke wijziging** — draai `./check.sh` (of het node-commando in de README).
  Los fouten direct op; ga nooit door op een gebroken bestand.
- **Veilige edits** — gebruik de Edit-tool met een unieke `old_string`. Voor meervoudige of complexe
  wijzigingen: een Node-script dat eerst telt (`if (s.split(oud).length - 1 !== 1) throw …`), zodat het
  bestand ongewijzigd blijft als de controle faalt. (Python staat niet op deze machine, Node wel.)
  **Nooit** een `re.S`/greedy regex zonder eerst voorkomens te tellen (een regex-incident wiste
  ooit 3.988 regels). Blok-verwijderingen: altijd bottom-to-top (indices aflopend sorteren).
- **Verifieer elke edit** met een gerichte controle (tel of de vervanging het verwachte aantal
  keer is doorgevoerd).
- **Preview vóór grote of visuele wijzigingen** — maak een los previewbestand en laat het
  beoordelen voordat je het in de hoofdcode verwerkt.
- **Git is de backup.** Commit vóór een grote operatie; zo is terugdraaien altijd één commando.

## Systeem-breed & consistent

- Controleer bij elke wijziging welke andere pagina's, componenten, functies of datavelden
  worden geraakt. Pas gedeelde helpers/statusmodellen overal consistent aan — lever geen losse
  wijziging die elders iets breekt.
- Gebruik bestaande **designtokens** en helperfuncties i.p.v. hardcoded waarden of een eigen stijl.
- **Iconen: altijd SVG** uit de bestaande `ICO`-set — nooit emoji of emoticons.
- Mobile-first (iPhone is het primaire testapparaat); desktop is de ruimere variant.

---

## Architectuur

- **Eén groot single-file HTML-bestand: `flow8-v2.html`** (~35.700 regels). CSS-tokens + styling in
  de `<head>` (± regel 14–635), daarna de HTML-body, daarna één grote `<script>` met alle JS
  (render-functies, Firebase, modules). Dit is het **canonieke bronbestand** — de waarheid.
- Gehost op **GitHub Pages** (repo `thomv-flow8/Flow-8`). Het HTML registreert `sw.js` (service
  worker; paden gaan uit van `/Flow-8/`) — houd die in de repo. Het manifest staat inline als
  data-URI in de `<head>`.
- **Firebase RTDB**: planning, medewerkers, verlof, instellingen.
- **Firestore**: werkorders, werkorder-types, artikelen, werkbonnen.
- RTDB en Firestore draaien in hetzelfde Firebase-project maar met **apart geïnitialiseerde SDK's
  en aparte helperfuncties — nooit door elkaar aanroepen.**
- Integraties: Google Maps (routing/markers), jsPDF (PDF maken), PDF.js (PDF tonen), Resend via
  Cloud Function `verstuurMail` (mail), PDOK (adres), Firebase Storage, Firebase Auth.

## Cloud Functions (`flow8-functions/`)

- Firebase-project `flow8-715de`, regio `europe-west1`, Node 22 (sinds 23 september 2026; Node 20
  werd op 30 oktober 2026 uitgezet). Code: `flow8-functions/functions/index.js`.
- `verstuurMail` — verstuurt mail via Resend met de huisstijl-wrapper `bouwMailHtml()`; logt naar
  `flow8/bedrijven/{bedrijfId}/mailLog`.
- `zetGebruikersClaim` — zet de custom claims op het token: `bedrijfId rol actief medId`, `rch`
  (per module `s`/`e`/`g`, voor Firestore-rules) en de platte `ouRecht okRecht vlRecht vzRecht`
  (voor RTDB-rules, die geen geneste claims lezen). **De Firebase-rules leunen hierop — wijzig
  claims en rules altijd samen.**
- Geheimen: `RESEND_API_KEY` staat in Firebase Secret Manager, `MAIL_FROM` in `functions/.env`
  (niet in git). Zet nooit een sleutel in code of repo.
- Deployen: `cd flow8-functions && firebase deploy --only functions`. Dat staat los van de
  Pages-push en is direct live — alleen na akkoord van Thomas.
- Rules: `database.rules.json`, `firestore.rules` en `storage.rules` in `flow8-functions/` zijn
  sinds 21 september 2026 gekoppeld aan `firebase.json`; op die datum is vastgesteld dat ze
  identiek waren aan de live-versie. **De repo is nu de bron — wijzig rules hier, niet in de
  Console**, want een deploy overschrijft de Console-versie. Deployen:
  `firebase deploy --only database,firestore:rules,storage` (eerst met `--dry-run`).
  Live RTDB-rules teruglezen kan met `firebase database:get "/.settings/rules"`; voor Firestore en
  Storage bestaat geen CLI-commando — die moeten uit de Console gekopieerd worden.
- **Rules testen**: er staat geen Java op deze machine, dus de emulator valt af. Testen gebeurt in de
  **Rules Playground** van de Console (die simuleert, en schrijft niets). Twee valkuilen: het Data-veld
  wil een JSON-**object**, een losse string geeft "Failed to parse payload" — gebruik dus `update` op
  het bovenliggende record met `{"veld":"waarde"}`, niet `set` op het veld zelf. En gebruik nooit `set` op
  een heel record: dan wist je de andere velden en krijg je rood om de verkeerde reden. Verwijderen
  test je met `delete` en een leeg Data-veld.
- **`.validate` draait niet bij een verwijdering.** Een veld dat niet gewijzigd mág worden, kun je dus
  niet met `.validate` beschermen — wissen-en-opnieuw-zetten omzeilt het. Zet zulke controles in de
  `.write`-regel, op het niveau waar het schrijfrecht wordt verleend; dieper kun je in RTDB niets meer
  intrekken, want rechten cascaderen naar beneden.

## Designtokens (huisstijl — gebruik deze, geen losse waarden)

Donker thema (`:root`) en licht thema (`body.light`). Thomas test vaak in **licht thema** — check
altijd beide.

- Vlakken: `--bg --surface --surface2 --border`
- Accent: `--accent:#4f6ef5` · `--accent2:#35c4e3` (cyaan)
- Status: `--green --orange --red --purple`; leesbare tekstvariant op vlakken: `--green-t` etc.
  (licht thema heeft donkere `-t`-varianten — al ingesteld)
- Tekst: `--text --muted --muted2`
- Radii: **drie rollen** — `--radius`(12px, velden) · `--radius-lg`(14px, kaarten) ·
  `--radius-pill`(100px, knoppen/tags/tegels). Modals houden 18px.
- Fonts: **Instrument Sans** (UI) + **Space Mono** (cijfers, kleinkapitaal-labels). **Syne** alleen
  voor het FLOW 8-woordmerk (weights 300/800).
- **SVG-icoon-lijndikte: 1.8** voor content-iconen (12–24px). Mini-iconen (<12px) en grote
  illustraties (1.5) houden hun dikte; logo-mark 5.5.

## Belangrijke helpers (nooit omzeilen)

- `_woNummerLabel(wo)` / `_woNummerPlat(wo)` — werkbonnummer-weergave (nooit `wo.nummer` direct).
- `magBeheren('werkorders')` — B-recht (beheren). `magSchrijven(module)` — schrijfrecht.
- Verlof: `verlofUrenNaarDagen(uren, med)` / `verlofDagenNaarUren(dagen, med)` /
  `verlofOpgenomenUren(lijst, med)` / `_verlofUrenPerDagVan(med)` — vereisen het medewerker-object.
- `laadWerkordersCache(force)` / `laadWerkdocumenten(force)` — Firestore-caching.
- `_mailRefParse()` / `_mailKlantNaam()` — maillog-refs en debiteurnaam.
- `_medBestaat(id)` / `_medInDienst(id)` — telt een record van een medewerker nog mee (verwijderd/inactief).
  `medArchiefNaam(id)` — naam van een verwijderde medewerker uit `medewerkersArchief` (anders '').
- `openBovenModal(titel, body, footer)` — venster bóven een open modal; het formulier eronder blijft staan.
- `enrichSortVelden()` maakt **kopieën** (`Object.assign`) — transient `_`-velden erop vervuilen
  de opgeslagen objecten niet.

## Domeinmodellen (kort)

- **Planning-status** (Outsmart-model, live): nieuw = `ingepland`; `klaargezet` = vrijgeven aan
  monteur (werkbon zichtbaar). Inplannen wijzigt de status niet. `spoed` staat nog ín het
  statusmodel maar hoort een aparte prioriteitsvlag te worden (zie TODO).
- **Monteur-rechten**: monteurs dienen Overuren/Onkosten/Verlof zelf in (write, eigen records);
  bewerkbaar zolang de status `aangevraagd` is (afgedwongen in de RTDB-rules), daarna read-only. Verzuim: alleen eigen data
  bekijken. Rechten zijn status-afhankelijk, niet alleen module aan/uit.

## Gotchas (hard geleerd)

- Meet vóór je optimaliseert — lazy-loading bleek onnodig (456 opdrachten, 107ms).
- `undefined` vs `null`: Firebase accepteert geen `undefined` — converteer naar `null` vóór opslaan.
- Guard `===`-vergelijkingen van identifiers tegen lege strings.
- Tabel-layout: een kolom zonder breedte absorbeert alle ruimte — geef bewuste breedtes + `max-width`.
- Nieuw venster op mobiel: open **synchroon in de klik-handler**, niet ná async werk; voorzie een
  download-vangnet.
- Canvas-geheugen op iOS: zet canvas op 0×0 om écht vrij te geven (`remove()` alleen is te weinig).
- Offline: gebruik Firebase `.info/connected`, niet `navigator.onLine`.
- Multi-tenant AVG: adres-lookups geven `null` voor onbekende tenants, nooit een default.

---

## Git & deploy

- **Commit + push naar GitHub Pages = live.** Na een push zet Pages `flow8-v2.html` automatisch
  live op `https://thomv-flow8.github.io/Flow-8/flow8-v2.html`.
- **Firebase Authorized domains**: `thomv-flow8.github.io` moet in Firebase → Authentication →
  Settings → Authorized domains staan, anders faalt inloggen op de live-versie.
- Werk in kleine, beschrijvende commits (NL). Push pas na de geslaagde JS-syntaxcheck.

## Projectbestanden

- `flow8-v2.html` — de app (canoniek).
- `sw.js` — service worker van de app.
- `flow8-functions/` — Cloud Functions (mail + custom claims), zie hierboven.
- `Flow8-website.html` — marketingsite; gebundelde export met een eigen, uitgesprokener stijl
  (niet de app-huisstijl).
- `check.sh` — JS-syntaxcheck van `flow8-v2.html`.
- `TODO.md` — openstaande punten, geprioriteerd. Werk dit bij als iets af is.
- `README.md` — eenmalige setup en dagelijkse workflow.
- `flow8-werklijst-fase2.md` — het volledige historische logboek (wat is gedaan + waarom).
