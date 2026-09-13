# Flow8 — openstaande punten

Geprioriteerd. Werk dit bij zodra iets af is. Het volledige historische logboek staat in
`flow8-werklijst-fase2.md`. Elk groot traject: eerst Analyse → Gevolgen → Oplossing, dan pas bouwen.

## Praktisch / eerst doen
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
- [ ] **Resend: eigen domein verifiëren + `MAIL_FROM` aanpassen** — nu staat live het testadres
      `onboarding@resend.dev`, dat alleen naar het eigen Resend-adres mailt. Voorwaarde vóór mails
      naar echte klanten. Daarna `MAIL_FROM` in `functions/.env` aanpassen en `verstuurMail` deployen.
- [x] **Planning dagweergave toonde niet alle opdrachten** — opgelost op 13 september 2026. Opdrachten
      zonder starttijd (163 van 732) vielen weg; nu een rij "Zonder tijd", een kolom "Niet toegewezen",
      een meerekkend rooster en een teller.
- [x] **Opdrachten van monteurs buiten de planning apart tonen** — 13 september 2026: rij/kolom
      "Niet in planning" in week- en dagweergave, "Verwijderde medewerker" in paneel en lijst. Niets
      gewijzigd of verwijderd. (Oorspronkelijke melding hieronder.)
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
- [ ] **Assemblage-mail: klantnaam leeg** — onderwerp "Assemblage ASSEM-3 —" en aanhef "Beste ,"
      (gezien op 13 september 2026). Uitzoeken waar de klantnaam in dat sjabloon vandaan komt.

## Grote trajecten (elk een eigen analyse-sessie; op business-prioriteit kiezen)
- [ ] **Offline upload veldwerk** — foto's lokaal bufferen en uploaden zodra er netwerk is.
      *Meest afgebakend en concrete pijn voor monteurs — goede eerste keuze.*
- [ ] **Goedkeuring stap B** — meerdere verplichte goedkeurders met tussenstatus. Raakt vier
      modules en ~49 plekken met `goedgekeurd`. Groot; lagere prioriteit; eerst concept + statusmodel.
- [ ] **Maillog fase 3** — Resend delivery-status via webhook + geplande/automatische mails
      (status-change triggers). Vereist uitbreiding van `flow8-functions/`.
- [ ] **Spoed als prioriteitsvlag** — `spoed` uit het statusmodel halen en als aparte
      prioriteit/eigenschap maken, zodat een opdracht tegelijk bv. `ingepland` én `spoed` kan zijn.
      Urgentie ≠ fase. **Niet** samenvoegen met werkbonnen-integratie — apart afhandelen.
- [ ] **Punt 4B** — aanvullend/optioneel contracttype structureel (datamodel + migratie).
- [ ] **H12** — credits/licenties, server-side (het grote licentie-traject).

## Klein / security-hardening
- [ ] **Werkbon list-query waterdicht** — een monteur kan via de console bon-*titels* binnen eigen
      bedrijf oplijsten (get + cross-bedrijf blijven dicht). Verscherping, geen gat.
- [ ] **Verzuim optie D** — gevoelig deel echt afschermen voor volledige AVG-dekking (relevant
      voorbij de testfase). Nu kan elk actief lid van een bedrijf via de RTDB-rules alle
      verzuimrecords lezen; alleen schrijven is afgeschermd.
- [ ] **RTDB `$overig` schrijfbaar voor elk actief lid** — onder meer `medewerkers`, `planning` en
      `mailLog`. Een monteur kan zo bijvoorbeeld het e-mailadres van een collega op het zijne zetten,
      waarna `zetGebruikersClaim` hem diens `medId` geeft. Hoort bij rules fase 2: per-module rechten.
- [ ] **Werkbon-subcollecties** — `get`/`list` op uren, foto's en documenten controleert geen
      toewijzing: een eigen-recht-gebruiker kan die van elke bon binnen het eigen bedrijf lezen als
      hij het bon-id kent.
- [x] **Firebase-rules in de repo** — staan sinds 10 september 2026 in `flow8-functions/`.
- [ ] **Rules koppelen aan `firebase.json`** — pas als zeker is dat de repo-versie gelijk is aan de
      live-versie; anders kan een deploy de live-rules overschrijven met een oudere versie.
- [ ] **`zetGebruikersClaim`: live-versie niet geverifieerd** — gedeployed op 11 augustus 2026, los van
      `verstuurMail`. Niet zeker dat die gelijk is aan de repo. Deploy daarom voorlopig per functie
      (`--only functions:verstuurMail`) tot dit is gecontroleerd.
- [ ] **`verstuurMail`: controleer `actief`** — een gedeactiveerde gebruiker met een nog geldig
      token kan nu mailen.
- [ ] **`verstuurMail`: bedrijfsgegevens server-side** — naam, logo en kleur komen nu uit de
      payload van de app. Lees ze uit `flow8/bedrijven/{bedrijfId}/instellingen/bedrijf`, anders kan
      een ingelogde gebruiker via de console een mail opmaken namens een ander bedrijf.
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
