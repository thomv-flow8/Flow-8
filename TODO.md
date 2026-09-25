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

## Grote trajecten (elk een eigen analyse-sessie; op business-prioriteit kiezen)
- [ ] **Offline upload veldwerk** — de queue zelf bestaat al: `flow8-fotoqueue` in IndexedDB, met een
      flush op het online-event en elke 30 seconden. Werkbon-foto's gebruiken hem goed. Wat resteert:
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
      - [ ] **C3. Werkorder-foto's een plaatshouder geven** — daar staat nog een `blob:`-adres in het
        document, wat bij de checklist bewust is vermeden: dat adres bestaat alleen in het tabblad dat
        het maakte, dus een collega ziet een gebroken plaatje. Raakt toevoegen, weergeven en de flush
        in de werkordercode. Geen storing, wel inconsistent.
      - [ ] **Los randje**: de retry in `dbSaveItem` (rond regel 5345) kijkt óók naar `navigator.onLine`.
        Zelfde bezwaar als C1, maar buiten de fotoqueue.
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
- [ ] **Verzuim optie D** — gevoelig deel echt afschermen voor volledige AVG-dekking (relevant
      voorbij de testfase). Nu kan elk actief lid van een bedrijf via de RTDB-rules alle
      verzuimrecords lezen; alleen schrijven is afgeschermd.
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
- [ ] **RTDB `$overig` schrijfbaar voor elk actief lid** — onder meer `planning`, `serviceklanten`
      en `mailLog`. De rechtenverhoging is hiermee weg (zie hierboven); wat rest is integriteit: een
      monteur kan gegevens van collega's of het maillog aanpassen. `medewerkers` valt sinds
      21 september 2026 niet meer onder `$overig` maar heeft een eigen regel. Hoort bij rules fase 2:
      per-module rechten, en daar hoort ook een platte claim (`mwRecht`) bij zodat niet-admins met
      schrijfrecht op Medewerkers weer kunnen verwijderen.
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
