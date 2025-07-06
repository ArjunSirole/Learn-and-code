import apiClient from "../api/apiClient";
import { fetchCategories, searchArticles } from "../services/searchService";
import axiosMock from "axios-mock-adapter";
import { Article } from "../interfaces/article";

describe("API Service", () => {
  let mock: axiosMock;

  beforeEach(() => {
    mock = new axiosMock(apiClient);
  });

  afterEach(() => {
    mock.restore();
  });

  describe("fetchCategories", () => {
    it("should fetch categories and return the category names", async () => {
      mock
        .onGet("/admin/categories")
        .reply(200, [
          { name: "Technology" },
          { name: "Health" },
          { name: "Science" },
        ]);

      const categories = await fetchCategories();

      expect(categories).toEqual(["Technology", "Health", "Science"]);
    });

    it("should handle empty categories", async () => {
      mock.onGet("/admin/categories").reply(200, []);

      const categories = await fetchCategories();

      expect(categories).toEqual([]);
    });

    it("should throw error on failure", async () => {
      mock.onGet("/admin/categories").reply(500);

      await expect(fetchCategories()).rejects.toThrow(
        "Request failed with status code 500"
      );
    });
  });

  describe("searchArticles", () => {
    it("should search articles with query parameters and return articles", async () => {
      const mockArticles: Article[] = [
        {
          id: 1,
          title: "Tech News",
          url: "https://example.com/tech-news",
          published_at: "2023-01-01T12:00:00Z",
          source: "TechSource",
        },
        {
          id: 2,
          title: "Health Update",
          url: "https://example.com/health-update",
          published_at: "2023-01-02T12:00:00Z",
          source: "HealthDaily",
        },
      ];

      mock
        .onGet(
          "/news/search?query=tech&category=Technology&startDate=2023-01-01&endDate=2023-12-31&sortBy=date"
        )
        .reply(200, {
          articles: mockArticles,
        });

      const searchParams = {
        query: "tech",
        category: "Technology",
        startDate: "2023-01-01",
        endDate: "2023-12-31",
        sortBy: "date",
      };

      const articles = await searchArticles(searchParams);

      expect(articles).toEqual(mockArticles);
      expect(articles.length).toBe(2);
    });

    it("should return an empty array if no articles are found", async () => {
      mock.onGet("/news/search?query=nonexistent").reply(200, {
        articles: [],
      });

      const searchParams = { query: "nonexistent" };

      const articles = await searchArticles(searchParams);

      expect(articles).toEqual([]);
    });

    it("should handle API error correctly", async () => {
      mock.onGet("/news/search?query=error").reply(500);

      const searchParams = { query: "error" };

      await expect(searchArticles(searchParams)).rejects.toThrow(
        "Request failed with status code 500"
      );
    });
  });
});
