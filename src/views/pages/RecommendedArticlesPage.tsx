import React, { JSX, useEffect, useState } from "react";
import NavigationBar from "../components/NavigationBar";
import Spinner from "../components/Spinner";
import Toast from "../components/Toast";
import "../styles/HeadlinesPage.css"; 
import fallbackImage from "../../assets/fallback.jpg";
import {
  fetchRecommendedArticles,
  markArticleAsRead,
} from "../../services/recommendationService";
import { Article } from "../../interfaces/article";

function RecommendedArticlesPage(): JSX.Element {
  const [articles, setArticles] = useState<Article[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  const ARTICLES_PER_PAGE = 20;
  const totalPages = Math.ceil(total / ARTICLES_PER_PAGE);

  useEffect(() => {
    loadArticles();
  }, [page]);

  async function loadArticles(): Promise<void> {
    setLoading(true);
    setError("");
    try {
      const { articles: fetchedArticles, total } = await fetchRecommendedArticles({
        limit: ARTICLES_PER_PAGE,
        offset: (page - 1) * ARTICLES_PER_PAGE,
      });
      setArticles(fetchedArticles || []);
      setTotal(total || 0);
    } catch (err: unknown) {
      console.error("[RecommendedArticlesPage.loadArticles]:", err);
      setError("Failed to load recommended articles.");
    } finally {
      setLoading(false);
    }
  }

  const capitalize = (word?: string): string =>
    word ? word.charAt(0).toUpperCase() + word.slice(1) : "";

  const formatDate = (dateStr: string): string => {
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

  return (
    <>
      <NavigationBar />
      <div className="headlines-container">
        <h1 className="page-title">Recommended Articles For You</h1>

        {loading && <Spinner />}
        {error && <p className="error">{error}</p>}

        <div className="articles-grid">
          {articles.map((article) => (
            <div key={article.id} className="article-card">
              <img
                src={article.image_url || fallbackImage}
                alt={article.title}
                className="article-image"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = fallbackImage;
                }}
              />
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
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => markArticleAsRead(article.id)}
                >
                  Read Full Article
                </a>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </>
  );
}

export default RecommendedArticlesPage;
