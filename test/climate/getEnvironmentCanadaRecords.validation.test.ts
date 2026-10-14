import { afterEach, expect, test, vi } from "vite-plus/test";
import getEnvironmentCanadaRecords from "../../src/climate/getEnvironmentCanadaRecords.ts";

const station = {
  properties: {
    ELEMENT_NAME_E: "DAILY MAXIMUM TEMPERATURE",
    VIRTUAL_CLIMATE_ID: "VSQC147",
    VIRTUAL_STATION_NAME_E: "MONTRÉAL AREA",
  },
  geometry: { coordinates: [-73.65, 45.52] },
};
const record = {
  properties: {
    RECORD_HIGH_MAX_TEMP: 36.1,
    RECORD_HIGH_MAX_TEMP_YR: 1931,
    PREV_RECORD_HIGH_MAX_TEMP: 33.9,
    PREV_RECORD_HIGH_MAX_TEMP_YR: 1913,
    MAX_TEMP_RECORD_BEGIN: "1871-07-01T00:00:00Z",
    MAX_TEMP_RECORD_END: null,
    VIRTUAL_STATION_NAME_E: "MONTRÉAL AREA",
    VIRTUAL_CLIMATE_ID: "VSQC147",
  },
};

function fetchRecords() {
  return getEnvironmentCanadaRecords(
    [{ lat: 45.52, lon: -73.65, name: "Montreal" }],
    "DAILY MAXIMUM TEMPERATURE",
    ["2023-07-01", "2023-07-01"],
    { delay: 0 },
  );
}

afterEach(() => vi.unstubAllGlobals());

test("ignores unused station fields for other weather variables", async () => {
  const fetch = vi
    .fn<typeof globalThis.fetch>()
    .mockResolvedValueOnce(
      Response.json({
        features: [{ properties: { ELEMENT_NAME_E: "DAILY TOTAL SNOWFALL" } }, station],
      }),
    )
    .mockResolvedValueOnce(Response.json(record));
  vi.stubGlobal("fetch", fetch);

  const records = await fetchRecords();
  expect(records).toHaveLength(1);
  expect(records[0]).toMatchObject({
    name: "Montreal",
    recordValue: 36.1,
    recordStationRecordEnd: null,
  });
  expect(fetch).toHaveBeenNthCalledWith(
    2,
    "https://api.weather.gc.ca/collections/ltce-temperature/items/VSQC147-7-1?f=json",
  );
});

test("rejects malformed station coordinates from the API", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        Response.json({ features: [{ ...station, geometry: { coordinates: ["-73.65", 45.52] } }] }),
      ),
  );
  await expect(fetchRecords()).rejects.toThrow("Expected an Environment Canada number.");
});

test("rejects malformed record values from the API", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(Response.json({ features: [station] }))
      .mockResolvedValueOnce(
        Response.json({ properties: { ...record.properties, RECORD_HIGH_MAX_TEMP: "36.1" } }),
      ),
  );
  await expect(fetchRecords()).rejects.toThrow("Expected an Environment Canada number.");
});
