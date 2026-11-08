---
name: Flow8
description: Planning, werkbonnen en teamadministratie voor de installatie- en servicebranche — app-huisstijl (flow8-v2.html)
colors:
  signaalblauw: "#4f6ef5"
  signaalblauw-knop: "#4c6aeb"
  signaalblauw-tekst: "#93a6ff"
  signaalblauw-tekst-licht: "#2f4bc8"
  waterlijn-cyaan: "#35c4e3"
  nachtdienst: "#0a0b10"
  werkvlak: "#101320"
  werkvlak-verdiept: "#181a2c"
  naad: "#262b3d"
  tekst: "#f4f6fb"
  tekst-gedempt: "#a8aec0"
  tekst-zacht: "#868da3"
  dagvlak: "#f5f6f8"
  werkvlak-licht: "#ffffff"
  werkvlak-verdiept-licht: "#f2f4f8"
  naad-licht: "#e2e5ec"
  tekst-licht: "#0d0f14"
  tekst-gedempt-licht: "#5f6572"
  tekst-zacht-licht: "#6b7180"
  gereed-groen: "#10b981"
  gereed-groen-knop: "#047857"
  gereed-groen-tekst: "#34d99f"
  gereed-groen-tekst-licht: "#065f46"
  wacht-oranje: "#f59e0b"
  wacht-oranje-tekst: "#e0b072"
  wacht-oranje-tekst-licht: "#92400e"
  spoed-rood: "#ef4444"
  spoed-rood-knop: "#d42c2c"
  spoed-rood-tekst: "#f98a8a"
  spoed-rood-tekst-licht: "#b91c1c"
  paars: "#8b5cf6"
  paars-tekst: "#b69bff"
  paars-tekst-licht: "#7040e0"
typography:
  woordmerk:
    fontFamily: "Syne, sans-serif"
    fontWeight: 800
  inlogkop:
    fontFamily: "Inter Tight, Instrument Sans, sans-serif"
    fontSize: "30px"
    fontWeight: 500
    lineHeight: 1.05
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
  body:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
  rij:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.3
  label:
    fontFamily: "Space Mono, monospace"
    fontSize: "11px"
    fontWeight: 400
    letterSpacing: "0.08em"
  cijfer:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14.5px"
    fontWeight: 600
    fontFeature: "tnum"
  uitleg:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.45
  klein:
    fontFamily: "Instrument Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
rounded:
  mini: "4px"
  sm: "8px"
  md: "12px"
  lg: "14px"
  venster: "18px"
  blad: "20px"
  pill: "100px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  kaart: "18px"
  xl: "24px"
components:
  button-primary:
    backgroundColor: "{colors.signaalblauw-knop}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "9px 18px"
    height: "38px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.tekst-gedempt}"
    rounded: "{rounded.pill}"
    padding: "9px 18px"
    height: "38px"
  button-danger:
    backgroundColor: "{colors.spoed-rood-knop}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "9px 18px"
  button-groen:
    backgroundColor: "{colors.gereed-groen-knop}"
    textColor: "#ffffff"
    rounded: "{rounded.pill}"
    padding: "9px 18px"
  input:
    backgroundColor: "{colors.werkvlak-verdiept}"
    textColor: "{colors.tekst}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
  card:
    backgroundColor: "{colors.werkvlak}"
    rounded: "{rounded.lg}"
    padding: "18px"
  tag:
    rounded: "{rounded.pill}"
    padding: "5px 12px"
    typography: "{typography.label}"
  stat-chip:
    backgroundColor: "{colors.werkvlak}"
    textColor: "{colors.tekst}"
    rounded: "{rounded.pill}"
    typography: "{typography.cijfer}"
  lijstrij:
    textColor: "{colors.tekst}"
    typography: "{typography.rij}"
    height: "58px"
  icoontegel:
    backgroundColor: "{colors.werkvlak-verdiept}"
    textColor: "{colors.tekst-gedempt}"
    rounded: "{rounded.md}"
    size: "36px"
  venster:
    backgroundColor: "{colors.werkvlak}"
    rounded: "{rounded.venster}"
    width: "640px"
---

# Design System: Flow8

## Overview

**Creative North Star: "De werkplaatsbank"**

Flow8 is gereedschap, geen etalage. Alles ligt op een vaste plek: dezelfde werkbalk bovenaan elke pagina, dezelfde lijstrijen, dezelfde knop rechtsboven om iets nieuws te maken. Een planner op kantoor en een monteur met werkhandschoenen in een pompput moeten allebei zonder nadenken de goede knop vinden. Daarom is de app rustig en voorspelbaar, met grote tikvlakken (44px op aanraakschermen) en tekst die in beide thema's leesbaar is.

Kleur is een signaal en nooit versiering. Signaalblauw is de kleur waarmee je iets doet. Groen, oranje en rood vertellen de status van een opdracht, aanvraag of medewerker. Al het andere is neutraal: donkere werkvlakken in het donkere thema en wit papier in het lichte thema, dat Thomas het vaakst gebruikt. De huisstijl is stevig en rustig: ronde pillen voor knoppen, vlakke kaarten met een dunne naad en velden die er duidelijk als velden uitzien.

De app is één bestand (`flow8-v2.html`). Alle waarden staan als CSS-variabelen op `:root` (donker) en `body.light` (licht). Gebruik altijd die tokens en de bestaande helpers, nooit losse waarden.

**Key Characteristics:**
- Twee volwaardige thema's: donker (`:root`) en licht (`body.light`); elke wijziging in beide controleren.
- Eén accentkleur voor handelingen (Signaalblauw); statuskleuren met een vaste betekenis.
- Lijststijl: inklapbare blokken, lijstrijen met een icoontegel links en de waarde of chevron rechts.
- Vlak in rust; schaduw alleen voor wat boven de pagina zweeft.
- Telefoon eerst (iPhone), desktop is de ruimere variant.
- Alle tekst en uitleg in het Nederlands, neutraal voor muis en vinger.

## Colors

Neutrale werkvlakken met één blauw voor handelingen en vier statuskleuren die altijd hetzelfde betekenen.

### Primary
- **Signaalblauw** (`--accent`): actieve tab, geselecteerde chip, focusrand, links en grafiekaccent. Als tekst altijd in de leesbare variant **Signaalblauw-tekst** (`--accent-t`): die is licht op donker en donker op licht.
- **Signaalblauw-knop** (`--accent-knop`): het vlak onder witte knoptekst. Vier procent donkerder dan Signaalblauw, zodat wit 4,6:1 haalt. Met het oog zie je het verschil niet.

### Secondary
- **Waterlijn-cyaan** (`--accent2`): verwijst naar water en pompen. Gebruik het alleen in het logo, het woordmerk en kleine accenten, nooit als knop- of tekstkleur.

### Tertiary
- **Gereed-groen** (`--green`): afgehandeld, goedgekeurd, online. Als tekst `--green-t`, als knopvlak met witte tekst `--green-knop`.
- **Wacht-oranje** (`--orange`): aangevraagd, opnieuw inplannen, waarschuwing. Als tekst `--orange-t`. Er bestaat geen oranje knop, want wit op oranje is onleesbaar. Een waarschuwing krijgt een blauwe knop met een oranje icoon.
- **Spoed-rood** (`--red`): spoed, ziek, verwijderen, fout. Als tekst `--red-t`, als knopvlak met witte tekst `--red-knop`.
- **Paars** (`--purple`): losse categorieën, zoals agendatypes. Als tekst `--purple-t`.

### Neutral
- **Nachtdienst** (`--bg`, donker) en **Dagvlak** (licht): de paginaachtergrond. Het donkere thema heeft bovenin één rustige blauwe gloed (`--bg-gradient`).
- **Werkvlak** (`--surface`): kaarten, vensters, de werkbalk en de zijbalk.
- **Werkvlak verdiept** (`--surface2`): velden, icoontegels, actieve segmenten en verleden rijen.
- **Naad** (`--border`): de dunne rand van kaarten en de scheiding tussen lijstrijen.
- **Tekst**, **Tekst gedempt** (`--muted`, uitleg en labels) en **Tekst zacht** (`--muted2`, placeholders). Alle drie halen minstens 4,5:1 op hun vlak.

### Named Rules
**The Signaal Rule.** Signaalblauw betekent "hier kun je iets doen" of "dit is gekozen". Gebruik het niet voor sfeer, achtergronden of decoratie.

**The Spoed Rule.** Spoed is een vlag, geen type en geen status. Overal hetzelfde teken: een gevuld rood label "Spoed" (`_spoedLabel()`, wit op `--red-knop`) en op kaarten een rode rand (`.spoed-kaart`). Een type houdt zijn eigen kleur, ook als die rood is, zodat een gewone Storing nooit op spoed lijkt.

**The -t Rule.** Een statuskleur als tekstkleur is altijd de `-t`-variant (`--accent-t`, `--red-t`, `--orange-t`, `--green-t`, `--purple-t`). De gewone kleur is voor vlakken, randen en stippen.

**The Witte-tekst Rule.** Witte tekst staat alleen op een `-knop`-vlak (`--accent-knop`, `--green-knop`, `--red-knop`). Wit op `--accent`, `--green`, `--red` of `--orange` haalt de contrastnorm niet.

**The Gedempt-niet-doorzichtig Rule.** Iets wat minder belangrijk is (een verleden week, een medewerker zonder aanvragen) krijgt `--muted`, een `--surface2`-vlak of `filter:saturate(...)`. Zet nooit `opacity` op tekst: dan zakt het contrast onder de norm en worden knoppen erin onleesbaar.

## Typography

**Display Font:** Syne (300/800), alleen voor het FLOW 8-woordmerk
**Body Font:** Instrument Sans (met ui-sans-serif, system-ui)
**Label/Mono Font:** Space Mono
**Inlogkop:** Inter Tight (500), alleen voor de welkomstkop op het inlogscherm, gelijk aan de marketingsite

**Character:** Instrument Sans is helder en zakelijk zonder kil te worden. Space Mono geeft labels en kolomkoppen het karakter van een registratieboek. Syne komt alleen in het merk voor.

### Hierarchy
- **Inlogkop** (Inter Tight 500, 30px tot clamp(26px, 2.4vw, 38px), 1.05, -0.04em): alleen "Welkom terug" en de kop op het inlogscherm. Het inlogscherm is de brug naar de marketingsite; in de app zelf komt Inter Tight niet voor.
- **Headline** (600, 17px, -0.02em): paginatitel in de bovenbalk en venstertitel. Op de telefoon 15px.
- **Title** (600, 16px): kop van een instellingenkaart of blok.
- **Rij** (400, 15px, 1.3): tekst in een lijstrij. Een tweede regel staat eronder in 12px `--muted`.
- **Body** (400, 13.5–14px, 1.45): uitleg, meldingen, formuliertekst.
- **Label** (Space Mono 400, 11px, 0.08em, HOOFDLETTERS): kolomkoppen, groepslabels (`lf-groep`) en meldingskoppen.
- **Cijfer** (600, 14.5px, tabelcijfers): waarden in statchips en totalen. In Rapportage-tegels 20px.
- **Uitleg** (400, 13px, 1.45): uitleg onder een kaartkop, filterpillen, kleine knoppen.
- **Klein** (400, 12px): tweede regel in een lijstrij, kolomtekst die minder belangrijk is, hints bij een knop. Dit is na 13px de meest gebruikte maat. Ga niet onder 11px, behalve bij avatar-initialen en in mini-voorbeelden zoals de werkbon-pdf in Instellingen.

### Named Rules
**The 700 Rule.** Koppen en cijfers gebruiken gewicht 600–700. 800 komt alleen in het Syne-woordmerk voor.

**The 16px Rule.** Op aanraakschermen (`pointer:coarse`, dus ook de iPad) en onder 768px staan invoervelden op 16px. Anders zoomt Safari in zodra je in een veld tikt. Inzoomen zelf blijft toegestaan.

**The Nederlandse Getallen Rule.** Getallen hebben een komma als decimaalteken en maximaal één decimaal, overuren maximaal twee (`_hrGetal`, `_nlAantal`, `_nlUren`). Eenheden schrijf je uit: "8 uur", "1 dag", "2,5 dagen" (`_nlDagen`). Gebruik geen "dg" en geen losse "d". De korte "u" mag in compacte saldo-weergaven ("0u").

## Layout

Elke pagina heeft dezelfde opbouw. Bovenaan staat de **werkbalk** (`.werkbalk`): links een zoekveld van maximaal 300px breed en eventueel filters, rechts de knoppen, met de primaire knop helemaal rechts. Daaronder staat de **periodekiezer** (`_periodeNav()`, de pil ‹ label ›) met eventueel de knop "Vandaag". Dan volgen de **statchips** en daarna de inhoud: een tabel, lijstrijen of inklapbare blokken. Tussenruimte in de werkbalk is 8px, tussen kaarten 16px. De paginarand is 24px op desktop en 12px op de telefoon.

Breekpunt 768px: daaronder is het de telefoonweergave, met een onderbalk voor navigatie, schuifbladen in plaats van zijpanelen en een eigen werkbalk voor Planning. Boven 768px staat de zijbalk links. Gebruik `(pointer:coarse)` voor tikvlakken van 44px, los van de breedte.

**Statchips** staan op de computer als rij met omloop. Op de telefoon worden ze één smalle schuifrij, zodat de lijst zelf snel in beeld komt. Alleen Rapportage toont cijfers als tegels van 2 × 2, want daar zijn de cijfers de inhoud.

**Weken** tonen de werkdagen uit Instellingen › Planning (standaard ma–vr), plus elke dag waarop werk staat (`_planWeekDagen`). Werk in het weekend is dus nooit onzichtbaar. Voor capaciteit tellen alleen de werkdagen mee (`_planIsWerkdag`): een weekenddag met werk telt als gepland, niet als extra beschikbare uren.

**Planning-lijst:** bij het openen, bij een andere periode en bij de knop Vandaag staat vandaag bovenaan in beeld (`_planNaarVandaag`). Bij hertekenen na een wijziging springt de lijst niet. Een reeks van twee of meer lege dagen wordt één regel (`.leeg-reeks`) met per dag een knopje "+ ma 2". Vandaag, dagen met werk, geblokkeerde dagen en een losse lege dag houden hun eigen dagblok.

**Werkbalk van Planning:** op desktop blijft de werkbalk bovenaan staan terwijl lijst, week of dag eronder scrolt (`.plan-kop`), met een dun randje zodra er iets onder schuift. Naar vandaag scrollen stopt net onder de werkbalk. Op de telefoon scrolt hij mee: vast zou hij ruim een kwart van het scherm innemen, en "+ Opdracht" zweeft daar al.

**Kaart in Week en Dag** (`.wk-kaart`): bovenaan tijd en status op één regel (`_wkKaartKop`), daaronder de klantnaam over de volle breedte, dan het type (`_wkType`) en het adres. De status zweeft niet: een zwevende badge knijpt de naam af. Vlak en linkerrand in de typekleur. Afgehandeld en verwerkt zijn gedempt (`.wk-klaar`: geen vlak, dun kader, `--muted`-tekst), zodat open werk eruit springt. "+ opdracht" in een weekcel verschijnt bij aanwijzen of toetsenbordfocus, op een aanraakscherm altijd.

**Zeldzame acties** (kolommen kiezen, exporteren, importeren) staan in het "…"-menu (`_meerMenu`), zodat de werkbalk op één regel past. Ook een losse "Export" gaat in het menu. De volgorde is vast: eerst de eigen acties van de pagina (Jaarplanning, Jaar bijschrijven), dan Kolommen kiezen, Exporteren en Importeren ("Debiteuren importeren"). Een keuze die bij de periode hoort, zoals Maand/Kwartaal of Kwartaal/Jaar, staat rechts naast de periodekiezer en "Vandaag" (`.ag-switcher`), niet als tweede kiezer in de werkbalk.

**Tabellen** die breder zijn dan het scherm vervagen aan de kant waar nog kolommen staan (`kan-links` en `kan-rechts`, automatisch op elke `.table-wrap`). Geef kolommen een bewuste breedte. Een kolom zonder breedte slokt alle ruimte op.

### Named Rules
**The Vaste-plek Rule.** De knop om iets nieuws te maken staat altijd rechts in de werkbalk. Zoeken staat altijd links. Een nieuwe pagina volgt die opbouw en verzint geen eigen werkbalk.

## Elevation & Depth

Flow8 is vlak in rust. Kaarten, statchips en lijsten hebben een dunne naad (`1px solid var(--border)`) en geen schaduw. In het lichte thema staat dat zelfs expliciet uit (`body.light .card{box-shadow:none}`); zet daar geen kaartschaduw overheen. Diepte komt van tonale lagen: de pagina (`--bg`), daarop het werkvlak (`--surface`), daarin velden en tegels (`--surface2`). Schaduw is voor wat boven de pagina zweeft: vensters, meldingen en het zijpaneel.

### Shadow Vocabulary
- **Venster** (`box-shadow: 0 24px 70px rgba(0,0,0,.55)`, licht: `0 24px 70px rgba(20,26,60,.18)`): vensters en bevestigingen.
- **Zijpaneel** (`box-shadow: -10px 0 40px rgba(0,0,0,.3)`): alleen als `.panel.open`. Een dicht paneel staat buiten beeld en heeft geen schaduw.
- **Melding** (licht: `box-shadow: 0 16px 40px rgba(20,26,60,.16)`): de toast onderin.
- **Gekozen segment** (`box-shadow: 0 1px 3px rgba(20,24,36,.1)`): het actieve vakje in een segmentkiezer.
- **Focusgloed** (`box-shadow: 0 0 0 3px rgba(79,110,245,.2)`): een veld met focus.

### Named Rules
**The Zweef Rule.** Alleen wat boven de pagina zweeft krijgt schaduw. Moet een kaart opvallen, gebruik dan een rand in de statuskleur, geen schaduw.

## Shapes

Vier radii met elk een eigen rol. Daarnaast zijn er een paar vaste uitzonderingen en verder geen losse waarden.

- **Pil** (`--radius-pill`, 100px): knoppen, chips, tags, statchips, de periodekiezer, zoekvelden in de bovenbalk en schakelaars.
- **Kaart** (`--radius-lg`, 14px): kaarten, inklapbare blokken en de lege-staat-tegel.
- **Veld** (`--radius`, 12px): invoervelden, icoontegels, meldingen (`zp-memo`) en segmentkiezers.
- **Klein** (`--radius-sm`, 8px): mini-tegels, kleurvakjes, balkjes en de segmenten binnen een kiezer.
- **Uitzonderingen:** vensters 18px, schuifbladen op de telefoon 20px. Mini-labels, grepen, voortgangsbalkjes en agendablokjes met een gekleurde linkerrand gebruiken 2–5px; gebruik daarvoor bij voorkeur `mini` (4px).

Iconen zijn altijd SVG uit de `ICO`-set met lijndikte 1.8 (12–24px). Mini-iconen onder 12px en grote illustraties (1.5) houden hun eigen dikte. Gebruik nooit emoji.

## Components

### Buttons
Stevig en rustig: een pil met duidelijke tekst, groot genoeg voor een vinger.
- **Shape:** pil (100px), 38px hoog in de werkbalk, 44–48px op aanraakschermen.
- **Primary:** Signaalblauw-knop met witte tekst (13.5px, 500). Bij hover 6% donkerder (`filter:brightness(.94)`).
- **Aanmaken:** primaire knop met het plus-icoon (`_LF_PLUS`) en een zelfstandig naamwoord: "Opdracht", "Verlof", "Afspraak". Gebruik geen getypt "+". Op de telefoon kan het een ronde plusknop of een knop over de volle breedte zijn. Kleine knoppen per rij of per cel ("+ opdracht") houden het plusteken.
- **Ghost:** transparant met een naad en `--muted`-tekst. Bij hover wordt de tekst `--text`. Voor Export, Route, Kolommen en Annuleren.
- **Danger / Groen:** `--red-knop` of `--green-knop` met witte tekst. Alleen voor weghalen, of voor goedkeuren en afronden.
- **Focus:** `outline:2px solid var(--accent)` met 2px afstand, alleen bij toetsenbordfocus.
- **Uitgeschakeld:** elke uitgeschakelde knop is gedempt (`--surface2`-vlak, `--muted`-tekst), ook een primaire. Nooit volledig blauw en nooit doorzichtig.
- **Beoordelen:** **Afwijzen** links, **Goedkeuren** rechts, op de computer en de telefoon, net als bij een bevestiging (de actie rechts).

### Chips
- **Filterchip / segment:** pil met een naad. Gekozen heeft een `--accent-knop`-vlak met witte tekst, of in een segmentkiezer een werkvlak met `--accent-t`-tekst en de segmentschaduw.
- **Statustag** (`.tag`, `.zp-tag`): pil met een tint van de statuskleur en tekst in de `-t`-variant, met een hoofdletter ("Aangevraagd", "Vakantie").
- **Status van een opdracht** (`tagStatus`, op kaarten `wkStatusBadge`): Ingepland blauw, Gereserveerd paars gestippeld, Klaargezet grijs, Opgehaald cyaan (`.tag-opgehaald`), Actie vereist oranje, Afgehandeld groen, Verwerkt leisteen. Overal dezelfde naam en kleur, ook in het Kaartoverzicht en de statustellers. Spoed is geen status (zie The Spoed Rule).
- **Statchip:** pil met icoontegel, cijfer (600, tabelcijfers) en label in `--muted`. Klikbare statchips filteren de lijst.

### Cards / Containers
- **Corner Style:** 14px.
- **Background:** `--surface`, in het lichte thema wit.
- **Shadow Strategy:** geen (zie Elevation & Depth).
- **Border:** `1px solid var(--border)`. Bij hover op een klikbare kaart een blauwe tint.
- **Internal Padding:** 18px, op de telefoon 12px. Een instellingenkaart heeft 16px 18px 18px met een kop (16px, 600) en uitleg (13px `--muted`).

### Inputs / Fields
- **Style:** `--surface2`-vlak, naad, 12px radius, 12px 14px binnenruimte, 14px tekst. In de werkbalk 38px hoog met een `--surface`-vlak. Keuzelijsten hebben een eigen chevron.
- **Focus:** naad wordt Signaalblauw, met focusgloed.
- **Placeholder:** `--muted2`. Een placeholder is geen label: zet het label ernaast of erboven.
- **Leeg veld in een lijstrij** (Instellingen): toont "Niet ingevuld" in `--muted2`, krijgt een `--surface2`-vlak bij aanwijzen en een blauwe rand bij bewerken. Een veld moet er altijd uitzien als iets wat je kunt invullen.
- **Verplichte velden:** de knop blijft uit tot alles is ingevuld (`lfBind`), maar zegt dan wat er ontbreekt: "Nog invullen: Startdatum, Einddatum". Een uitgeschakelde knop is gedempt (`--surface2`-vlak, `--muted`-tekst), niet doorzichtig.
- **Error:** een rode rand met de melding direct onder het veld.

### Navigation
- **Zijbalk (desktop):** items van 14px in `--muted` met icoon, radius 12px, 6px 12px binnenruimte (44px hoog op aanraakschermen), zodat Team op een laptop van 860px hoog in beeld staat. Rapportage en Instellingen staan onderaan in hetzelfde scrollende menu, in een rustiger blok (`.nav-systeem`), niet vast onderin. Het actieve item heeft een blauwe tint en is 600, en `aria-current="page"`. In het lichte thema is de tekst `--accent-t`. De items zijn met Tab en Enter te bedienen (`role="link"`). Staat er onder de vouw nog meer, dan vervaagt de onderkant (`kan-onder`).
- **Onderbalk (telefoon):** vier vaste bestemmingen en "Meer" voor de rest.
- **Tabs:** tekst met een onderstreping in Signaalblauw. Op de telefoon schuifbare pillen.

### Lijstrij (signature)
Het hart van de lijststijl (`lfRij`, `_istNavRij`). Een rij van minimaal 58px met links een icoontegel van 36px (`--surface2`, 12px radius), in het midden het label (15px) met eventueel een tweede regel (12px `--muted`), en rechts de waarde, een schakelaar of een chevron. Rijen worden gescheiden door een naad. Een klikbare rij is `role="button"` en werkt ook met Enter.

### Weergavekiezer en periodekiezer
- **Weergavekiezer** (`.ag-switcher`): een segmentkiezer in de volgorde van klein naar groot: **Dag · Week · Maand · Lijst**. Planning en Agenda gebruiken dezelfde. De telefoon heeft een brede variant met icoontjes, in dezelfde volgorde.
- **Periodekiezer** (`_periodeNav()`): de pil ‹ label ›, eventueel met "Vandaag" ernaast. De labels zijn overal hetzelfde: **"Week 45 · 2 – 6 nov 2026"** (`_periodeWeekLabel`), **"Maandag 2 november 2026"** (`_periodeDagLabel`), "November 2026" en "2026".

### Vensters en bevestigingen
- **Venster** (`openModal`, `openBovenModal`, `lfOpen`): 18px radius met de vensterschaduw. Het is een echte dialoog: de focus gaat het venster in, Tab blijft erbinnen, Esc sluit het bovenste venster en de focus keert terug naar de knop waarmee het werd geopend. Heb je iets ingevuld, dan vraagt een klik ernaast of Esc eerst "Wijzigingen verwerpen?".
- **Bevestiging** (`bevestigActie`): het werkwoord uit de titel staat op de knop ("Opdracht verwijderen" → **Verwijderen**). Rood met prullenbak alleen bij weghalen (verwijderen, wissen, verwerpen, intrekken, ontkoppelen). Al het andere krijgt een blauwe knop. De focus staat op Annuleren.

### Opslaan
Drie vaste manieren, elk met een eigen reden:
- **Direct opslaan:** lijsten en schakelaars (Opdrachttypes, Notificaties, Administraties, blokkadedagen). Het tabblad zegt bovenaan "Wijzigingen worden direct opgeslagen" (`_INST_DIRECT`).
- **Eén Opslaan per blok:** formulieren (Bedrijf, Planning, Team & Verlof, Goedkeuring, Werkbonnen), met een markering voor niet-opgeslagen wijzigingen. Een lijstvenster (`lfOpen`) heeft één brede Opslaan-knop onderin.
- **Opslagbalk:** alleen voor een groot raster waarin je veel vakjes tegelijk wijzigt (de rechtenmatrix). De balk verschijnt pas bij een wijziging, met "Ongedaan maken".

### Verwijderen
- **Niet in de lijstrij.** Een rij openen en iets weghalen zijn twee handelingen. "… verwijderen" staat onderaan het paneel (`_zpVerwijder`) of het bewerkvenster (`_lfVerwijderInVenster`), met een bevestiging.
- **Uitzonderingen:** lijstjes binnen een formulier dat je bewerkt (uurregels, materiaal, documenten, pauzes, blokkadedagen) houden hun prullenbak. Tabellen zonder paneel of venster (Gebruikers) ook. Verlof heeft geen paneel: bij een open aanvraag staan alleen Goedkeuren en Afwijzen, en pas na beoordelen verschijnt de prullenbak.
- Selectie met een bulkactie ("Verwijder selectie") is een goed alternatief voor lange lijsten (Materialen).

### Panelen
- **Knoppenrij** (Bellen · Navigeren · Mailen, `_klActies`) alleen in contactpanelen: Debiteur, Serviceklant en Medewerker. Panelen voor kantoorwerk, zoals het opdrachtpaneel, hebben die rij niet. Telefoon en e-mail zijn daar aanklikbare regels, het adres opent de route en "Mail versturen" (met templates en maillog) staat onder Acties.
- Onderaan staat de hoofdactie in de voet, met "… verwijderen" erboven.
- **Dialoog:** het zijpaneel gedraagt zich als een venster. Het heeft `role="dialog"`, de focus gaat erin, Tab blijft binnen, Esc sluit en de focus keert terug naar de rij. Ligt er een bevestiging boven het paneel, dan sluit Esc eerst alleen die.
- **Inklappen:** een lange lijst die zelden nodig is (bijv. Pompen uit register) staat als inklapbaar blok (`.zp-klap` met `_dpSectieKop`), standaard dicht, met het aantal en een samenvatting in de kop.

### Meldingen en lege staat
- **Melding in de pagina** (`_zpMelding`): een vlak met icoon, een kop als label en één of twee zinnen. Rood is een fout, oranje een actie, blauw informatie en groen opgelost.
- **Toast** (`toast`): een pil onderin. Bij een fout vertaalt `_foutNL` technische Firebase-tekst naar gewone taal ("je hebt hier geen rechten voor", "geen verbinding met de server").
- **Lege staat** (`.leeg-staat`): een icoon in een tegel van 48px (`--surface2`, 14px radius), een kop (15px, 600) en één zin over wat er nu gebeurt, afgestemd op de rol. Toon niet alleen "Geen gegevens".

## Do's and Don'ts

### Do:
- **Do** gebruik de tokens (`--accent`, `--surface2`, `--radius-lg`, …) en bestaande helpers (`_periodeNav`, `_istKaart`, `lfRij`, `_zpMelding`, `bevestigActie`) in plaats van losse waarden of een eigen variant.
- **Do** controleer elke visuele wijziging in het lichte én het donkere thema, en op de telefoon (iPhone) én desktop.
- **Do** zet tekst in een statuskleur altijd in de `-t`-variant, en witte tekst alleen op een `-knop`-vlak.
- **Do** demp minder belangrijke rijen met `--muted`, een `--surface2`-vlak of `filter:saturate(...)`.
- **Do** zet het werkwoord op een bevestigknop, en maak hem alleen rood als er iets verdwijnt.
- **Do** schrijf uitleg neutraal voor muis en vinger: "Kies een type om het te wijzigen", niet "Tik op…".
- **Do** schrijf eenheden uit ("8 uur", "1 dag") en getallen met een komma.
- **Do** begin chips, tags en rolnamen met een hoofdletter; toon rollen met de naam uit Rollen & rechten (`_rolNaam`).
- **Do** zet verwijderen in het paneel of bewerkvenster, en laat een uitgeschakelde knop zeggen wat er nog ontbreekt.
- **Do** schrijf datums als dag-maand-jaar ("2 november 2026", "02-11-2026").
- **Do** demp afgehandeld werk in de planning (`.wk-klaar`), zodat open werk opvalt.
- **Do** maak alles wat klikbaar is ook met het toetsenbord bereikbaar (`role` en tabindex, of een echte knop of link), en geef panelen en vensters dialooggedrag.

### Don't:
- **Don't** zet `opacity` op tekst of knoppen om iets te dempen.
- **Don't** gebruik wit op `--accent`, `--green`, `--red` of `--orange`.
- **Don't** geef kaarten een schaduw: schaduw is alleen voor vensters, meldingen en het open zijpaneel.
- **Don't** gebruik emoji of icoonfonts; alleen SVG uit de `ICO`-set (lijndikte 1.8).
- **Don't** gebruik gewicht 800 buiten het woordmerk, of Syne buiten het merk.
- **Don't** verzin een eigen weergavekiezer, periodelabel of datumformaat: gebruik `.ag-switcher` (Dag · Week · Maand · Lijst) en `_periodeNav()` met de vaste labels.
- **Don't** blokkeer inzoomen (`user-scalable=no`); los een te kleine veldtekst op met 16px.
- **Don't** toon ruwe Firebase- of foutcodes aan de gebruiker; laat de technische tekst in het logboek.
- **Don't** zet een rode prullenbak in een lijstrij naast een veelgebruikte actie zoals Goedkeuren.
- **Don't** verberg werk: een week toont altijd de dagen waarop iets gepland staat.
- **Don't** markeer spoed met de typekleur of een los icoontje: gebruik altijd het label "Spoed" en de rode rand.
- **Don't** zet Kolommen, Export of Importeren als losse knop in de werkbalk: die horen in het "…"-menu.
- **Don't** laat een badge naast de klantnaam zweven; zet status en tijd samen op een eigen regel.
- **Don't** gebruik een dollaricoon voor geld: Flow8 rekent in euro (`ICO.euro`).
