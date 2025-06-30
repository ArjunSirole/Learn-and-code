import { NotificationApi } from "../api/notificationApi";
import inquirer from "inquirer";

export class NotificationService {
  private api = new NotificationApi();

  async viewNotifications(): Promise<void> {
    try {
      let page = 0;
      const limit = 5;
      let hasMore = true;

      while (hasMore) {
        const { data } = await this.api.getNotifications(limit, page * limit);
        const notifications = data.data;

        if (!notifications || notifications.length === 0) {
          if (page === 0) {
            console.log("No notifications available.");
          } else {
            console.log("End of notifications.");
          }
          break;
        }

        console.log(`\nPage ${page + 1}\n`);
        notifications.forEach((n: any, index: number) => {
          console.log(`${index + 1}. ${n.title}`);
          console.log(`   Category: ${n.category}`);
          console.log(`   Published: ${n.published_at}`);
          console.log(`   Source: ${n.source}`);
          console.log(`   URL: ${n.url}`);
          console.log(`   Description: ${n.description || "No description"}`);
          console.log(`   Read: ${n.is_read ? "Read" : "Unread"}`);
          console.log("---------------------------");
        });

        const { action } = await inquirer.prompt([
          {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: [
              { name: "Next page", value: "next" },
              { name: "Mark notifications", value: "mark" },
              { name: "Exit", value: "exit" },
            ],
          },
        ]);

        if (action === "next") {
          page++;
          continue;
        }

        if (action === "exit") {
          break;
        }

        const { markType } = await inquirer.prompt([
          {
            type: "list",
            name: "markType",
            message: "Mark as read or unread?",
            choices: [
              { name: "Mark all as read", value: "read-all" },
              { name: "Mark all as unread", value: "unread-all" },
              { name: "Select which to mark as read", value: "read-select" },
              {
                name: "Select which to mark as unread",
                value: "unread-select",
              },
              { name: "Cancel", value: "cancel" },
            ],
          },
        ]);

        if (markType === "cancel") continue;

        let idsToMark: number[] = [];

        if (markType.endsWith("all")) {
          idsToMark = notifications.map((n: any) => n.id);
        } else {
          const { selected } = await inquirer.prompt([
            {
              type: "checkbox",
              name: "selected",
              message: "Select notifications:",
              choices: notifications.map((n: any) => ({
                name: `${n.title} (${n.category})`,
                value: n.id,
              })),
            },
          ]);
          idsToMark = selected;
        }

        if (idsToMark.length > 0) {
          if (markType.includes("unread")) {
            await this.api.markAsUnread(idsToMark);
            console.log("Selected notifications marked as unread.");
          } else {
            await this.api.markAsRead(idsToMark);
            console.log("Selected notifications marked as read.");
          }
        } else {
          console.log("No notifications marked.");
        }
      }
    } catch (error: any) {
      console.error("Failed to fetch notifications:", error.message);
    }
  }

  async configureNotifications(): Promise<void> {
    let existingConfig;
    try {
      const { data } = await this.api.getConfig();
      existingConfig = data.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log("No existing config found. Proceeding with defaults...");
      } else {
        console.error("Failed to fetch existing config:", error.message);
        return;
      }
    }

    const selectedCategories: string[] = [];
    if (existingConfig?.business) selectedCategories.push("business");
    if (existingConfig?.entertainment) selectedCategories.push("entertainment");
    if (existingConfig?.sports) selectedCategories.push("sports");
    if (existingConfig?.technology) selectedCategories.push("technology");

    const { preferences } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "preferences",
        message: "Select categories to receive notifications:",
        choices: ["business", "entertainment", "sports", "technology"],
        default: selectedCategories,
      },
    ]);

    const { keywords } = await inquirer.prompt([
      {
        type: "input",
        name: "keywords",
        message: "Any specific keywords (comma-separated)?",
        default: existingConfig?.keywords || "",
      },
    ]);

    const config = {
      business: preferences.includes("business"),
      entertainment: preferences.includes("entertainment"),
      sports: preferences.includes("sports"),
      technology: preferences.includes("technology"),
      keywords,
    };

    await this.api.updateConfig(config);
    console.log("Notification configuration saved successfully.");
  }
}
