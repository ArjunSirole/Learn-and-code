import { NewsService } from "../services/newsService";
import pool from "../config/db";
import { RowDataPacket } from "mysql2";

jest.mock("../config/db");

describe("NewsService Tests", () => {
  let newsService: NewsService;

  beforeEach(() => {
    newsService = new NewsService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("mapNewsApiArticle", () => {
    it("should map the article correctly", () => {
      const apiArticle = {
        url: "http://example.com",
        title: "Test Article",
        source: { name: "News Source" },
        category: "Tech",
        publishedAt: "2023-07-01T12:00:00Z",
        description: "Test description",
        category: "Technology",
        urlToImage: "http://example.com/image.jpg",
      };

      const result = newsService.mapNewsApiArticle(apiArticle);

      expect(result).toEqual({
        external_id: "http://example.com",
        title: "Test Article",
        url: "http://example.com",
        source: "News Source",
        category: "Tech",
        published_at: "2023-07-01 12:00:00",
        description: "Test description",
        categories: ["Technology"],
        image_url: "http://example.com/image.jpg",
      });
    });

    it("should use a generated id if no url is provided", () => {
      const apiArticle = {
        title: "Test Article",
        source: { name: "News Source" },
        category: "Tech",
        publishedAt: "2023-07-01T12:00:00Z",
      };

      const result = newsService.mapNewsApiArticle(apiArticle);

      expect(result.external_id).toHaveLength(36);
    });
  });

  describe("saveHeadlines", () => {
    it("should save articles successfully", async () => {
      const articles = [
        {
          external_id: "12345",
          title: "Test Article",
          url: "http://example.com",
          source: "News Source",
          published_at: "2023-07-01 12:00:00",
          category: "Tech",
          description: "Test description",
          categories: ["Tech"],
          image_url: "http://example.com/image.jpg",
        },
      ];

      pool.query.mockResolvedValueOnce([[]]);

      const result = await newsService.saveHeadlines(articles);

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO articles"),
        expect.arrayContaining([expect.any(String), expect.any(String)])
      );
      expect(result).toEqual(articles);
    });

    it("should handle errors gracefully", async () => {
      const articles = [
        {
          external_id: "12345",
          title: "Test Article",
          url: "http://example.com",
          source: "News Source",
          published_at: "2023-07-01 12:00:00",
          category: "Tech",
          description: "Test description",
          categories: ["Tech"],
          image_url: "http://example.com/image.jpg",
        },
      ];

      pool.query.mockRejectedValueOnce(new Error("Database Error"));

      const result = await newsService.saveHeadlines(articles);

      expect(result).toEqual([]);
    });
  });

  describe("getArticlesFromDB", () => {
    it("should fetch articles with the correct query and parameters", async () => {
      const mockArticles = [
        {
          id: 1,
          title: "Test Article",
          url: "http://example.com",
          source: "News Source",
          category: "Tech",
          published_at: "2023-07-01 12:00:00",
          description: "Test description",
          categories: '["Tech"]',
          image_url: "http://example.com/image.jpg",
        },
      ];

      pool.query.mockResolvedValueOnce([mockArticles]);

      const result = await newsService.getArticlesFromDB(
        "2023-07-01",
        "2023-07-01",
        "Tech"
      );

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM articles"),
        expect.arrayContaining([expect.any(String), expect.any(String), "Tech"])
      );
      expect(result).toEqual(mockArticles);
    });
  });

  describe("countArticles", () => {
    it("should count articles correctly", async () => {
      const mockCount = [{ total: 5 }];
      pool.query.mockResolvedValueOnce([mockCount]);

      const result = await newsService.countArticles(
        "2023-07-01",
        "2023-07-01",
        "Tech"
      );

      expect(result).toBe(5);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT COUNT(*) FROM articles"),
        expect.arrayContaining([expect.any(String), expect.any(String), "Tech"])
      );
    });
  });

  describe("submitFeedback", () => {
    it("should submit feedback successfully", async () => {
      pool.query.mockResolvedValueOnce([[]]);

      const result = await newsService.submitFeedback(1, 1, "LIKE");

      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO article_feedback"),
        [1, 1, "LIKE"]
      );
    });

    it("should handle error when inserting feedback", async () => {
      pool.query.mockRejectedValueOnce(new Error("Database Error"));

      await expect(newsService.submitFeedback(1, 1, "LIKE")).rejects.toThrow(
        "Database Error"
      );
    });
  });

  describe("reportArticle", () => {
    it("should handle article reporting with threshold logic", async () => {
      pool.getConnection.mockResolvedValue({
        beginTransaction: jest.fn(),
        query: jest.fn().mockResolvedValueOnce([{ count: 2 }]),
        commit: jest.fn(),
        rollback: jest.fn(),
        release: jest.fn(),
      });

      await newsService.reportArticle(1, 1, "Inappropriate Content");

      expect(pool.getConnection).toHaveBeenCalled();
      expect(pool.getConnection().commit).toHaveBeenCalled();
    });

    it("should handle errors in reporting", async () => {
      pool.getConnection.mockResolvedValue({
        beginTransaction: jest.fn(),
        query: jest.fn().mockRejectedValueOnce(new Error("DB Error")),
        commit: jest.fn(),
        rollback: jest.fn(),
        release: jest.fn(),
      });

      await expect(
        newsService.reportArticle(1, 1, "Inappropriate Content")
      ).rejects.toThrow("DB Error");
    });
  });

  describe("getSavedArticles", () => {
    it("should fetch saved articles for a user", async () => {
      const mockSavedArticles = [
        {
          id: 1,
          title: "Test Article",
          url: "http://example.com",
          source: "News Source",
          image_url: "http://example.com/image.jpg",
          feedback: "LIKE",
        },
      ];

      pool.query.mockResolvedValueOnce([mockSavedArticles]);

      const result = await newsService.getSavedArticles(1);

      expect(result).toEqual(mockSavedArticles);
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT a.id, a.title, a.url"),
        [1, 1]
      );
    });
  });
});
