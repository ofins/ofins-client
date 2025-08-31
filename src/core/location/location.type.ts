export interface LocationOptions {
  locationKey?: string;
  maxCacheDuration?: number;
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export type CachedLocation = {
  timestamp: number;
  location: ILocation;
};

export interface ILocation {
  longitude: number;
  latitude: number;
  accuracy?: number;
}
