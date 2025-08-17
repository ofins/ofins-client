import { useEffect, useState } from "react";
import { AuthInterface } from "../../../core/auth/auth.type";

/**
 * Hook to subscribe to auth state changes without requiring AuthProvider
 * Useful for components that need auth state but aren't wrapped in AuthProvider
 */
export const useAuthState = (authInstance: AuthInterface) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(
    authInstance.getAuthState()
  );

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authInstance.subscribe((newAuthState: boolean) => {
      setIsLoggedIn(newAuthState);
    });

    return () => {
      unsubscribe();
    };
  }, [authInstance]);

  return {
    isLoggedIn,
    login: (token: string) => authInstance.login(token),
    logout: () => authInstance.logout(),
  };
};
