// Load the data from json
// (the json file should be located in a folder named json 
//  and by named salaries.json)
let data = await jload('json/salaries.json');

addMdToPage(`
  # Åldrar

  Yngsta individ: ${s.min(data.map(x => x.age))}

  Äldsta individ: ${s.max(data.map(x => x.age))}

  Yngsta kvinna: ${s.min(data.filter(x => x.gender == "female").map(x => x.age))}

  Yngsta man: ${s.min(data.filter(x => x.gender == "male").map(x => x.age))}
`);

addMdToPage(`
  # Kvinnor och män

  Antal kvinnor: ${data.filter(x => x.gender == "female").length}

  Antal män: ${data.filter(x => x.gender == "male").length}

  Antal kvinnor i Stockholm: ${data.filter(x => x.gender == "female").filter(x => x.region == "Stockholm").length}

  Antal kvinnor i Stockholm: ${data.filter(x => x.gender == "female" && x.region == "Stockholm").length}
`);

const stockholmCount = data.filter(x => x.region == 'Stockholm').length;
const gothenburgCount = data.filter(x => x.region == 'Göteborg').length;
const malmoCount = data.filter(x => x.region == 'Malmö').length;

// Note: To get the correct mode value for non-numeric
// values you need to use modeFast, not mode!

addMdToPage(`
  # Regioner och antal respondenter
  Hur många som besvarade undersökningen i de olika regionerna.
  Vi gick ut och frågade lika många (450 st) i varje region.

  Vanligaste region: ${s.modeFast(data.map(x => x.region))}

  Antal respondenter från Malmö: ${malmoCount}

  Antal respondenter från Göteborg: ${gothenburgCount}

  Antal respondenter från Stockholm: ${stockholmCount}
`);

drawGoogleChart({
  type: 'BarChart',
  data: makeChartFriendly([
    { city: 'Malmö', respondents: malmoCount },
    { city: 'Göteborg', respondents: gothenburgCount },
    { city: 'Stockholm', respondents: stockholmCount }
  ]),
  options: {
    min: 0,
    height: 500,
    chartArea: { left: 100, right: 0 },
    title: `Antal respondenter per region`
  }
});