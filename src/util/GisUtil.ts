export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface BoundingBox {
  pivot: Coordinates;
  radius: number;
  min: Coordinates;
  max: Coordinates;
}

export default class GisUtil {
  // Earth's mean radius in metres
  public static readonly EARTH_RADIUS: number = 6371e3;

  public static toCoordinates(latitude: number | string, longitude: number | string): Coordinates {
    // eslint-disable-next-line no-param-reassign
    if (typeof latitude === 'string') latitude = Number.parseFloat(latitude);
    // eslint-disable-next-line no-param-reassign
    if (typeof longitude === 'string') longitude = Number.parseFloat(longitude);

    return { latitude, longitude };
  }

  public static calculateBoundingBox(
    coordinates: Coordinates,
    radius: number | string
  ): BoundingBox {
    // eslint-disable-next-line no-param-reassign
    if (typeof radius === 'string') radius = Number.parseInt(radius, 10);

    return {
      pivot: coordinates,
      radius,
      min: {
        latitude: coordinates.latitude - ((radius / this.EARTH_RADIUS) * 180) / Math.PI,
        longitude:
          coordinates.longitude -
          ((radius / this.EARTH_RADIUS) * 180) /
            Math.PI /
            Math.cos((coordinates.latitude * Math.PI) / 180),
      },
      max: {
        latitude: coordinates.latitude + ((radius / this.EARTH_RADIUS) * 180) / Math.PI,
        longitude:
          coordinates.longitude +
          ((radius / this.EARTH_RADIUS) * 180) /
            Math.PI /
            Math.cos((coordinates.latitude * Math.PI) / 180),
      },
    };
  }

  /**
   * @see https://www.movable-type.co.uk/scripts/latlong-db.html
   */
  public static distance(start: Coordinates, end: Coordinates): number {
    return (
      Math.acos(
        Math.sin((end.latitude * Math.PI) / 180) * Math.sin((start.latitude * Math.PI) / 180) +
          Math.cos((end.latitude * Math.PI) / 180) *
            Math.cos((start.latitude * Math.PI) / 180) *
            Math.cos((end.longitude * Math.PI) / 180 - (start.longitude * Math.PI) / 180)
      ) * this.EARTH_RADIUS
    );
  }
}
