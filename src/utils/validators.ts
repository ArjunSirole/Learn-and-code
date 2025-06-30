import validator from "validator";

export const validateRequired = (input: string): true | string =>
  input.trim().length > 0 ? true : "This field is required.";

export const validateEmail = (email: string): true | string =>
  validator.isEmail(email) ? true : "Please enter a valid email address.";

export const validatePassword = (password: string): true | string =>
  password.length >= 6 ? true : "Password must be at least 6 characters long.";

export const validateStrongPassword = (input: string): true | string => {
  if (input.length < 6) {
    return "Password must be at least 6 characters.";
  }
  if (!/\d/.test(input)) {
    return "Password must include at least one number.";
  }
  if (!/[a-zA-Z]/.test(input)) {
    return "Password must include at least one letter.";
  }
  return true;
};
