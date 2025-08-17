export type AuthInterface = {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
  subscribe: (listener: (isLoggedIn: boolean) => void) => () => void;
  getAuthState: () => boolean;
  destroy: () => void;
};

export type ListenerType = (isLoggedIn: boolean) => void;

export interface AuthOptions {
  tokenKey?: string;
}
