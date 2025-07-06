import pool from "../config/db";
import { RowDataPacket } from "mysql2";
import { v4 as uuidv4 } from "uuid";
import { REPORT_THRESHOLD } from "../config/constants";

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
      image_url: article.urlToImage || null,
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
      image_url: article.image_url || null,
    };
  }

  async saveHeadlines(articles: any[]): Promise<any[]> {
    const saved: any[] = [];
    for (const article of articles) {
      try {
        if (article.category) {
          await pool.query(`INSERT IGNORE INTO categories (name) VALUES (?)`, [
            article.category,
          ]);
        }

        await pool.query(
          `INSERT INTO articles (
              external_id, title, url, source, published_at, category, description, categories, image_url
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              title = VALUES(title),
              source = VALUES(source),
              published_at = VALUES(published_at),
              category = VALUES(category),
              description = VALUES(description),
              categories = VALUES(categories),
              image_url = VALUES(image_url)`,
          [
            article.external_id,
            article.title,
            article.url,
            article.source,
            article.published_at,
            article.category,
            article.description,
            JSON.stringify(article.categories || []),
            article.image_url,
          ]
        );
        saved.push(article);
      } catch (error) {
        console.error("Error saving article:", error);
      }
    }
    return saved;
  }

  async getArticlesFromDB(
    startDate?: string,
    endDate?: string,
    category?: string,
    sortBy: string = "date",
    limit = 20,
    offset = 0
  ) {
    let sql = `
    SELECT 
      a.id,
      a.title,
      a.url,
      a.source,
      a.category,
      a.published_at,
      a.description,
      a.categories,
      a.image_url
    FROM articles a
    LEFT JOIN categories c ON a.category = c.name
    WHERE a.is_hidden = 0
      AND (c.hidden IS NULL OR c.hidden = 0)
      AND NOT EXISTS (
        SELECT 1 FROM banned_keywords bk
        WHERE 
          a.title LIKE CONCAT('%', bk.keyword, '%')
          OR a.description LIKE CONCAT('%', bk.keyword, '%')
      )
  `;

    const params: any[] = [];

    if (startDate && endDate) {
      sql += ` AND a.published_at BETWEEN ? AND ?`;
      params.push(`${startDate} 00:00:00`, `${endDate} 23:59:59`);
    } else if (startDate) {
      sql += ` AND a.published_at >= ?`;
      params.push(`${startDate} 00:00:00`);
    } else if (endDate) {
      sql += ` AND a.published_at <= ?`;
      params.push(`${endDate} 23:59:59`);
    }

    if (category) {
      sql += ` AND a.category = ?`;
      params.push(category);
    }

    switch (sortBy) {
      case "likes":
        sql += ` ORDER BY a.like_count DESC`;
        break;
      case "dislikes":
        sql += ` ORDER BY a.dislike_count DESC`;
        break;
      default:
        sql += ` ORDER BY a.published_at DESC`;
    }

    sql += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await pool.query<RowDataPacket[]>(sql, params);
    return rows;
  }

  async countArticles(startDate?: string, endDate?: string, category?: string) {
    let sql = `
        SELECT COUNT(*) AS total
        FROM articles a
        LEFT JOIN categories c ON a.category = c.name
        WHERE a.is_hidden = 0
          AND (c.hidden IS NULL OR c.hidden = 0)
          AND NOT EXISTS (
            SELECT 1 FROM banned_keywords bk
            WHERE 
              a.title LIKE CONCAT('%', bk.keyword, '%')
              OR a.description LIKE CONCAT('%', bk.keyword, '%')
          )
      `;
    const params: any[] = [];

    if (startDate && endDate) {
      sql += ` AND a.published_at BETWEEN ? AND ?`;
      params.push(`${startDate} 00:00:00`, `${endDate} 23:59:59`);
    } else if (startDate) {
      sql += ` AND a.published_at >= ?`;
      params.push(`${startDate} 00:00:00`);
    } else if (endDate) {
      sql += ` AND a.published_at <= ?`;
      params.push(`${endDate} 23:59:59`);
    }
    if (category) {
      sql += ` AND a.category = ?`;
      params.push(category);
    }

    const [rows] = await pool.query<RowDataPacket[]>(sql, params);
    return rows[0].total;
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
          a.id, a.title, a.url, a.source, a.image_url,
          MAX(af.feedback) AS feedback
        FROM saved_articles sa
        JOIN articles a ON sa.article_id = a.id
        LEFT JOIN article_feedback af ON sa.article_id = af.article_id AND af.user_id = ?
        WHERE sa.user_id = ?
          AND a.is_hidden = 0
        GROUP BY a.id, a.title, a.url, a.source, a.image_url
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
      SELECT 
        a.id, a.title, a.url, a.source, a.published_at, a.description, a.image_url,
        COALESCE(l.like_count, 0) AS like_count,
        COALESCE(d.dislike_count, 0) AS dislike_count
      FROM articles a
      LEFT JOIN (
        SELECT article_id, COUNT(*) AS like_count
        FROM article_feedback
        WHERE feedback = 'LIKE'
        GROUP BY article_id
      ) l ON a.id = l.article_id
      LEFT JOIN (
        SELECT article_id, COUNT(*) AS dislike_count
        FROM article_feedback
        WHERE feedback = 'DISLIKE'
        GROUP BY article_id
      ) d ON a.id = d.article_id
      WHERE a.is_hidden = 0
        AND MATCH(a.title, a.description, a.source) AGAINST(? IN NATURAL LANGUAGE MODE)
    `;

    const params: any[] = [query];

    if (category) {
      sql += ` AND (
        a.category = ?
        OR JSON_CONTAINS(a.categories, ?)
      )`;
      params.push(category, `"${category}"`);
    }

    if (startDate && endDate) {
      sql += " AND a.published_at BETWEEN ? AND ?";
      params.push(startDate, endDate);
    }

    if (sortBy === "likes") {
      sql += " ORDER BY like_count DESC";
    } else if (sortBy === "dislikes") {
      sql += " ORDER BY dislike_count DESC";
    } else if (sortBy === "date") {
      sql += " ORDER BY a.published_at DESC";
    } else {
      sql += " ORDER BY MATCH(a.title, a.description) AGAINST(?) DESC";
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
      `SELECT a.id, a.title, a.url, a.image_url, af.feedback
        FROM article_feedback af
        JOIN articles a ON af.article_id = a.id
        WHERE af.user_id = ? AND af.feedback = ?
          AND a.is_hidden = 0`,
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

  async reportArticle(
    userId: number,
    articleId: number,
    reason: string,
    banKeywords?: string[]
  ) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      await conn.query(
        `INSERT INTO article_reports (user_id, article_id, reason)
        VALUES (?, ?, ?)`,
        [userId, articleId, reason]
      );

      const [reportCountRows] = await conn.query<RowDataPacket[]>(
        `SELECT COUNT(*) AS count FROM article_reports WHERE article_id = ?`,
        [articleId]
      );
      const reportCount = reportCountRows[0].count;

      if (reportCount >= REPORT_THRESHOLD) {
        await conn.query(`UPDATE articles SET is_hidden = 1 WHERE id = ?`, [
          articleId,
        ]);
      }

      if (banKeywords && banKeywords.length > 0) {
        for (const keyword of banKeywords) {
          if (keyword.trim()) {
            await conn.query(
              `INSERT IGNORE INTO banned_keywords (keyword, enabled)
              VALUES (?, 1)`,
              [keyword.trim()]
            );
          }
        }
      }

      await conn.commit();
    } catch (error: any) {
      await conn.rollback();
      if (error.code === "ER_DUP_ENTRY") {
        throw new Error("You have already reported this article.");
      }
      throw error;
    } finally {
      conn.release();
    }
  }

  async markArticleAsRead(userId: number, articleId: number): Promise<void> {
    await pool.query(
      `INSERT IGNORE INTO article_reads (user_id, article_id) VALUES (?, ?)`,
      [userId, articleId]
    );
  }

  async getRecommendedArticles(
    userId: number,
    limit = 20,
    offset = 0
  ): Promise<[any[], number]> {
    console.log("Fetching recommended articles for user:", userId);

    const [countRows] = await pool.query<RowDataPacket[]>(
      `
    SELECT COUNT(*) AS total
    FROM articles a
    LEFT JOIN notification_config nc ON nc.user_id = ?
    LEFT JOIN categories c ON a.category = c.name
    WHERE a.is_hidden = 0
      AND (c.hidden IS NULL OR c.hidden = 0)
      AND NOT EXISTS (
        SELECT 1 FROM banned_keywords bk
        WHERE 
          a.title LIKE CONCAT('%', bk.keyword, '%')
          OR a.description LIKE CONCAT('%', bk.keyword, '%')
      )
  `,
      [userId]
    );
    const total = countRows[0]?.total ?? 0;

    const [rows] = await pool.query<RowDataPacket[]>(
      `
    SELECT 
      a.id,
      a.title,
      a.url,
      a.source,
      a.published_at,
      a.description,
      a.category,
      a.image_url,

      (
        CASE
          WHEN nc.business = 1 AND a.category = 'business' THEN 10
          WHEN nc.entertainment = 1 AND a.category = 'entertainment' THEN 10
          WHEN nc.sports = 1 AND a.category = 'sports' THEN 10
          WHEN nc.technology = 1 AND a.category = 'technology' THEN 10
          ELSE 0
        END
        +
        CASE
          WHEN nc.keywords IS NOT NULL AND (
            a.title LIKE CONCAT('%', nc.keywords, '%') OR 
            a.description LIKE CONCAT('%', nc.keywords, '%')
          ) THEN 15
          ELSE 0
        END
        +
        CASE
          WHEN a.category IN (
            SELECT DISTINCT category FROM articles 
            WHERE id IN (
              SELECT article_id FROM saved_articles WHERE user_id = ?
              UNION
              SELECT article_id FROM article_feedback WHERE user_id = ?
              UNION
              SELECT article_id FROM article_reads WHERE user_id = ?
            )
          ) THEN 5
          ELSE 0
        END
        +
        CASE 
          WHEN a.published_at >= DATE_SUB(NOW(), INTERVAL 3 DAY) THEN 5
          ELSE 0
        END
      ) AS score

    FROM articles a
    LEFT JOIN notification_config nc ON nc.user_id = ?
    LEFT JOIN categories c ON a.category = c.name
    WHERE a.is_hidden = 0
      AND (c.hidden IS NULL OR c.hidden = 0)
      AND NOT EXISTS (
        SELECT 1 FROM banned_keywords bk
        WHERE 
          a.title LIKE CONCAT('%', bk.keyword, '%')
          OR a.description LIKE CONCAT('%', bk.keyword, '%')
      )
    ORDER BY score DESC, a.published_at DESC
    LIMIT ? OFFSET ?
  `,
      [userId, userId, userId, userId, limit, offset]
    );

    console.log("Recommended articles count:", rows.length);
    rows.forEach((row) =>
      console.log(`Score: ${row.score} | Title: ${row.title}`)
    );

    return [rows, total];
  }
}
