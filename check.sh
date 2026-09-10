#!/usr/bin/env bash
# Flow8 — JS-syntaxcheck: parset alle inline <script>-blokken zonder uit te voeren.
node -e "const fs=require('fs');const h=fs.readFileSync('flow8-v2.html','utf8');const s=[...h.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);try{new Function(s.join('\n;\n'));console.log('\u2713 JS syntax OK');}catch(e){console.log('\u2717 SYNTAX FOUT:',e.message);process.exit(1);}"
