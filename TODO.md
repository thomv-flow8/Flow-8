# Flow8 — openstaande punten

Geprioriteerd. Werk dit bij zodra iets af is. Het volledige historische logboek staat in
`flow8-werklijst-fase2.md`. Elk groot traject: eerst Analyse → Gevolgen → Oplossing, dan pas bouwen.

## Praktisch / eerst doen
- [x] **Cloud Functions op Node 22** — gedaan op 23 september 2026, ruim vóór de uitzetdatum van
      30 oktober. Alleen `engines.node` in `functions/package.json` gewijzigd; firebase-admin (12.7.0) en
      firebase-functions (6.6.0) zijn bewust niet meegegaan, zodat een probleem niet op twee oorzaken
      kon wijzen. Resend loopt via `fetch` op de REST-API, geen pakket, dus daar veranderde niets.
      Beide functies opnieuw gebouwd en getest: inloggen (zetGebruikersClaim) en een mail versturen
      (verstuurMail, inclusief secret en afzender).
- [x] **Publiceren naar GitHub Pages** — gecontroleerd op 10 september 2026: de versie op GitHub is
      gelijk aan het canonieke bestand.
- [x] **Firebase Authorized domains** — gecontroleerd op 13 september 2026 via de publieke Auth-config:
      `thomv-flow8.github.io` staat erin (nodig voor inloggen met Google).
- [x] **RTDB-rules: admin kan zich naar een ander bedrijf verplaatsen** — opgelost en live op
      10 september 2026. In de admin-tak van `flow8/gebruikers/$uid` moet `bedrijfId` bij een
      bestaand profiel gelijk blijven (verwijderen mag). Getest: account aanmaken, rol wijzigen,
      toegang blokkeren/verlenen en verwijderen werken nog.
- [x] **Cloud Function mail-wrapper deployen** — bevestigd op 13 september 2026: de huisstijl-mail
      (`bouwMailHtml`) staat live.
- [x] **Huisstijl-mail verfijnd** (13 september 2026) — titel 18px, bedrijfsnaam 20px; het logo wordt
      bij het uploaden automatisch bijgesneden (`bereidLogoVoor`) en krijgt in de mail vaste
      afmetingen (max 220×64px, ook goed in Outlook). De kaartmarker behoudt nu de verhouding.
- [x] **Homa-logo opnieuw uploaden + testmail** — gedaan en goedgekeurd op 13 september 2026 (mail,
      kaart en werkbon-PDF). Andere bedrijven: logo één keer opnieuw uploaden voor de nieuwe weergave.
- [ ] **Resend: eigen domein verifiëren + `MAIL_FROM` aanpassen** — nu staat live nog het testadres
      `onboarding@resend.dev`, dat alleen naar het eigen Resend-adres mailt. Voorwaarde vóór mails
      naar echte klanten. Gekozen model (23 september 2026): **één Flow8-domein voor alle bedrijven**,
      met de bedrijfsnaam als afzendernaam ervoor. Te claimen domein: `flow-8.nl`.
      Stappen die nog open staan: domein claimen → in Resend toevoegen → SPF/DKIM bij de registrar →
      `MAIL_FROM` in `functions/.env` omzetten → `verstuurMail` deployen → testen met een ontvanger
      buiten het eigen domein. Aan de code hoeft dan niets meer te gebeuren.
      Later mogelijk: een veld `mailAfzender` per bedrijf voor klanten die hun eigen domein verifiëren.
- [x] **Afzendernaam en antwoordadres in de mail** — 23 september 2026, gedeployd. Het adres komt uit
      `MAIL_FROM`, de naam ervoor uit `instellingen/bedrijf/naam`, dus de ontvanger leest de naam van het
      bedrijf en niet Flow8. Nieuw is `reply_to`: het algemene adres van het bedrijf, met de verzender als
      terugval — daarvóór kwam een antwoord van een klant nergens uit. Beide velden gaan door
      `_headerVeilig`: zonder dat kon een bedrijfsnaam met een regeleinde een extra header (bcc) toevoegen.
      Dertien tests op de helpers, inclusief injectiegevallen. Nog te testen in de praktijk door Thomas,
      samen met de domeinomzetting.
- [x] **Planning dagweergave toonde niet alle opdrachten** — opgelost op 13 september 2026. Opdrachten
      zonder starttijd (163 van 732) vielen weg; nu een rij "Zonder tijd", een kolom "Niet toegewezen",
      een meerekkend rooster en een teller.
- [x] **Opdrachten van monteurs buiten de planning apart tonen** — 13 september 2026: rij/kolom
      "Niet in planning" in week- en dagweergave, "Verwijderde medewerker" in paneel en lijst. Niets
      gewijzigd of verwijderd. (Oorspronkelijke melding hieronder.)
- [x] **Serviceklant niet bijgewerkt na afronden door monteur** — 13 september 2026: de monteur-route
      (`fsWerkbonStatusNaarPlanning`) werkte laatsteDatum/volgendeDatum niet bij; nu via gedeelde
      `_skNaServicebeurt` (alleen vooruit, ook bij 'verwerkt').
- [x] **Eenmalige reparatie gemiste servicedatums** — uitgevoerd 16 september 2026: 40 klanten met een
      afgeronde servicebeurt (april/mei/juli 2026) kregen laatsteDatum + volgendeDatum. Gecontroleerd:
      40/40 correct. Klanten met volgendeDatum: 255 → 295; nog 799 actieve klanten zonder datum (Outsmart).
- [x] **Jaarplanner serviceklanten (groot traject)** — KLAAR 16-09; oude auto-planner vervallen. — concept + preview goedgekeurd 13 september 2026.
      Besluiten: speelruimte instelbaar via Instellingen → Planning (start: halfjaarlijks ±3 wk,
      jaarlijks ±6 wk, 2/3-jaarlijks ±2 mnd); periode kiesbaar (3/6/12 mnd of van–tot, standaard 6);
      ankerdatum/voorkeurweek = zachte wens + vinkje "vaste afspraak"; seizoen volgt uit historie.
      Fases: 0 snelinvoerscherm "Datums invoeren": KLAAR 16-09 (typen + Enter, plakvak, geen export
      uit Outsmart mogelijk — invoeren blijft handwerk) ·
      1 instellingen + vinkje: KLAAR 16-09 (speelruimte per interval + standaardperiode, vinkje "vaste afspraak") ·
      2a jaarverdeling berekenen + voorstelscherm: KLAAR 16-09 (periode, achterstallig, klanten zonder
      datum, bestaande planning telt mee) · 2b vastleggen: KLAAR 16-09 (planMaand + bron/datum per klant,
      contractdatum blijft) · 3a dagen en routes per maand: KLAAR 16-09 (stap 3 voedt de bestaande
      rekenkern met de klanten van de gekozen maand; duplicaatcheck slaat al ingeplande over) ·
      3b opruimen: KLAAR 16-09 (knop "Auto-plannen" en de oude maandkeuze verwijderd; dagcapaciteit
      houdt nu rekening met uren die al op die dag staan).
- [x] **"Slimme dagplanning" heet nu "Route"** — 13 september 2026: route-icoon; de route wordt direct
      berekend bij het kiezen van een monteur, datum of via de knop per dag (`_dpAutoBereken`).
      "Bereken tijden" heet nu "Opnieuw berekenen". Tijden overnemen blijft een bewuste stap.
      Daarna: na slepen pas doorrekenen na ~1 s pauze (één Google-aanvraag), verouderde antwoorden
      genegeerd (`_dpRouteVersie`), "Tijden overnemen" geblokkeerd zolang de tijden niet kloppen, en
      "Opnieuw berekenen" alleen zichtbaar als er geen geldige route is.
- [x] **Oude route-wizard opgeruimd** — 16 september 2026: 469 regels verwijderd (openRouteWizard,
      _renderRWStap1/2, _genRouteVoorstel, _rwKalenderHtml, postcodeNummer, _optimaliseerPostcode) plus
      de knopkoppeling. minToTijd is behouden. Route-optimalisatie zit in Route en in de jaarplanner.
- [x] **Namenarchief verwijderde medewerkers** — 13 september 2026: `medewerkersArchief` (naam, rol,
      datum) wordt bij verwijderen gevuld; planning, paneel, lijst en werkbon-uren tonen "Naam · verwijderd".
      Eenmalig aangevuld: `mo043vnte2ar` = Perry Windt (oud record), `mqyu6fdxzfzk` = Jonny Visser.
      Dubbel label ("Verwijderde medewerker, Verwijderde medewerker") hersteld.
- [x] **99 oude opdrachten zonder geldige monteur** — 86 van een verwijderde medewerker (`mo043vnte2ar`,
      mei–juli 2026) en 13 van Jeremy Smits (rol magazijn, juni–augustus). Onzichtbaar in dag- én
      weekweergave. Kiezen: opruimen, opnieuw toewijzen of apart tonen.
- [x] **Verwijderde medewerkers telden mee bij "Afwezig vandaag"** — opgelost op 13 september 2026.
      Tellingen (dashboard, verlof, verzuim, goedkeuringsmelding) slaan verwijderde medewerkers over;
      "vandaag" ook inactieve. Bij verwijderen volgt een waarschuwing bij lopend verzuim / open aanvragen.
- [x] **Extra locatie in opdracht werd niet opgeslagen** — opgelost op 13 september 2026. Het
      locatievenster (en "Nieuwe debiteur") opende in dezelfde modal en verving het opdrachtformulier;
      nu een venster erboven (`openBovenModal`). Locatie komt in de keuzelijst, ook bij servicecontract-klanten.
- [x] **Werkbonnen-kop in klantpanelen** — 13 september 2026: zelfde uitklapbare kop als contactpersonen,
      locaties, pompen en mails (debiteur, serviceklant, object, pomp), ook bij 0 werkbonnen.
- [x] **Register: foto's boven de kaart + checklist-kop** — 13 september 2026: bij pomp → Installatie en
      in het objectdetail staan de foto's boven de kaart; checklists hebben dezelfde uitklapbare kop.
      Werkbonnen en checklists staan op desktop naast elkaar, op mobiel onder elkaar.
- [x] **Rapportage → Medewerkers (was "Persoonlijk")** — 13 september 2026: cirkeldiagrammen
      medewerkers per rol en ingezette uren per rol (% in de legenda) en een staafdiagram per maand
      (gewerkt, verlof, verzuim, overuren). Gewerkt = roosteruren − verlof − verzuim (keuze A).
- [x] **Percentages op de ring ook op andere rapportagepagina's?** — besloten 13 september 2026: niet nodig.
- [x] **Verzuimrecords van verwijderde medewerkers** — besloten 13 september 2026: bewaren. Ze staan in
      de RTDB en tellen nergens meer mee.
- [x] **Assemblage-mail: klantnaam leeg** — opgelost op 13 september 2026: werkorder-mail gebruikt nu
      _woKlantKort (ook "T.b.v. voorraad") en de standaard contactpersoon; _mailTekstOpschonen haalt
      een losse streep en "Beste ," weg in werkorder-, werkbon- en planningsmails.

- [x] **Rode offline-balk bleef staan op iPhone** — gevonden bij het testen van de fotoqueue op
      24 september 2026, opgelost dezelfde dag. Desktop had er geen last van. Oorzaak: `forceerHerverbinding`
      zette de database offline en 300 ms later weer online. iOS bevriest JavaScript zodra je de app
      verlaat — precies wat je doet om vliegtuigmodus om te zetten — en gebeurde dat tussen die twee
      stappen, dan bleef de database bewust offline én bleef `_herverbindBezig` op `true` staan, waardoor
      elke volgende poging meteen terugkeerde. Alleen een herlaadactie hielp nog.
      Opgelost met drie dingen: `goOnline()` (idempotent) als eerste stap in zowel `probeerHerverbinden`
      als `forceerHerverbinding`, `goOnline()` ook in de foutafhandeling, en een **tijdstempel** in plaats
      van een vangnet-timer om een klemmende vlag te herkennen — een timer gaat bij het bevriezen
      immers net zo goed verloren als de timer die hem moest vrijgeven. 9 tests, inclusief het
      bevriesscenario.

- [x] **Rode strook bovenaan bleef staan (iPhone, Safari)** — 24 september 2026, in twee stappen.
      Eerste verklaring was mis: de balk zou zijn rood in de veilige zone achter klok en batterij
      schilderen, dus is hij onder `--safe-top` gezet. Dat hielp niet, en achteraf logisch — in Safari is
      die zone nul; alleen als geïnstalleerde app heeft hij hoogte. (De wijziging is blijven staan: voor
      wie de app wél vanaf het beginscherm gebruikt is het correct.)
      Werkelijke oorzaak: Safari kleurt zijn **eigen bovenrand** naar de kleur van de pagina, en dat
      verversen gebeurt niet betrouwbaar. Zolang de rode balk de bovenrand raakte, bleef die rand rood
      nadat de balk zelf al weg was. Oplossing: de balk zweeft nu, met 8px ruimte rondom en afgeronde
      hoeken, zodat de bovenste pixels altijd de donkere app-achtergrond zijn. Preview vooraf beoordeeld.
      In de app is maar één rood element, dus een tweede boosdoener was uitgesloten.
- [x] **Werkorder-foto's aanklikken om te bekijken** — 24 september 2026, op verzoek. Werkbonnen hadden
      dit al; werkorders niet. Hergebruikt de bestaande `openFotoViewer`, en geeft alle foto's van díé
      sectie mee zodat je kunt doorbladeren. De startpositie wordt geteld binnen de foto's die echt een
      afbeelding hebben, zodat een wachtende foto zonder url de telling niet verschuift. 7 tests.
      Checklist-foto's in een werkbon kregen dezelfde behandeling (5 tests): daar komt de bron van een
      wachtende foto uit de lokale voorbeeldweergave, want in de werkbon staat alleen een plaatshouder.

- [x] **Checklist-fotoveld als volwaardige kaart** — 25 september 2026, op verzoek. Het veld toonde een
      kale tegel van 64px; nu dezelfde kaart als de sectie Foto’s, met de bestaande stijlklassen
      (`wbx-foto-item` e.v.): thumbnail die de viewer opent, "Foto N", tekenknop, kruisje **met
      bevestiging** (die ontbrak) en een bijschriftveld dat zichzelf na 700 ms opslaat in het
      checklistantwoord (`{url, naam, bijschrift}`). Een wachtende foto toont het wolkje én
      "wacht op upload" in het label; de tekenknop is dan verborgen, want de overlay stuurt het
      resultaat meteen naar Storage en heeft een bestaande URL nodig.
      `_wbFotoTekenOverlay` heeft daarvoor een derde, optionele parameter gekregen
      (`{bewaarUrl, naOpslaan}`): zonder die parameter werkt hij als vanouds op het fotorecord in
      Firestore, met die parameter schrijft de checklist zijn eigen antwoord weg. Preview vooraf
      beoordeeld.

## Grote trajecten (elk een eigen analyse-sessie; op business-prioriteit kiezen)
- [x] **Offline upload veldwerk — VOLLEDIG AFGEROND op 28 september 2026.** De queue zelf bestond al:
      `flow8-fotoqueue` in IndexedDB, met een flush zodra de verbinding terug is en elke 30 seconden.
      Werkbon-, werkorder- en checklist-foto's lopen er nu alle drie goed doorheen. Hieronder het
      volledige verloop, inclusief de twee dubbele-foto-oorzaken die pas bij het testen boven water kwamen:
      - [x] **A. Werkorder-foto's** — 23 september 2026. Ze stonden in dezelfde queue met
        `werkbonId: WO_<id>`, en de generieke flush schreef ze weg naar `werkbonnen/WO_<id>/fotos` —
        een werkbon die niet bestaat. De foto kwam dan wel in Storage maar de werkorder raakte de
        verwijzing kwijt; voor een monteur weigerde de rule het zelfs, waarna het item elke 30 seconden
        opnieuw werd geprobeerd. Nu een eigen route (`_fqWerkorderFoto`) die de URL in de werkorder zet,
        of die nu open staat of niet, en het item opruimt als de werkorder verdwenen is. 12 tests.
      - [x] **B. Checklist-foto's** — 23 september 2026. Gingen rechtstreeks naar Storage, dus zonder
        bereik verdwenen ze met een toast. Nu eerst de queue in. In de werkbon komt een **plaatshouder
        zonder URL** (`{_localId, _pending, naam}`) in plaats van een `blob:`-adres: dat laatste bestaat
        alleen in dat ene tabblad en zou bij een collega een gebroken plaatje geven. De voorbeeldweergave
        komt uit de lokale queue, het tegeltje toont een klokje, en `_fqChecklistFoto` zet na de upload de
        echte URL op zijn plaats — werkbon open of dicht. Checklist herkend op templateId met de index als
        terugval; verdwenen werkbon of checklist ruimt het item op. Verwijdert de monteur een wachtende
        foto, dan gaat het queue-item mee. 12 tests.
      - [x] **C1. Eén bron voor de verbinding** — 24 september 2026. De queue keek naar
        `navigator.onLine`, terwijl de rest van de app `.info/connected` gebruikt via `_fbVerbonden` — precies
        omdat die eerste op iOS blijft hangen na vliegtuigmodus. De flush wordt nu afgetrapt vanuit
        `zetOfflineBanner` zodra de verbinding echt terug is; het `online`-event van de browser doet niets
        meer. De interval van 30 seconden kijkt ook naar `_fbVerbonden`.
      - [x] **C2. Pogingenteller** — 24 september 2026. Elk item telt mislukte pogingen en onthoudt de
        laatste fout; na 10 laat de automatische flush het met rust, zodat er niet elke 30 seconden
        zinloos verkeer is. Het pilletje onderin wordt dan rood ("1 foto komt niet weg — tik om opnieuw
        te proberen"); een tik zet de teller terug en probeert het meteen. De drie routes zitten nu in
        `_fqWerkbonFoto` / `_fqWerkorderFoto` / `_fqChecklistFoto`, met `flushFotoQueue` als dunne verdeler.
        11 tests. (`_fqAantal` verviel en is verwijderd.)
      - [x] **Dubbele foto's na herstel van de verbinding** — gevonden bij Thomas' test op
        25 september 2026. Bij werkorders en checklists staan de foto's ín het document, en de flush
        zocht de wachtende foto alleen op `_localId`; vond hij die niet, dan plakte hij er een nieuwe
        achteraan. Het item werd pas uit de wachtrij gehaald ná bevestiging door Firestore, en die kan
        bij een net herstelde verbinding seconden duren — liep de ronde van 30 seconden er intussen
        doorheen, dan werd dezelfde foto opnieuw geüpload en toegevoegd.
        Opgelost met twee gedeelde helpers: `_fqUploadEenmalig` bewaart de URL op het wachtrij-item, zodat
        een bestand nooit twee keer naar Storage gaat, en `_fqZetFotoUrl` herkent een foto ook aan zijn
        URL en voegt alleen toe als hij écht nergens staat (bijschrift blijft behouden). Ook de losse
        werkbon-foto loopt nu via dezelfde upload-helper. 10 tests; de zes bestaande suites bijgewerkt
        en allemaal groen.
      - [x] **"Wacht op upload" ontbrak bij werkorders** — 25 september 2026: `_woFotosToevoegen` riep
        `_updateFqBanner()` niet aan, de andere twee wel.
      - [x] **Dubbele foto's, de echte oorzaak** — 25 september 2026. De eerste reparatie (idempotent
        bijwerken) hielp op desktop maar niet in Safari op de iPhone. De consolegegevens wezen het aan:
        beide foto's hadden **hetzelfde bestandspad in Storage, maar een ander downloadtoken**. Het
        bestand was dus twee keer geüpload, en omdat Firebase bij elke upload een nieuw token geeft en
        het vorige ongeldig maakt, kreeg de eerste foto een vraagteken.
        Twee aannames klopten niet. Een uploadtaak faalt zonder verbinding **niet** meteen maar blijft
        tot tien minuten opnieuw proberen, dus de directe poging van bij het toevoegen leefde nog toen
        de flush begon — twee routes, één item. En de dubbelcheck op URL zag die twee als verschillende
        foto's, want de tokens verschilden. Op desktop viel het niet op omdat DevTools de aanvraag
        meteen afbreekt.
        Opgelost met `_fqVerwerkItem`: een grendel per wachtrij-item, waarbij de tweede aanklopper de
        belofte van de eerste terugkrijgt in plaats van zelf te beginnen. Plus `_fqZelfdeBestand`, dat
        URL's op hun pad vergelijkt en de parameters negeert — het vangnet als er ooit tóch twee
        uploads doorheen glippen, bijvoorbeeld vanuit twee tabbladen. 12 tests; de acht andere suites
        meegetrokken en groen.
      - [x] **C3. Werkorder-foto's een plaatshouder geven** — 28 september 2026. Er stond een
        `blob:`-adres in het document; dat bestaat alleen in het tabblad dat het maakte, dus een
        collega zag een gebroken plaatje. Nu dezelfde plaatshouder als bij de checklist
        (`{_localId, _pending, naam}`, zonder URL) en de voorbeeldweergave uit de lokale queue.
        De map `_clVoorbeeldUrls`/`_clVoorbeeldUrl` was niet checklist-specifiek en heet nu
        `_fqVoorbeeldUrls`/`_fqVoorbeeldUrl` — één mechanisme voor beide, geen tweede kopie.
        Ontbreekt het voorbeeld (ander toestel), dan een leeg tegeltje met camera-icoon in plaats
        van een kapot plaatje. `_woOpenDetail` registreert de voorbeelden opnieuw uit de queue,
        anders bleef een tegeltje na een herstart leeg; de werkbon deed dat al. De fotoviewer
        gebruikt dezelfde bron-logica, zodat de positie blijft kloppen. Oude records met een
        `blob:`-URL genezen vanzelf zodra hun wachtrij-item wegschrijft.
      - [x] **Los randje** — 28 september 2026: de retry in `dbSaveItem` kijkt nu naar
        `_fbVerbonden` in plaats van `navigator.onLine`. Daarmee is `navigator.onLine` nergens in
        de app meer in gebruik (alleen nog in toelichtende comments).
      - [x] **Teller wachtende wijzigingen sluitend** — 28 september 2026, gevonden bij het losse
        randje. `_pendingWrites` werd bij een mislukte schrijfactie nooit verlaagd (en elke retry
        telde er nog eens bij op), terwijl een geslaagde schrijfactie die níet had opgehoogd de
        teller juist wél verlaagde. De offline-balk kon dus wijzigingen melden die er niet waren,
        of er te weinig. Nu meldt elke aanroep precies af waarvoor hij zich heeft aangemeld.
- [ ] **Goedkeuring stap B** — meerdere verplichte goedkeurders met tussenstatus. Raakt vier
      modules en ~49 plekken met `goedgekeurd`. Groot; lagere prioriteit; eerst concept + statusmodel.
- [ ] **Maillog fase 3** — Resend delivery-status via webhook + geplande/automatische mails
      (status-change triggers). Vereist uitbreiding van `flow8-functions/`.
- [x] **Spoed als prioriteitsvlag** — bij controle op 24 september 2026 bleek dit al gedaan; de lijst
      liep achter. Er is een losse vlag `o.spoed` met helper `_isSpoed()`, die oude records met
      `status==='spoed'` nog herkent; een rode badge náást de statusbadge; een knop "Spoed" in het
      opdrachtpaneel; en bij bewerken wordt een oude spoed-status omgezet naar `ingepland`. Ook de
      teller in de filterbalk telt via `_isSpoed()`, dus niet op status.
- [ ] **Punt 4B** — aanvullend/optioneel contracttype structureel (datamodel + migratie).
- [ ] **H12** — credits/licenties, server-side (het grote licentie-traject).

## Klein / security-hardening
- [x] **Werkbon list-query blijft bewust open** — besloten 22 september 2026. Het pompregister toont
      de werkbonhistorie van een pomp of object via queries op objectId/debId/skId/pompIds; die filteren
      niet op monteur. Bij een storing moet een monteur juist de volledige historie van een klant kunnen
      zien, dus een strengere list-regel zou functionaliteit kosten om een lek te dichten dat binnen het
      eigen bedrijf blijft. Cross-bedrijf en een gerichte get op een andermans bon blijven dicht.
      Ooit tóch afschermen: via een Cloud Function die de historie server-side samenvat, niet via de
      list-regel. Vastgelegd in de koptekst van `firestore.rules`.
- [x] **Verzuim optie D — AFGEROND op 28 september 2026.** Gevoelig deel afgeschermd voor
      volledige AVG-dekking. Gekozen aanpak: niet het hele record afschermen (de planning, het
      dashboard, de route en vier rapportagepagina's lezen verzuim om te tonen dát iemand er niet
      is — blokkeren breekt die), maar alléén de vrije tekst. `omschrijving` en `notitie` gaan naar
      `flow8/verzuimDetail/{bedrijfId}/{verzuimId}`. Die tak hangt bewust **buiten**
      `flow8/bedrijven`: daar staat één breed `.read` dat cascadeert en in RTDB niet meer in te
      trekken is. `type` blijft zichtbaar (besloten met Thomas) omdat de planningbadge hem toont.
      - [x] **1. Claim `vzInzage`** — gedeployd. Achteraf niet nodig gebleken (zie 2), maar
        onschadelijk: geen rule gebruikt hem. Eventueel later bruikbaar aan de Firestore-kant.
      - [x] **2. RTDB-rules** — gedeployd. **Leunt bewust NIET op de claim** maar leest het
        inzagerecht rechtstreeks: rol `admin`, of `rollen/{rol}/rechten/verzuim/inzageAlle === true`.
        Reden: de Rules Playground draagt **geen custom claims**, dus elke claim-rule is daar
        ontestbaar (bewezen met een controletest op de bestaande `vzRecht`-rule — ook rood voor een
        admin). Bijvangst: het intrekken van het I-vinkje werkt nu direct in plaats van pas na een
        tokenrefresh, en app en rules delen één bron van waarheid met `magVerzuimInzageAlle()`.
        Vier Playground-tests groen: admin lezen/schrijven mag, monteur lezen/schrijven niet.
      - [x] **3. App om** — 28 september 2026. `verzuimDetailPad()`, `verzuimTekst()` (met terugval
        op de oude velden in het record, zodat niet-gemigreerde records blijven werken) en
        `laadVerzuimDetail()` (laadt niets zonder inzagerecht). Formulier toont de tekstvelden
        alleen aan wie ze mag zien — anders zou iemand blind bestaande tekst leegschrijven.
        Opslaan, zoekfilter, rij, zijpaneel, export en verwijderen om. Export schreef `v.reden` weg,
        een veld dat niet bestaat, dus die kolom was altijd leeg — nu de echte omschrijving.
      - [x] **4. Migratie — NIET gebouwd, bleek onnodig.** Van de acht bestaande registraties had er
        precies één een omschrijving en notitie, van een medewerker die al uit dienst is. Die twee
        velden zijn met de hand uit het record gehaald; het record blijft staan (conform de eerdere
        beslissing van 13 september om verzuimrecords van verwijderde medewerkers te bewaren).
        Een automatische migratie bouwen voor nul records zou ballast zijn die bij elke start van de
        app langs de verzuimlijst loopt. De terugval in `verzuimTekst()` blijft staan en vangt een
        eventueel oud record alsnog op; bewerken-en-opslaan verhuist het dan vanzelf.
      - [x] **Stale status gecontroleerd** — dat ene record stond nog op `status: actief` zonder
        hersteldatum. Nagelopen: dat heeft nergens effect. Het verzuimoverzicht filtert op
        `_medBestaat`, het dashboard op `_medInDienst`, en de rapportage telt per actieve
        medewerker. Bevestigt de beslissing van 13 september: ze tellen nergens meer mee.
      - [ ] **Later mogelijk**: eigen dossier. Nu ziet een medewerker met `E` zijn eigen verzuim
        zónder de vrije tekst. Wil je dat wél, dan moet `medId` mee in de detail-node en de rule
        naast inzage ook het eigen record toestaan.
- [x] **E-mailadressen vastgezet (rechtenverhoging)** — gevonden en opgelost op 21 september 2026.
      Een gebruiker mocht zijn eigen profiel-e-mail wijzigen, en elk actief lid dat van een medewerker;
      `zetGebruikersClaim` leidt de medId van dat adres af, dus daarmee kon een monteur de medId van
      een collega krijgen (verlof/overuren namens die collega, diens werkbonnen met het eigen-recht).
      Opgelost in de `.write`-regels, niet in `.validate`: validate draait niet bij een verwijdering, dus
      wissen-en-opnieuw-zetten zou het gat openhouden. Daarom mag `admin` alles, mag een ander actief lid
      een medewerker aanmaken en wijzigen zolang het e-mailveld gelijk blijft, en mag alleen een admin een
      medewerkerrecord verwijderen (anders: verwijderen + opnieuw aanmaken onder hetzelfde id).
      Getest in de Rules Playground, zes scenario's: eigen e-mail wijzigen, medewerker-e-mail wijzigen en
      medewerker verwijderen als monteur = geweigerd; eigen naam wijzigen, telefoonnummer van een
      medewerker wijzigen en e-mail wijzigen als admin = toegestaan.
- [x] **RTDB `$overig` afgepeld — 28 september 2026, gedeployd.** Zes sleutels uit `$overig` gehaald
      en elk achter het recht gezet dat de app er feitelijk voor gebruikt, rechtstreeks uit de
      rollenmatrix gelezen (geen claims — zie de verzuim-sessie: die zijn in de Playground ontestbaar):
      `medewerkersArchief` en `mailTemplates` → admin · `agenda` → agenda-`S` · `storingsdienst` →
      storingsdienst-`S` · `verlofMutaties` → verlof-`S` **of** overuren-`S` · `mailLog` →
      **append-only** (iedereen mag toevoegen, alleen admin mag wijzigen of verwijderen).
      Zes Playground-tests groen, inclusief één die bewijst dat `opdrachten` open blijft.
      **Bewust open gelaten**, elk met een achtergrondroute of een schrijver uit een andere module:
      - `opdrachten` — de monteur schrijft erin bij het afronden van een werkbon
        ([flow8-v2.html:4585](flow8-v2.html:4585)) en het kaartoverzicht schrijft gevonden coördinaten
        terug (regel ~26124), dus iedereen die de kaart opent schrijft.
      - `serviceklanten` — diezelfde afrond-route werkt de laatste beurtdatum bij.
      - `wp_pompen` / `pr_objecten` — het opslaan van een debiteur registreert een pomp
        ([flow8-v2.html:11414](flow8-v2.html:11414)), dus administratie en verkoop schrijven hier met
        hún debiteuren-recht. Register-`S` eisen zou debiteurenbeheer breken.
      - `mailLog` kon om dezelfde reden niet achter klantmails-`S`: de werkbonmail loopt via
        `_wbVerstuurMail` → `openMailVerzendModal` → `logVerzondenMail`, en de monteur heeft géén
        klantmails-recht. Vandaar append-only in plaats van een module-recht.
      - `notificaties` — je schrijft per definitie in de lijst van een ánder.
      - `meta` — administratief, o.a. de jaarlijkse verlofbijschrijving.
      **`$overig` blijft staan als vangnet.** Op weigeren zetten zou elke nieuwe sleutel die we later
      toevoegen stilletjes breken. Prijs: een nieuwe gevoelige sleutel staat standaard open — bij het
      toevoegen van een sleutel dus bewust beslissen of hij een eigen regel nodig heeft.
- [x] **Eigen aanvraag intrekken — 28 september 2026, rules gedeployd.** Een `eigen`-gebruiker kon
      zijn eigen aanvraag wél bewerken maar niet intrekken: de eigenaarscontrole stond hard op
      `newData`, en die bestaat bij een verwijdering niet. Nu geldt: elke kant die bestaat moet van
      mij zijn én op `aangevraagd` staan — dat dekt aanmaken, bewerken én intrekken in één vorm, en
      sluit het overzetten van een record naar of van een collega uit. Voor overuren, onkosten en
      verlof. **Hiermee is een echte bug weg:** het onkostenpaneel toonde de eigenaar al een
      Verwijderen-knop, maar de rule weigerde hem — en `dbRemove` faalt gerúisloos, dus de post
      verdween uit de lijst en stond er na herladen weer. Maandenlang onzichtbaar.
      Ook toegevoegd: `( newData.exists() || data.exists() )`. Zonder dat slaagde een delete op een
      leeg pad, wat op zich onschadelijk is maar de Playground-tests onbetrouwbaar maakte — een
      typefout in een sleutel gaf groen. Dat is precies één keer misgegaan tijdens het testen.
      Zeven tests groen: eigen aanvraag intrekken ✓, getekende aanvraag ✗, andermans aanvraag ✗,
      leeg pad ✗.
- [x] **Verlof bewerkbaar + intrekken-knoppen — 28 september 2026.** De rules stonden het al toe,
      de app bood het niet aan. Drie dingen gedaan:
      1. **`dbRemove` meldt nu een fout.** Faalde hiervoor geruisloos (alleen een logregel), terwijl
         de app het record al uit zijn lijst had gehaald — het leek dus gelukt tot de volgende keer
         laden. Nieuwe helper `_dbFoutTekst()` vertaalt de fout: bij PERMISSION_DENIED "Geen rechten
         om dit te verwijderen", anders "check je verbinding". Ook `dbSaveItem` gebruikt hem nu — die
         riep bij een geweigerde schrijfactie altijd "check je verbinding", wat precies de verkeerde
         kant op wijst.
      2. **Intrekken-knop** bij verlof (in de rij) en overuren (in het paneel), voor de eigenaar
         zolang de status `aangevraagd` is, met een bevestigingsvraag. Bij onkosten stond hij er al.
      3. **Verlof bewerkbaar.** `openVerlofModal(voorMedId, bestaandId)` leest een bestaande aanvraag
         in (datums, type, hele dag of tijdstip, opmerking) en `submitVerlof(bestaandId)` werkt die bij
         in plaats van een nieuwe aan te maken. Titel en knop worden "Verlofaanvraag wijzigen" /
         "Opslaan", en er gaat géén nieuwe-aanvraag-melding uit bij een wijziging.
      **Saldo bleek geen risico:** het verlofsaldo wordt pas bij goedkeuren afgeboekt (`keurVerlof`),
      dus een aanvraag met status `aangevraagd` heeft nog geen saldo-effect. Wijzigen kan daarom geen
      dubbele af- of terugboeking veroorzaken. Twee vangnetten die op status controleren, in
      `openVerlofModal` én `submitVerlof`, zodat een andere route er ook niet omheen kan.
      De zin in `CLAUDE.md` over bewerkbaar zolang `aangevraagd` klopt hiermee alsnog — niets te
      corrigeren, de bouw heeft de documentatie ingehaald.
- [ ] **Lokale staat loopt uit de pas bij een mislukte verwijdering** — de app haalt het record uit
      `APP.x` vóór `dbRemove`. Mislukt de verwijdering, dan meldt hij dat nu wel, maar de rij blijft
      uit beeld tot je herlaadt. Netter: pas opruimen ná bevestiging, of terugzetten bij een fout.
      Raakt alle modules; klein maar op veel plekken.
- [ ] **Per-veld rechten op `opdrachten` en `serviceklanten`** — de helft van de oorspronkelijke zorg
      blijft staan: een monteur kan daar meer wijzigen dan alleen wat hij nodig heeft. Dichtzetten kan
      alleen per veld (bijvoorbeeld wel `status`, niet klant of datum), en dat is een eigen traject.
- [x] **Claim-rules omgezet en voor het eerst getest — 28 september 2026, gedeployd.** `overuren`,
      `onkosten`, `verlof` en `verzuim` leunden op `auth.token.ouRecht/okRecht/vlRecht/vzRecht` en
      waren daarmee ontestbaar: de Rules Playground draagt geen custom claims, dus ook een admin werd
      daar geweigerd. Nu een rechtstreekse opzoeking in de rollenmatrix, **1-op-1 vertaald zonder
      gedragswijziging** — bewust in twee fasen, zodat een afwijking niet aan vertaling én reparatie
      tegelijk kon liggen.
      - **`auth.token.medId` vervangen door dezelfde afleiding die de Cloud Function doet:** van het
        `medId` in het record naar `medewerkers/{medId}/email`, vergeleken (lowercase, met
        `isString()`-guards) met `gebruikers/{uid}/email`. Veilig omdát het e-mailveld op
        21 september 2026 is vastgezet — precies omdat medId eruit wordt afgeleid.
      - **De voor de hand liggende route viel af:** `bedrijven/{bedrijfId}/gebruikers/{uid}/medId`
        wordt bij het inloggen gezet (flow8-v2.html ~6993), maar dat knooppunt is **admin-only
        schrijfbaar** — een monteur kan zijn eigen record daar niet eens aanmaken. Juist voor de
        gebruikers die we nodig hebben is dat veld dus onbetrouwbaar.
      - **Zes Playground-tests**, met een echte monteur-uid: eigen overuur/verlof indienen ✓,
        voor een collega schrijven ✗, buiten status `aangevraagd` schrijven ✗, verzuim ✗.
      - **Open vraag beantwoord: géén bug.** Een `eigen`-gebruiker kan zijn eigen aanvraag niet
        verwijderen (bij een delete bestaat `newData` niet, dus de eigenaarscontrole faalt). Dat
        leek strijdig met "bewerkbaar zolang de status aangevraagd is", maar dat gaat over
        *bewerken* — en dat kan wél. De verwijderknop zit in de app achter `magSchrijven('verlof')`
        respectievelijk `kanGoedkeuren`, dus een monteur krijgt hem nooit te zien. Regel en UI zijn
        het eens; er viel niets te repareren.
      - **De RTDB-rules gebruiken nu nul claims.** Firestore en Storage gebruiken nog wel
        `bedrijfId`, `actief`, `medId` en `rch.werkbonnen` — daar werken claims prima.
        `ouRecht`, `okRecht`, `vlRecht`, `vzRecht` en `vzInzage` zijn daarmee nergens meer in
        gebruik. Bewust laten staan als vangnet; opruimen kan als dit een paar weken goed draait.
- [ ] **`mwRecht`** — hoorde bij dit punt en blijft open: niet-admins met schrijfrecht op Medewerkers
      kunnen nog steeds niet verwijderen. Los op met dezelfde rollenmatrix-opzoeking, dan is er geen
      claim voor nodig.
- [x] **Werkbon-subcollecties** — opgelost op 22 september 2026: `get`, `list` én `write` op uren,
      foto's en documenten controleren nu de toewijzing van de bovenliggende bon. Dat kan hier wél bij een
      query, want het bon-id staat in het pad. Breekt niets: beide leesplekken in de app halen in dezelfde
      aanroep ook de bon zelf op (openWerkbonVanuitPlanning, genereerWerkbonPDF) en díé get was al streng.
      Het is dezelfde uitdrukking die bij `write` al live stond.
- [x] **Firebase-rules in de repo** — staan sinds 10 september 2026 in `flow8-functions/`.
- [x] **Rules gekoppeld aan `firebase.json`** — 21 september 2026: de live-rules opgehaald en
      vergeleken (RTDB via `firebase database:get "/.settings/rules"`, Firestore en Storage uit de
      Console). Alle drie identiek aan de repo, daarna gekoppeld. **De repo is nu de bron** — rules
      niet meer in de Console wijzigen, want een deploy overschrijft ze.
- [x] **`zetGebruikersClaim`: live-versie geverifieerd** — 21 september 2026: de live functie geeft
      alle negen v5-velden terug (bedrijfId, rol, actief, medId, rch, ouRecht, okRecht, vlRecht,
      vzRecht), dus gelijk aan de repo. Daarna gericht opnieuw gedeployd om dat vast te zetten.
- [x] **`verstuurMail`: controleert `actief`** — 16 september 2026, gedeployd op 16 september.
- [x] **`verstuurMail`: bedrijfsgegevens server-side** — 16 september 2026, gedeployd: gelezen uit
      `flow8/bedrijven/{bedrijfId}/instellingen/bedrijf` i.p.v. de payload. De app stuurde het blok daarna
      nog wel mee; dat is op 23 september 2026 uit `verstuurMailDirect` gehaald.
- [x] **Commentaar `index.js` regel 4** — rechtgezet op 13 september 2026 (`flow8/bedrijven/{bedrijfId}/mailLog`).

## Config / verificatie (niet puur code)
- [x] **Mail-logo oogt klein** — oorzaak (13 september 2026): het logobestand was een vierkant met veel
      witruimte en een grijs randje. Opgelost met automatisch bijsnijden bij het uploaden.
- [x] **Logo-Storage-URL publiek leesbaar** — gecontroleerd op 13 september 2026: de download-URL
      laadt zonder in te loggen (HTTP 200).

## Optioneel
- [ ] **Mail fase 2** — rijkere sjablonen met iconen-blok.
- [ ] **PDF-preview iOS** — al opgelost via PDF.js; alleen heropenen als er nog iets hapert.
- [ ] **Marketing-site (Flow8.nl)** — CTA's koppelen, Contact functioneel (mailto/Formspree),
      Pages-deploy. Staat als `Flow8-website.html` in deze repo.

## Styling — afgerond
Fase 1 (tokens + typografie), 2 (componenten), 3 (details + licht thema), 4 (toegankelijkheid +
iconen 1.8 + radius-tokens). Volledig klaar. Zie `flow8-werklijst-fase2.md` voor details.
