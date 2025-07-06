import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthController } from "../controllers/authController";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "../utils/validators";

export const useSignup = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [nameError, setNameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [submitError, setSubmitError] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const authController = new AuthController();

  const handleSignup = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    setNameError("");
    setEmailError("");
    setPasswordError("");
    setSubmitError("");

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
      setLoading(true);
      await authController.signup(name, email, password);
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setSubmitError(err.message);
      } else {
        setSubmitError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};
