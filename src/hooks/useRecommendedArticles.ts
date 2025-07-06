import { useState, useEffect } from "react";
import {
  fetchRecommendedArticles,
  markArticleAsRead,
} from "../services/recommendationService";
import { Article } from "../interfaces/article";

export function useRecommendedArticles(limit = 20) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const totalPages = Math.ceil(total / limit);

  const loadArticles = async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const offset = (page - 1) * limit;
      const { articles: fetchedArticles, total } =
        await fetchRecommendedArticles({
          limit,
          offset,
        });

      const uniqueArticlesMap = new Map<string, Article>();
      fetchedArticles.forEach((article) => {
        if (!uniqueArticlesMap.has(article.title)) {
          uniqueArticlesMap.set(article.title, article);
        }
      });

      setArticles(Array.from(uniqueArticlesMap.values()));
      setTotal(total);
      setCurrentPage(page);
    } catch (err) {
      console.error("[useRecommendedArticles.loadArticles]:", err);
      setError("Failed to load recommended articles.");
    } finally {
      setLoading(false);
    }
  };

  const handleArticleRead = async (articleId: number) => {
    try {
      await markArticleAsRead(articleId);
      setToastMessage("Article marked as read.");
    } catch (err) {
      console.error("[useRecommendedArticles.handleArticleRead]:", err);
    }
  };

  useEffect(() => {
    loadArticles(currentPage);
  }, [currentPage]);

  return {
    articles,
    total,
    totalPages,
    currentPage,
    setPage: setCurrentPage,
    loading,
    error,
    toastMessage,
    setToastMessage,
    handleArticleRead,
  };
}
