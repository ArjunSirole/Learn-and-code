import apiClient from "../api/apiClient";
import { SavedArticle } from "../interfaces/savedArticle";

export const getSavedArticles = async (): Promise<SavedArticle[]> => {
  const response = await apiClient.get<SavedArticle[]>("/news/saved");
  return response.data;
};

export const deleteSavedArticle = async (articleId: string): Promise<void> => {
  await apiClient.delete(`/news/saved/${articleId}`);
};
