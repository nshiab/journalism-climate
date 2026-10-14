import { deepStrictEqual as assertEquals } from "node:assert/strict";
import { test } from "vite-plus/test";
import distance from "../../../src/climate/helpers/distance.ts";

test("distance calculates and rounds Haversine distances", () => {
  assertEquals(distance(-73.65, 45.52, -73.65, 45.52), 0);
  assertEquals(distance(-73.5673, 45.5017, -79.3832, 43.6532, { decimals: 2 }), 504.26);
});
