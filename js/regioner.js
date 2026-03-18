let data = await jload('json/salaries.json');

let regionMo = data.filter(x => x.region == 'Malmö');
let regionGbg = data.filter(x => x.region == 'Göteborg');
let regionSthm = data.filter(x => x.region == 'Stockholm');

addMdToPage(`
## Regioner

Den region de flesta bor i: ${s.modeFast(data.map(x => x.region))}
`);

let regionData = [
  { region: 'Malmö', antal: regionMo.length },
  { region: 'Göteborg', antal: regionGbg.length },
  { region: 'Stockholm', antal: regionSthm.length },
];

tableFromData({
  data: regionData,
  columnNames: ['Region', 'Antal'],
});

drawGoogleChart({
  type: 'PieChart',
  data: makeChartFriendly(regionData, 'Region', 'Antal'),
  options: {
    height: 400,
    title: 'Fördelning av respondenter per region',
  },
});
