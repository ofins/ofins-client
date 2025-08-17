import { AuthInterface, AuthOptions, ListenerType } from "./auth.type";

/**
 * Auth class for managing authentication state.
 * This class provides methods for logging in, logging out, and subscribing to authentication state changes.
 * It uses localStorage to persist the authentication state across page reloads.
 * @param {AuthOptions} options - Optional configuration for the Auth instance.
 */
export class Auth implements AuthInterface {
  isLoggedIn: boolean;
  private listeners: Set<ListenerType>;
  private handleStorageChange: (event: StorageEvent) => void;
  private isClient: boolean;
  private TOKEN_KEY: string;

  constructor({ tokenKey }: AuthOptions = {}) {
    this.isClient = typeof window !== "undefined";
    this.isLoggedIn = this.getStoredAuthState();
    this.listeners = new Set();
    this.TOKEN_KEY = tokenKey || "token";

    this.handleStorageChange = (event: StorageEvent) => {
      if (event.key === this.TOKEN_KEY) {
        this.updateAuthState(!!event.newValue);
      }
    };

    if (this.isClient) {
      window.addEventListener("storage", this.handleStorageChange);
    }
  }

  private getStoredAuthState(): boolean {
    if (!this.isClient) return false;

    try {
      return !!localStorage.getItem("token");
    } catch (error) {
      console.warn("Failed to access localStorage:", error);
      return false;
    }
  }

  private setStorageItem(key: string, value: string): boolean {
    if (!this.isClient) return false;

    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn("Failed to set localStorage item:", error);
      return false;
    }
  }

  private removeStorageItem(key: string): boolean {
    if (!this.isClient) return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn("Failed to remove localStorage item:", error);
      return false;
    }
  }

  private updateAuthState(newState: boolean) {
    if (this.isLoggedIn !== newState) {
      this.isLoggedIn = newState;
      // Use setTimeout to avoid synchronous execution issues
      setTimeout(() => {
        this.listeners.forEach((listener) => {
          try {
            listener(newState);
          } catch (error) {
            console.error("Auth listener error:", error);
          }
        });
      }, 0);
    }
  }

  login(token: string): Promise<boolean> {
    return new Promise((resolve) => {
      const success = this.setStorageItem(this.TOKEN_KEY, token);
      if (success) {
        this.updateAuthState(true);
      }
      resolve(success);
    });
  }

  logout(): Promise<boolean> {
    return new Promise((resolve) => {
      const success = this.removeStorageItem(this.TOKEN_KEY);
      if (success) {
        this.updateAuthState(false);
      }
      resolve(success);
    });
  }

  subscribe(listener: ListenerType): () => void {
    this.listeners.add(listener);

    // Call listener with current state asynchronously to avoid timing issues
    setTimeout(() => {
      try {
        listener(this.isLoggedIn);
      } catch (error) {
        console.error("Auth listener error:", error);
      }
    }, 0);

    return () => this.listeners.delete(listener);
  }

  getAuthState(): boolean {
    return this.isLoggedIn;
  }

  /* Method to refresh auth state from storage (useful after SSR hydration) */
  refresh(): void {
    const storedState = this.getStoredAuthState();
    this.updateAuthState(storedState);
  }

  destroy(): void {
    if (this.isClient) {
      window.removeEventListener("storage", this.handleStorageChange);
    }
    this.listeners.clear();
  }
}

export const createAuth = (options?: AuthOptions) => {
  return new Auth(options);
};
