import apiClient from "../api/apiClient";
import { FeedbackArticle } from "../interfaces/feedbackArticle";

export const fetchSortedFeedbackArticles = async (
  sort: "like" | "dislike"
): Promise<FeedbackArticle[]> => {
  const response = await apiClient.get<FeedbackArticle[]>(
    `/news/sorted-feedback?sort=${sort}`
  );
  return response.data;
};
