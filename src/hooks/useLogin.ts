import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthController } from "../controllers/authController";
import { validateEmail, validatePassword } from "../utils/validators";

export const useLogin = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const authController = new AuthController();

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
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
      setLoading(true);
      await authController.login(email, password);
      navigate("/news");
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    emailError,
    passwordError,
    submitError,
    loading,
    handleSubmit,
  };
};
