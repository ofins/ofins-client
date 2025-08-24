// Named exports for better tree-shaking

// * CORE

export { test } from "./utils";
export { createAuth, Auth } from "./core/auth/auth";
export {
  type AuthInterface,
  type AuthOptions,
  type ListenerType,
} from "./core/auth/auth.type";

// * REACT
export { AuthProvider } from "./frameworks/react/auth/components/AuthProvider";
export { AuthGuard } from "./frameworks/react/auth/components/AuthGuard";
export { useLogin } from "./frameworks/react/auth/hooks/useLogin";
export { useAuth } from "./frameworks/react/auth/hooks/useAuth";
export { useAuthState } from "./frameworks/react/auth/hooks/useAuth/useAuthState";
export { useRegister } from "./frameworks/react/auth/hooks/useRegister";
