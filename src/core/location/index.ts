import { ILocation, LocationOptions, CachedLocation } from "./location.type";

const DEFAULT_MAX_CACHE_DURATION = 600_000;
const DEFAULT_TIMEOUT = 10_000;

export class Location {
  private LOCATION_KEY: string;
  private readonly maxCacheDuration: number;
  private readonly geoLocationOptions: PositionOptions;
  private fetchPromise: Promise<ILocation> | null = null;

  constructor({
    locationKey = "cache_location",
    maxCacheDuration = DEFAULT_MAX_CACHE_DURATION,
    enableHighAccuracy = false,
    timeout = DEFAULT_TIMEOUT,
    maximumAge = 0,
  }: LocationOptions = {}) {
    this.LOCATION_KEY = locationKey;
    this.maxCacheDuration = maxCacheDuration;
    this.geoLocationOptions = {
      enableHighAccuracy,
      timeout,
      maximumAge,
    };
  }

  /**
   * Get location from cache or fetch new one if cache is expired
   */
  async pull(): Promise<ILocation> {
    if (!this.isGeolocationSupported()) {
      throw new Error("Geolocation is not supported by this browser.");
    }

    if (this.fetchPromise) {
      return this.fetchPromise;
    }

    const cached = this.getCached();
    if (cached) {
      return cached;
    }

    // Fetch new location
    this.fetchPromise = this.set();

    try {
      const location = await this.fetchPromise;
      return location;
    } finally {
      this.fetchPromise = null;
    }
  }

  /**
   * Force fetch a new location and update cache
   */
  async refresh(): Promise<ILocation> {
    if (!this.isGeolocationSupported()) {
      throw new Error("Geolocation is not supported by this browser");
    }
    this.clearCache();
    return this.set();
  }

  getCached(): ILocation | null {
    const cached = this.getFromCache();
    return cached && this.isCacheValid(cached) ? cached.location : null;
  }

  clearCache(): void {
    try {
      localStorage.removeItem(this.LOCATION_KEY);
    } catch (error) {
      console.warn("Failed to clear location cache:", error);
    }
  }

  isGeolocationSupported(): boolean {
    return "geolocation" in navigator;
  }

  isLocalStorageSupported(): boolean {
    try {
      const test = "__localStorage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      return false;
    }
  }

  private isCacheValid(cached: CachedLocation): boolean {
    const now = Date.now();
    return now - cached.timestamp <= this.maxCacheDuration;
  }

  /**
   * Fetch and cache the current location
   */
  private async set(): Promise<ILocation> {
    try {
      const location = await this.getGeolocation();

      if (this.isLocalStorageSupported()) {
        try {
          const cacheData = {
            location,
            timestamp: Date.now(),
          };

          localStorage.setItem(this.LOCATION_KEY, JSON.stringify(cacheData));
        } catch (error) {
          console.warn("Failed to cache location:", error);
        }
      }

      return location;
    } catch (error) {
      throw new Error(
        `Failed to get location: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  private async getGeolocation(): Promise<ILocation> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          });
        },
        (error) => {
          let errorMessage: string;

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = "Location permission denied";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = "Location information unavailable";
              break;
            case error.TIMEOUT:
              errorMessage = "Location request timed out";
              break;
            default:
              errorMessage = "Unknown location error";
          }

          reject(new Error(errorMessage));
        },
        this.geoLocationOptions
      );
    });
  }

  private getFromCache(): CachedLocation | null {
    if (!this.isLocalStorageSupported()) {
      return null;
    }

    try {
      const store = localStorage.getItem(this.LOCATION_KEY);
      if (!store) return null;

      const cached = JSON.parse(store);

      if (
        typeof cached.timestamp !== "number" ||
        typeof cached.location?.latitude !== "number" ||
        typeof cached.location?.longitude !== "number"
      ) {
        this.clearCache();
        return null;
      }

      return cached;
    } catch (error) {
      console.warn(`Failed to parse cached location:`, error);
      this.clearCache();
      return null;
    }
  }
}
