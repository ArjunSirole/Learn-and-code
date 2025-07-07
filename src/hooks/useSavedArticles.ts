import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TokenStorage } from "../utils/tokenStorage";
import { getUserIdFromToken } from "../utils/jwtUtils";
import { SavedArticle } from "../interfaces/savedArticle";
import {
  getSavedArticles,
  deleteSavedArticle,
} from "../services/savedArticlesService";

export const useSavedArticles = () => {
  const [articles, setArticles] = useState<SavedArticle[]>([]);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmArticle, setConfirmArticle] = useState<SavedArticle | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = TokenStorage.getToken();
    if (!token) {
      navigate("/");
      return;
    }
    fetchSavedArticles();
  }, [navigate]);

  const fetchSavedArticles = async () => {
    setError("");
    try {
      const userId = getUserIdFromToken();
      if (!userId) throw new Error("Invalid user.");
      const data = await getSavedArticles();
      setArticles(data);
    } catch (err) {
      console.error("[useSavedArticles.fetch]:", err);
      setError("Failed to load saved articles.");
    }
  };

  const handleConfirmRemove = async () => {
    if (!confirmArticle) return;

    setLoading(true);
    setError("");

    try {
      await deleteSavedArticle(confirmArticle.id);
      setArticles((prev) => prev.filter((a) => a.id !== confirmArticle.id));
      setToastMessage("Article removed successfully.");
      setConfirmArticle(null);
    } catch (err) {
      console.error("[useSavedArticles.remove]:", err);
      setError("Failed to remove article.");
      setConfirmArticle(null);
    } finally {
      setLoading(false);
    }
  };

  return {
    articles,
    error,
    toastMessage,
    setToastMessage,
    confirmArticle,
    setConfirmArticle,
    loading,
    handleConfirmRemove,
  };
};
