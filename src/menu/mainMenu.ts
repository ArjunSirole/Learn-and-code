import inquirer from "inquirer";
import { loginMenu } from "./loginMenu";
import { signupMenu } from "./signupMenu";
import { SessionService } from "../services/sessionService";
import { adminMenu } from "./adminMenu";
import { userMenu } from "./userMenu";

enum MainMenuOption {
  Login = "Login",
  Signup = "Sign up",
  Exit = "Exit",
}

export async function mainMenu(): Promise<void> {
  let exitRequested = false;

  while (!exitRequested) {
    console.clear();
    console.log("\\ Welcome to the News Aggregator Application!\n");

    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Please choose an option:",
        choices: Object.values(MainMenuOption),
      },
    ]);

    switch (action) {
      case MainMenuOption.Login: {
        const success = await loginMenu();

        if (success) {
          const role = SessionService.getUserRole();
          switch (role) {
            case "ADMIN":
              await adminMenu();
              break;
            case "USER":
              await userMenu();
              break;
            default:
              console.log("Unknown user role. Access denied.");
              await pause();
          }
        } else {
          console.log("\n Login failed. Incorrect email or password.");
          await pause();
        }
        break;
      }

      case MainMenuOption.Signup:
        await signupMenu();
        await pause();
        break;

      case MainMenuOption.Exit:
        console.log(" Goodbye! Thanks for using News Aggregator.\n");
        exitRequested = true;
        break;
    }
  }
}

async function pause(): Promise<void> {
  await inquirer.prompt([
    {
      type: "input",
      name: "continue",
      message: "Press Enter to continue...",
    },
  ]);
}
