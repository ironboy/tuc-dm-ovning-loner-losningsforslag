let data = await jload('json/salaries.json');

let valtKön = addDropdown('Visa för', ['Samtliga', 'Kvinnor', 'Män']);
let regions = ['Samtliga', 'Malmö', 'Göteborg', 'Stockholm'];
let valdRegion = addDropdown('Region', regions);

let filtered = data;
if (valtKön == 'Kvinnor') {
  filtered = data.filter(x => x.gender == 'female');
} else if (valtKön == 'Män') {
  filtered = data.filter(x => x.gender == 'male');
}
if (valdRegion != 'Samtliga') {
  filtered = filtered.filter(x => x.region == valdRegion);
}

if (valdRegion == 'Samtliga') {
  let regionMo = filtered.filter(x => x.region == 'Malmö');
  let regionGbg = filtered.filter(x => x.region == 'Göteborg');
  let regionSthm = filtered.filter(x => x.region == 'Stockholm');
  let salMo = regionMo.map(x => x.monthlySalarySEK);
  let salGbg = regionGbg.map(x => x.monthlySalarySEK);
  let salSthm = regionSthm.map(x => x.monthlySalarySEK);

  addMdToPage(`## Löner och regioner — ${valtKön.toLowerCase()}`);

  let tableData = [
    { region: 'Malmö', medianlön: s.median(salMo), medellön: s.mean(salMo), sd: s.sampleStandardDeviation(salMo) },
    { region: 'Göteborg', medianlön: s.median(salGbg), medellön: s.mean(salGbg), sd: s.sampleStandardDeviation(salGbg) },
    { region: 'Stockholm', medianlön: s.median(salSthm), medellön: s.mean(salSthm), sd: s.sampleStandardDeviation(salSthm) },
  ];

  tableFromData({
    data: tableData,
    columnNames: ['Region', 'Medianlön', 'Medellön', 'sd'],
    numberFormatOptions: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
  });

  let chartData = [
    { region: 'Malmö', medellön: s.mean(salMo) },
    { region: 'Göteborg', medellön: s.mean(salGbg) },
    { region: 'Stockholm', medellön: s.mean(salSthm) },
  ];

  drawGoogleChart({
    type: 'ColumnChart',
    data: makeChartFriendly(chartData, 'Region', 'Medellön'),
    options: {
      height: 400,
      title: `Medellön per region — ${valtKön.toLowerCase()} (SEK)`,
      chartArea: { left: 80, right: 20 },
      vAxis: { format: '#,### SEK', minValue: 0 },
      animation: { startup: true, duration: 800, easing: 'out' },
      legend: 'none',
    },
  });

  addMdToPage(`
Skillnaderna mellan Malmö och Göteborg är relativt små. Däremot är det en tydlig skillnad mellan Stockholm och övriga regioner:
`);

  tableFromData({
    data: [
      { jämförelse: 'Stockholm vs Malmö', skillnadMedellön: s.mean(salSthm) - s.mean(salMo), skillnadMedianLön: s.median(salSthm) - s.median(salMo) },
      { jämförelse: 'Stockholm vs Göteborg', skillnadMedellön: s.mean(salSthm) - s.mean(salGbg), skillnadMedianLön: s.median(salSthm) - s.median(salGbg) },
      { jämförelse: 'Göteborg vs Malmö', skillnadMedellön: s.mean(salGbg) - s.mean(salMo), skillnadMedianLön: s.median(salGbg) - s.median(salMo) },
    ],
    columnNames: ['Jämförelse', 'Skillnad medellön', 'Skillnad medianlön'],
    numberFormatOptions: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
  });
} else {
  let sal = filtered.map(x => x.monthlySalarySEK);

  addMdToPage(`## Löner i ${valdRegion} — ${valtKön.toLowerCase()}`);

  tableFromData({
    data: [
      { mått: 'Antal', värde: sal.length },
      { mått: 'Lägsta lön', värde: s.min(sal) },
      { mått: 'Högsta lön', värde: s.max(sal) },
      { mått: 'Medianlön', värde: s.median(sal) },
      { mått: 'Medellön', värde: s.mean(sal) },
      { mått: 'sd', värde: s.sampleStandardDeviation(sal) },
    ],
    columnNames: ['Mått', 'Värde'],
    numberFormatOptions: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
  });
}
