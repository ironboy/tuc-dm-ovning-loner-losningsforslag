let data = await jload('json/salaries.json');

let women = data.filter(x => x.gender == 'female');
let men = data.filter(x => x.gender == 'male');
let ages = data.map(x => x.age);
let agesWomen = women.map(x => x.age);
let agesMen = men.map(x => x.age);
let ageGroup18_32 = data.filter(x => x.age >= 18 && x.age <= 32);
let ageGroup33_50 = data.filter(x => x.age >= 33 && x.age <= 50);
let ageGroup51_64 = data.filter(x => x.age >= 51 && x.age <= 64);

addMdToPage(`## Ålder`);

tableFromData({
  data: [
    { grupp: 'Samtliga', yngsta: s.min(ages), äldsta: s.max(ages), medianålder: s.median(ages), medelålder: s.mean(ages), sd: s.sampleStandardDeviation(ages) },
    { grupp: 'Kvinnor', yngsta: s.min(agesWomen), äldsta: s.max(agesWomen), medianålder: s.median(agesWomen), medelålder: s.mean(agesWomen), sd: s.sampleStandardDeviation(agesWomen) },
    { grupp: 'Män', yngsta: s.min(agesMen), äldsta: s.max(agesMen), medianålder: s.median(agesMen), medelålder: s.mean(agesMen), sd: s.sampleStandardDeviation(agesMen) },
  ],
  columnNames: ['Grupp', 'Yngsta', 'Äldsta', 'Medianålder', 'Medelålder', 'sd'],
  numberFormatOptions: { minimumFractionDigits: 0, maximumFractionDigits: 1 },
});

addMdToPage(`### Åldersgruppsindelning`);

let ageGroupData = [
  { åldersgrupp: '18-32 år', antal: ageGroup18_32.length },
  { åldersgrupp: '33-50 år', antal: ageGroup33_50.length },
  { åldersgrupp: '51-64 år', antal: ageGroup51_64.length },
];

tableFromData({
  data: ageGroupData,
  columnNames: ['Åldersgrupp', 'Antal respondenter'],
});

drawGoogleChart({
  type: 'ColumnChart',
  data: makeChartFriendly(ageGroupData, 'Åldersgrupp', 'Antal'),
  options: {
    height: 400,
    title: 'Antal respondenter per åldersgrupp',
    chartArea: { left: 60, right: 20 },
    vAxis: { minValue: 0 },
    legend: 'none',
  },
});
