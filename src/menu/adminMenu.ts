import inquirer from "inquirer";
import { AdminService } from "../services/adminService";

const adminService = new AdminService();

export async function adminMenu(): Promise<void> {
  let exit = false;

  while (!exit) {
    console.log(" Admin Panel - Select an option:\n");

    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: "Choose an action:",
        choices: [
          { name: "1. View external servers", value: "servers" },
          { name: "2. View server details", value: "serverDetails" },
          { name: "3. Update server API key", value: "updateApiKey" },
          { name: "4. Add news category", value: "addCategory" },
          { name: "5. Delete user", value: "deleteUser" },
          { name: "6. Deactivate user", value: "deactivateUser" },
          { name: "7. Reactivate user", value: "reactivateUser" },
          { name: "8. Change user role", value: "changeUserRole" },
          { name: "9. View user metrics", value: "userMetrics" },
          { name: "10. Review Reported Articles", value: "reviewReports" },
          { name: "11. Logout", value: "logout" },
        ],
      },
    ]);

    switch (choice) {
      case "servers":
        await adminService.showServers();
        break;
      case "serverDetails":
        const { id: serverId } = await inquirer.prompt([
          { type: "input", name: "id", message: "Enter server ID:" },
        ]);
        await adminService.showServerDetails(Number(serverId));
        break;
      case "updateApiKey":
        const { id: upId, apiKey } = await inquirer.prompt([
          { type: "input", name: "id", message: "Enter server ID:" },
          { type: "input", name: "apiKey", message: "Enter new API key:" },
        ]);
        await adminService.updateServerApiKey(Number(upId), apiKey);
        break;
      case "addCategory":
        const { name } = await inquirer.prompt([
          { type: "input", name: "name", message: "Enter category name:" },
        ]);
        await adminService.addCategory(name);
        break;
      case "deleteUser":
        const { id: delId } = await inquirer.prompt([
          { type: "input", name: "id", message: "Enter user ID to delete:" },
        ]);
        await adminService.deleteUser(Number(delId));
        break;
      case "deactivateUser":
        const { id: deactId } = await inquirer.prompt([
          {
            type: "input",
            name: "id",
            message: "Enter user ID to deactivate:",
          },
        ]);
        await adminService.deactivateUser(Number(deactId));
        break;
      case "reactivateUser":
        const { id: reactId } = await inquirer.prompt([
          {
            type: "input",
            name: "id",
            message: "Enter user ID to reactivate:",
          },
        ]);
        await adminService.reactivateUser(Number(reactId));
        break;
      case "changeUserRole":
        const { id: roleId, role } = await inquirer.prompt([
          { type: "input", name: "id", message: "Enter user ID:" },
          {
            type: "list",
            name: "role",
            message: "Select new role:",
            choices: ["ADMIN", "USER"],
          },
        ]);
        await adminService.changeUserRole(Number(roleId), role);
        break;
      case "userMetrics":
        await adminService.showUserMetrics();
        break;
      case "reviewReports":
        await adminService.reviewReportedArticles();
        break;

      case "logout":
        exit = true;
        console.log("\n Logged out from admin panel.");
        break;
    }
  }
}
