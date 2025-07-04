import React, { JSX, useEffect, useState } from "react";
import apiClient from "../../api/apiClient";
import NavigationBar from "../components/NavigationBar";
import ConfirmationModal from "../components/ConfirmationModal";
import Toast from "../components/Toast";
import "../styles/AdminReportsPage.css";
import { ReportedArticle, BannedKeyword } from "../../interfaces/adminReports";

function AdminReportsPage(): JSX.Element {
  const [reports, setReports] = useState<ReportedArticle[]>([]);
  const [keywords, setKeywords] = useState<BannedKeyword[]>([]);
  const [error, setError] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [confirmAction, setConfirmAction] = useState<{
    type:
      | "hide"
      | "unhide"
      | "dismiss"
      | "enableKeyword"
      | "disableKeyword"
      | "deleteKeyword";
    report?: ReportedArticle;
    keyword?: BannedKeyword;
  } | null>(null);

  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    fetchReports();
    fetchKeywords();
  }, []);

  async function fetchReports(): Promise<void> {
    setError("");
    try {
      const response = await apiClient.get<ReportedArticle[]>("/admin/reports");
      setReports(response.data);
    } catch (err) {
      console.error("[AdminReportsPage.fetchReports]:", err);
      setError("Failed to load reports.");
    }
  }

  async function fetchKeywords(): Promise<void> {
    setError("");
    try {
      const response = await apiClient.get<BannedKeyword[]>("/admin/banned-keywords");
      setKeywords(response.data);
    } catch (err) {
      console.error("[AdminReportsPage.fetchKeywords]:", err);
      setError("Failed to load keywords.");
    }
  }

  async function handleHideArticle(articleId: number): Promise<void> {
    await apiClient.put(`/admin/articles/${articleId}/hide`);
    setToastMessage("Article hidden.");
  }

  async function handleUnhideArticle(articleId: number): Promise<void> {
    await apiClient.put(`/admin/articles/${articleId}/unhide`);
    setToastMessage("Article unhidden.");
  }

  async function handleDismissReport(reportId: number): Promise<void> {
    await apiClient.put(`/admin/reports/${reportId}/dismiss`);
    setToastMessage("Report dismissed.");
  }

  async function handleEnableKeyword(keywordId: number): Promise<void> {
    await apiClient.put(`/admin/banned-keywords/${keywordId}/enable`);
    setToastMessage("Keyword enabled.");
  }

  async function handleDisableKeyword(keywordId: number): Promise<void> {
    await apiClient.put(`/admin/banned-keywords/${keywordId}/disable`);
    setToastMessage("Keyword disabled.");
  }

  async function handleDeleteKeyword(keywordId: number): Promise<void> {
    await apiClient.delete(`/admin/banned-keywords/${keywordId}`);
    setToastMessage("Keyword deleted.");
  }

  async function handleConfirm(): Promise<void> {
    if (!confirmAction) return;
    setSubmitting(true);
    try {
      switch (confirmAction.type) {
        case "hide":
          if (confirmAction.report) {
            await handleHideArticle(confirmAction.report.article_id);
          }
          break;
        case "unhide":
          if (confirmAction.report) {
            await handleUnhideArticle(confirmAction.report.article_id);
          }
          break;
        case "dismiss":
          if (confirmAction.report) {
            await handleDismissReport(confirmAction.report.report_id);
          }
          break;
        case "enableKeyword":
          if (confirmAction.keyword) {
            await handleEnableKeyword(confirmAction.keyword.id);
          }
          break;
        case "disableKeyword":
          if (confirmAction.keyword) {
            await handleDisableKeyword(confirmAction.keyword.id);
          }
          break;
        case "deleteKeyword":
          if (confirmAction.keyword) {
            await handleDeleteKeyword(confirmAction.keyword.id);
          }
          break;
        default:
          break;
      }
      await fetchReports();
      await fetchKeywords();
    } catch (err) {
      console.error("[AdminReportsPage.handleConfirm]:", err);
      setError("Operation failed.");
    } finally {
      setSubmitting(false);
      setConfirmAction(null);
    }
  }

  function getConfirmDescription(): string {
    if (!confirmAction) return "";
    switch (confirmAction.type) {
      case "hide":
        return `Hide article "${confirmAction.report?.title ?? "Unknown"}"?`;
      case "unhide":
        return `Unhide article "${confirmAction.report?.title ?? "Unknown"}"?`;
      case "dismiss":
        return `Dismiss this report for "${confirmAction.report?.title ?? "Unknown"}"?`;
      case "enableKeyword":
        return `Enable keyword "${confirmAction.keyword?.keyword ?? "Unknown"}"?`;
      case "disableKeyword":
        return `Disable keyword "${confirmAction.keyword?.keyword ?? "Unknown"}"?`;
      case "deleteKeyword":
        return `Delete keyword "${confirmAction.keyword?.keyword ?? "Unknown"}"? This action cannot be undone.`;
      default:
        return "";
    }
  }

  return (
    <>
      <NavigationBar />
      <div className="reports-container">
        <h2>Reported Articles</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}

        <table className="reports-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Reason</th>
              <th>Reported At</th>
              <th>Reports Count</th>
              <th>Hidden?</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.report_id}>
                <td>
                  <a
                    href={report.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {report.title}
                  </a>
                </td>
                <td>{report.reason}</td>
                <td>{new Date(report.created_at).toLocaleString()}</td>
                <td>{report.report_count}</td>
                <td>{report.is_hidden ? "Yes" : "No"}</td>
                <td className="report-actions">
                  {!report.is_hidden ? (
                    <button
                      onClick={() =>
                        setConfirmAction({ type: "hide", report })
                      }
                    >
                      Hide Article
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        setConfirmAction({ type: "unhide", report })
                      }
                    >
                      Unhide Article
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setConfirmAction({ type: "dismiss", report })
                    }
                  >
                    Dismiss Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Banned / Blocked Keywords</h2>

        <table className="reports-table">
          <thead>
            <tr>
              <th>Keyword</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {keywords.map((kw) => (
              <tr key={kw.id}>
                <td>{kw.keyword}</td>
                <td>{kw.enabled ? "Enabled" : "Disabled"}</td>
                <td className="keyword-actions">
                  {kw.enabled ? (
                    <button
                      onClick={() =>
                        setConfirmAction({
                          type: "disableKeyword",
                          keyword: kw,
                        })
                      }
                    >
                      Disable
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        setConfirmAction({
                          type: "enableKeyword",
                          keyword: kw,
                        })
                      }
                    >
                      Enable
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setConfirmAction({
                        type: "deleteKeyword",
                        keyword: kw,
                      })
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmAction && (
        <ConfirmationModal
          title="Confirm Action"
          description={getConfirmDescription()}
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
          loading={submitting}
        />
      )}

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </>
  );
}

export default AdminReportsPage;
