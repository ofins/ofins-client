import { useAuthContext } from './AuthProvider';

/**
 * Hook to access auth functionality
 * Returns auth methods and state from the AuthProvider context
 */
export const useAuth = () => {
  const { auth, isLoggedIn, login, logout, isLoading } = useAuthContext();
  
  return {
    // State
    isLoggedIn,
    isLoading,
    
    // Methods
    login,
    logout,
    
    // Direct access to auth instance if needed
    auth,
  };
};
