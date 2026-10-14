/**
 * Calculates the Haversine distance between two coordinates in kilometres.
 */
export default function distance(
  lon1: number,
  lat1: number,
  lon2: number,
  lat2: number,
  options: { decimals?: number } = {},
): number {
  const longitudeDifference = toRadians(lon2 - lon1);
  const latitudeDifference = toRadians(lat2 - lat1);
  const latitude1 = toRadians(lat1);
  const latitude2 = toRadians(lat2);

  const haversine =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.sin(longitudeDifference / 2) ** 2 * Math.cos(latitude1) * Math.cos(latitude2);
  const angularDistance = 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
  const distanceInKilometres = angularDistance * 6371.0088;

  return typeof options.decimals === "number"
    ? Number(distanceInKilometres.toFixed(options.decimals))
    : distanceInKilometres;
}

function toRadians(coordinate: number): number {
  return (coordinate * Math.PI) / 180;
}
