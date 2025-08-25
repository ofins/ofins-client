import {
  CredentialResponse,
  GoogleLogin as OriginalGoogleLogin,
} from "@react-oauth/google";
import { useAuth } from "../hooks/useAuth";

type LoginResponse = {
  token: string;
};

interface Props<T = LoginResponse> {
  endpoint?: string;
  originalProps?: Omit<
    React.ComponentProps<typeof OriginalGoogleLogin>,
    "onSuccess" | "onError"
  >;
  disabled?: boolean;
  onSuccess?: (credential: CredentialResponse) => void;
  onLogin?: (data: T) => void;
  onError?: (error: Error) => void;
}

const DEFAULT_GOOGLE_AUTH_ENDPOINT = "/api/auth/google";

/**
 * Google Login component
 * @param endpoint - The backend endpoint to handle Google OAuth token exchange. Default is '/api/auth/google'.
 * @param onLogin - Callback function to handle login.
 * @param onSuccess - Callback function to handle successful login.
 * @param onError - Callback function to handle login errors.
 * @returns JSX.Element
 */
export function GoogleLogin<T = LoginResponse>({
  endpoint = DEFAULT_GOOGLE_AUTH_ENDPOINT,
  originalProps,
  disabled = false,
  onLogin,
  onSuccess,
  onError,
}: Props<T>) {
  const { login } = useAuth();

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    if (!credentialResponse.credential) {
      const error = new Error("No credential returned from Google");
      console.error("Google Login Failed");
      onError?.(error);
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data: T = await response.json();

      if (onSuccess) {
        onSuccess(credentialResponse);
      } else if (onLogin) {
        onLogin(data);
      } else {
        // default behavior
        const loginData = data as LoginResponse;
        if (!loginData.token) {
          throw new Error("Invalid login response");
        }
        login(loginData.token);
      }
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error("Google Login Failed");
      console.error("Google Login Failed");
      onError?.(err);
    }
  };

  const handleGoogleError = () => {
    const error = new Error("Google Login Failed");
    console.error("Google Login Failed");
    onError?.(error);
  };

  return (
    <OriginalGoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={handleGoogleError}
      {...originalProps}
    />
  );
}
