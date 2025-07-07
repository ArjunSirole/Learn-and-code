import React, { JSX } from "react";
import { useSignup } from "../../hooks/useSignup";
import Spinner from "../components/Spinner";
import "../styles/SignupPage.css";

function SignupPage(): JSX.Element {
  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    nameError,
    emailError,
    passwordError,
    submitError,
    handleSignup,
    loading,
  } = useSignup();

  return (
    <div className="signup-container">
      <h2>Create Your Account</h2>
      <p className="intro-text">Please enter your details to sign up.</p>

      {submitError && <div className="error">{submitError}</div>}
      {loading && <Spinner />}

      <form
        onSubmit={handleSignup}
        style={{
          opacity: loading ? 0.5 : 1,
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {nameError && <div className="field-error">{nameError}</div>}

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {emailError && <div className="field-error">{emailError}</div>}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {passwordError && <div className="field-error">{passwordError}</div>}

        <button type="submit">Sign Up</button>
      </form>

      <p style={{ textAlign: "center" }}>
        Already have an account? <a href="/">Log in</a>
      </p>
    </div>
  );
}

export default SignupPage;
