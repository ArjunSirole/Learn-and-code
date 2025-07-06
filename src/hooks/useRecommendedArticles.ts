import { useState, useEffect } from "react";
import { fetchRecommendedArticles } from "../services/recommendationService";
import { Article } from "../interfaces/article";

export function useRecommendedArticles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const limit = 20;

  async function loadArticles(page = 1) {
    setLoading(true);
    setError("");
    try {
      const offset = (page - 1) * limit;
      const { articles, total } = await fetchRecommendedArticles({ limit, offset });
      setArticles(articles);
      setTotal(total);
      setCurrentPage(page);
    } catch (err) {
      console.error("Error loading recommended articles:", err);
      setError("Failed to load recommended articles.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  return {
    articles,
    total,
    currentPage,
    setPage: loadArticles,
    loading,
    error,
  };
}
