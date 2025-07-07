import { useState, useEffect } from "react";
import {
  fetchReports,
  fetchKeywords,
  fetchCategories,
  handleHideArticle,
  handleUnhideArticle,
  handleDismissReport,
  handleEnableKeyword,
  handleDisableKeyword,
  handleDeleteKeyword,
  handleHideCategory,
  handleUnhideCategory,
} from "../services/adminReportsService";
import {
  ReportedArticle,
  BannedKeyword,
  Category,
} from "../interfaces/adminReports";

export const useAdminReports = () => {
  const [reports, setReports] = useState<ReportedArticle[]>([]);
  const [keywords, setKeywords] = useState<BannedKeyword[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{
    type: string;
    report?: ReportedArticle;
    keyword?: BannedKeyword;
    category?: Category;
  } | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [r, k, c] = await Promise.all([
        fetchReports(),
        fetchKeywords(),
        fetchCategories(),
      ]);
      setReports(r);
      setKeywords(k);
      setCategories(c);
    } catch (err) {
      setError("Failed to load data.");
    }
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    setSubmitting(true);
    try {
      switch (confirmAction.type) {
        case "hide":
          await handleHideArticle(confirmAction.report!.article_id);
          break;
        case "unhide":
          await handleUnhideArticle(confirmAction.report!.article_id);
          break;
        case "dismiss":
          await handleDismissReport(confirmAction.report!.report_id);
          break;
        case "enableKeyword":
          await handleEnableKeyword(confirmAction.keyword!.id);
          break;
        case "disableKeyword":
          await handleDisableKeyword(confirmAction.keyword!.id);
          break;
        case "deleteKeyword":
          await handleDeleteKeyword(confirmAction.keyword!.id);
          break;
        case "hideCategory":
          await handleHideCategory(confirmAction.category!.name);
          break;
        case "unhideCategory":
          await handleUnhideCategory(confirmAction.category!.name);
          break;
        default:
          break;
      }
      await fetchData();
      setToastMessage("Action successful!");
    } catch (err) {
      setError("Operation failed.");
    } finally {
      setSubmitting(false);
      setConfirmAction(null);
    }
  };

  return {
    reports,
    keywords,
    categories,
    error,
    toastMessage,
    confirmAction,
    submitting,
    setConfirmAction,
    handleConfirm,
    setToastMessage,
  };
};
