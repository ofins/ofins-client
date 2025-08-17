type AuthInterface = {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  subscribe: (listener: (isLoggedIn: boolean) => void) => () => void;
  getAuthState: () => boolean;
  destroy: () => void;
};

type ListenerType = (isLoggedIn: boolean) => void;

class Auth implements AuthInterface {
  isLoggedIn: boolean;
  private listeners: Set<ListenerType>;
  private handleStorageChange: (event: StorageEvent) => void;
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== "undefined";
    this.isLoggedIn = this.getStoredAuthState();
    this.listeners = new Set();

    this.handleStorageChange = (event: StorageEvent) => {
      if (event.key === "token") {
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
      const success = this.setStorageItem("token", token);
      if (success) {
        this.updateAuthState(true);
      }
      resolve(success);
    });
  }

  logout(): Promise<boolean> {
    return new Promise((resolve) => {
      const success = this.removeStorageItem("token");
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

export const createAuth = () => new Auth();

export default createAuth;
