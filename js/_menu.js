createMenu('Löneanalys', [
  { name: 'Regioner', script: 'regioner.js' },
  { name: 'Ålder', script: 'alder.js' },
  { name: 'Löner', sub: [
    { name: 'Löner och kön', script: 'loner-kon.js' },
    { name: 'Löner och ålder', script: 'loner-alder.js' },
    { name: 'Löner och regioner', script: 'loner-regioner.js' },
  ]},
  { name: 'Slutsatser', script: 'slutsatser.js' },
]);
