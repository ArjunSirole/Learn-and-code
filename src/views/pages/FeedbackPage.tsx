import React, { JSX } from "react";
import NavigationBar from "../components/NavigationBar";
import "../styles/SavedArticlesPage.css";
import { useFeedbackArticles } from "../../hooks/useFeedbackArticles";

function FeedbackPage(): JSX.Element {
  const { articles, error, sort, capitalize, formatDate } =
    useFeedbackArticles();

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
                      <strong>Published:</strong>{" "}
                      {formatDate(article.published_at)}
                    </p>
                  )}
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
