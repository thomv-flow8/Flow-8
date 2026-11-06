// Zo vroeg mogelijk: laat de CSS weten dat JavaScript draait.
document.documentElement.classList.add('js');

// Oude links naar een kopje op de ene lange pagina (flow-8.nl/#prijzen) naar de nieuwe pagina sturen.
// Alleen op de homepage: op de andere pagina's betekent een anker gewoon een plek op die pagina.
(function () {
  var naar = { dashboard: 'product/', kaart: 'product/#kaart', klanten: 'product/#klanten', register: 'product/#register', team: 'product/#team',
    prijzen: 'prijzen/', overstappen: 'overstappen/', faq: 'vragen/', contact: 'contact/' }[location.hash.slice(1)];
  if (naar && !/\/(product|prijzen|overstappen|vragen|contact)\//.test(location.pathname)) location.replace(naar);
})();
