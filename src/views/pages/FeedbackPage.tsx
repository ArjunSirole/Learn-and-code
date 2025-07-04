import React, { JSX, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TokenStorage } from "../../utils/tokenStorage";
import apiClient from "../../api/apiClient";
import NavigationBar from "../components/NavigationBar";
import "../styles/SavedArticlesPage.css";
import { FeedbackArticle } from "../../interfaces/feedbackArticle";


function FeedbackPage(): JSX.Element {
  const [articles, setArticles] = useState<FeedbackArticle[]>([]);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const sort = searchParams.get("sort") || "like";

  useEffect(() => {
    const token = TokenStorage.getToken();
    if (!token) {
      navigate("/");
      return;
    }
    fetchFeedbackArticles();
  }, [navigate, sort]);

  async function fetchFeedbackArticles(): Promise<void> {
    try {
      const response = await apiClient.get<FeedbackArticle[]>(
        `/news/sorted-feedback?sort=${sort}`
      );
      setArticles(response.data);
    } catch (err: unknown) {
      console.error("[FeedbackPage.fetchFeedbackArticles]:", err);
      setError("Failed to load feedback articles.");
    }
  }

  function capitalize(word?: string): string {
    return word ? word.charAt(0).toUpperCase() + word.slice(1) : "";
  }

  function formatDate(dateStr?: string): string {
    if (!dateStr) return "";
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

  return (
    <>
      <NavigationBar />
      <div className="saved-container">
        <h1 className="page-title">
          {sort === "like" ? "Liked Articles" : "Disliked Articles"}
        </h1>
        {error && <div className="error">{error}</div>}
        {articles.length === 0 ? (
          <p>You have no {sort === "like" ? "liked" : "disliked"} articles.</p>
        ) : (
          <div className="saved-articles-list">
            {articles.map((article) => (
              <div key={article.id} className="saved-article-card">
                <div className="saved-article-content">
                  <h3>{article.title}</h3>
                  <p>
                    <strong>Feedback:</strong> {capitalize(article.feedback)}
                  </p>
                  {article.category && (
                    <p>
                      <strong>Category:</strong> {capitalize(article.category)}
                    </p>
                  )}
                  {article.published_at && (
                    <p>
                      <strong>Published:</strong> {formatDate(article.published_at)}
                    </p>
                  )}
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    Read Full Article
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default FeedbackPage;
