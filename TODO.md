# Flow8 — openstaande punten

Geprioriteerd. Werk dit bij zodra iets af is. Het volledige historische logboek staat in
`flow8-werklijst-fase2.md`. Elk groot traject: eerst Analyse → Gevolgen → Oplossing, dan pas bouwen.

## Praktisch / eerst doen
- [x] **Publiceren naar GitHub Pages** — gecontroleerd op 10 september 2026: de versie op GitHub is
      gelijk aan het canonieke bestand.
- [ ] **Firebase Authorized domains** — controleer dat `thomv-flow8.github.io` erin staat.
- [ ] **Cloud Function mail-wrapper deployen** — zodat de huisstijl ook in de e-mails zit
      Code staat in `flow8-functions/` (`bouwMailHtml` zit er al in); controleren of de
      gedeployde versie gelijk is.

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
      voorbij de testfase).
- [ ] **Firebase-rules in de repo** — `database.rules.json` + `firestore.rules` uit de Console, zodat
      ze onder versiebeheer staan. Pas daarna aan `firebase.json` koppelen; anders kan een deploy de
      live-rules overschrijven met een oudere versie.
- [ ] **`verstuurMail`: controleer `actief`** — een gedeactiveerde gebruiker met een nog geldig
      token kan nu mailen.
- [ ] **`verstuurMail`: bedrijfsgegevens server-side** — naam, logo en kleur komen nu uit de
      payload van de app. Lees ze uit `flow8/bedrijven/{bedrijfId}/instellingen/bedrijf`, anders kan
      een ingelogde gebruiker via de console een mail opmaken namens een ander bedrijf.
- [ ] **Commentaar `index.js` regel 4** — noemt `flow8/{bedrijfId}/mailLog`; de code schrijft naar
      `flow8/bedrijven/{bedrijfId}/mailLog`.

## Config / verificatie (niet puur code)
- [ ] **Mail-logo oogt klein** — vermoedelijk klein bronbestand; check Instellingen → Bedrijf,
      evt. groter logo uploaden.
- [ ] **Logo-Storage-URL publiek leesbaar** — verifiëren dat het logo bij de ontvanger niet
      gebroken is (Storage-rechten).

## Optioneel
- [ ] **Mail fase 2** — rijkere sjablonen met iconen-blok.
- [ ] **PDF-preview iOS** — al opgelost via PDF.js; alleen heropenen als er nog iets hapert.
- [ ] **Marketing-site (Flow8.nl)** — CTA's koppelen, Contact functioneel (mailto/Formspree),
      Pages-deploy. Staat als `Flow8-website.html` in deze repo.

## Styling — afgerond
Fase 1 (tokens + typografie), 2 (componenten), 3 (details + licht thema), 4 (toegankelijkheid +
iconen 1.8 + radius-tokens). Volledig klaar. Zie `flow8-werklijst-fase2.md` voor details.
