# Flow8 naar eigen domein en Cloud86 — draaiboek

Opgesteld 1 november 2026. Flow8 krijgt het eigen domein `flow-8.nl` en verhuist van GitHub
Pages naar het bestaande Cloud86-pakket, waar ViVo en THNK al draaien.

**Indeling (keuze Thomas, 1 nov 2026):**

| Adres | Wat | Uit |
|---|---|---|
| `flow-8.nl` | marketingsite | `docs/site/` |
| `app.flow-8.nl` | de applicatie | `docs/app/` |

`app.flow-8.nl` is een **subdomein** van een domein dat je al hebt — daar hoeft niets voor
aangevraagd of betaald te worden.

## Waarom

Hetzelfde als bij ViVo: GitHub Pages geeft geen beveiligingskoppen, geen instelbare cache en
geen echte 301's. Voor Flow8 komt daar bij dat de app één bestand van ruim 2 MB is; daar wil je
`Cache-Control` zelf kunnen zetten. En een SaaS die je aan bedrijven verkoopt hoort op een eigen
adres te staan, niet op `thomv-flow8.github.io`.

## Wat dit NIET is

Cloud86 gaat alleen de bestanden serveren. **Firebase blijft volledig bij Google**: auth,
Realtime Database, Firestore, Storage en de Cloud Functions. Je verplaatst twee HTML-bestanden,
niet de applicatie. Noem het dus geen "zelf hosten".

## Het uitgangspunt: de mail wordt niet aangeraakt

De naamservers blijven bij Strato staan. We zetten alleen A en AAAA om. MX, DKIM en DMARC
blijven ongemoeid. Daarmee vervalt ook het DNSSEC-risico, dat alleen speelt bij een
naamserverwissel.

**Cloud86:** `45.82.191.90` — server `shared87.cloud86-host.nl`, Plesk.

---

## Momentopname vóór de verhuizing

Gemeten 1 november 2026. Bewaar dit: hiermee controleer je achteraf of er niets onbedoeld is
veranderd.

### flow-8.nl — DNS bij Strato
```
NS       docks16.rzone.de. shades15.rzone.de.
A        217.160.0.138                    ← WORDT GEWIJZIGD
AAAA     2001:8d8:100f:f000::200          ← WORDT GEWIJZIGD of verwijderd
www      → zelfde adressen                ← WORDT GEWIJZIGD
MX       5 smtp.rzone.de.                 ← NIET AANRAKEN
DKIM     strato-dkim-0002, strato-dkim-0003   ← NIET AANRAKEN
_dmarc   "v=DMARC1;p=reject;"             ← NIET AANRAKEN
SPF      GEEN (geen enkel TXT-record op @)
https    geen certificaat (TLS-fout); http geeft de Strato-parkeerpagina
app      bestaat nog niet                 ← WORDT TOEGEVOEGD
```

**Twee dingen om te onthouden.**

1. **DMARC staat op `p=reject` terwijl er geen SPF is.** Zodra Resend namens dit domein gaat
   mailen zonder SPF en zonder Resend-DKIM, worden die mails *direct geweigerd* — er is geen
   zachte landing. Dat is ronde 3, niet nu.
2. Er staat nog niets op het domein, dus er valt bij het omzetten niets kapot te maken aan een
   bestaande site. Dit is een gunstig moment.

---

## Wat er verandert aan de werkwijze

| | Nu | Straks |
|---|---|---|
| Bron | `flow8-v2.html`, `sw.js`, `Flow8-website.html` in de hoofdmap | **ongewijzigd** |
| Publiceren | push → GitHub Pages | `node publiceer.js`, commit, push → Plesk haalt op |
| Adres app | `thomv-flow8.github.io/Flow-8/flow8-v2.html` | `app.flow-8.nl` |

De hoofdmap blijft de canonieke bron en blijft werken op GitHub Pages. `publiceer.js` maakt
daar in `docs/` de Cloud86-versies van, met `/Flow-8/` omgezet naar `/`. **Daardoor kunnen beide
omgevingen tegelijk draaien zolang de verhuizing loopt.**

`check.sh` controleert sinds 1 november ook of `docs/` nog gelijk is aan de bron, zodat een
vergeten `node publiceer.js` niet stilletjes een oude app op Cloud86 laat staan.

---

## Drie risico's die alleen bij Flow8 spelen

**1. Inloggen breekt zonder deze stap.** `app.flow-8.nl` moet in Firebase →
Authentication → Settings → Authorized domains. Staat het er niet, dan kan niemand inloggen met
Google. Dit vóór de DNS-wijziging doen; het kan geen kwaad om het er alvast bij te zetten.

**2. De PWA begint op nul.** Service-worker-cache, `localStorage` (thema, laatste pagina) en
**IndexedDB met de offline-wachtrij van Firebase** horen bij de herkomst en verhuizen niet mee.
Wie de app op zijn beginscherm heeft staan, moet hem opnieuw toevoegen.
**Belangrijk: laat iedereen vóór het omzetten online gaan en synchroniseren.** Een
niet-verzonden offline-wijziging blijft anders achter op het oude adres.

**3. De oude omgeving blijft doorserveren.** De service worker op github.io geeft de oude app
door tot hij vervangen wordt. Niet opruimen vóór het nieuwe adres een week goed draait.

---

## Stappenplan

### Ronde 0 — publicatie-opzet — GEDAAN (1 nov 2026)
- [x] `publiceer.js`: bouwt `docs/site/` en `docs/app/` uit de bron, zet `/Flow-8/` om naar `/`,
      en schrijft per site een `.htaccess`. Telt elk voorkomen en stopt bij een afwijking.
- [x] Twee keer gedraaid: de tweede ronde geeft "0 bestanden bijgewerkt".
- [x] Uitvoer gecontroleerd door hem uit te voeren: manifest parseert nog als JSON,
      `start_url` en beide snelkoppelingen staan op `/flow8-v2.html`, `sw.js` parseert als
      JavaScript, de app parseert, de drie knoppen op de marketingsite wijzen naar
      `app.flow-8.nl`, en de bronbestanden zijn aantoonbaar ongewijzigd.
- [x] `check.sh` uitgebreid met de publicatiecontrole, en getest door `docs/` met opzet te laten
      achterlopen.

**Over de `.htaccess`:** https afdwingen, compressie, `nosniff`, `X-Frame-Options: DENY`,
`Referrer-Policy` en `Permissions-Policy` staan erin. Caching: HTML `must-revalidate`, en
`sw.js` op `no-store` — een gecachete service worker houdt zichzelf anders eeuwig in stand.

Twee dingen staan er bewust **niet** in:
- **HSTS** — pas aanzetten als https bewezen werkt, want browsers onthouden het een jaar.
- **Content-Security-Policy** — de app praat met Firebase, Google Maps, PDOK en twee CDN's,
  draait een web worker voor PDF.js en zet een verborgen iframe op
  `flow8-715de.firebaseapp.com` neer om in te loggen. Eén ontbrekende regel breekt stil het
  inloggen of de kaart, en tijdens een verhuizing is dat niet te onderscheiden van een
  hostingprobleem. Volgende ronde: eerst `Report-Only`, een week meekijken, dan afdwingen.
  Ook bij de marketingsite, want dat is een gebundelde export met een React-verwijzing naar
  unpkg waarvan van buitenaf niet te zien is of hij echt geladen wordt.
- **`Permissions-Policy` let op:** `geolocation=(self)`, niet `()`. De planning en het
  kaartoverzicht gebruiken `navigator.geolocation`. Blind de regel van ViVo overnemen had dat
  zonder foutmelding gebroken.

### Ronde 1 — Plesk inrichten en testen zonder DNS — GEDAAN (1 nov 2026)
- [x] Pakket nagekeken: er waren nog drie websites vrij, dus beide sites konden los. Let op:
      met OK Timmerwerken erbij zit het pakket vol; opwaarderen naar Power kan in minuten.
- [x] `flow-8.nl` toegevoegd in de webruimte van `vivoproducts.nl`, Git-koppeling naar
      `thomv-flow8/Flow-8`, tak `main`, modus automatisch, deployment directory `/flow-8.nl`.
      **Mailservice uitgezet** — de mail loopt bij Strato en Plesk mag zich geen bestemming
      voor `@flow-8.nl` wanen. Document root daarna op `/flow-8.nl/docs/site`.
- [x] `app.flow-8.nl` als subdomein toegevoegd met document root `/flow-8.nl/docs/app` —
      **géén tweede Git-koppeling**. Eén clone, twee sites, dus ze kunnen niet uit de pas lopen.
- [x] Niet nodig: `thomv-flow8/Flow-8` is openbaar, dus Plesk kloont zonder sleutel.
- [x] Webhook GitHub → Plesk ingesteld, aflevering met een groen vinkje. Nodig omdat
      "automatisch" alleen slaat op commits die al ín de Plesk-repository staan: zonder webhook
      hoort Plesk niet dat er op GitHub iets nieuws is. Die URL bevat een geheim.
- [x] `app.flow-8.nl` toegevoegd bij Firebase → Authentication → Authorized domains
      (1 nov 2026). `thomv-flow8.github.io` blijft staan zolang Pages draait.
- [x] **Preferred domain** van `flow-8.nl` op het kale domein gezet, zodat `www` met een 301
      doorverwijst en er één canoniek adres is — net als bij vivoproducts.nl. Het certificaat
      moet daarom straks `flow-8.nl` én `www.flow-8.nl` dekken: zonder dat krijgt wie `www.`
      intikt eerst een certificaatfout en bereikt hij de doorverwijzing nooit.
- [x] Getest met het IP opgedrongen (`curl --resolve …:443:45.82.191.90`). Beide sites geven
      precies de bestanden uit `docs/`, byte voor byte gelijk aan de lokale build:
      `flow-8.nl/` 474.607 bytes, `app.flow-8.nl/` 2.334.106 bytes (via `DirectoryIndex`),
      `sw.js` 3.464 bytes. Alle repo-bestanden geven 404, `.htaccess` geeft 403. De koppen
      komen door, met `geolocation=(self)` en `sw.js` op `no-store`.

**Wat hier misging en hoe het eruitzag.** Vóór het verzetten van de document root waren
`TODO.md` (45 kB) en `flow8-functions/database.rules.json` (17 kB) met een 200 op te halen —
de hele repository stond op het web. Niet gevaarlijk op dat moment, want het domein wees nog
naar Strato, dus je moest het IP kennen én de Host-header zetten. En er stonden geen sleutels
in: `functions/.env` staat in `.gitignore` en zit dus niet in de repo. **Maar dit is precies de
reden dat de document root op `docs/site` en `docs/app` moet staan en niet op de hoofdmap.**

**Les: LiteSpeed cachet, dus een eerste test liegt.** Twee keer leek een wijziging niet
aangekomen terwijl hij wél goed was — eenmaal na het verzetten van de document root, eenmaal
na het aanmaken van het subdomein (dat gaf eerst Plesk's eigen `/login.php`, omdat de server
de naam nog niet kende). Meet daarom altijd met een cache-omzeiler (`?a=$RANDOM`) en geef het
twintig seconden voordat je concludeert dat er iets mis is.

**Ontdekt: de app is pas ná het certificaat echt te testen.** Een service worker registreert
alleen op een beveiligde verbinding met een geldig certificaat, en Let's Encrypt kan er pas
een uitgeven als het domein naar deze server wijst. Inloggen, de kaart en de PWA zijn dus niet
vóór de DNS-wijziging te controleren — alleen dat de juiste bestanden geserveerd worden, en
dat is hierboven gebeurd. Voor de marketingsite speelt dit niet; die is volledig getest.

### Ronde 2 — DNS omzetten
- [ ] Iedereen laten synchroniseren: online gaan, wachten tot er niets meer in de wachtrij staat.
- [ ] Bij Strato: A van `@` en `www` naar `45.82.191.90`, AAAA weghalen of omzetten,
      en een A-record `app` naar hetzelfde adres. TTL kort zetten (60) vóór de wijziging.
- [ ] Let's Encrypt-certificaat voor `flow-8.nl`, `www.flow-8.nl` en `app.flow-8.nl`.
- [ ] Controleren dat **MX nog steeds `smtp.rzone.de`** is, en DKIM en DMARC onveranderd.
- [ ] Testmail sturen en ontvangen.
- [ ] Koppen controleren: `curl -I https://app.flow-8.nl/`.
- [ ] Pas als https bewezen werkt: HSTS aanzetten in beide `.htaccess`-bestanden.

### Ronde 3 — mail en Resend
Bewust na de hosting (keuze Thomas), zodat een mailprobleem niet met de verhuizing verward kan
worden. Zie het openstaande punt in `TODO.md`.
- [ ] SPF toevoegen — er staat er nu géén, en DMARC staat op `reject`.
- [ ] `flow-8.nl` in Resend toevoegen, Resend-DKIM bij Strato zetten.
- [ ] `MAIL_FROM` in `functions/.env` omzetten, `verstuurMail` deployen.
- [ ] Testen met een ontvanger buiten het eigen domein.

### Ronde 4 — opruimen (op zijn vroegst een week na ronde 2)
- [ ] Controleren dat Cloud86 een week probleemloos draait.
- [ ] Op GitHub Pages een afscheidsversie zetten die de service worker afmeldt en doorstuurt
      naar `app.flow-8.nl`, zodat wie de oude app nog heeft staan niet blijft hangen.
- [ ] Pas daarna GitHub Pages uitzetten.
- [ ] **Repository overzetten naar de organisatie `Vivoproducts`** en daarna de Git-URL in
      Plesk bijwerken.

**Waarom de repo-overdracht pas hier staat** (besluit 1 november 2026). Bij een overdracht
verandert het Pages-adres van `thomv-flow8.github.io/Flow-8/` in
`vivoproducts.github.io/Flow-8/`, en dat is zolang Pages draait het live adres van de app —
waar monteurs hem op hun beginscherm hebben staan. Nu overzetten zou de app verplaatsen vóórdat
Cloud86 klaarstaat, `vivoproducts.github.io` óók bij Firebase → Authorized domains vereisen, en
twee verhuizingen tegelijk laten lopen. In ronde 4 kost de adreswijziging niets, want dan
gebruikt niemand dat adres meer.

Voor Cloud86 maakt het eigenaarschap niets uit: Plesk kloont over https uit een openbare
repository. Gecontroleerd op 1 november 2026: `thomv-flow8/Flow-8` is openbaar en heeft geen
`.github`-map, dus er hangt ook geen GitHub App aan die bij een overdracht zou afbreken — de
val waar THNK in liep speelt hier niet.

---

## Controleren en terugdraaien

Na elke DNS-wijziging alles uit de momentopname hierboven regel voor regel nalopen. Wijkt er
iets af aan de mailkant, zet het dan meteen terug.

**Terugdraaien** kan altijd: A terug op `217.160.0.138`, AAAA terug op
`2001:8d8:100f:f000::200`. GitHub Pages blijft in ronde 1 tot en met 3 gewoon draaien, dus de
app is in die periode nooit onbereikbaar. DNS heeft een wachttijd van ongeveer een uur — plan
een wijziging niet vlak voor een drukke dag.

**Les uit de ViVo-verhuizing:** de DNS-cache van de router hield het oude adres nog 13 minuten
vast. Op wifi zie je dan nog het oude, op mobiel internet al het nieuwe. Dat is geen fout.
