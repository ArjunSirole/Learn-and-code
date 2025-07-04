import React, { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthController } from "../../controllers/authController";
import { validateEmail, validatePassword } from "../../utils/validators";
import "../styles/LoginPage.css";

function LoginPage(): JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");

  const navigate = useNavigate();
  const authController = new AuthController();

  async function handleLogin(event: React.FormEvent): Promise<void> {
    event.preventDefault();

    setEmailError("");
    setPasswordError("");
    setSubmitError("");

    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);

    let hasError = false;

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
      await authController.login(email, password);
      navigate("/news");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("An unexpected error occurred.");
      }
    }
  }

  return (
    <div className="login-container">
      <h2>Welcome to Our Application</h2>
      <p className="intro-text">
        Please enter your login credentials.
      </p>

      {submitError && <div className="error">{submitError}</div>}

      <form onSubmit={handleLogin}>
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

        <button type="submit">Login</button>
      </form>

      <p style={{ textAlign: "center" }}>
        Don’t have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
}

export default LoginPage;
