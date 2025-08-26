export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

export const isDesktop = () => {
  !isMobileDevice();
};

export const isLandscape = () =>
  window.matchMedia("(orientation: landscape)").matches;

export const isSafari = () => {
  const ua = navigator.userAgent;
  const iOS = !!/iP(ad|od|hone)/i.exec(ua);
  const hasSafariInUa = !!/Safari/i.exec(ua);
  const noOtherBrowsersInUa = !/Chrome|CriOS|OPiOS|mercury|FxiOS|Firefox/i.exec(
    ua
  );
  let result = false;
  if (iOS) {
    //detecting Safari in IOS mobile browsers
    const webkit = !!/WebKit/i.exec(ua);
    result = webkit && hasSafariInUa && noOtherBrowsersInUa;
  } else if ("safari" in window) {
    //detecting Safari in Desktop Browsers
    result = true;
  } else {
    // detecting Safari in other platforms
    result = hasSafariInUa && noOtherBrowsersInUa;
  }
  return result;
};

export const isIOS = () => {
  const ua = navigator.userAgent;
  return !!/iPad/i.exec(ua) || !!/iPhone/i.exec(ua);
};

export const isLocalhost = () => {
  const { hostname } = window.location;
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" || // IPv6 localhost
    hostname.startsWith("192.168.") || // Local network
    hostname.startsWith("10.") || // Local network
    hostname.startsWith("172.") || // Local network
    hostname.endsWith(".local") || // mDNS
    hostname.endsWith(".localhost") // localhost subdomains
  );
};
