let data = await jload('json/salaries.json');

let valtKön = addDropdown('Visa för', ['Samtliga', 'Kvinnor', 'Män']);

let filtered = data;
if (valtKön == 'Kvinnor') {
  filtered = data.filter(x => x.gender == 'female');
} else if (valtKön == 'Män') {
  filtered = data.filter(x => x.gender == 'male');
}

let ageGroup18_32 = filtered.filter(x => x.age >= 18 && x.age <= 32);
let ageGroup33_50 = filtered.filter(x => x.age >= 33 && x.age <= 50);
let ageGroup51_64 = filtered.filter(x => x.age >= 51 && x.age <= 64);
let sal18_32 = ageGroup18_32.map(x => x.monthlySalarySEK);
let sal33_50 = ageGroup33_50.map(x => x.monthlySalarySEK);
let sal51_64 = ageGroup51_64.map(x => x.monthlySalarySEK);

addMdToPage(`## Löner och ålder — ${valtKön.toLowerCase()}`);

let tableData = [
  { åldersgrupp: '18-32 år', medianlön: s.median(sal18_32), medellön: s.mean(sal18_32), sd: s.sampleStandardDeviation(sal18_32) },
  { åldersgrupp: '33-50 år', medianlön: s.median(sal33_50), medellön: s.mean(sal33_50), sd: s.sampleStandardDeviation(sal33_50) },
  { åldersgrupp: '51-64 år', medianlön: s.median(sal51_64), medellön: s.mean(sal51_64), sd: s.sampleStandardDeviation(sal51_64) },
];

tableFromData({
  data: tableData,
  columnNames: ['Åldersgrupp', 'Medianlön', 'Medellön', 'sd'],
  numberFormatOptions: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
});

let chartData = [
  { åldersgrupp: '18-32 år', medellön: s.mean(sal18_32) },
  { åldersgrupp: '33-50 år', medellön: s.mean(sal33_50) },
  { åldersgrupp: '51-64 år', medellön: s.mean(sal51_64) },
];

drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(chartData, 'Åldersgrupp', 'Medellön'),
  options: {
    height: 400,
    title: `Medellön per åldersgrupp — ${valtKön.toLowerCase()} (SEK)`,
    chartArea: { left: 80, right: 20 },
    vAxis: { format: '#,### SEK', minValue: 0 },
    animation: { startup: true, duration: 800, easing: 'out' },
    legend: 'none',
  },
});

addMdToPage(`
Lönerna ökar med ålder. Lönespridningen (sd) ökar också markant med ålder. Jämförelse mellan yngsta och äldsta gruppen:
`);

tableFromData({
  data: [
    { åldersgrupp: '18-32 år', antal: ageGroup18_32.length, medellön: s.mean(sal18_32), sd: s.sampleStandardDeviation(sal18_32) },
    { åldersgrupp: '51-64 år', antal: ageGroup51_64.length, medellön: s.mean(sal51_64), sd: s.sampleStandardDeviation(sal51_64) },
    { åldersgrupp: 'Skillnad', antal: ageGroup51_64.length - ageGroup18_32.length, medellön: s.mean(sal51_64) - s.mean(sal18_32), sd: s.sampleStandardDeviation(sal51_64) - s.sampleStandardDeviation(sal18_32) },
  ],
  columnNames: ['Åldersgrupp', 'Antal', 'Medellön', 'sd'],
  numberFormatOptions: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
});

addMdToPage(`
Vad gäller korrelationen lön och ålder ser vi en liknande utveckling oavsett kön — använd dropdownen ovan för att jämföra.
`);
