import React, { JSX, useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import NavigationBar from "../components/NavigationBar";
import Toast from "../components/Toast";
import ConfirmationModal from "../components/ConfirmationModal";
import "../styles/HeadlinesPage.css";
import { Article } from "../../interfaces/article";

const ARTICLES_PER_PAGE = 20;

function HeadlinesPage(): JSX.Element {
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [confirmAction, setConfirmAction] = useState<{
    article: Article;
    type: "save" | "like" | "dislike" | "report";
  } | null>(null);

  const [reportReason, setReportReason] = useState<string>("");
  const [banKeywords, setBanKeywords] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchArticles();
  }, [currentPage]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  async function fetchArticles(): Promise<void> {
    setError("");
    setLoading(true);
    try {
      const params = {
        limit: String(ARTICLES_PER_PAGE),
        offset: String((currentPage - 1) * ARTICLES_PER_PAGE),
      };

      const response = await apiClient.get<{
        articles: Article[];
        total: number;
      }>("/news/headlines", { params });

      setArticles(response.data.articles);
      setTotalResults(response.data.total ?? response.data.articles.length);
    } catch (err) {
      console.error("[HeadlinesPage]:", err);
      setError("Failed to fetch articles.");
    } finally {
      setLoading(false);
    }
  }

  function capitalize(word?: string): string {
    return word ? word.charAt(0).toUpperCase() + word.slice(1) : "";
  }

  function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  }

  async function handleConfirm(): Promise<void> {
    if (!confirmAction) return;
    const { article, type } = confirmAction;

    setSubmitting(true);
    try {
      if (type === "save") {
        await apiClient.post("/news/save", {
          articleId: article.id,
          title: article.title,
          url: article.url,
          source: article.source,
        });
        setToastMessage("Article saved successfully.");
      } else if (type === "like" || type === "dislike") {
        await apiClient.post(`/news/${article.id}/feedback`, {
          feedback: type.toUpperCase(),
        });
        setToastMessage(`Article ${type}d.`);
      } else if (type === "report") {
        if (!reportReason.trim()) {
          setToastMessage("Please enter a reason.");
          return;
        }
        await apiClient.post(`/news/${article.id}/report`, {
          reason: reportReason,
          banKeywords: banKeywords
            .split(",")
            .map((kw) => kw.trim())
            .filter(Boolean),
        });
        setToastMessage("Article reported successfully.");
      }
    } catch (err) {
      console.error("[HeadlinesPage.handleConfirm]:", err);
      setToastMessage("Operation failed.");
    } finally {
      setConfirmAction(null);
      setReportReason("");
      setBanKeywords("");
      setSubmitting(false);
    }
  }

  const totalPages = Math.ceil(totalResults / ARTICLES_PER_PAGE);

  return (
    <>
      <NavigationBar />
      <div className="headlines-container">
        <h1 className="page-title">Welcome to News Aggregator!</h1>
        <h2>Latest Headlines</h2>

        {loading && <p>Loading articles...</p>}
        {error && <p className="error">{error}</p>}

        <div className="articles-grid">
          {articles.map((article) => (
            <div key={article.id} className="article-card">
              {article.image_url && (
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="article-image"
                />
              )}
              <div className="article-content">
                <h3>{article.title}</h3>
                {article.description && <p>{article.description}</p>}
                <p>
                  <strong>Source:</strong> {article.source || "Unknown"}
                </p>
                {article.category && (
                  <p>
                    <strong>Category:</strong> {capitalize(article.category)}
                  </p>
                )}
                <p>
                  <strong>Published:</strong> {formatDate(article.published_at)}
                </p>

                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  Read Full Article
                </a>

                <div className="action-buttons">
                  <button
                    onClick={() => setConfirmAction({ article, type: "save" })}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setConfirmAction({ article, type: "like" })}
                  >
                    Like
                  </button>
                  <button
                    onClick={() =>
                      setConfirmAction({ article, type: "dislike" })
                    }
                  >
                    Dislike
                  </button>
                  <button
                    onClick={() =>
                      setConfirmAction({ article, type: "report" })
                    }
                  >
                    Report
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}

        {confirmAction && (
          <ConfirmationModal
            title="Confirm Action"
            description={
              confirmAction.type === "save"
                ? "Save this article?"
                : confirmAction.type === "like"
                ? "Like this article?"
                : confirmAction.type === "dislike"
                ? "Dislike this article?"
                : "Report this article? Please provide a reason and optional keywords below."
            }
            showTextarea={confirmAction.type === "report"}
            textareaValue={reportReason}
            onTextareaChange={setReportReason}
            showInput={confirmAction.type === "report"}
            inputValue={banKeywords}
            inputPlaceholder="Comma-separated keywords to ban"
            onInputChange={setBanKeywords}
            onConfirm={handleConfirm}
            onCancel={() => setConfirmAction(null)}
            loading={submitting}
          />
        )}
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </>
  );
}

export default HeadlinesPage;
