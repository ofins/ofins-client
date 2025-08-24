import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider, GoogleOAuthProvider } from "@ofins/client/react";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </AuthProvider>
  </StrictMode>
);
