import React, { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TokenStorage } from "../../utils/tokenStorage";
import { getUserIdFromToken } from "../../utils/jwtUtils";
import apiClient from "../../api/apiClient";
import NavigationBar from "../components/NavigationBar";
import ConfirmationModal from "../components/ConfirmationModal";
import Toast from "../components/Toast";
import "../styles/NotificationsPage.css";
import { Notification } from "../../interfaces/notification";

function NotificationsPage(): JSX.Element {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [confirmAction, setConfirmAction] = useState<{
    type: "mark-all" | "mark-one";
    notificationId?: number;
  } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = TokenStorage.getToken();
    if (!token) {
      navigate("/");
      return;
    }
    fetchNotifications();
  }, [navigate]);

  async function fetchNotifications(): Promise<void> {
    setLoading(true);
    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        throw new Error("Invalid user token.");
      }
      const response = await apiClient.get<{ data: Notification[] }>(
        `/notifications/${userId}/articles`
      );
      const unread = response.data.data.filter((n) => !n.is_read);
      setNotifications(unread);
    } catch (err: unknown) {
      console.error("[NotificationsPage.fetchNotifications]:", err);
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirm(): Promise<void> {
    if (!confirmAction) return;

    const userId = getUserIdFromToken();
    if (!userId) {
      setError("Invalid user.");
      return;
    }

    setConfirmLoading(true);

    try {
      if (confirmAction.type === "mark-all") {
        const ids = notifications.map((n) => n.id);
        if (ids.length === 0) return;

        await apiClient.post("/notifications/mark-read", {
          user_id: userId,
          notificationIds: ids,
        });

        setNotifications([]);
        setToastMessage("All notifications marked as read.");
      } else if (confirmAction.type === "mark-one" && confirmAction.notificationId) {
        await apiClient.post("/notifications/mark-read", {
          user_id: userId,
          notificationIds: [confirmAction.notificationId],
        });

        setNotifications((prev) =>
          prev.filter((n) => n.id !== confirmAction.notificationId)
        );
        setToastMessage("Notification marked as read.");
      }
      setConfirmAction(null);
    } catch (err: unknown) {
      console.error("[NotificationsPage.handleConfirm]:", err);
      setError("Failed to mark notifications as read.");
      setConfirmAction(null);
    } finally {
      setConfirmLoading(false);
    }
  }

  return (
    <>
      <NavigationBar />
      <div className="notifications-container">
        <h1 className="page-title">Your Notifications</h1>
        {error && <div className="error">{error}</div>}
        {loading && <p>Loading notifications...</p>}

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
