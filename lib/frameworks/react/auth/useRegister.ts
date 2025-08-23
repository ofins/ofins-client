import { useState, useCallback } from "react";
import { useAuth } from "./useAuth";

export interface RegisterCredentials {
  email: string;
  username?: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

export interface RegisterResponse {
  token: string;
  user?: any;
  expiresIn?: number;
}

export interface UseRegisterOptions {
  /**
   * Custom register function that handles the registration API call
   */
  onRegister?: (
    credentials: RegisterCredentials
  ) => Promise<string | RegisterResponse>;

  /**
   * Custom validation function for credentials
   */
  validate?: (
    credentials: RegisterCredentials
  ) => Record<string, string> | null;

  /**
   * Called after successful registration
   */
  onSuccess?: (response: RegisterResponse | string) => void;

  /**
   * Called when registration fails
   */
  onError?: (error: Error) => void;

  /**
   * Auto-clear form after successful registration
   */
  clearOnSuccess?: boolean;

  /**
   * Whether to auto-login after successful registration
   */
  autoLogin?: boolean;

  /**
   * Initial form values
   */
  initialValues?: Partial<RegisterCredentials>;
}

export interface UseRegisterReturn {
  // Form state
  credentials: RegisterCredentials;
  setCredentials: (credentials: Partial<RegisterCredentials>) => void;
  setEmail: (email: string) => void;
  setUsername: (username: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  setFirstName: (firstName: string) => void;
  setLastName: (lastName: string) => void;

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
  credentials: RegisterCredentials
): Record<string, string> | null => {
  const errors: Record<string, string> = {};

  if (!credentials.email) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(credentials.email)) {
    errors.email = "Email is invalid";
  }

  if (!credentials.password) {
    errors.password = "Password is required";
  } else if (credentials.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (!credentials.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (credentials.password !== credentials.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return Object.keys(errors).length > 0 ? errors : null;
};

/**
 * A comprehensive React hook for handling user registration
 *
 * @example
 * ```tsx
 * const registerHook = useRegister({
 *   onRegister: async (credentials) => {
 *     const response = await fetch('/api/register', {
 *       method: 'POST',
 *       body: JSON.stringify(credentials)
 *     });
 *     const data = await response.json();
 *     return data.token;
 *   },
 *   onSuccess: () => {
 *     navigate('/welcome');
 *   }
 * });
 * ```
 */
export const useRegister = (
  options: UseRegisterOptions = {}
): UseRegisterReturn => {
  const {
    onRegister,
    validate = defaultValidate,
    onSuccess,
    onError,
    clearOnSuccess = true,
    autoLogin = true,
    initialValues = {},
  } = options;

  const { login: authLogin, isLoggedIn } = useAuth();

  const [credentials, setCredentialsState] = useState<RegisterCredentials>({
    email: initialValues.email || "",
    username: initialValues.username || "",
    password: initialValues.password || "",
    confirmPassword: initialValues.confirmPassword || "",
    firstName: initialValues.firstName || "",
    lastName: initialValues.lastName || "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setCredentials = useCallback(
    (newCredentials: Partial<RegisterCredentials>) => {
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
    [credentials]
  );

  const setEmail = useCallback(
    (email: string) => {
      setCredentials({ email });
    },
    [setCredentials]
  );

  const setUsername = useCallback(
    (username: string) => {
      setCredentials({ username });
    },
    [setCredentials]
  );

  const setPassword = useCallback(
    (password: string) => {
      setCredentials({ password });
    },
    [setCredentials]
  );

  const setConfirmPassword = useCallback(
    (confirmPassword: string) => {
      setCredentials({ confirmPassword });
    },
    [setCredentials]
  );

  const setFirstName = useCallback(
    (firstName: string) => {
      setCredentials({ firstName });
    },
    [setCredentials]
  );

  const setLastName = useCallback(
    (lastName: string) => {
      setCredentials({ lastName });
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
      username: initialValues.username || "",
      password: initialValues.password || "",
      confirmPassword: initialValues.confirmPassword || "",
      firstName: initialValues.firstName || "",
      lastName: initialValues.lastName || "",
    });
    setErrors({});
    setIsLoading(false);
  }, [initialValues]);

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();

      if (!validateCredentials()) {
        return;
      }

      setIsLoading(true);
      setErrors({});

      try {
        let token: string;

        if (onRegister) {
          const result = await onRegister(credentials);
          if (typeof result === "string") {
            token = result;
          } else {
            token = result.token;
            onSuccess?.(result);
          }
        } else {
          throw new Error("No register handler provided");
        }

        // Auto-login after successful registration
        if (autoLogin) {
          authLogin(token);
        }

        if (
          typeof onRegister === "undefined" ||
          typeof (await onRegister(credentials)) === "string"
        ) {
          onSuccess?.(token);
        }

        if (clearOnSuccess) {
          reset();
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Registration failed";
        setErrors({ general: errorMessage });
        onError?.(error instanceof Error ? error : new Error(errorMessage));
      } finally {
        setIsLoading(false);
      }
    },
    [
      credentials,
      validateCredentials,
      onRegister,
      authLogin,
      autoLogin,
      onSuccess,
      onError,
      clearOnSuccess,
      reset,
    ]
  );

  const isValid =
    Object.keys(errors).length === 0 &&
    credentials.email.length > 0 &&
    credentials.password.length > 0 &&
    credentials.confirmPassword.length > 0;

  return {
    // Form state
    credentials,
    setCredentials,
    setEmail,
    setUsername,
    setPassword,
    setConfirmPassword,
    setFirstName,
    setLastName,

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
