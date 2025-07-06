import apiClient from "../api/apiClient";
import { Article } from "../interfaces/article";

export const fetchCategories = async (): Promise<string[]> => {
  const response = await apiClient.get<{ name: string }[]>("/admin/categories");
  return response.data.map((c) => c.name);
};

interface SearchParams {
  query: string;
  category?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
}

interface SearchResponse {
  articles: Article[];
}

export const searchArticles = async ({
  query,
  category,
  startDate,
  endDate,
  sortBy,
}: SearchParams): Promise<Article[]> => {
  const params = new URLSearchParams();
  params.append("query", query);
  if (category) params.append("category", category);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  if (sortBy) params.append("sortBy", sortBy);

  const response = await apiClient.get<{ articles: Article[] }>(
    `/news/search?${params.toString()}`
  );

  return response.data.articles ?? [];
};
