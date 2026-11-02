#!/usr/bin/env bash
# Flow8 — controles na elke wijziging.
#   1. JS-syntaxcheck: parset alle inline <script>-blokken van de bron zonder uit te voeren.
#   2. Publicatiecontrole app: staat docs/app/ nog gelijk aan flow8-v2.html? Cloud86 serveert
#      docs/, dus een vergeten "node publiceer.js" zou daar een oude app laten staan.
#   3. Publicatiecontrole site: staat docs/site/ nog gelijk aan site/?
set -e

node -e "const fs=require('fs');const h=fs.readFileSync('flow8-v2.html','utf8');const s=[...h.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);try{new Function(s.join('\n;\n'));console.log('✓ JS syntax OK');}catch(e){console.log('✗ SYNTAX FOUT:',e.message);process.exit(1);}"

node publiceer.js --controleer
node tools/bouw-site.js --controleer
