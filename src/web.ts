/**
 * @module
 *
 * The Journalism library (climate functions) - Web entry point
 *
 * To install the library with Deno, use:
 * ```bash
 * deno add jsr:@nshiab/journalism-climate
 * ```
 *
 * To install the library with Node.js, use:
 * ```bash
 * npm i @nshiab/journalism-climate
 * ```
 *
 * To import a function, use:
 * ```ts
 * import { functionName } from "@nshiab/journalism-climate";
 * ```
 *
 * To import a function from the Web entry point, use:
 * ```ts
 * import { functionName } from "@nshiab/journalism-climate/web";
 * ```
 */

import getHumidex from "./climate/getHumidex.ts";
import getSeason from "./climate/getSeason.ts";

export { getHumidex, getSeason };
