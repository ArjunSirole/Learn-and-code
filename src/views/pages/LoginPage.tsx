import React, { JSX } from "react";
import { useLogin } from "../../hooks/useLogin";
import Spinner from "../components/Spinner";
import "../styles/LoginPage.css";

function LoginPage(): JSX.Element {
  const {
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    passwordError,
    submitError,
    loading,
    handleSubmit,
  } = useLogin();

  return (
    <div className="login-container">
      <h2>Welcome to Our Application</h2>
      <p className="intro-text">Please enter your login credentials.</p>

      {submitError && <div className="error">{submitError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        {emailError && <div className="field-error">{emailError}</div>}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        {passwordError && <div className="field-error">{passwordError}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {loading && <Spinner />}

      <p style={{ textAlign: "center" }}>
        Don’t have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}

export default LoginPage;
