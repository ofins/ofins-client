# @ofins/client

A personal npm package containing utilities and components for frontend development. Includes both framework-agnostic helpers and React-specific hooks/components. Designed for rapid reuse in your own projects. 🚀

## Features

- **Agnostic utilities:** Functions and helpers usable in any frontend project.
- **React framework support:** Hooks and components for authentication, state management, and more.
- **Modular structure:** Import only what you need.
- **TypeScript support:** All exports are fully typed.

## Installation

```bash
npm install @ofins/client
```

## Usage

### Agnostic Utilities

```typescript
import { someUtility } from "@ofins/client/lib/utils";
```

### React Framework

```typescript
import {
  useLogin,
  AuthProvider,
} from "@ofins/client/src/frameworks/react/auth";
```

## Example: Authentication in React

```tsx
import {
  AuthProvider,
  useLogin,
} from "@ofins/client/src/frameworks/react/auth";

function LoginForm() {
  const login = useLogin({
    onLogin: async ({ email, password }) => {
      // Your login logic here
    },
    onSuccess: () => {
      // Handle success
    },
    onError: (err) => {
      // Handle error
    },
  });

  return (
    <form onSubmit={login.handleSubmit}>
      <input
        type="email"
        value={login.credentials.email}
        onChange={(e) => login.setEmail(e.target.value)}
      />
      <input
        type="password"
        value={login.credentials.password}
        onChange={(e) => login.setPassword(e.target.value)}
      />
      <button type="submit" disabled={login.isLoading}>
        Login
      </button>
    </form>
  );
}
```

## Directory Structure

```
lib/
	core/
		auth/
			...
	frameworks/
		react/
			auth/
				...
	utils/
		...
```

## Development

- Written in TypeScript
- Linting and formatting via ESLint and Prettier
- Build with `npm run build`

## License

ISC
