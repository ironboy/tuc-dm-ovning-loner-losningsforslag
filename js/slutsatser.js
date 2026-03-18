let data = await jload('json/salaries.json');

let salaries = data.map(x => x.monthlySalarySEK);
let salariesWomen = data.filter(x => x.gender == 'female').map(x => x.monthlySalarySEK);
let salariesMen = data.filter(x => x.gender == 'male').map(x => x.monthlySalarySEK);

addMdToPage(`
## Slutsatser

Sammanfattningsvis kan sägas att ålder verkar ha störst betydelse för lön, och att kön och vilken storstadsregion verkar ha ungefär lika stor betydelse.

Det vore därmed ganska troligt att två jämngamla IT-utvecklare, en manlig verksam i Malmö och en kvinnlig verksam i Stockholm har liknande lön.

Den IT-utvecklare som tjänar sämst är en ung kvinna i Malmö-regionen och den som tjänar bäst är en äldre man i Stockholms-regionen...

### Om fördelningen

I samtliga grupper är medellönen högre än medianlönen. Det tyder på en högersnedfördelning (positiv skevhet) — det finns ett antal höga löner som drar upp medelvärdet, medan medianlönen bättre representerar den "typiska" lönen.
`);

tableFromData({
  data: [
    { grupp: 'Samtliga', medianlön: s.median(salaries), medellön: s.mean(salaries), skillnad: s.mean(salaries) - s.median(salaries), sd: s.sampleStandardDeviation(salaries) },
    { grupp: 'Kvinnor', medianlön: s.median(salariesWomen), medellön: s.mean(salariesWomen), skillnad: s.mean(salariesWomen) - s.median(salariesWomen), sd: s.sampleStandardDeviation(salariesWomen) },
    { grupp: 'Män', medianlön: s.median(salariesMen), medellön: s.mean(salariesMen), skillnad: s.mean(salariesMen) - s.median(salariesMen), sd: s.sampleStandardDeviation(salariesMen) },
  ],
  columnNames: ['Grupp', 'Medianlön', 'Medellön', 'Medel − Median', 'sd'],
  numberFormatOptions: { minimumFractionDigits: 0, maximumFractionDigits: 0 },
});

addMdToPage(`
När skillnaden mellan medelvärde och median är stor bör man vara försiktig med att använda medelvärdet som mått på den "typiska" lönen — medianen ger en mer rättvisande bild.

Standardavvikelsen (sd) visar hur stor lönespridningen är inom varje grupp. En hög sd innebär att lönerna varierar mycket — det finns både låg- och höginkomsttagare. Vid jämförelser mellan grupper: om sd är likartade kan man lita mer på att skillnaden i medelvärde inte drivs av enstaka extremvärden.

### Lönefördelning vs normalfördelning

Diagrammet nedan visar den faktiska lönefördelningen (staplar) jämfört med en teoretisk normalfördelning (linje) baserad på medelvärde och standardavvikelse. Om staplarna följer linjen väl är datan normalfördelad — avviker de tyder det på skevhet.

P.g.a. hur medelvärdet för alla löner ligger i förhållande till spridningen visas även negativa lönevärden i diagrammet — detta för att kunna visa hela normalfördelningskurvan.
`);

// Beräkna histogram-bins
let mean = s.mean(salaries);
let sd = s.sampleStandardDeviation(salaries);
let binSize = 5000;
let minBin = Math.floor((mean - 4 * sd) / binSize) * binSize;
let maxBin = Math.ceil((mean + 4 * sd) / binSize) * binSize;

// Räkna antal per bin
let bins = [];
for (let bin = minBin; bin < maxBin; bin += binSize) {
  let count = salaries.filter(x => x >= bin && x < bin + binSize).length;
  bins.push({ binStart: bin, count: count });
}

// Normalfördelningens PDF
let normalPdf = (x, mean, sd) =>
  (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / sd, 2));

// Skapa diagramdata: bin-mittpunkt, faktiskt antal, förväntat antal från normalfördelning
let chartData = bins.map(b => {
  let midpoint = b.binStart + binSize / 2;
  let expected = normalPdf(midpoint, mean, sd) * binSize * salaries.length;
  return [midpoint, b.count, expected];
});

// Lägg till kolumnhuvud
chartData.unshift(['Lön', 'Faktisk fördelning', 'Normalfördelning']);

drawGoogleChart({
  type: 'ComboChart',
  data: chartData,
  options: {
    height: 450,
    title: 'Lönefördelning jämfört med normalfördelning (samtliga)',
    chartArea: { left: 60, right: 20 },
    hAxis: { format: '#,### SEK' },
    vAxis: { title: 'Antal', minValue: 0 },
    seriesType: 'bars',
    series: { 1: { type: 'line', curveType: 'function', lineWidth: 3 } },
    legend: { position: 'top' },
    bar: { groupWidth: '90%' },
  },
});
