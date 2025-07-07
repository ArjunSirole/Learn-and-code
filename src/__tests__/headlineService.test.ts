import apiClient from "../api/apiClient";
import {
  fetchHeadlines,
  saveArticle,
  submitFeedback,
  reportArticle,
} from "../services/headlineService";
import { Article } from "../interfaces/article";

jest.mock("../api/apiClient");

const mockArticle: Article = {
  id: 1,
  title: "Test Article",
  url: "https://example.com",
  source: "Test Source",
  description: "",
  published_at: "",
  category: "",
  image_url: "",
};

describe("headlineService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("fetchHeadlines should call GET with correct params", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue({
      data: { articles: [mockArticle], total: 1 },
    });

    const result = await fetchHeadlines(
      10,
      0,
      "tech",
      "2023-01-01",
      "2023-12-31"
    );

    expect(apiClient.get).toHaveBeenCalledWith("/news/headlines", {
      params: {
        limit: 10,
        offset: 0,
        category: "tech",
        startDate: "2023-01-01",
        endDate: "2023-12-31",
      },
    });
    expect(result.articles.length).toBe(1);
    expect(result.total).toBe(1);
  });

  it("saveArticle should call POST with article data", async () => {
    await saveArticle(mockArticle);

    expect(apiClient.post).toHaveBeenCalledWith("/news/save", {
      articleId: mockArticle.id,
      title: mockArticle.title,
      url: mockArticle.url,
      source: mockArticle.source,
    });
  });

  it("submitFeedback should post feedback", async () => {
    await submitFeedback(1, "LIKE");

    expect(apiClient.post).toHaveBeenCalledWith("/news/1/feedback", {
      feedback: "LIKE",
    });
  });

  it("reportArticle should send reason and keywords", async () => {
    await reportArticle(1, "Fake news", ["keyword1", "keyword2"]);

    expect(apiClient.post).toHaveBeenCalledWith("/news/1/report", {
      reason: "Fake news",
      banKeywords: ["keyword1", "keyword2"],
    });
  });
});
