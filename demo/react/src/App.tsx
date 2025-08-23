import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useRegister } from "@ofins/client";

function App() {
  const [count, setCount] = useState(0);

  // Test the linked @ofins/client package
  const register = useRegister({
    onRegister: async (credentials) => {
      console.log("Register called with:", credentials);
      return "mock-token";
    },
  });

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>

        {/* Test @ofins/client package */}
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #ccc",
          }}
        >
          <h3>Testing @ofins/client package</h3>
          <p>Email: {register.credentials.email}</p>
          <p>Username: {register.credentials.username || "not set"}</p>
          <p>Password: {register.credentials.password}</p>
          <input
            type="email"
            placeholder="Email"
            value={register.credentials.email}
            onChange={(e) => register.setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            value={register.credentials.username || ""}
            onChange={(e) => register.setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={register.credentials.password}
            onChange={(e) => register.setPassword(e.target.value)}
          />
          <button onClick={() => register.handleSubmit()}>Test Register</button>
        </div>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
