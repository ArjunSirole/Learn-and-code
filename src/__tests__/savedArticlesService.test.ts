import apiClient from "../api/apiClient";
import {
  getSavedArticles,
  deleteSavedArticle,
} from "../services/savedArticlesService";
import axiosMock from "axios-mock-adapter";
import { SavedArticle } from "../interfaces/savedArticle";

const mockSavedArticles: SavedArticle[] = [
  {
    id: "1",
    title: "Article 1",
    url: "abc@espn.com",
    source: "thenewsapi",
  },
  {
    id: "2",
    title: "Article 2",
    url: "def@bbc.com",
    source: "thenewsapi",
  },
];

describe("Saved Articles Service", () => {
  let mock: axiosMock;

  beforeEach(() => {
    mock = new axiosMock(apiClient);
  });

  afterEach(() => {
    mock.restore();
  });

  describe("getSavedArticles", () => {
    it("should fetch saved articles successfully", async () => {
      mock.onGet("/news/saved").reply(200, mockSavedArticles);

      const articles = await getSavedArticles();

      expect(articles).toEqual(mockSavedArticles);
      expect(articles.length).toBe(2);
    });

    it("should handle error when fetching saved articles", async () => {
      mock.onGet("/news/saved").reply(500);

      await expect(getSavedArticles()).rejects.toThrow(
        "Request failed with status code 500"
      );
    });
  });

  describe("deleteSavedArticle", () => {
    it("should delete saved article successfully", async () => {
      const articleId = "1";

      mock.onDelete(`/news/saved/${articleId}`).reply(200);

      await expect(deleteSavedArticle(articleId)).resolves.not.toThrow();
    });

    it("should handle error when deleting saved article", async () => {
      const articleId = "1";

      mock.onDelete(`/news/saved/${articleId}`).reply(500);

      await expect(deleteSavedArticle(articleId)).rejects.toThrow(
        "Request failed with status code 500"
      );
    });
  });
});
