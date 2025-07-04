import React, { JSX, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TokenStorage } from "../../utils/tokenStorage";
import apiClient from "../../api/apiClient";
import NavigationBar from "../components/NavigationBar";
import "../styles/SearchPage.css";
import { Article } from "../../interfaces/article";

function SearchPage(): JSX.Element {
  const [query, setQuery] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date");
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  function handleInputChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void {
    const { name, value } = event.target;
    switch (name) {
      case "query":
        setQuery(value);
        break;
      case "category":
        setCategory(value);
        break;
      case "startDate":
        setStartDate(value);
        break;
      case "endDate":
        setEndDate(value);
        break;
      case "sortBy":
        setSortBy(value);
        break;
    }
  }

  async function handleSearch(event: React.FormEvent): Promise<void> {
    event.preventDefault();
    setError("");
    setArticles([]);

    if (!query.trim()) {
      setError("Please enter a search query.");
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("query", query);
      if (category) params.append("category", category);
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);
      if (sortBy) params.append("sortBy", sortBy);

      const response = await apiClient.get<{ articles?: Article[] }>(
        `/news/search?${params.toString()}`
      );
      setArticles(response.data.articles ?? []);
    } catch (err: unknown) {
      console.error("[SearchPage.handleSearch]:", err);
      setError("Failed to fetch articles.");
    }
  }

  return (
    <>
      <NavigationBar />
      <div className="search-container">
        <h2>Search Articles</h2>
        {error && <div className="error">{error}</div>}
        <form className="search-form" onSubmit={handleSearch}>
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
              <option value="business">Business</option>
              <option value="entertainment">Entertainment</option>
              <option value="sports">Sports</option>
              <option value="technology">Technology</option>
              <option value="health">Health</option>
              <option value="general">General</option>
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
