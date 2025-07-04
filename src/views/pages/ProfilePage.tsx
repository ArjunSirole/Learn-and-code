import React, { JSX, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import NavigationBar from "../components/NavigationBar";
import Toast from "../components/Toast";
import {
  getUserIdFromToken,
  getUserNameFromToken
} from "../../utils/jwtUtils";
import "../styles/ProfilePage.css";
import { NotificationConfig } from "../../interfaces/notificationConfig";


function ProfilePage(): JSX.Element {
  const [preferences, setPreferences] = useState<NotificationConfig>({
    business: false,
    entertainment: false,
    sports: false,
    technology: false,
    keywords: "",
  });
  const [error, setError] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (!userId) {
      navigate("/");
      return;
    }
    fetchPreferences();
  }, [navigate]);

  async function fetchPreferences(): Promise<void> {
    try {
      const userId = getUserIdFromToken();
      if (!userId) throw new Error("Invalid user.");

      const response = await apiClient.get<{
        data: NotificationConfig & { id: number; user_id: number };
      }>(`/notifications/${userId}`);

      const config = response.data.data;
      if (config) {
        setPreferences({
          business: Boolean(config.business),
          entertainment: Boolean(config.entertainment),
          sports: Boolean(config.sports),
          technology: Boolean(config.technology),
          keywords: config.keywords || "",
        });
      }
    } catch (err: unknown) {
      console.error("[ProfilePage.fetchPreferences]:", err);
      setError("Failed to load preferences.");
    }
  }

  async function handleSavePreferences(): Promise<void> {
    try {
      const userId = getUserIdFromToken();
      if (!userId) throw new Error("Invalid user.");

      await apiClient.post("/notifications/configure", {
        user_id: userId,
        ...preferences,
      });

      setToastMessage("Preferences saved successfully.");
    } catch (err: unknown) {
      console.error("[ProfilePage.handleSavePreferences]:", err);
      setToastMessage("Failed to save preferences.");
    }
  }

  function handleCheckboxChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    const { name, checked } = event.target;
    setPreferences((prev) => ({
      ...prev,
      [name]: checked,
    }));
  }

  function handleKeywordsChange(
    event: React.ChangeEvent<HTMLInputElement>
  ): void {
    setPreferences((prev) => ({
      ...prev,
      keywords: event.target.value,
    }));
  }

  return (
    <>
      <NavigationBar />
      <div className="profile-container">
        <h1 className="page-title">Your Profile</h1>
        <div className="profile-card">
          <p>
            <strong>Name:</strong> {getUserNameFromToken()}
          </p>
        </div>

        <div className="preferences-card">
          <h3>Notification Preferences</h3>
          {error && (
            <div className="error" aria-live="polite">
              {error}
            </div>
          )}

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                name="business"
                checked={preferences.business}
                onChange={handleCheckboxChange}
              />
              Business
            </label>
            <label>
              <input
                type="checkbox"
                name="entertainment"
                checked={preferences.entertainment}
                onChange={handleCheckboxChange}
              />
              Entertainment
            </label>
            <label>
              <input
                type="checkbox"
                name="sports"
                checked={preferences.sports}
                onChange={handleCheckboxChange}
              />
              Sports
            </label>
            <label>
              <input
                type="checkbox"
                name="technology"
                checked={preferences.technology}
                onChange={handleCheckboxChange}
              />
              Technology
            </label>
          </div>

          <label className="keywords-label">
            Keywords (comma-separated)
            <input
              type="text"
              value={preferences.keywords}
              onChange={handleKeywordsChange}
            />
          </label>

          <button className="save-button" onClick={handleSavePreferences}>
            Save Preferences
          </button>
        </div>
      </div>

      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </>
  );
}

export default ProfilePage;
