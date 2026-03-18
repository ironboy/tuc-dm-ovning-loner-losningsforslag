// Load the data
let data = await jload('json/salaries.json');

// Create some variables with filtered and mapped data
let women = data.filter(x => x.gender == 'female');
let men = data.filter(x => x.gender == 'male');
let ages = data.map(x => x.age);
let agesWomen = women.map(x => x.age);
let agesMen = men.map(x => x.age);
let salaries = data.map(x => x.monthlySalarySEK);
let salariesWomen = women.map(x => x.monthlySalarySEK);
let salariesMen = men.map(x => x.monthlySalarySEK);
let ageGroup18_32 = data.filter(x => x.age >= 18 && x.age <= 32);
let ageGroup33_50 = data.filter(x => x.age >= 33 && x.age <= 50);
let ageGroup51_64 = data.filter(x => x.age >= 51 && x.age <= 64);
let salariesAgeGroup18_32 = ageGroup18_32.map(x => x.monthlySalarySEK);
let salariesAgeGroup33_50 = ageGroup33_50.map(x => x.monthlySalarySEK);
let salariesAgeGroup51_64 = ageGroup51_64.map(x => x.monthlySalarySEK);
let salariesAgeGroupWomen18_32 = ageGroup18_32
  .filter(x => x.gender == 'female').map(x => x.monthlySalarySEK);
let salariesAgeGroupWomen33_50 = ageGroup33_50
  .filter(x => x.gender == 'female').map(x => x.monthlySalarySEK);
let salariesAgeGroupWomen51_64 = ageGroup51_64
  .filter(x => x.gender == 'female').map(x => x.monthlySalarySEK);
let salariesAgeGroupMen18_32 = ageGroup18_32
  .filter(x => x.gender == 'male').map(x => x.monthlySalarySEK);
let salariesAgeGroupMen33_50 = ageGroup33_50
  .filter(x => x.gender == 'male').map(x => x.monthlySalarySEK);
let salariesAgeGroupMen51_64 = ageGroup51_64
  .filter(x => x.gender == 'male').map(x => x.monthlySalarySEK);
let regionMo = data.filter(x => x.region == 'Malmö');
let regionGbg = data.filter(x => x.region == 'Göteborg');
let regionSthm = data.filter(x => x.region == 'Stockholm');
let salariesRegionMo = regionMo.map(x => x.monthlySalarySEK);
let salariesRegionGbg = regionGbg.map(x => x.monthlySalarySEK);
let salariesRegionSthm = regionSthm.map(x => x.monthlySalarySEK);
let salariesWomenRegionMo = regionMo
  .filter(x => x.gender == 'female').map(x => x.monthlySalarySEK);
let salariesWomenRegionGbg = regionGbg
  .filter(x => x.gender == 'female').map(x => x.monthlySalarySEK);
let salariesWomenRegionSthm = regionSthm
  .filter(x => x.gender == 'female').map(x => x.monthlySalarySEK);
let salariesMenRegionMo = regionMo
  .filter(x => x.gender == 'male').map(x => x.monthlySalarySEK);
let salariesMenRegionGbg = regionGbg
  .filter(x => x.gender == 'male').map(x => x.monthlySalarySEK);
let salariesMenRegionSthm = regionSthm
  .filter(x => x.gender == 'male').map(x => x.monthlySalarySEK);

// Perform and output statistic calculations
addMdToPage(`
**Notera**: Samtliga löner är bruttomånadslöner i SEK, samt **sd** används som förkortning för standardavvikelse.

### Regioner

Den region de flesta bor i: ${s.modeFast(data.map(x => x.region))}
`);

tableFromData({
  data: [
    { region: 'Malmö', antal: regionMo.length },
    { region: 'Göteborg', antal: regionGbg.length },
    { region: 'Stockholm', antal: regionSthm.length },
  ],
  columnNames: ['Region', 'Antal'],
});

addMdToPage(`### Ålder`);

tableFromData({
  data: [
    { grupp: 'Samtliga', yngsta: s.min(ages), äldsta: s.max(ages), medianålder: s.median(ages), medelålder: s.mean(ages), sd: s.sampleStandardDeviation(ages) },
    { grupp: 'Kvinnor', yngsta: s.min(agesWomen), äldsta: s.max(agesWomen), medianålder: s.median(agesWomen), medelålder: s.mean(agesWomen), sd: s.sampleStandardDeviation(agesWomen) },
    { grupp: 'Män', yngsta: s.min(agesMen), äldsta: s.max(agesMen), medianålder: s.median(agesMen), medelålder: s.mean(agesMen), sd: s.sampleStandardDeviation(agesMen) },
  ],
  columnNames: ['Grupp', 'Yngsta', 'Äldsta', 'Medianålder', 'Medelålder', 'sd'],
  numberFormatOptions: { minimumFractionDigits: 0, maximumFractionDigits: 1 },
});

addMdToPage(`### Löner och kön`);

tableFromData({
  data: [
    { grupp: 'Samtliga', medianlön: s.median(salaries), medellön: s.mean(salaries), sd: s.sampleStandardDeviation(salaries) },
    { grupp: 'Kvinnor', medianlön: s.median(salariesWomen), medellön: s.mean(salariesWomen), sd: s.sampleStandardDeviation(salariesWomen) },
    { grupp: 'Män', medianlön: s.median(salariesMen), medellön: s.mean(salariesMen), sd: s.sampleStandardDeviation(salariesMen) },
  ],
  columnNames: ['Grupp', 'Medianlön', 'Medellön', 'sd'],
  numberFormatOptions: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
});

addMdToPage(`### Åldersgruppsindelning`);

tableFromData({
  data: [
    { åldersgrupp: '18-32 år', antal: ageGroup18_32.length },
    { åldersgrupp: '33-50 år', antal: ageGroup33_50.length },
    { åldersgrupp: '51-64 år', antal: ageGroup51_64.length },
  ],
  columnNames: ['Åldersgrupp', 'Antal respondenter'],
});

addMdToPage(`### Löner och ålder, samtliga`);

tableFromData({
  data: [
    { åldersgrupp: '18-32 år', medianlön: s.median(salariesAgeGroup18_32), medellön: s.mean(salariesAgeGroup18_32), sd: s.sampleStandardDeviation(salariesAgeGroup18_32) },
    { åldersgrupp: '33-50 år', medianlön: s.median(salariesAgeGroup33_50), medellön: s.mean(salariesAgeGroup33_50), sd: s.sampleStandardDeviation(salariesAgeGroup33_50) },
    { åldersgrupp: '51-64 år', medianlön: s.median(salariesAgeGroup51_64), medellön: s.mean(salariesAgeGroup51_64), sd: s.sampleStandardDeviation(salariesAgeGroup51_64) },
  ],
  columnNames: ['Åldersgrupp', 'Medianlön', 'Medellön', 'sd'],
  numberFormatOptions: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
});

addMdToPage(`### Löner och ålder, kvinnor`);

tableFromData({
  data: [
    { åldersgrupp: '18-32 år', medianlön: s.median(salariesAgeGroupWomen18_32), medellön: s.mean(salariesAgeGroupWomen18_32), sd: s.sampleStandardDeviation(salariesAgeGroupWomen18_32) },
    { åldersgrupp: '33-50 år', medianlön: s.median(salariesAgeGroupWomen33_50), medellön: s.mean(salariesAgeGroupWomen33_50), sd: s.sampleStandardDeviation(salariesAgeGroupWomen33_50) },
    { åldersgrupp: '51-64 år', medianlön: s.median(salariesAgeGroupWomen51_64), medellön: s.mean(salariesAgeGroupWomen51_64), sd: s.sampleStandardDeviation(salariesAgeGroupWomen51_64) },
  ],
  columnNames: ['Åldersgrupp', 'Medianlön', 'Medellön', 'sd'],
  numberFormatOptions: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
});

addMdToPage(`### Löner och ålder, män`);

tableFromData({
  data: [
    { åldersgrupp: '18-32 år', medianlön: s.median(salariesAgeGroupMen18_32), medellön: s.mean(salariesAgeGroupMen18_32), sd: s.sampleStandardDeviation(salariesAgeGroupMen18_32) },
    { åldersgrupp: '33-50 år', medianlön: s.median(salariesAgeGroupMen33_50), medellön: s.mean(salariesAgeGroupMen33_50), sd: s.sampleStandardDeviation(salariesAgeGroupMen33_50) },
    { åldersgrupp: '51-64 år', medianlön: s.median(salariesAgeGroupMen51_64), medellön: s.mean(salariesAgeGroupMen51_64), sd: s.sampleStandardDeviation(salariesAgeGroupMen51_64) },
  ],
  columnNames: ['Åldersgrupp', 'Medianlön', 'Medellön', 'sd'],
  numberFormatOptions: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
});

addMdToPage(`### Löner och regioner, samtliga`);

tableFromData({
  data: [
    { region: 'Malmö', medianlön: s.median(salariesRegionMo), medellön: s.mean(salariesRegionMo), sd: s.sampleStandardDeviation(salariesRegionMo) },
    { region: 'Göteborg', medianlön: s.median(salariesRegionGbg), medellön: s.mean(salariesRegionGbg), sd: s.sampleStandardDeviation(salariesRegionGbg) },
    { region: 'Stockholm', medianlön: s.median(salariesRegionSthm), medellön: s.mean(salariesRegionSthm), sd: s.sampleStandardDeviation(salariesRegionSthm) },
  ],
  columnNames: ['Region', 'Medianlön', 'Medellön', 'sd'],
  numberFormatOptions: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
});

addMdToPage(`### Löner och regioner, kvinnor`);

tableFromData({
  data: [
    { region: 'Malmö', medianlön: s.median(salariesWomenRegionMo), medellön: s.mean(salariesWomenRegionMo), sd: s.sampleStandardDeviation(salariesWomenRegionMo) },
    { region: 'Göteborg', medianlön: s.median(salariesWomenRegionGbg), medellön: s.mean(salariesWomenRegionGbg), sd: s.sampleStandardDeviation(salariesWomenRegionGbg) },
    { region: 'Stockholm', medianlön: s.median(salariesWomenRegionSthm), medellön: s.mean(salariesWomenRegionSthm), sd: s.sampleStandardDeviation(salariesWomenRegionSthm) },
  ],
  columnNames: ['Region', 'Medianlön', 'Medellön', 'sd'],
  numberFormatOptions: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
});

addMdToPage(`### Löner och regioner, män`);

tableFromData({
  data: [
    { region: 'Malmö', medianlön: s.median(salariesMenRegionMo), medellön: s.mean(salariesMenRegionMo), sd: s.sampleStandardDeviation(salariesMenRegionMo) },
    { region: 'Göteborg', medianlön: s.median(salariesMenRegionGbg), medellön: s.mean(salariesMenRegionGbg), sd: s.sampleStandardDeviation(salariesMenRegionGbg) },
    { region: 'Stockholm', medianlön: s.median(salariesMenRegionSthm), medellön: s.mean(salariesMenRegionSthm), sd: s.sampleStandardDeviation(salariesMenRegionSthm) },
  ],
  columnNames: ['Region', 'Medianlön', 'Medellön', 'sd'],
  numberFormatOptions: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
});

addMdToPage(`
### Slutsatser

Vi kan konstatera att kön har betydelse för lönenivån, med en skillnad i medellön på 4 261 SEK och i medianlön på 4 943 SEK, till männens fördel.

Vi delade in respondenterna i 3 åldersgrupper (18-32 år, 322 st, 33-50 år, 386 st, 51-64 år, 292 st) och kan konstatera att lönerna ökar med ålder, med nästa dubbelt så höga medellön i gruppen 51-64 år (73 913 SEK), jämfört med gruppen 18-32 år (37 983 SEK).

Även lönespridningen ökar markant med ålder (från 12 993 SEK i standardavvikelse i den yngsta gruppen till 27 019 SEK i den äldsta).

Vad gäller korrelationen lön och ålder ser vi en liknande utveckling oavsett kön, om vi tittar på endast kvinnor, respektive endast män, inom olika åldersgrupper kvarstår faktum att medellönerna är nästan dubbelt så höga i gruppen 51-64 år, jämfört med gruppen 18-32 år.

Vad gäller de olika regionerna (Malmö-, Göteborg- och Stockholmsregionen) inverkan på lönerna är skillnaderna mellan Malmö och Göteborg relativt små, med bara aningen högre löner i Göteborg.

Det är däremot en tydlig skillnad mellan Stockholm och övriga regioner. Medellönen för Stockholmsregionen är 4 870 SEK högre än för Malmöregionen. Standardavvikelserna är likartade (vilket innebär att extremvärden inte verkar snedvrida jämförelsen).

Sammanfattningsvis kan sägas att ålder verkar ha störst betydelse för lön, och att kön och vilken storstadsregion verkar ha ungefär lika stor betydelse.

Det vore därmed ganska troligt att två jämngamla IT-utvecklare, en manlig verksam i Malmö och en kvinnlig verksam i Stockholm har liknande lön.

Den IT-utvecklare som tjänar sämst är en ung kvinna i Malmö-regionen och den som tjänar bäst är en äldre man i Stockholms-regionen...
`);

