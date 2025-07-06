import apiClient from "../api/apiClient";
import {
  ReportedArticle,
  BannedKeyword,
  Category,
} from "../interfaces/adminReports";

export const fetchReports = async (): Promise<ReportedArticle[]> => {
  try {
    const response = await apiClient.get<ReportedArticle[]>("/admin/reports");
    return response.data;
  } catch (err) {
    throw new Error("Failed to load reports.");
  }
};

export const fetchKeywords = async (): Promise<BannedKeyword[]> => {
  try {
    const response = await apiClient.get<BannedKeyword[]>(
      "/admin/banned-keywords"
    );
    return response.data;
  } catch (err) {
    throw new Error("Failed to load keywords.");
  }
};

export const handleHideArticle = async (articleId: number): Promise<void> => {
  await apiClient.put(`/admin/articles/${articleId}/hide`);
};

export const handleUnhideArticle = async (articleId: number): Promise<void> => {
  await apiClient.put(`/admin/articles/${articleId}/unhide`);
};

export const handleDismissReport = async (reportId: number): Promise<void> => {
  await apiClient.put(`/admin/reports/${reportId}/dismiss`);
};

export const handleEnableKeyword = async (keywordId: number): Promise<void> => {
  await apiClient.put(`/admin/banned-keywords/${keywordId}/enable`);
};

export const handleDisableKeyword = async (
  keywordId: number
): Promise<void> => {
  await apiClient.put(`/admin/banned-keywords/${keywordId}/disable`);
};

export const handleDeleteKeyword = async (keywordId: number): Promise<void> => {
  await apiClient.delete(`/admin/banned-keywords/${keywordId}`);
};

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<Category[]>("/admin/all-categories");
  return response.data;
};

export const handleHideCategory = async (name: string): Promise<void> => {
  await apiClient.put(`/admin/categories/${name}/hide`);
};

export const handleUnhideCategory = async (name: string): Promise<void> => {
  await apiClient.put(`/admin/categories/${name}/unhide`);
};
