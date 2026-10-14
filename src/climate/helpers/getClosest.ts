import distance from "./distance.ts";

/**
 * Returns the item geographically closest to the provided coordinates.
 */
export default function getClosest<T>(
  lon: number,
  lat: number,
  items: T[],
  getItemLon: (item: T) => number,
  getItemLat: (item: T) => number,
  options: {
    addDistance: true;
    decimals?: number;
  },
): T & { distance: number };
export default function getClosest<T>(
  lon: number,
  lat: number,
  items: T[],
  getItemLon: (item: T) => number,
  getItemLat: (item: T) => number,
  options?: {
    addDistance?: false;
    decimals?: number;
  },
): T;
export default function getClosest<T>(
  lon: number,
  lat: number,
  items: T[],
  getItemLon: (item: T) => number,
  getItemLat: (item: T) => number,
  options: {
    addDistance?: boolean;
    decimals?: number;
  } = {},
): T | (T & { distance: number }) {
  let closestIndex = -1;
  let closestDistance = Infinity;

  for (let index = 0; index < items.length; index++) {
    const item = items[index];
    const itemDistance = distance(lon, lat, getItemLon(item), getItemLat(item), {
      decimals: options.decimals,
    });

    if (itemDistance < closestDistance) {
      closestIndex = index;
      closestDistance = itemDistance;
    }
  }

  const closest = items[closestIndex];
  if (!options.addDistance) {
    return closest;
  }
  if (typeof closest !== "object" || closest === null) {
    throw new Error("Cannot add distance property to non-object item");
  }

  return { ...closest, distance: closestDistance };
}
