// * CORE EXPORTS
export { createAuth, Auth } from "./core/auth";
export {
  type AuthInterface,
  type AuthOptions,
  type ListenerType,
} from "./core/auth/auth.type";

// * UTILS EXPORTS
export {
  sleep,
  toggleFullScreen,
  debounce,
  throttle,
} from "./core/utils/common";

export {
  isMobileDevice,
  isDesktop,
  isLandscape,
  isSafari,
  isIOS,
  isLocalhost,
} from "./core/utils/device";

export { calculateDistance } from "./core/utils/location";
