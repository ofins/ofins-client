import { GoogleOAuthProvider as OriginalGoogleOAuthProvider } from "@react-oauth/google";

type GoogleOAuthProviderProps = React.ComponentProps<
  typeof OriginalGoogleOAuthProvider
>;

export const GoogleOAuthProvider = (props: GoogleOAuthProviderProps) => {
  return <OriginalGoogleOAuthProvider {...props} />;
};
