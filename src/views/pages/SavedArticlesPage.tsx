import React, { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TokenStorage } from "../../utils/tokenStorage";
import apiClient from "../../api/apiClient";
import NavigationBar from "../components/NavigationBar";
import ConfirmationModal from "../components/ConfirmationModal";
import Toast from "../components/Toast";
import { getUserIdFromToken } from "../../utils/jwtUtils";
import "../styles/SavedArticlesPage.css";
import { SavedArticle } from "../../interfaces/savedArticle";

function SavedArticlesPage(): JSX.Element {
  const [articles, setArticles] = useState<SavedArticle[]>([]);
  const [error, setError] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmArticle, setConfirmArticle] = useState<SavedArticle | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = TokenStorage.getToken();
    if (!token) {
      navigate("/");
      return;
    }
    fetchSavedArticles();
  }, [navigate]);

  async function fetchSavedArticles(): Promise<void> {
    setError("");
    try {
      const userId = getUserIdFromToken();
      if (!userId) throw new Error("Invalid user.");
      const response = await apiClient.get<SavedArticle[]>(`/news/saved`);
      setArticles(response.data);
    } catch (err: unknown) {
      console.error("[SavedArticlesPage.fetchSavedArticles]:", err);
      setError("Failed to load saved articles.");
    }
  }

  async function handleConfirmRemove(): Promise<void> {
    if (!confirmArticle) return;

    setLoading(true);
    setError("");

    try {
      await apiClient.delete(`/news/saved/${confirmArticle.id}`);
      setArticles((prev) => prev.filter((a) => a.id !== confirmArticle.id));
      setToastMessage("Article removed successfully.");
      setConfirmArticle(null);
    } catch (err: unknown) {
      console.error("[SavedArticlesPage.handleConfirmRemove]:", err);
      setError("Failed to remove article.");
      setConfirmArticle(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <NavigationBar />
      <div className="saved-container">
        <h1 className="page-title">Your Saved Articles</h1>
        {error && (
          <div className="error" aria-live="assertive">
            {error}
          </div>
        )}
        {articles.length === 0 ? (
          <p>You have no saved articles.</p>
        ) : (
          <div className="saved-articles-list">
            {articles.map((article) => (
              <div key={article.id} className="saved-article-card">
                <div className="saved-article-content">
                  <h3>{article.title}</h3>
                  <p>
                    <strong>Source:</strong> {article.source}
                  </p>
                  {article.feedback && (
                    <p>
                      <strong>Feedback:</strong> {article.feedback}
                    </p>
                  )}
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Read More
                  </a>
                </div>
                <button onClick={() => setConfirmArticle(article)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {confirmArticle && (
        <ConfirmationModal
          title="Confirm Remove"
          description={`Are you sure you want to remove "${confirmArticle.title}"?`}
          confirmLabel="Remove"
          onConfirm={handleConfirmRemove}
          onCancel={() => setConfirmArticle(null)}
          loading={loading}
        />
      )}

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </>
  );
}

export default SavedArticlesPage;
