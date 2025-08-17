import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user?: any;
  expiresIn?: number;
}

export interface UseLoginOptions {
  /**
   * Custom login function that handles the authentication API call
   * Should return a token or LoginResponse object
   */
  onLogin?: (credentials: LoginCredentials) => Promise<string | LoginResponse>;

  /**
   * Custom validation function for credentials
   */
  validate?: (credentials: LoginCredentials) => Record<string, string> | null;

  /**
   * Called after successful login
   */
  onSuccess?: (response: LoginResponse | string) => void;

  /**
   * Called when login fails
   */
  onError?: (error: Error) => void;

  /**
   * Auto-clear form after successful login
   */
  clearOnSuccess?: boolean;

  /**
   * Initial form values
   */
  initialValues?: Partial<LoginCredentials>;
}

export interface UseLoginReturn {
  // Form state
  credentials: LoginCredentials;
  setCredentials: (credentials: Partial<LoginCredentials>) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;

  // Form actions
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  reset: () => void;

  // Status
  isLoading: boolean;
  isValid: boolean;
  errors: Record<string, string>;

  // Auth state
  isLoggedIn: boolean;

  // Utility methods
  validateCredentials: () => boolean;
  clearErrors: () => void;
}

const defaultValidate = (
  credentials: LoginCredentials
): Record<string, string> | null => {
  const errors: Record<string, string> = {};

  if (!credentials.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
    errors.email = "Email is invalid";
  }

  if (!credentials.password) {
    errors.password = "Password is required";
  } else if (credentials.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

/**
 * A comprehensive React hook for handling login functionality
 *
 * @example
 * ```tsx
 * const loginHook = useLogin({
 *   onLogin: async ({ email, password }) => {
 *     const response = await fetch('/api/login', {
 *       method: 'POST',
 *       body: JSON.stringify({ email, password })
 *     });
 *     const data = await response.json();
 *     return data.token;
 *   },
 *   onSuccess: () => {
 *     navigate('/dashboard');
 *   }
 * });
 *
 * return (
 *   <form onSubmit={loginHook.handleSubmit}>
 *     <input
 *       type="email"
 *       value={loginHook.credentials.email}
 *       onChange={(e) => loginHook.setEmail(e.target.value)}
 *     />
 *     {loginHook.errors.email && <span>{loginHook.errors.email}</span>}
 *
 *     <input
 *       type="password"
 *       value={loginHook.credentials.password}
 *       onChange={(e) => loginHook.setPassword(e.target.value)}
 *     />
 *     {loginHook.errors.password && <span>{loginHook.errors.password}</span>}
 *
 *     <button type="submit" disabled={!loginHook.isValid || loginHook.isLoading}>
 *       {loginHook.isLoading ? 'Logging in...' : 'Login'}
 *     </button>
 *   </form>
 * );
 * ```
 */
export const useLogin = (options: UseLoginOptions = {}): UseLoginReturn => {
  const {
    onLogin,
    validate = defaultValidate,
    onSuccess,
    onError,
    clearOnSuccess = true,
    initialValues = {},
  } = options;

  const { login: authLogin, isLoggedIn } = useAuth();

  const [credentials, setCredentialsState] = useState<LoginCredentials>({
    email: initialValues.email || "",
    password: initialValues.password || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setCredentials = useCallback(
    (newCredentials: Partial<LoginCredentials>) => {
      setCredentialsState((prev) => ({ ...prev, ...newCredentials }));
      // Clear related errors when user types
      setErrors((prev) => {
        const newErrors = { ...prev };
        Object.keys(newCredentials).forEach((key) => {
          delete newErrors[key];
        });
        return newErrors;
      });
    },
    []
  );

  const setEmail = useCallback(
    (email: string) => {
      setCredentials({ email });
    },
    [setCredentials]
  );

  const setPassword = useCallback(
    (password: string) => {
      setCredentials({ password });
    },
    [setCredentials]
  );

  const validateCredentials = useCallback((): boolean => {
    const validationErrors = validate(credentials);
    if (validationErrors) {
      setErrors(validationErrors);
      return false;
    }
    setErrors({});
    return true;
  }, [credentials, validate]);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const reset = useCallback(() => {
    setCredentialsState({
      email: initialValues.email || "",
      password: initialValues.password || "",
    });
    setErrors({});
    setIsLoading(false);
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      console.log("Form submitted");
      console.log(e);
      e?.preventDefault();

      if (!validateCredentials()) {
        return;
      }

      setIsLoading(true);
      setErrors({});

      try {
        let token: string;

        if (onLogin) {
          // Use custom login function
          const result = await onLogin(credentials);
          if (typeof result === "string") {
            token = result;
          } else {
            token = result.token;
            onSuccess?.(result);
          }
        } else {
          // This would be a default implementation - you might want to throw an error instead
          throw new Error("No login handler provided");
        }

        // Use the auth system to store the token
        authLogin(token);

        if (
          typeof onLogin === "undefined" ||
          typeof (await onLogin(credentials)) === "string"
        ) {
          onSuccess?.(token);
        }

        if (clearOnSuccess) {
          reset();
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Login failed";
        setErrors({ general: errorMessage });
        onError?.(error instanceof Error ? error : new Error(errorMessage));
      } finally {
        setIsLoading(false);
      }
    },
    [
      credentials,
      validateCredentials,
      onLogin,
      authLogin,
      onSuccess,
      onError,
      clearOnSuccess,
      reset,
    ]
  );

  const isValid =
    Object.keys(errors).length === 0 &&
    credentials.email.length > 0 &&
    credentials.password.length > 0;

  return {
    // Form state
    credentials,
    setCredentials,
    setEmail,
    setPassword,

    // Form actions
    handleSubmit,
    reset,

    // Status
    isLoading,
    isValid,
    errors,

    // Auth state
    isLoggedIn,

    // Utility methods
    validateCredentials,
    clearErrors,
  };
};
