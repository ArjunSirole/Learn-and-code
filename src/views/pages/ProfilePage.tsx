import React, { JSX } from "react";
import NavigationBar from "../components/NavigationBar";
import Toast from "../components/Toast";
import "../styles/ProfilePage.css";
import { useProfile } from "../../hooks/useProfile";
import { NotificationConfig } from "../../interfaces/notificationConfig";

function ProfilePage(): JSX.Element {
  const {
    preferences,
    error,
    toastMessage,
    setToastMessage,
    handleSave,
    handleCheckboxChange,
    handleKeywordsChange,
    userName,
  } = useProfile();

  return (
    <>
      <NavigationBar />
      <div className="profile-container">
        <h1 className="page-title">Your Profile</h1>
        <div className="profile-card">
          <p>
            <strong>Name:</strong> {userName}
          </p>
        </div>

        <div className="preferences-card">
          <h3>Notification Preferences</h3>
          {error && <div className="error">{error}</div>}

          <div className="checkbox-group">
            {(
              ["business", "entertainment", "sports", "technology"] as Array<
                keyof NotificationConfig
              >
            ).map((topic) => (
              <label key={topic}>
                <input
                  type="checkbox"
                  name={topic}
                  checked={preferences[topic] as boolean}
                  onChange={(e) =>
                    handleCheckboxChange(topic, e.target.checked)
                  }
                />
                {topic.charAt(0).toUpperCase() + topic.slice(1)}
              </label>
            ))}
          </div>

          <label className="keywords-label">
            Keywords (comma-separated)
            <input
              type="text"
              value={preferences.keywords}
              onChange={(e) => handleKeywordsChange(e.target.value)}
            />
          </label>

          <button className="save-button" onClick={handleSave}>
            Save Preferences
          </button>
        </div>
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </>
  );
}

export default ProfilePage;
