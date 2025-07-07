import { useState, useEffect } from "react";
import {
  fetchHeadlines,
  saveArticle,
  submitFeedback,
  reportArticle,
} from "../services/headlineService";
import { fetchCategories } from "../services/searchService";
import { Article } from "../interfaces/article";

const ARTICLES_PER_PAGE = 20;

export const useHeadlines = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    article: Article;
    type: "save" | "like" | "dislike" | "report";
  } | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [banKeywords, setBanKeywords] = useState("");

  const [category, setCategory] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    setCategory("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadHeadlines();
    }, 200);
    return () => clearTimeout(timeout);
  }, [currentPage, category, startDate, endDate]);

  useEffect(() => {
    fetchCategories()
      .then((cats) =>
        setAvailableCategories(
          Array.from(new Set(cats.map((c) => c.trim().toLowerCase())))
        )
      )
      .catch(() => setAvailableCategories([]));
  }, []);

  const loadHeadlines = async () => {
    setError("");
    setLoading(true);
    setArticles([]);
    try {
      const { articles, total } = await fetchHeadlines(
        ARTICLES_PER_PAGE,
        (currentPage - 1) * ARTICLES_PER_PAGE,
        category,
        startDate,
        endDate
      );

      const seenTitles = new Set<string>();
      const uniqueArticles = articles.filter((article) => {
        const titleKey = article.title.trim().toLowerCase();
        if (seenTitles.has(titleKey)) return false;
        seenTitles.add(titleKey);
        return true;
      });

      setArticles(uniqueArticles);
      setTotalResults(total ?? uniqueArticles.length);
    } catch (err) {
      console.error("[useHeadlines.loadHeadlines]:", err);
      setError("No articles available.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;

    const { article, type } = confirmAction;
    setSubmitting(true);

    try {
      if (type === "save") {
        await saveArticle(article);
        setToastMessage("Article saved successfully.");
      } else if (type === "like" || type === "dislike") {
        await submitFeedback(
          article.id,
          type.toUpperCase() as "LIKE" | "DISLIKE"
        );
        setToastMessage(`Article ${type}d.`);
      } else if (type === "report") {
        if (!reportReason.trim()) {
          setToastMessage("Please enter a reason.");
          return;
        }
        await reportArticle(
          article.id,
          reportReason,
          banKeywords
            .split(",")
            .map((kw) => kw.trim())
            .filter(Boolean)
        );
        setToastMessage("Article reported successfully.");
      }
    } catch (err) {
      console.error("[useHeadlines.handleConfirm]:", err);
      setToastMessage("Operation failed.");
    } finally {
      setConfirmAction(null);
      setReportReason("");
      setBanKeywords("");
      setSubmitting(false);
    }
  };

  return {
    articles,
    currentPage,
    setCurrentPage,
    totalResults,
    error,
    loading,
    toastMessage,
    setToastMessage,
    confirmAction,
    setConfirmAction,
    reportReason,
    setReportReason,
    banKeywords,
    setBanKeywords,
    handleConfirm,
    submitting,
    category,
    setCategory,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    availableCategories,
  };
};
