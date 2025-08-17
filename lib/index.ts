// Named exports for better tree-shaking
export { test } from "./utils";
export { createAuth, Auth } from "./core/auth";
export {
  AuthInterface,
  AuthOptions,
  ListenerType,
} from "./core/auth/auth.type";

// React components and hooks
export * from "./frameworks/react/auth";
