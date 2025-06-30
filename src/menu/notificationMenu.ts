import inquirer from "inquirer";
import { NotificationService } from "../services/notificationService";

const service = new NotificationService();

export async function notificationMenu() {
  let back = false;

  while (!back) {
    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: "Notification Menu",
        choices: [
          "1. View Notifications",
          "2. Configure Notification Preferences",
          "3. Back",
        ],
      },
    ]);

    switch (choice[0]) {
      case "1":
        await service.viewNotifications();
        break;
      case "2":
        await service.configureNotifications();
        break;
      default:
        back = true;
    }
  }
}
