import {
  CredentialResponse,
  GoogleLogin as OriginalGoogleLogin,
} from "@react-oauth/google";
import { useAuth } from "../hooks/useAuth";

interface Props {
  endpoint?: string;
}

const DEFAULT_GOOGLE_AUTH_ENDPOINT = "/api/auth/google";

export const GoogleLogin = ({
  endpoint = DEFAULT_GOOGLE_AUTH_ENDPOINT,
}: Props) => {
  const { login } = useAuth();

  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ credential: credentialResponse.credential }),
    });

    const data = await response.json();

    login(data.token);
  };

  const handleGoogleError = () => {
    // Handle error case
  };

  return (
    <OriginalGoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={handleGoogleError}
    />
  );
};
