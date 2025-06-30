import { NewsApi } from "../api/newsApi";
import { Article } from "../interfaces/Article";
import inquirer from "inquirer";
import { format } from "date-fns";
import slugify from "slugify";
import { handleApiError } from "../utils/requestUtils";

export class NewsService {
  private api = new NewsApi();

  async showHeadlines(
    date?: string,
    startDate?: string,
    endDate?: string,
    userName = "User"
  ) {
    try {
      const articles = await this.fetchHeadlines(date, startDate, endDate);
      if (!articles.length) return console.log("No articles found.");

      const category = await this.promptCategory();
      const filtered = this.filterHeadlines(articles, category);

      if (!filtered.length) {
        console.log(`No "${category}" news found.`);
        return;
      }

      await this.displayPaginatedArticles(filtered);
    } catch (error) {
      await handleApiError("fetching headlines", error);
    }
  }

  private async fetchHeadlines(
    date?: string,
    startDate?: string,
    endDate?: string
  ): Promise<Article[]> {
    const response = await this.api.getHeadlines(date, startDate, endDate);
    return response.data?.articles ?? [];
  }

  private async promptCategory(): Promise<string> {
    const { selectedCategory } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedCategory",
        message: "Select a news category:",
        choices: ["All", "Business", "Entertainment", "Sports", "Technology"],
      },
    ]);
    return selectedCategory;
  }

  private filterHeadlines(articles: Article[], category: string): Article[] {
    const cat = category.toLowerCase();
    return articles.filter(
      (article) =>
        category === "All" ||
        article.category?.toLowerCase() === cat ||
        article.categories?.map((c) => c.toLowerCase()).includes(cat)
    );
  }

  private async displayPaginatedArticles(articles: Article[]): Promise<void> {
    const pageSize = 10;
    let pageIndex = 0;

    while (pageIndex < articles.length) {
      const page = articles.slice(pageIndex, pageIndex + pageSize);

      console.log(
        `\n Headlines (Page ${Math.floor(pageIndex / pageSize) + 1}):\n`
      );
      page.forEach((a, i) => {
        const categoryDisplay =
          a.category != null && a.category.trim() !== ""
            ? a.category
            : a.categories && a.categories.length > 0
            ? a.categories.join(", ")
            : "Uncategorized";

        console.log(`${pageIndex + i + 1}. ${a.title}`);
        console.log(`${a.url}`);
        console.log(categoryDisplay);
        console.log("--------------------------");
      });

      const { action } = await inquirer.prompt([
        {
          type: "list",
          name: "action",
          message: "Choose an action:",
          choices: [
            { name: "Save an article", value: "save" },
            { name: "Report an article", value: "report" },
            { name: "Like an article", value: "like" },
            { name: "Dislike an article", value: "dislike" },
            ...(pageIndex + pageSize < articles.length
              ? [{ name: "Next Page", value: "next" }]
              : []),
            ...(pageIndex > 0
              ? [{ name: "Previous Page", value: "prev" }]
              : []),
            { name: "Exit", value: "exit" },
          ],
        },
      ]);

      if (["save", "report", "like", "dislike"].includes(action)) {
        const { selectedArticle } = await inquirer.prompt([
          {
            type: "list",
            name: "selectedArticle",
            message: `Select an article to ${action}:`,
            choices: page.map((a) => ({ name: a.title, value: a })),
          },
        ]);

        if (action === "save") {
          await this.api.saveArticle({
            articleId: selectedArticle.id,
            title: selectedArticle.title,
            url: selectedArticle.url,
            source: selectedArticle.source || "Unknown",
          });
          console.log(` Saved: "${selectedArticle.title}"`);
        } else if (action === "report") {
          const { reason } = await inquirer.prompt([
            {
              type: "input",
              name: "reason",
              message: "Enter a reason to report:",
              validate: (input) =>
                input.trim() !== "" || "Reason cannot be empty",
            },
          ]);
          await this.api.reportArticle(selectedArticle.id, reason);
          console.log(`Reported: "${selectedArticle.title}"`);
        } else if (action === "like" || action === "dislike") {
          await this.giveFeedbackToArticle(
            selectedArticle.id,
            action === "like" ? "LIKE" : "DISLIKE"
          );
        }
      } else if (action === "next") {
        pageIndex += pageSize;
      } else if (action === "prev") {
        pageIndex -= pageSize;
      } else {
        break;
      }
    }
  }

  async showSavedArticles(filter?: "LIKE" | "DISLIKE") {
    const response = await this.api.getSavedArticles();
    const articles = response.data ?? [];

    const filtered = filter
      ? articles.filter((a: any) => a.feedback === filter)
      : articles;

    if (!filtered.length) {
      console.log(`No ${filter?.toLowerCase() || ""} articles found.`);
      return;
    }

    console.log(`\n${filter ? `${filter}D` : "Saved"} Articles:\n`);
    filtered.forEach((article: any) => {
      console.log(`${article.id}`);
      console.log(`${article.title}`);
      console.log(`${article.url}`);
      console.log(`${article.source}`);
      if (article.feedback) console.log(`Feedback: ${article.feedback}`);
      console.log("-------------------------");
    });
  }

  async giveFeedbackToArticle(articleId: string, feedback: "LIKE" | "DISLIKE") {
    await this.api.giveFeedback(articleId, feedback);
    console.log(
      `${feedback === "LIKE" ? "👍 Liked" : "👎 Disliked"} article ${articleId}`
    );
  }

  async getSavedArticles() {
    const response = await this.api.getSavedArticles();
    return response.data ?? [];
  }

  async deleteSavedArticle(articleId: string) {
    await this.api.deleteArticle(articleId);
    console.log(`Deleted article with ID ${articleId}`);
  }

  async searchArticles(
    query: string,
    category?: string,
    startDate?: string,
    endDate?: string,
    sortBy?: string
  ) {
    const response = await this.api.searchArticles(
      query,
      category,
      startDate,
      endDate,
      sortBy
    );
    const articles = response.data ?? [];

    const deduped = Array.from(
      new Map(
        articles.map((a: Article) => [slugify(a.title, { lower: true }), a])
      ).values()
    ) as Article[];

    if (!deduped.length) {
      console.log("No articles found.");
      return;
    }

    console.log(`\nSearch Results for "${query}":\n`);

    if (sortBy === "like") {
      deduped.sort(
        (a, b) => (b.feedback_count?.like || 0) - (a.feedback_count?.like || 0)
      );
    } else if (sortBy === "dislike") {
      deduped.sort(
        (a, b) =>
          (b.feedback_count?.dislike || 0) - (a.feedback_count?.dislike || 0)
      );
    }

    let index = 0;
    const pageSize = 10;

    while (index < deduped.length) {
      const page = deduped.slice(index, index + pageSize);

      page.forEach((article: any, i: number) => {
        console.log(`${index + i + 1}. ${article.title}`);
        console.log(`${article.url}`);
        console.log(`${article.source}   ${article.published_at}`);
        if (article.feedback_count) {
          console.log(
            `Likes: ${article.feedback_count.like || 0}  Dislikes: ${
              article.feedback_count.dislike || 0
            }`
          );
        }
        console.log("--------------------------");
      });

      const { wantToSave } = await inquirer.prompt([
        {
          type: "confirm",
          name: "wantToSave",
          message: "Would you like to save an article from this page?",
          default: false,
        },
      ]);

      if (wantToSave) {
        const { selectedArticle } = await inquirer.prompt([
          {
            type: "list",
            name: "selectedArticle",
            message: "Select an article to save:",
            choices: page.map((a: any) => ({ name: a.title, value: a })),
          },
        ]);

        await this.api.saveArticle({
          articleId: selectedArticle.id,
          title: selectedArticle.title,
          url: selectedArticle.url,
          source: selectedArticle.source || "Unknown",
        });

        console.log(`Saved article: "${selectedArticle.title}"`);
      }

      index += pageSize;

      if (index < deduped.length) {
        const { showMore } = await inquirer.prompt([
          {
            type: "confirm",
            name: "showMore",
            message: "Show more results?",
            default: false,
          },
        ]);
        if (!showMore) break;
      } else {
        console.log("\nEnd of search results.");
      }
    }
  }

  async reportArticle(articleId: number, reason: string) {
    await this.api.reportArticle(articleId, reason);
    console.log(`Reported article with ID ${articleId} successfully.`);
  }
}
