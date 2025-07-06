import axios from "axios";
import cron from "node-cron";
import pool from "../config/db";
import { NEWS_CATEGORIES } from "../config/constants";
import { NewsApiResponse, TheNewsApiResponse } from "../models/articleModel";
import { EmailScheduler } from "./emailScheduler";

const emailScheduler = new EmailScheduler();

export class NewsScheduler {
  constructor(private interval = "0 */3 * * *") {}

  public start(): void {
    console.log(" News scheduler started. Interval:", this.interval);
    cron.schedule(this.interval, () => this.fetchNews());
  }

  private async fetchNews(): Promise<void> {
    await this.fetchFromNewsAPI();
    await this.fetchFromTheNewsAPI();
  }

  private async fetchFromNewsAPI(): Promise<void> {
    const uniqueArticles = new Map<
      string,
      {
        id: string;
        title: string;
        category?: string;
        published_at?: string;
        url: string;
        source: string;
        description?: string;
        image_url?: string;
      }
    >();

    try {
      for (const category of NEWS_CATEGORIES) {
        const { data } = await axios.get<NewsApiResponse>(
          "https://newsapi.org/v2/top-headlines",
          {
            params: {
              country: "us",
              category,
              apiKey: process.env.NEWS_API_KEY,
            },
          }
        );

        const articles = data.articles ?? [];
        if (!Array.isArray(articles) || articles.length === 0) {
          console.warn(`No ${category} articles from NewsAPI.`);
          continue;
        }

        for (const article of articles) {
          const key = article.url.trim();
          if (!uniqueArticles.has(key)) {
            uniqueArticles.set(key, {
              id: article.url,
              title: article.title,
              category,
              published_at: article.publishedAt,
              url: article.url,
              source: article.source?.name ?? "NewsAPI",
              description: article.description,
              image_url: article.urlToImage ?? undefined,
            });
          }
        }
      }

      for (const article of uniqueArticles.values()) {
        await this.insertArticle(article);
      }

      await this.updateLastAccessed("newsapi");
      console.log(" NewsAPI unique articles inserted.");
    } catch (error) {
      console.error(" Error fetching NewsAPI:", error);
    }
  }

  private async fetchFromTheNewsAPI(): Promise<void> {
    const uniqueArticles = new Map<
      string,
      {
        id: string;
        title: string;
        category?: string;
        published_at?: string;
        url: string;
        source: string;
        description?: string;
        image_url?: string;
      }
    >();

    try {
      for (const category of NEWS_CATEGORIES) {
        const { data } = await axios.get<TheNewsApiResponse>(
          "https://api.thenewsapi.com/v1/news/top",
          {
            params: {
              country: "us",
              category,
              api_token: process.env.THE_NEWS_API_KEY,
            },
          }
        );

        const articles = data.data ?? [];
        if (!Array.isArray(articles) || articles.length === 0) {
          console.warn(`No ${category} articles from TheNewsAPI.`);
          continue;
        }

        for (const article of articles) {
          const key = article.url.trim();
          if (!uniqueArticles.has(key)) {
            uniqueArticles.set(key, {
              id: article.url,
              title: article.title,
              category,
              published_at: article.published_at,
              url: article.url,
              source: article.source ?? "TheNewsAPI",
              description: article.description,
              image_url: undefined,
            });
          }
        }
      }

      for (const article of uniqueArticles.values()) {
        await this.insertArticle(article);
      }

      await this.updateLastAccessed("thenewsapi");
      console.log(" TheNewsAPI unique articles inserted.");
    } catch (error) {
      console.error(" Error fetching TheNewsAPI:", error);
    }
  }

  private async insertArticle(article: {
    id: string;
    title: string;
    category?: string;
    published_at?: string;
    url: string;
    source: string;
    description?: string;
    image_url?: string;
  }): Promise<void> {
    try {
      let formattedPublishedAt = article.published_at;

      if (formattedPublishedAt) {
        formattedPublishedAt = formattedPublishedAt.replace("T", " ").replace("Z", "");
      }

      await pool.query(
        `INSERT IGNORE INTO articles (
          id, title, category, published_at, url, source, description, image_url
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          article.id,
          article.title,
          article.category ?? null,
          formattedPublishedAt ?? null,
          article.url,
          article.source,
          article.description ?? null,
          article.image_url ?? null,
        ]
      );

      await this.upsertCategory(article.category);

      await emailScheduler.insertNotificationsForNewArticle({
        title: article.title,
        category: (article.category ?? "").toLowerCase(),
        published_at: formattedPublishedAt ?? new Date().toISOString(),
        url: article.url,
      });
    } catch (error) {
      console.error("DB insertion error:", error);
    }
  }

  private async upsertCategory(categoryName?: string): Promise<void> {
    if (!categoryName || categoryName.trim().toLowerCase() === "uncategorized") return;

    const trimmedName = categoryName.trim().toLowerCase();

    await pool.query(
      `INSERT INTO categories (name, hidden)
       SELECT ?, 0
       FROM DUAL
       WHERE NOT EXISTS (
         SELECT 1 FROM categories WHERE LOWER(TRIM(name)) = ?
       )`,
      [trimmedName, trimmedName]
    );
  }

  private async updateLastAccessed(serverId: string): Promise<void> {
    try {
      await pool.query(
        `UPDATE servers SET last_accessed = NOW() WHERE id = ?`,
        [serverId]
      );
      console.log(`[INFO] Updated last_accessed for server: ${serverId}`);
    } catch (error) {
      console.error(
        `[ERROR] Failed to update last_accessed for ${serverId}:`,
        error
      );
    }
  }
}
