import { useLocation } from "@ofins/client/react";

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
  return (
    <div>
      <h2>Location</h2>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {location && (
        <ul>
          <li>Latitude: {location.latitude}</li>
          <li>Longitude: {location.longitude}</li>
          <li>Accuracy: {location.accuracy} meters</li>
          <li>From Cache: {isFromCache ? "Yes" : "No"}</li>
          <li>Permission State: {permissionState}</li>
        </ul>
      )}
    </div>
  );
};

export default Location;
