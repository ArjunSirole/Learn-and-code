import apiClient from "../api/apiClient";
import { Article } from "../interfaces/article";

export const fetchHeadlines = async (
  limit: number,
  offset: number,
  category?: string,
  startDate?: string,
  endDate?: string
): Promise<{ articles: Article[]; total: number }> => {
  const params: any = { limit, offset };
  if (category) params.category = category;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const res = await apiClient.get<{ articles: Article[]; total: number }>(
    "/news/headlines",
    { params }
  );
  return res.data;
};

export const saveArticle = async (article: Article) => {
  return apiClient.post("/news/save", {
    articleId: article.id,
    title: article.title,
    url: article.url,
    source: article.source,
  });
};

export const submitFeedback = async (id: number, type: "LIKE" | "DISLIKE") => {
  return apiClient.post(`/news/${id}/feedback`, { feedback: type });
};

export const reportArticle = async (
  id: number,
  reason: string,
  keywords: string[]
) => {
  return apiClient.post(`/news/${id}/report`, {
    reason,
    banKeywords: keywords,
  });
};
