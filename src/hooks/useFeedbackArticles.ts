import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TokenStorage } from "../utils/tokenStorage";
import { FeedbackArticle } from "../interfaces/feedbackArticle";
import { fetchSortedFeedbackArticles } from "../services/feedbackApiService";

export const useFeedbackArticles = () => {
  const [articles, setArticles] = useState<FeedbackArticle[]>([]);
  const [error, setError] = useState<string>("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sort = (searchParams.get("sort") || "like") as "like" | "dislike";

  useEffect(() => {
    const token = TokenStorage.getToken();
    if (!token) {
      navigate("/");
      return;
    }
    loadFeedbackArticles();
  }, [navigate, sort]);

  const loadFeedbackArticles = async () => {
    setError("");
    try {
      const data = await fetchSortedFeedbackArticles(sort);
      setArticles(data);
    } catch (err) {
      console.error("[useFeedbackArticles]:", err);
      setError("Failed to load feedback articles.");
    }
  };

  const capitalize = (word?: string): string =>
    word ? word.charAt(0).toUpperCase() + word.slice(1) : "";

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  };

  return {
    articles,
    error,
    sort,
    capitalize,
    formatDate,
  };
};
