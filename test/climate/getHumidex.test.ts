import { deepStrictEqual as assertEquals, throws as assertThrows } from "node:assert/strict";
import { test } from "vite-plus/test";
import getHumidex from "../../src/climate/getHumidex.ts";

test("should return the humidex (35) given temperature (27 C) and humidity (70%)", () => {
  const humidex = getHumidex(27, 70);
  assertEquals(humidex, 35);
});
test("should return the humidex (41) given temperature (30 C) and humidity (70%)", () => {
  const humidex = getHumidex(30, 70);
  assertEquals(humidex, 41);
});
test("should return the humidex (29) given temperature (21 C) and humidity (100%)", () => {
  const humidex = getHumidex(21, 100);
  assertEquals(humidex, 29);
});
test("should return the humidex (59) given temperature (35 C) and humidity (95%)", () => {
  const humidex = getHumidex(35, 95);
  assertEquals(humidex, 59);
});
test("should return the temperature (21 C) (with humidity (20%)) if humidex is less than the temperature", () => {
  const humidex = getHumidex(21, 20);
  assertEquals(humidex, 21);
});
test("should return the temperature (20 C) (with humidity (30%)) if humidex is less than the temperature", () => {
  const humidex = getHumidex(20, 30);
  assertEquals(humidex, 20);
});
test("should throw error when humidex is not between 0 and 100", () => {
  assertThrows(() => getHumidex(30, 105));
});
