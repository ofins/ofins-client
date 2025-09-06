import { useEffect, useRef, useState } from "react";
import { ILocation, LocationOptions } from "../../../../../core";
import { Location } from "../../../../../core/location";

interface UseLocationOptions extends LocationOptions {
  /**
   * Automatically fetch locations on mount
   * @default true
   */
  autoFetch?: boolean;
  /**
   * Watch for location changes
   * @default false
   */
  watch?: boolean;
  watchInterval?: number;
  onSuccess?: (location: ILocation) => void;
  onError?: (error: Error) => void;
  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

interface LocationState {
  location: ILocation | null;
  loading: boolean;
  error: Error | null;
  isFromCache: boolean;
  lastFetchTime: number | null;
  isSupported: boolean;
  permissionState: PermissionState | null;
}

export const useLocation = (options: UseLocationOptions = {}) => {
  const {
    autoFetch = true,
    watch = false,
    watchInterval = 5000,
    onSuccess,
    onError,
    debug = false,
    ...locationOptions
  } = options;

  const log = (...args: any[]) => {
    if (debug) {
      console.log("[useLocation]", ...args);
    }
  };

  const locationInstance = useRef<Location | null>(null);

  const [state, setState] = useState<LocationState>({
    location: null,
    loading: false,
    error: null,
    isFromCache: false,
    lastFetchTime: null,
    isSupported: typeof navigator !== "undefined" && "geolocation" in navigator,
    permissionState: null,
  });

  // initialize location instance
  useEffect(() => {
    locationInstance.current = new Location(locationOptions);
  }, []);

  const getLocation = async () => {
    if (!locationInstance.current || !state.isSupported) {
      const error = new Error("Geolocation is not supported.");
      setState((prev) => ({ ...prev, error }));
      onError?.(error);
      return;
    }

    log("Fetching location...");
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // get cached first
      const cached = locationInstance.current.getCached();
      if (cached) {
        setState((prev) => ({
          ...prev,
          location: cached,
          loading: true,
          isFromCache: true,
        }));
      }

      log("Pulling fresh location data...");
      const location = await locationInstance.current.pull();
      log("Fresh location data received:", location);
      setState((prev) => ({
        ...prev,
        location,
        loading: false,
        error: null,
        isFromCache: false,
        lastFetchTime: Date.now(),
      }));

      onSuccess?.(location);
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Failed to get location");
      log("Location fetch error", err);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err,
      }));
      onError?.(err);
    }
  };

  const refresh = async () => {
    if (!locationInstance.current || !state.isSupported) {
      const error = new Error("Geolocation is not supported.");
      setState((prev) => ({ ...prev, error }));
      onError?.(error);
      return;
    }

    log("Refreshing location (bypassing cache)...");
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const location = await locationInstance.current.refresh();

      log("Location refreshed:", location);
      setState((prev) => ({
        ...prev,
        location,
        loading: false,
        error: null,
        isFromCache: false,
        lastFetchTime: Date.now(),
      }));
      onSuccess?.(location);
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Failed to get location");
      log("Location fetching failed");
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err,
      }));
      onError?.(err);
    }
  };

  const clearCache = () => {
    if (locationInstance.current) {
      log("clearing cache...");
      locationInstance.current.clearCache();
      setState((prev) => ({
        ...prev,
        location: null,
        isFromCache: false,
        lastFetchTime: null,
      }));
    }
  };

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      log("Auto-fetching location...");
      getLocation();
    }
  }, [autoFetch]);

  return {
    ...state,
    getLocation,
    refresh,
    clearCache,
  };
};
