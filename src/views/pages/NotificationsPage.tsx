import React, { JSX, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import ConfirmationModal from "../components/ConfirmationModal";
import Toast from "../components/Toast";
import Spinner from "../components/Spinner";
import "../styles/NotificationsPage.css";
import { TokenStorage } from "../../utils/tokenStorage";
import { useNotifications } from "../../hooks/useNotifications";

function NotificationsPage(): JSX.Element {
  const navigate = useNavigate();

  const {
    notifications,
    error,
    loading,
    toastMessage,
    setToastMessage,
    confirmAction,
    setConfirmAction,
    confirmLoading,
    handleConfirm,
  } = useNotifications();

  useEffect(() => {
    const token = TokenStorage.getToken();
    if (!token) navigate("/");
  }, [navigate]);

  return (
    <>
      <NavigationBar />
      <div className="notifications-container">
        <h1 className="page-title">Your Notifications</h1>

        {error && <div className="error">{error}</div>}
        {loading && <Spinner />}

        {notifications.length === 0 && !loading ? (
          <p>You have no unread notifications.</p>
        ) : (
          <>
            <button
              className="mark-read-button"
              onClick={() => setConfirmAction({ type: "mark-all" })}
              disabled={notifications.length === 0}
            >
              Mark All as Read
            </button>
            <div className="notifications-grid">
              {notifications.map((n) => (
                <div key={n.id} className="notification-card">
                  <h3>{n.title}</h3>
                  <p>
                    <strong>Category:</strong> {n.category}
                  </p>
                  <p>
                    <strong>Published:</strong>{" "}
                    {new Date(n.published_at).toLocaleString()}
                  </p>
                  {n.description && <p>{n.description}</p>}
                  {n.source && (
                    <p>
                      <strong>Source:</strong> {n.source}
                    </p>
                  )}
                  <a href={n.url} target="_blank" rel="noopener noreferrer">
                    Read Full Article
                  </a>
                  <div className="notification-actions">
                    <button
                      onClick={() =>
                        setConfirmAction({
                          type: "mark-one",
                          notificationId: n.id,
                        })
                      }
                      className="mark-read-single"
                    >
                      Mark as Read
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {confirmAction && (
        <ConfirmationModal
          title="Confirm Action"
          description={
            confirmAction.type === "mark-all"
              ? "Are you sure you want to mark all notifications as read?"
              : "Are you sure you want to mark this notification as read?"
          }
          confirmLabel="Mark as Read"
          onConfirm={handleConfirm}
          onCancel={() => setConfirmAction(null)}
          loading={confirmLoading}
        />
      )}

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </>
  );
}

export default NotificationsPage;
