import apiClient from "../api/apiClient";
import { Article } from "../interfaces/article";

export interface FetchRecommendedResponse {
  articles: Article[];
  total: number;
}

export const fetchRecommendedArticles = async ({
  limit = 20,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
} = {}): Promise<{ articles: Article[]; total: number }> => {
  const res = await apiClient.get("/news/recommended", {
    params: { limit, offset },
  });
  return res.data;
};

export async function markArticleAsRead(articleId: number): Promise<void> {
  await apiClient.post(`/news/mark-read`, { articleId });
}
