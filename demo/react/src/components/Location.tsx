import { useLocation } from "@ofins/client/react";

// getLocation
// refresh
// clearCache
// startWatching
// stopWatching
/*
function LocationExample() {
  const {
    location,
    loading,
    error,
    isFromCache,
    permissionState,
    getLocation,
    refresh,
    clearCache,
  } = useLocation({
    autoFetch: true,
    enableHighAccuracy: true,
    maxCacheDuration: 300_000, // 5 minutes
    onSuccess: (loc) => console.log('Got location!', loc),
    onError: (err) => console.error('Location error:', err),
    debug: true,
  });
*/

const Location = () => {
  const {
    location,
    loading,
    error,
    isFromCache,
    permissionState,
    // getLocation,
    // refresh,
    // clearCache,
  } = useLocation({
    autoFetch: true,
    enableHighAccuracy: true,
    maxCacheDuration: 300_000, // 5 minutes
    onSuccess: (loc) => console.log("Got location!", loc),
    onError: (err) => console.error("Location error:", err),
    debug: true,
  });

  console.log({
    location,
    loading,
    error,
    isFromCache,
    permissionState,
  });
  return <div>Location</div>;
};

export default Location;
