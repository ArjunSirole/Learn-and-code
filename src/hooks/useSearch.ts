import { useState, useEffect } from "react";
import { Article } from "../interfaces/article";
import { searchArticles, fetchCategories } from "../services/searchService";

const ARTICLES_PER_PAGE = 20;

export const useSearch = () => {
  const [query, setQuery] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date");
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await fetchCategories();
        const uniqueCategories = Array.from(
          new Set(
            categories.map((cat) => cat?.trim().toLowerCase()).filter(Boolean)
          )
        );
        setAvailableCategories(uniqueCategories);
      } catch (err) {
        console.error("[useSearch] Failed to load categories:", err);
        setAvailableCategories([]);
      }
    };

    loadCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
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
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setArticles([]);
    setCurrentPage(1);

    if (!query.trim()) {
      setError("Please enter a search query.");
      return;
    }

    try {
      const result = await searchArticles({
        query,
        category,
        startDate,
        endDate,
        sortBy,
      });
      setArticles(result ?? []);
    } catch (err) {
      console.error("[useSearch.handleSearch]:", err);
      setError("No articles available");
    }
  };

  const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE);
  const paginatedArticles = articles.slice(
    (currentPage - 1) * ARTICLES_PER_PAGE,
    currentPage * ARTICLES_PER_PAGE
  );

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return {
    query,
    category,
    startDate,
    endDate,
    sortBy,
    error,
    articles: paginatedArticles,
    handleInputChange,
    handleSearch,
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    availableCategories,
  };
};
