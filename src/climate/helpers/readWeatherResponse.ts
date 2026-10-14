// Validate the untrusted JSON fields consumed from Environment Canada's API.
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function readObject(value: unknown): Record<string, unknown> {
  if (!isObject(value)) throw new Error("Expected an Environment Canada object.");
  return value;
}

export function readArray(value: unknown): unknown[] {
  if (!Array.isArray(value)) throw new Error("Expected an Environment Canada array.");
  return value;
}

export function readNumber(value: unknown): number {
  if (typeof value !== "number") throw new Error("Expected an Environment Canada number.");
  return value;
}

export function readString(value: unknown): string {
  if (typeof value !== "string") throw new Error("Expected an Environment Canada string.");
  return value;
}

export function readNullableString(value: unknown): string | null {
  return value === null ? null : readString(value);
}
