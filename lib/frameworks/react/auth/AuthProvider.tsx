import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Auth } from "../../../core/auth/auth";
import {
  AuthOptions,
  AuthInterface,
  ListenerType,
} from "../../../core/auth/auth.type";

interface AuthContextType {
  auth: AuthInterface;
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
  authOptions?: AuthOptions;
  authInstance?: AuthInterface;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
  authOptions = {},
  authInstance,
}) => {
  // Use provided instance or create new one
  const [auth] = useState<AuthInterface>(
    () => authInstance || new Auth(authOptions)
  );

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(auth.getAuthState());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = auth.subscribe((newAuthState: boolean) => {
      setIsLoggedIn(newAuthState);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [auth]);

  const login = (token: string) => {
    setIsLoading(true);
    auth.login(token);
  };

  const logout = () => {
    setIsLoading(true);
    auth.logout();
  };

  const contextValue: AuthContextType = {
    auth,
    isLoggedIn,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
