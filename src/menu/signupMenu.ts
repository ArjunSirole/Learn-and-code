import inquirer from "inquirer";
import { AuthService } from "../services/authService";
import {
  validateRequired,
  validateEmail,
  validateStrongPassword,
} from "../utils/validators";

const authService = new AuthService();

export async function signupMenu(): Promise<void> {
  const { name, email, password } = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter your name:",
      validate: validateRequired,
    },
    {
      type: "input",
      name: "email",
      message: "Enter your email:",
      validate: validateEmail,
    },
    {
      type: "password",
      name: "password",
      message: "Enter your password:",
      mask: "*",
      validate: validateStrongPassword,
    },
  ]);

  await authService.signup({ name, email, password });
}
