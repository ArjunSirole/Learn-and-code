import React, { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthController } from "../../controllers/authController";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "../../utils/validators";
import "../styles/SignupPage.css";

function SignupPage(): JSX.Element {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Individual field errors
  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");

  const navigate = useNavigate();
  const authController = new AuthController();

  async function handleSignup(event: React.FormEvent): Promise<void> {
    event.preventDefault();

    // Reset errors
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setSubmitError("");

    // Validate each field
    const nameValidation = validateName(name);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    let hasError = false;

    if (nameValidation !== true) {
      setNameError(nameValidation);
      hasError = true;
    }
    if (emailValidation !== true) {
      setEmailError(emailValidation);
      hasError = true;
    }
    if (passwordValidation !== true) {
      setPasswordError(passwordValidation);
      hasError = true;
    }

    if (hasError) return;

    try {
      await authController.signup(name, email, password);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("An unexpected error occurred.");
      }
    }
  }

  return (
    <div className="signup-container">
      <h2>Create Your Account</h2>
      <p className="intro-text">Please enter your details to sign up.</p>

      {submitError && <div className="error">{submitError}</div>}

      <form onSubmit={handleSignup}>
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
