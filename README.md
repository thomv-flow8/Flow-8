# Flow8

Multi-tenant SaaS PWA voor de installatie- en servicebranche. Één self-contained HTML-bestand
(`flow8-v2.html`), gehost op GitHub Pages, met Firebase (RTDB + Firestore + Auth + Storage).

Live: https://thomv-flow8.github.io/Flow-8/flow8-v2.html

> Werk je met Claude Code? Lees eerst `CLAUDE.md` — daar staat de verplichte werkwijze,
> het token-systeem en de projectkennis. Openstaande punten: `TODO.md`.

---

## Eenmalige setup in Claude Code

### 1. Lokale repo (gedaan)

De repo staat lokaal in `C:\Users\HP\Downloads\Flow-8`, als clone van `thomv-flow8/Flow-8`.
Inloggen bij GitHub gaat via Git Credential Manager (zit in Git for Windows): bij de eerste
`git push` opent een browservenster. De GitHub CLI (`gh`) is niet nodig.

Op een andere computer:
```bash
git clone https://github.com/thomv-flow8/Flow-8.git
```

### 2. GitHub Pages

Repo → Settings → Pages → Source: *Deploy from a branch* → branch `main`, map `/root`. Na een push
staat de nieuwe versie binnen ~1 minuut live.

### 3. Firebase

Firebase Console → Authentication → Settings → **Authorized domains** → voeg `thomv-flow8.github.io`
toe. Zonder dit faalt inloggen op de live-versie (`auth/unauthorized-domain`).

### 4. Cloud Functions (`flow8-functions/`)

Eenmalig: Firebase CLI installeren en inloggen, daarna de dependencies.
```bash
npm install -g firebase-tools
firebase login
cd flow8-functions/functions && npm install
```

Geheimen staan nooit in git:
- `RESEND_API_KEY` in Secret Manager: `firebase functions:secrets:set RESEND_API_KEY`
- `MAIL_FROM` in `flow8-functions/functions/.env`, bijvoorbeeld `MAIL_FROM=Flow8 <mail@jouwdomein.nl>`

Deployen (direct live, los van GitHub Pages):
```bash
cd flow8-functions && firebase deploy --only functions
```

---

## Dagelijkse workflow

In Claude Code volstaat één zin, bijvoorbeeld: *"pas X aan en push."* Claude Code:
1. analyseert eerst (Analyse → Gevolgen → Oplossing), vraagt akkoord bij grote stappen;
2. bewerkt `flow8-v2.html`;
3. draait de JS-syntaxcheck;
4. `git add` + `git commit` + `git push` → GitHub Pages zet het live.

### JS-syntaxcheck (na elke wijziging)

```bash
./check.sh
```

of direct:

```bash
node -e "const fs=require('fs');const h=fs.readFileSync('flow8-v2.html','utf8');const s=[...h.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);try{new Function(s.join('\n;\n'));console.log('✓ JS syntax OK');}catch(e){console.log('✗ SYNTAX FOUT:',e.message);}"
```

(Node.js vereist. De check parset alle inline `<script>`-blokken zonder ze uit te voeren.)

---

## Let op
- `flow8-v2.html` is het **canonieke** bestand — de waarheid. Hernoem het niet zonder `sw.js` mee
  aan te passen: die cachet `/Flow-8/flow8-v2.html` bij naam. Het manifest staat inline in de HTML.
- Alle UI-tekst en communicatie is **Nederlands**.
- Test op **iPhone** (licht én donker thema) — dat is het primaire testapparaat.
