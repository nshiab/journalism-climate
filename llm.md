**Journalism Climate v1.0.12**

***

# The Journalism Library (climate)

Useful TypeScript functions for climate calculations and weather data in journalism projects.
Part of the [journalism library](https://github.com/nshiab/journalism).

The library is maintained by [Nael Shiab](https://naelshiab.com/), computational
journalist and senior data producer for [CBC News](https://www.cbc.ca/news).

> [!TIP]
> To learn how to use this library and more, check out
> [Code Like a Journalist](https://www.code-like-a-journalist.com/), a free and
> open-source data analysis and data visualization course in TypeScript. You
> might also find
> [simple-data-analysis](https://github.com/nshiab/simple-data-analysis) useful.

## Installation

Requires **Node.js 24.21.0 or later**. Use `import`
and set `"type": "module"` in your project's `package.json`.

```sh
npm install @nshiab/journalism-climate
```

```ts
import { getEnvironmentCanadaRecords } from "@nshiab/journalism-climate";

const records = await getEnvironmentCanadaRecords(
  [{ lat: 45.52, lon: -73.65, name: "Montreal" }],
  "DAILY MAXIMUM TEMPERATURE",
  ["2023-07-01", "2023-07-01"],
);
console.table(records);
```

For browser projects, use the `/web` entry point:

```ts
import { getHumidex } from "@nshiab/journalism-climate/web";

console.log(getHumidex(30, 70)); // 41
```

To start a data project with folders, configuration and documentation for AI
agents, run:

```sh
npx @nshiab/setup-data-project
```

## Documentation

- [Documentation](https://nshiab.github.io/journalism-climate/)
- [llms.txt — Documentation index for AI agents](https://nshiab.github.io/journalism-climate/llms.txt)
- [llm.md — Complete Markdown reference](https://nshiab.github.io/journalism-climate/llm.md),
  for AI assistants or offline reading
- [npm package](https://www.npmjs.com/package/@nshiab/journalism-climate)

See
[CONTRIBUTING.md](https://github.com/nshiab/journalism-climate/blob/main/CONTRIBUTING.md)
for development commands.

Climate calculations and historical weather records.

## Climate

### getEnvironmentCanadaRecords()

> **getEnvironmentCanadaRecords**\<`T`\>(`locations`, `variable`, `dateRange`, `options?`): `Promise`\<`T` & `object`[]\>

Retrieves historical weather records from Environment and Climate Change Canada for specified locations and date ranges. This function fetches extreme weather records (daily maximum temperatures, precipitation, or snowfall) from the closest weather stations to your provided coordinates.

The function uses Environment Canada's Long-Term Climate Extremes (LTCE) API to find the nearest weather stations that have recorded the specified weather variable, then retrieves the historical record values for each day in your specified date range.

**Weather Variables**:
- `"DAILY MAXIMUM TEMPERATURE"`: Historical record high temperatures for each day
- `"DAILY TOTAL PRECIPITATION"`: Historical record precipitation amounts for each day
- `"DAILY TOTAL SNOWFALL"`: Historical record snowfall amounts for each day

**Station Selection**:
For each location you provide, the function automatically finds the closest weather station that has recorded the specified weather variable. The distance to the station is calculated and included in the results, allowing you to assess the relevance of the data to your specific location.

**Rate Limiting**:
The function includes built-in rate limiting with a configurable delay between API calls to respect Environment Canada's servers. The default delay is 100ms between requests, but this can be adjusted based on your needs.

#### Type Parameters

##### T

`T` *extends* `object`

#### Parameters

##### locations

`T`[]

An array of location objects, each containing `lat` and `lon` properties. Additional properties will be preserved in the output.

##### variable

`"DAILY MAXIMUM TEMPERATURE"` \| `"DAILY TOTAL PRECIPITATION"` \| `"DAILY TOTAL SNOWFALL"`

The type of weather record to retrieve. Must be one of:
  - `"DAILY MAXIMUM TEMPERATURE"`: Record high temperatures in Celsius
  - `"DAILY TOTAL PRECIPITATION"`: Record precipitation amounts in millimeters
  - `"DAILY TOTAL SNOWFALL"`: Record snowfall amounts in centimeters

##### dateRange

\[`` `${number}-${number}-${number}` ``, `` `${number}-${number}-${number}` ``\]

A tuple of two date strings in "YYYY-MM-DD" format representing the start and end dates (inclusive) for the record retrieval. Note: The year values are only used for iteration purposes to determine which calendar days to fetch records for - the actual records returned are historical all-time extremes regardless of the year specified.

##### options?

Configuration options for the data retrieval.

###### delay?

`number`

Delay in milliseconds between API requests. Defaults to 100ms. Increase this value if you encounter rate limiting.

###### verbose?

`boolean`

If `true`, logs detailed information about station selection and API requests. Useful for debugging and monitoring progress. Defaults to `false`.

#### Returns

`Promise`\<`T` & `object`[]\>

A Promise that resolves to an array of objects containing the weather records. Each object includes:
  - All original properties from the input location
  - `recordMonth`: The month (1-12) of the record
  - `recordDay`: The day of the month of the record
  - `recordVariable`: The weather variable that was requested
  - `recordValue`: The record value (temperature in °C, precipitation/snowfall in mm/cm)
  - `recordYear`: The year when the record was set
  - `previousRecordValue`: The previous record value before the current record
  - `previousRecordYear`: The year when the previous record was set
  - `recordStationName`: The name of the weather station where the record was measured
  - `recordStationId`: The unique identifier of the weather station
  - `recordStationLat`: The latitude of the weather station
  - `recordStationLon`: The longitude of the weather station
  - `recordStationDistance`: The distance in meters from your location to the weather station
  - `recordStationRecordBegin`: The date when record-keeping began at this station
  - `recordStationRecordEnd`: The date when record-keeping ended at this station (null if still active)

#### Examples

```ts
// Get record high temperatures for Toronto in July 2023
const torontoRecords = await getEnvironmentCanadaRecords(
  [{ lat: 43.6532, lon: -79.3832, city: "Toronto" }],
  "DAILY MAXIMUM TEMPERATURE",
  ["2023-07-01", "2023-07-31"]
);
console.table(torontoRecords);
// Returns daily record highs with station info and distances
```

```ts
// Get precipitation records for multiple cities with custom options
const cities = [
  { lat: 45.4215, lon: -75.6972, name: "Ottawa" },
  { lat: 43.6532, lon: -79.3832, name: "Toronto" },
  { lat: 45.5017, lon: -73.5673, name: "Montreal" }
];

const precipitationRecords = await getEnvironmentCanadaRecords(
  cities,
  "DAILY TOTAL PRECIPITATION",
  ["2023-06-01", "2023-08-31"],
  {
    delay: 200, // Slower requests to be extra respectful
    verbose: true // Log progress and station information
  }
);
console.table(precipitationRecords);
```

```ts
// Get snowfall records for winter months
const vancouverSnow = await getEnvironmentCanadaRecords(
  [{ lat: 49.2827, lon: -123.1207, region: "Vancouver" }],
  "DAILY TOTAL SNOWFALL",
  ["2023-12-01", "2024-02-29"]
);

// Filter for days with significant snowfall records
const significantSnow = vancouverSnow.filter(record => record.recordValue > 10);
console.table(significantSnow);
```

***

### getHumidex()

> **getHumidex**(`temperature`, `humidity`): `number`

Calculates the humidex factor in Celsius based on the given temperature in Celsius and humidity percentage.

If the calculated humidex is less than the provided temperature, the temperature itself is returned.

This calculation uses the formula provided by the Canadian Centre for Climate Services.

#### Parameters

##### temperature

`number`

The ambient temperature in Celsius.

##### humidity

`number`

The relative humidity as a percentage (0-100).

#### Returns

`number`

The calculated humidex value in Celsius, rounded to the nearest whole number. Returns the original temperature if the calculated humidex is lower.

#### Examples

```ts
// Calculate humidex for a warm and humid day.
const humidex = getHumidex(30, 70); // returns 41
console.log(`Humidex: ${humidex}`);
```

```ts
// In cases where the calculated humidex is less than the temperature, the temperature is returned.
const humidexLowHumidity = getHumidex(20, 30); // returns 20 (since calculated humidex would be lower)
console.log(`Humidex: ${humidexLowHumidity}`);
```

#### Throws

If the humidity value is not within the valid range of 0 to 100.

***

### getSeason()

> **getSeason**(`options?`): `"winter"` \| `"spring"` \| `"summer"` \| `"fall"`

Determines the current season based on a given date, hemisphere, and season type. This function provides flexibility by allowing you to specify the exact date, the hemisphere (Northern or Southern), and the method of season calculation (astronomical or meteorological). By default, it uses the current date, the Northern Hemisphere, and astronomical seasons.

Astronomical seasons are based on the Earth's position in its orbit around the sun, marked by equinoxes and solstices. Meteorological seasons are based on the annual temperature cycle and are typically defined by calendar months, making them consistent for statistical purposes.

#### Parameters

##### options?

An object containing options for determining the season.

###### date?

`Date`

Optional. The date for which to determine the season. Defaults to the current date if not provided.

###### hemisphere?

`"northern"` \| `"southern"`

Optional. The hemisphere for which to determine the season. Can be 'northern' or 'southern'. Defaults to 'northern'.

###### type?

`"meteorological"` \| `"astronomical"`

Optional. The type of season calculation to use. Can be 'meteorological' or 'astronomical'. Defaults to 'astronomical'.

#### Returns

`"winter"` \| `"spring"` \| `"summer"` \| `"fall"`

The name of the season ('winter', 'spring', 'summer', or 'fall').

#### Examples

```ts
// Get the current season in the northern hemisphere using astronomical seasons.
const season = getSeason();
console.log(season); // e.g., "summer" (if current date is July 7, 2025)
```

```ts
// Get the season for a specific date in the southern hemisphere using meteorological seasons.
const specificDate = new Date('2023-06-15');
const seasonSouthernMeteorological = getSeason({
  date: specificDate,
  hemisphere: 'southern',
  type: 'meteorological'
});
console.log(seasonSouthernMeteorological); // Output: "winter"
```

```ts
// Compare astronomical and meteorological seasons for a specific date in the Northern Hemisphere.
const march21 = new Date('2024-03-21');
const astronomicalSeason = getSeason({ date: march21, type: 'astronomical' });
console.log(`Astronomical season on March 21: ${astronomicalSeason}`); // Output: "spring"

const meteorologicalSeason = getSeason({ date: march21, type: 'meteorological' });
console.log(`Meteorological season on March 21: ${meteorologicalSeason}`); // Output: "spring"

const december1 = new Date('2024-12-01');
const astronomicalSeasonDec = getSeason({ date: december1, type: 'astronomical' });
console.log(`Astronomical season on December 1: ${astronomicalSeasonDec}`); // Output: "fall"

const meteorologicalSeasonDec = getSeason({ date: december1, type: 'meteorological' });
console.log(`Meteorological season on December 1: ${meteorologicalSeasonDec}`); // Output: "winter"
```
