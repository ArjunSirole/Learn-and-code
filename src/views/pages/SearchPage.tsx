import React, { JSX } from "react";
import { useSearch } from "../../hooks/useSearch";
import NavigationBar from "../components/NavigationBar";
import "../styles/SearchPage.css";

function SearchPage(): JSX.Element {
  const {
    query,
    category,
    startDate,
    endDate,
    sortBy,
    articles,
    error,
    handleInputChange,
    handleSearch,
    availableCategories,
  } = useSearch();

  return (
    <>
      <NavigationBar />
      <div className="search-container">
        <h2>Search Articles</h2>
        {error && <div className="error">{error}</div>}

        <form className="filters" onSubmit={handleSearch}>
          <label>
            Keyword
            <input
              type="text"
              name="query"
              value={query}
              onChange={handleInputChange}
              required
            />
          </label>

          <label>
            Category
            <select
              name="category"
              value={category}
              onChange={handleInputChange}
            >
              <option value="">All Categories</option>
              {availableCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </label>

          <label>
            Start Date
            <input
              type="date"
              name="startDate"
              value={startDate}
              onChange={handleInputChange}
            />
          </label>

          <label>
            End Date
            <input
              type="date"
              name="endDate"
              value={endDate}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Sort By
            <select name="sortBy" value={sortBy} onChange={handleInputChange}>
              <option value="date">Date</option>
              <option value="relevance">Relevance</option>
              <option value="likes">Most Liked</option>
              <option value="dislikes">Most Disliked</option>
            </select>
          </label>

          <button type="submit">Search</button>
        </form>

        {articles.length > 0 && (
          <ul className="search-results">
            {articles.map((article) => (
              <li key={article.id} className="search-item">
                <h3>{article.title}</h3>
                <p>
                  <strong>Source:</strong> {article.source}
                </p>
                <p>
                  <strong>Published:</strong>{" "}
                  {new Date(article.published_at).toLocaleString()}
                </p>
                <p>
                  <strong>Likes:</strong> {article.like_count ?? 0} |{" "}
                  <strong>Dislikes:</strong> {article.dislike_count ?? 0}
                </p>
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  Read Full Article
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default SearchPage;
