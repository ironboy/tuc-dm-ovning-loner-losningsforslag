let data = await jload('json/salaries.json');

let salaries = data.map(x => x.monthlySalarySEK);
let salariesWomen = data.filter(x => x.gender == 'female').map(x => x.monthlySalarySEK);
let salariesMen = data.filter(x => x.gender == 'male').map(x => x.monthlySalarySEK);

addMdToPage(`## Löner och kön`);

tableFromData({
  data: [
    { grupp: 'Samtliga', medianlön: s.median(salaries), medellön: s.mean(salaries), sd: s.sampleStandardDeviation(salaries) },
    { grupp: 'Kvinnor', medianlön: s.median(salariesWomen), medellön: s.mean(salariesWomen), sd: s.sampleStandardDeviation(salariesWomen) },
    { grupp: 'Män', medianlön: s.median(salariesMen), medellön: s.mean(salariesMen), sd: s.sampleStandardDeviation(salariesMen) },
  ],
  columnNames: ['Grupp', 'Medianlön', 'Medellön', 'sd'],
  numberFormatOptions: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
});

let chartData = [
  { grupp: 'Samtliga', medianlön: s.median(salaries), medellön: s.mean(salaries) },
  { grupp: 'Kvinnor', medianlön: s.median(salariesWomen), medellön: s.mean(salariesWomen) },
  { grupp: 'Män', medianlön: s.median(salariesMen), medellön: s.mean(salariesMen) },
];

drawGoogleChart({
  type: 'BarChart',
  data: makeChartFriendly(chartData, 'Grupp', 'Medianlön', 'Medellön'),
  options: {
    height: 300,
    title: 'Medianlön och medellön per kön (SEK)',
    chartArea: { left: 100, right: 20 },
    hAxis: { format: '#,### SEK', minValue: 0 },
    animation: { startup: true, duration: 800, easing: 'out' },
  },
});

addMdToPage(`
Vi kan konstatera att kön har betydelse för lönenivån, till männens fördel:
`);

tableFromData({
  data: [
    { mått: 'Skillnad i medellön', skillnad: s.mean(salariesMen) - s.mean(salariesWomen) },
    { mått: 'Skillnad i medianlön', skillnad: s.median(salariesMen) - s.median(salariesWomen) },
  ],
  columnNames: ['Mått', 'Skillnad (SEK)'],
  numberFormatOptions: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
});
