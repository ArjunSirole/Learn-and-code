
export function validateEmail(email: string): string | true {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) {
    return "Email is required.";
  }
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address.";
  }
  return true;
}

export function validatePassword(password: string): string | true {
  if (!password.trim()) {
    return "Password is required.";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters.";
  }
  return true;
}

export function validateName(name: string): string | true {
  if (!name.trim()) {
    return "Name is required.";
  }
  if (name.length < 2) {
    return "Name must be at least 2 characters.";
  }
  return true;
}
