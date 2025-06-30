import inquirer from "inquirer";
import { AuthService } from "../services/authService";
import { validateEmail, validatePassword } from "../utils/validators";

const authService = new AuthService();

export async function loginMenu(): Promise<boolean> {
  while (true) {
    const { email, password } = await inquirer.prompt([
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
        validate: validatePassword,
      },
    ]);

    const success = await authService.login({ email, password });

    if (success) return true;

    console.log("\nLogin failed. Incorrect email or password.\n");

    const { retry } = await inquirer.prompt([
      {
        type: "confirm",
        name: "retry",
        message: "Would you like to try again?",
        default: true,
      },
    ]);

    if (!retry) return false;
  }
}
