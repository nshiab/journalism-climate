import {
  deepStrictEqual as assertEquals,
  notStrictEqual as assertNotStrictEquals,
} from "node:assert/strict";
import { test } from "vite-plus/test";
import getClosest from "../../../src/climate/helpers/getClosest.ts";

test("getClosest returns a copy of the closest item with its distance", () => {
  const stations = [
    { id: "montreal", lon: -73.5673, lat: 45.5017 },
    { id: "toronto", lon: -79.3832, lat: 43.6532 },
  ];

  const closest = getClosest(
    -75.6972,
    45.4215,
    stations,
    (station) => station.lon,
    (station) => station.lat,
    { addDistance: true, decimals: 0 },
  );

  assertEquals(closest, {
    id: "montreal",
    lon: -73.5673,
    lat: 45.5017,
    distance: 166,
  });
  assertNotStrictEquals(closest, stations[0]);
});
