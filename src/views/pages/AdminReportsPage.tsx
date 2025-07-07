import React, { JSX } from "react";
import NavigationBar from "../components/NavigationBar";
import ConfirmationModal from "../components/ConfirmationModal";
import Toast from "../components/Toast";
import { useAdminReports } from "../../hooks/useAdminReports";
import "../styles/AdminReportsPage.css";

function AdminReportsPage(): JSX.Element {
  const {
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
  } = useAdminReports();

  const getConfirmDescription = (): string => {
    if (!confirmAction) return "";
    switch (confirmAction.type) {
      case "hide":
        return `Hide article "${confirmAction.report?.title ?? "Unknown"}"?`;
      case "unhide":
        return `Unhide article "${confirmAction.report?.title ?? "Unknown"}"?`;
      case "dismiss":
        return `Dismiss this report for "${
          confirmAction.report?.title ?? "Unknown"
        }"?`;
      case "enableKeyword":
        return `Enable keyword "${
          confirmAction.keyword?.keyword ?? "Unknown"
        }"?`;
      case "disableKeyword":
        return `Disable keyword "${
          confirmAction.keyword?.keyword ?? "Unknown"
        }"?`;
      case "deleteKeyword":
        return `Delete keyword "${
          confirmAction.keyword?.keyword ?? "Unknown"
        }"? This action cannot be undone.`;
      case "hideCategory":
        return `Hide category "${confirmAction.category?.name ?? "Unknown"}"?`;
      case "unhideCategory":
        return `Unhide category "${
          confirmAction.category?.name ?? "Unknown"
        }"?`;
      default:
        return "";
    }
  };

  return (
    <>
      <NavigationBar />
      <div className="reports-container">
        <h2>Reported Articles</h2>
        {error && <p className="error">{error}</p>}

        <div className="table-section">
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
        </div>

        <h2>Banned / Blocked Keywords</h2>
        <div className="table-section">
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
                  <td>
                    <span
                      className={`status-badge ${
                        kw.enabled ? "enabled" : "disabled"
                      }`}
                    >
                      {kw.enabled ? "Enabled" : "Disabled"}
                    </span>
                  </td>
                  <td className="report-actions">
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
                      className="danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2>Categories</h2>
        <div className="table-section">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>{cat.name}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        cat.hidden ? "disabled" : "enabled"
                      }`}
                    >
                      {cat.hidden ? "Hidden" : "Visible"}
                    </span>
                  </td>
                  <td className="report-actions">
                    {cat.hidden ? (
                      <button
                        onClick={() =>
                          setConfirmAction({
                            type: "unhideCategory",
                            category: cat,
                          })
                        }
                      >
                        Unhide
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          setConfirmAction({
                            type: "hideCategory",
                            category: cat,
                          })
                        }
                      >
                        Hide
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
