/* Flow8 — prijsindicatie.
   Progressieve verbetering: zonder JavaScript tonen de velden hun beginwaarde en
   staat er een kloppend bedrag in de HTML. Dit script maakt het alleen levend.

   Tarieven staan óók in de HTML, zodat de pagina klopt als dit bestand niet laadt.
   Verander je ze hier, verander ze dan daar mee. */
(function () {
  'use strict';
  var BASIS = 9;    // per gebruiker per maand
  var BON   = 15;   // extra per monteur met werkbonlicentie

  var vGebruikers = document.getElementById('rk-gebruikers');
  var vBonnen     = document.getElementById('rk-bonnen');
  if (!vGebruikers || !vBonnen) return;

  var uit = {
    gebruikers: document.getElementById('rk-gebruikers-uit'),
    bonnen:     document.getElementById('rk-bonnen-uit'),
    basisRegel: document.getElementById('rk-basis-regel'),
    basisBedrag:document.getElementById('rk-basis-bedrag'),
    bonRegel:   document.getElementById('rk-bon-regel'),
    bonBedrag:  document.getElementById('rk-bon-bedrag'),
    perGebruiker:document.getElementById('rk-per-gebruiker'),
    totaal:     document.getElementById('rk-totaal')
  };
  for (var k in uit) if (!uit[k]) return;

  function euro(n) {
    return '€ ' + n.toLocaleString('nl-NL', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }
  function euroCent(n) {
    return '€ ' + n.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function herbereken() {
    var g = parseInt(vGebruikers.value, 10);
    // Je kunt geen werkbonlicenties hebben voor meer mensen dan je gebruikers.
    if (parseInt(vBonnen.value, 10) > g) vBonnen.value = g;
    vBonnen.max = g;
    var b = parseInt(vBonnen.value, 10);

    var basis = g * BASIS;
    var bon   = b * BON;
    var totaal = basis + bon;

    uit.gebruikers.textContent = g + (g >= 40 ? '+' : '');
    uit.bonnen.textContent     = b;
    uit.basisRegel.textContent = 'Basistoegang · ' + g + ' × ' + euro(BASIS);
    uit.basisBedrag.textContent = euro(basis);
    uit.bonRegel.textContent   = 'Werkbonlicentie · ' + b + ' × ' + euro(BON);
    uit.bonBedrag.textContent  = euro(bon);
    uit.totaal.textContent     = euro(totaal);
    uit.perGebruiker.textContent =
      b + ' × ' + euro(BASIS + BON) + ' · ' + (g - b) + ' × ' + euro(BASIS) +
      ' — ' + euroCent(totaal / g) + ' per gebruiker';
  }

  vGebruikers.addEventListener('input', herbereken);
  vBonnen.addEventListener('input', herbereken);
  herbereken();
})();
