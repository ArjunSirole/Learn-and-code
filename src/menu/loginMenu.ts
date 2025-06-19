// loginMenu.ts
import inquirer from "inquirer";
import { AuthService } from "../services/authService";

const authService = new AuthService();

export async function loginMenu(): Promise<boolean> {
  const { email, password } = await inquirer.prompt([
    { type: "input", name: "email", message: "Enter your email:" },
    {
      type: "password",
      name: "password",
      message: "Enter your password:",
      mask: "*",
    },
  ]);

  return await authService.login({ email, password });
}
