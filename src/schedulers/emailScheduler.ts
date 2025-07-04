import cron from "node-cron";
import pool from "../config/db";
import { sendEmail } from "../utils/emailService";
import { RowDataPacket } from "mysql2";
import { NotificationArticle } from "../interfaces/Notification";
import { NOTIFICATION_CATEGORIES } from "../config/constants";

const DEFAULT_IMAGE_URL = "https://your-cdn-host/default-image.jpg";

export class EmailScheduler {
  constructor(private schedule = "0 */3 * * *") {}

  public start(): void {
    console.log(`[Scheduler] Starting with schedule: ${this.schedule}`);
    cron.schedule(this.schedule, () => this.sendNewsEmails());
  }

  public async insertNotificationsForNewArticle(article: {
    title: string;
    category: string;
    published_at: string;
    url: string;
  }): Promise<void> {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT * FROM notification_config
    `);

    const users = rows as any[];
    for (const user of users) {
      const categoryLower = (article.category ?? "").toLowerCase();

      const enabled =
        NOTIFICATION_CATEGORIES.includes(categoryLower) &&
        user[categoryLower] === 1;

      const keywordArray =
        user.keywords
          ?.split(",")
          .map((k: string) => k.trim())
          .filter(Boolean) || [];

      const keywordMatch = keywordArray.some(
        (k: string) => article.title.includes(k) || article.url.includes(k)
      );

      if (enabled || keywordMatch) {
        await pool.query(
          `
          INSERT INTO notifications (
            user_id, title, category, published_at, url, is_read
          ) VALUES (?, ?, ?, ?, ?, 0)
        `,
          [
            user.user_id,
            article.title,
            categoryLower,
            article.published_at,
            article.url,
          ]
        );
      }
    }
  }

  private async sendNewsEmails(): Promise<void> {
    try {
      const [configs] = await pool.query<RowDataPacket[]>(`
        SELECT c.*, u.email, u.name
        FROM notification_config c
        JOIN users u ON u.id = c.user_id
      `);

      const users = configs as any[];
      console.log(`[Scheduler] Users to notify: ${users.length}`);

      for (const config of users) {
        const categories = this.extractEnabledCategories(config);
        const keywords =
          config.keywords
            ?.split(",")
            .map((k: string) => k.trim())
            .filter(Boolean) ?? [];

        if (categories.length === 0 && keywords.length === 0) {
          console.log(`[SKIP] No preferences for ${config.email}`);
          continue;
        }

        const articles = await this.fetchArticles(
          config.user_id,
          categories,
          keywords
        );

        if (!articles.length) {
          console.log(`[SKIP] No matching articles for ${config.email}`);
          continue;
        }

        const emailHtml = this.formatHtmlContent(
          articles,
          config.name || "there"
        );

        console.log(`[SEND] Email sent to ${config.email}`);
        await sendEmail(
          config.email,
          "Your Personalized News Update",
          emailHtml
        );
      }

      console.log(`[Scheduler] Email notifications completed.`);
    } catch (error) {
      console.error(`[Scheduler Error]:`, error);
    }
  }

  private extractEnabledCategories(config: any): string[] {
    return NOTIFICATION_CATEGORIES.filter(
      (cat: string | number) => config[cat] === 1
    );
  }

  private async fetchArticles(
    userId: number,
    categories: string[],
    keywords: string[]
  ): Promise<NotificationArticle[]> {
    const placeholders = categories.map(() => "?").join(",") || "''";
    const categoryFilter = categories.length
      ? `AND n.category IN (${placeholders})`
      : "";
    const keywordFilter = keywords.length
      ? `AND (${keywords
          .map(() => `(a.title LIKE ? OR a.description LIKE ?)`)
          .join(" OR ")})`
      : "";

    const queryParams = [
      userId,
      ...categories,
      ...keywords.flatMap((k) => [`%${k}%`, `%${k}%`]),
    ];

    const [rows] = await pool.query<RowDataPacket[]>(
      `
      SELECT 
        n.title,
        n.category,
        n.published_at,
        n.url,
        n.description AS notification_description,
        a.title AS article_title,
        a.url AS article_url,
        a.published_at AS article_published_at,
        a.description AS article_description,
        a.image_url
      FROM notifications n
      JOIN articles a ON n.url = a.url 
      WHERE n.user_id = ? AND n.is_read = 0
      ${categoryFilter}
      ${keywordFilter}
      ORDER BY n.published_at DESC
      LIMIT 5
    `,
      queryParams
    );

    return rows as NotificationArticle[];
  }

  private formatHtmlContent(
    articles: NotificationArticle[],
    userName: string
  ): string {
    return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width:600px; margin:0 auto;">
        <h2 style="color:#2c3e50;">Hi ${userName},</h2>
        <p>Here are the latest news articles we think you'll be interested in:</p>
        ${articles
          .map(
            (article) => `
          <div style="border-bottom:1px solid #ddd; padding:20px 0;">
            <h3 style="margin:0 0 10px 0; color:#2c3e50;">${
              article.article_title
            }</h3>
            <p><strong>Category:</strong> ${article.category}</p>
            <p><strong>Published:</strong> ${article.article_published_at}</p>
            <img src="${
              article.image_url || DEFAULT_IMAGE_URL
            }" alt="Article Image" style="max-width:100%; border-radius:4px; margin:10px 0;">
            <p>${article.article_description || "No description available."}</p>
            <a href="${
              article.article_url
            }" target="_blank" style="display:inline-block; margin-top:10px; padding:10px 15px; background-color:#3498db; color:#fff; text-decoration:none; border-radius:4px;">
              Read Full Article
            </a>
          </div>
        `
          )
          .join("")}
        <p style="margin-top:30px; font-size:12px; color:#777;">
          You received this email because you subscribed to personalized news notifications.
        </p>
      </div>
    `;
  }
}
