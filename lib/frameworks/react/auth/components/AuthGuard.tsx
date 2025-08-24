import React, { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

/**
 * Component that conditionally renders children based on auth state
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  fallback = null,
  redirectTo,
  requireAuth = true,
}) => {
  const { isLoggedIn, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return fallback || <div>Loading...</div>;
  }

  // Handle redirect
  if (redirectTo && requireAuth && !isLoggedIn) {
    if (typeof window !== "undefined") {
      window.location.href = redirectTo;
    }
    return fallback || <div>Redirecting...</div>;
  }

  // Render based on auth requirement
  if (requireAuth && !isLoggedIn) {
    return <>{fallback}</>;
  }

  if (!requireAuth && isLoggedIn) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
