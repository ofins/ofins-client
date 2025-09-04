import { useRegister } from "@ofins/client/react";

export const Register = () => {
  // Test the linked @ofins/client package
  const {
    credentials,
    setEmail,
    setUsername,
    setPassword,
    setConfirmPassword,
    setFirstName,
    setLastName,
    handleSubmit,
    errors,
  } = useRegister({
    initialValues: {
      email: "test@example.com",
      username: "testuser",
      password: "password123",
      confirmPassword: "password123",
      firstName: "John",
      lastName: "Doe",
    },
    onRegister: async (credentials: {
      email: string;
      username?: string;
      password: string;
      confirmPassword: string;
      firstName?: string;
      lastName?: string;
    }) => {
      console.log("Register called with:", credentials);
      return "mock-token";
    },
  });
  return (
    <>
      {/* Test @ofins/client package */}
      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #ccc",
        }}
      >
        <h3>Testing @ofins/client package</h3>
        <p>Email: {credentials.email}</p>
        <p>Username: {credentials.username || "not set"}</p>
        <p>Password: {credentials.password}</p>
        <input
          type="email"
          placeholder="Email"
          value={credentials.email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username"
          value={credentials.username || ""}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={credentials.confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="First Name"
          value={credentials.firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={credentials.lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <button onClick={() => handleSubmit()}>Test Register</button>

        {/* Display errors */}
        {Object.keys(errors).length > 0 && (
          <div style={{ marginTop: "10px", color: "red" }}>
            <h4>Errors:</h4>
            {Object.entries(errors).map(([field, message]) => (
              <div key={field}>
                <strong>{field}:</strong> {String(message)}
              </div>
            ))}
          </div>
        )}
      </div>
      <span>{errors.message}</span>
    </>
  );
};

export default Register;
