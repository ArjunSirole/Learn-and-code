import React, { JSX } from "react";
import { useHeadlines } from "../../hooks/useHeadlines";
import NavigationBar from "../components/NavigationBar";
import ConfirmationModal from "../components/ConfirmationModal";
import Toast from "../components/Toast";
import Spinner from "../components/Spinner";
import "../styles/HeadlinesPage.css";
import fallbackImage from "../../assets/fallback.jpg";

function HeadlinesPage(): JSX.Element {
  const {
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
  } = useHeadlines();

  const totalPages = Math.ceil(totalResults / 20);

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
        <h1 className="page-title">Welcome to News Aggregator!</h1>
        <h2>Latest Headlines</h2>

        <div className="filters">
          <label>
            Category:
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {capitalize(cat)}
                </option>
              ))}
            </select>
          </label>

          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>

          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>

        {loading && <Spinner />}
        {error && <p className="error">{error}</p>}

        <div className="articles-grid">
          {articles.map((article) => (
            <div key={`${article.id || article.url}`} className="article-card">
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
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
                : "Report this article? Provide reason and optional keywords."
            }
            showTextarea={confirmAction.type === "report"}
            textareaValue={reportReason}
            onTextareaChange={setReportReason}
            showInput={confirmAction.type === "report"}
            inputValue={banKeywords}
            inputPlaceholder="Comma-separated keywords"
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
