//  Fully Updated userMenu with clean naming, typing, and structure

import inquirer from "inquirer";
import { format } from "date-fns";
import { NewsService } from "../services/newsService";
import { notificationMenu } from "./notificationMenu";
import { Article } from "../interfaces/Article";

const newsService = new NewsService();

export async function userMenu(): Promise<void> {
  let back = false;

  while (!back) {
    const { choice } = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: "User Menu - Choose an option:",
        choices: [
          "1. Headlines",
          "2. Saved Articles",
          "3. Search",
          "4. Notifications",
          "5. Logout",
        ],
      },
    ]);

    switch (choice[0]) {
      case "1":
        await headlinesMenu();
        break;
      case "2":
        await savedArticlesMenu();
        break;
      case "3":
        await searchMenu();
        break;
      case "4":
        await notificationMenu();
        break;
      case "5":
        back = true;
        console.log("Logged out.");
        break;
      default:
        console.log("Feature under construction.");
        break;
    }
  }
}

async function headlinesMenu(): Promise<void> {
  const { subChoice } = await inquirer.prompt([
    {
      type: "list",
      name: "subChoice",
      message: "View Headlines for:",
      choices: ["1. Today", "2. Date Range", "3. Back"],
    },
  ]);

  switch (subChoice[0]) {
    case "1": {
      const today = format(new Date(), "yyyy-MM-dd");
      await newsService.showHeadlines(today);
      break;
    }
    case "2": {
      const { startDate, endDate } = await inquirer.prompt([
        {
          type: "input",
          name: "startDate",
          message: "Enter start date (YYYY-MM-DD):",
        },
        {
          type: "input",
          name: "endDate",
          message: "Enter end date (YYYY-MM-DD):",
        },
      ]);
      console.log(`\nShowing headlines from ${startDate} to ${endDate}`);
      await newsService.showHeadlines(undefined, startDate, endDate);
      break;
    }
    default:
      return;
  }
}

async function savedArticlesMenu(): Promise<void> {
  let back = false;

  while (!back) {
    const { action } = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "Saved Articles Menu:",
        choices: [
          "1. View All Saved Articles",
          "2. Like/Dislike a Saved Article",
          "3. View Liked Articles",
          "4. View Disliked Articles",
          "5. Delete a Saved Article",
          "6. Report an Article",
          "7. Back",
        ],
      },
    ]);

    switch (action[0]) {
      case "1":
        await newsService.showSavedArticles();
        break;
      case "2":
        await handleLikeDislike();
        break;
      case "3":
        await newsService.showSavedArticles("LIKE");
        break;
      case "4":
        await newsService.showSavedArticles("DISLIKE");
        break;
      case "5":
        await handleDeleteArticle();
        break;
      case "6": {
        const saved = await newsService.getSavedArticles();
        if (!saved || saved.length === 0) {
          console.log(" No saved articles to report.");
          break;
        }

        const unique = Array.from(
          new Map(saved.map((a: any) => [a.id, a])).values()
        );

        const { articleIdToReport } = await inquirer.prompt([
          {
            type: "list",
            name: "articleIdToReport",
            message: "Select an article to report:",
            choices: unique.map((a: any) => ({
              name: a.title,
              value: a.id,
            })),
          },
        ]);

        const { reason } = await inquirer.prompt([
          {
            type: "input",
            name: "reason",
            message: "Enter reason for reporting this article:",
            validate: (input) =>
              input.trim().length > 0 ? true : "Reason cannot be empty.",
          },
        ]);

        await newsService.reportArticle(articleIdToReport, reason);
        break;
      }

      case "7":
        back = true;
        break;
    }
  }
}

async function handleLikeDislike(): Promise<void> {
  const response = await newsService.getSavedArticles();
  const articles: Article[] = response.data ?? [];

  if (!articles.length) {
    console.log("No saved articles found.");
    return;
  }

  const uniqueArticles = Array.from(
    new Map(articles.map((article) => [article.id, article])).values()
  );

  const { selectedId } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedId",
      message: "Select an article to like/dislike:",
      choices: uniqueArticles.map((article) => ({
        name: article.title,
        value: article.id,
      })),
    },
  ]);

  const { feedback } = await inquirer.prompt([
    {
      type: "list",
      name: "feedback",
      message: "What feedback would you like to give?",
      choices: ["LIKE", "DISLIKE"],
    },
  ]);

  await newsService.giveFeedbackToArticle(selectedId, feedback);
}

async function handleDeleteArticle(): Promise<void> {
  const response = await newsService.getSavedArticles();
  const articles: Article[] = response.data ?? [];

  if (!articles.length) {
    console.log("No saved articles found.");
    return;
  }

  const uniqueArticles = Array.from(
    new Map(articles.map((article) => [article.id, article])).values()
  );

  const { deleteId } = await inquirer.prompt([
    {
      type: "list",
      name: "deleteId",
      message: "Select an article to delete:",
      choices: uniqueArticles.map((article) => ({
        name: article.title,
        value: article.id,
      })),
    },
  ]);

  await newsService.deleteSavedArticle(deleteId);
}

async function searchMenu(): Promise<void> {
  const { query } = await inquirer.prompt([
    { type: "input", name: "query", message: "Enter keyword to search:" },
  ]);

  const { category, startDate, endDate, sortBy } = await inquirer.prompt([
    {
      type: "list",
      name: "category",
      message: "Select category (optional):",
      choices: ["Skip", "Business", "Entertainment", "Sports", "Technology"],
    },
    {
      type: "input",
      name: "startDate",
      message: "Start date (YYYY-MM-DD):",
      default: "",
    },
    {
      type: "input",
      name: "endDate",
      message: "End date (YYYY-MM-DD):",
      default: "",
    },
    {
      type: "list",
      name: "sortBy",
      message: "Sort by:",
      choices: ["Relevance", "Date", "Like", "Dislike"],
    },
  ]);

  await newsService.searchArticles(
    query,
    category === "Skip" ? undefined : category,
    startDate || undefined,
    endDate || undefined,
    sortBy.toLowerCase()
  );
}
