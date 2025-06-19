import inquirer from "inquirer";
import { AdminApi } from "../api/adminApi";

export class AdminService {
  private api = new AdminApi();

  async showServers(): Promise<void> {
    try {
      const { data: servers } = await this.api.getServers();
      if (!servers.length) {
        console.log("\nNo external servers found.");
        return;
      }

      console.log("\nExternal Servers:\n");
      servers.forEach((server: any, index: number) => {
        console.log(`${index + 1}. ${server.name} - ${server.status} (Last accessed: ${server.last_accessed})`);
      });
    } catch (error) {
      this.handleError("fetching servers", error);
    }
  }

  async showServerDetails(id: number): Promise<void> {
    try {
      const { data: s } = await this.api.getServerById(id);
      console.log(`\nServer #${s.id} - ${s.name}`);
      console.log(`Status: ${s.status}`);
      console.log(`Last Accessed: ${s.last_accessed}`);
      console.log(`API Key: ${s.api_key}`);
    } catch (error) {
      this.handleError("fetching server details", error);
    }
  }

  async updateServerApiKey(id: number, apiKey: string): Promise<void> {
    try {
      await this.api.updateApiKey(id, apiKey);
      console.log("API key updated successfully.");
    } catch (error) {
      this.handleError("updating API key", error);
    }
  }

  async addCategory(name: string): Promise<void> {
    try {
      await this.api.addCategory(name);
      console.log(`Category "${name}" added successfully.`);
    } catch (error) {
      this.handleError("adding category", error);
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      await this.api.deleteUser(id);
      console.log(`User with ID ${id} deleted successfully.`);
    } catch (error) {
      this.handleError("deleting user", error);
    }
  }

  async deactivateUser(id: number): Promise<void> {
    try {
      await this.api.deactivateUser(id);
      console.log(`User with ID ${id} deactivated.`);
    } catch (error) {
      this.handleError("deactivating user", error);
    }
  }

  async reactivateUser(id: number): Promise<void> {
    try {
      await this.api.reactivateUser(id);
      console.log(`User with ID ${id} reactivated.`);
    } catch (error) {
      this.handleError("reactivating user", error);
    }
  }

  async changeUserRole(id: number, role: "ADMIN" | "USER"): Promise<void> {
    try {
      await this.api.updateUserRole(id, role);
      console.log(`User role updated to ${role}.`);
    } catch (error) {
      this.handleError("changing user role", error);
    }
  }

  async showUserMetrics(): Promise<void> {
    try {
      const { data } = await this.api.getUserMetrics();
      console.log(`\nUser Metrics:`);
      console.log(`Total Users: ${data.total_users}`);
      console.log(`Active: ${data.active_users}  Inactive: ${data.inactive_users}`);
    } catch (error) {
      this.handleError("fetching user metrics", error);
    }
  }

  async showNewsMetrics(): Promise<void> {
    try {
      const { data } = await this.api.getNewsMetrics();
      console.log(`\nNews Metrics by Category:`);
      data.forEach((c: any) => {
        console.log(`${c.category}: ${c.article_count} articles`);
      });
    } catch (error) {
      this.handleError("fetching news metrics", error);
    }
  }

  async reviewReportedArticles(): Promise<void> {
    try {
      const { data: reports } = await this.api.getReportedArticles();

      if (!reports.length) {
        console.log(" No reported articles found.");
        return;
      }

      for (const report of reports) {
        console.log(`\n📢 Article Title: ${report.title}`);
        console.log(`URL: ${report.url}`);
        console.log(`Reported by User ID: ${report.user_id}`);
        console.log(`Reason: ${report.reason}`);
        console.log(`Report ID: ${report.id}`);
        console.log("---------------------------");

        const { action } = await inquirer.prompt([
          {
            type: "list",
            name: "action",
            message: "What would you like to do?",
            choices: [
              { name: "1. Hide Article", value: "hide" },
              { name: "2. Dismiss Report", value: "dismiss" },
              { name: "3. Skip", value: "skip" }
            ]
          }
        ]);

        if (action === "hide") {
          await this.api.hideArticle(report.article_id);
          console.log(` Article ID ${report.article_id} hidden.`);
        } else if (action === "dismiss") {
          await this.api.dismissReport(report.id);
          console.log(` Report ID ${report.id} dismissed.`);
        } else {
          console.log(" Skipped.");
        }
      }
    } catch (error) {
      this.handleError("reviewing reported articles", error);
    }
  }

  private handleError(context: string, error: unknown): void {
    console.error(`\n Error ${context}:`, error instanceof Error ? error.message : error);
  }
}
