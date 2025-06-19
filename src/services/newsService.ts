import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { v4 as uuidv4 } from "uuid";

function sanitizeDatetime(dateString?: string): string {
  if (!dateString) {
    return new Date().toISOString().slice(0, 19).replace("T", " ");
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date format: ${dateString}`);
  }
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export class NewsService {
  private generateUniqueId(): string {
    return uuidv4();
  }

  mapNewsApiArticle(article: any): any {
    return {
      external_id: article.url || this.generateUniqueId(),
      title: article.title || "No Title",
      url: article.url || "",
      source: article.source?.name || "Unknown Source",
      category: article.category || null,
      published_at: article.publishedAt
        ? sanitizeDatetime(article.publishedAt)
        : null,
      description: article.description || null,
      categories: article.category ? [article.category] : [],
    };
  }

  mapTheNewsApiArticle(article: any): any {
    return {
      external_id: article.url || article.uuid || this.generateUniqueId(),
      title: article.title || "No Title",
      url: article.url || "",
      source: article.source || "Unknown Source",
      category: article.category || null,
      published_at: article.published_at
        ? sanitizeDatetime(article.published_at)
        : null,
      description: article.description || article.snippet || null,
      categories:
        article.categories || (article.category ? [article.category] : []),
    };
  }

  async saveHeadlines(articles: any[]): Promise<any[]> {
    const saved: any[] = [];

    for (const article of articles) {
      try {
        await pool.query(
          `INSERT INTO articles (external_id, title, url, source, published_at, category, description, categories)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
             title = VALUES(title),
             source = VALUES(source),
             published_at = VALUES(published_at),
             category = VALUES(category),
             description = VALUES(description),
             categories = VALUES(categories)`,
          [
            article.external_id,
            article.title,
            article.url,
            article.source,
            article.published_at,
            article.category,
            article.description,
            JSON.stringify(article.categories || []),
          ]
        );
        saved.push(article);
      } catch (error) {
        console.error("Error saving article:", error);
      }
    }

    return saved;
  }

  async getArticlesFromDB(date?: string) {
    let sql = `SELECT id, title, url, source, category, published_at, categories FROM articles`;
    const params: any[] = [];

    if (date) {
      sql += " WHERE DATE(published_at) = ?";
      params.push(date);
    }

    const [rows] = await pool.query<RowDataPacket[]>(sql, params);
    return rows;
  }

  async saveArticle(id: string, title: string, url: string, source: string) {
    await pool.query(
      "INSERT IGNORE INTO articles (id, title, url, source) VALUES (?, ?, ?, ?)",
      [id, title, url, source]
    );
  }

  async associateArticleWithUser(userId: number, articleId: string) {
    await pool.query(
      "INSERT IGNORE INTO saved_articles (user_id, article_id) VALUES (?, ?)",
      [userId, articleId]
    );
  }

  async getSavedArticles(userId: number) {
    const [rows] = await pool.query(
      `
      SELECT 
        a.id, a.title, a.url, a.source,
        MAX(af.feedback) AS feedback
      FROM saved_articles sa
      JOIN articles a ON sa.article_id = a.id
      LEFT JOIN article_feedback af ON sa.article_id = af.article_id AND af.user_id = ?
      WHERE sa.user_id = ?
      GROUP BY a.id, a.title, a.url, a.source
      `,
      [userId, userId]
    );
    return rows;
  }

  async searchArticles(
    query: string,
    category?: string,
    startDate?: string,
    endDate?: string,
    sortBy?: string
  ) {
    let sql = `
      SELECT id, title, url, source, published_at
      FROM articles
      WHERE MATCH(title, description, source) AGAINST(? IN NATURAL LANGUAGE MODE)
    `;
    const params: any[] = [query];

    if (category) {
      sql += ` AND (
        category = ?
        OR JSON_CONTAINS(categories, ?)
      )`;
      params.push(category, `"${category}"`);
    }

    if (startDate && endDate) {
      sql += " AND published_at BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }

    if (sortBy === "date") {
      sql += " ORDER BY published_at DESC";
    } else {
      sql += " ORDER BY MATCH(title, description) AGAINST(?) DESC";
      params.push(query);
    }

    const [rows] = await pool.query<RowDataPacket[]>(sql, params);
    return rows;
  }

  async submitFeedback(
    userId: number,
    articleId: number,
    feedback: "LIKE" | "DISLIKE"
  ) {
    await pool.query(
      `INSERT INTO article_feedback (user_id, article_id, feedback)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE feedback = VALUES(feedback)`,
      [userId, articleId, feedback]
    );
  }

  async getFeedbackArticles(userId: number, feedback: "LIKE" | "DISLIKE") {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT a.id, a.title, a.url, af.feedback
       FROM article_feedback af
       JOIN articles a ON af.article_id = a.id
       WHERE af.user_id = ? AND af.feedback = ?`,
      [userId, feedback]
    );
    return rows;
  }

  async deleteSavedArticle(userId: number, articleId: string) {
    await pool.query(
      `DELETE FROM saved_articles WHERE user_id = ? AND article_id = ?`,
      [userId, articleId]
    );
  }

  async reportArticle(userId: number, articleId: number, reason: string): Promise<void> {
    await pool.query(
      `INSERT INTO article_reports (user_id, article_id, reason)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE reason = VALUES(reason), created_at = CURRENT_TIMESTAMP`,
      [userId, articleId, reason]
    );
  }
  
}
