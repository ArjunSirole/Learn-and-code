import { useEffect, useState } from "react";
import { getPreferences, savePreferences } from "../services/profileService";
import { getUserIdFromToken, getUserNameFromToken } from "../utils/jwtUtils";
import { NotificationConfig } from "../interfaces/notificationConfig";
import { useNavigate } from "react-router-dom";

export const useProfile = () => {
  const [preferences, setPreferences] = useState<NotificationConfig>({
    business: false,
    entertainment: false,
    sports: false,
    technology: false,
    keywords: "",
  });
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const userId = getUserIdFromToken();
    if (!userId) {
      navigate("/");
    } else {
      loadPreferences();
    }
  }, [navigate]);

  const loadPreferences = async () => {
    try {
      const config = await getPreferences();
      setPreferences({
        business: Boolean(config.business),
        entertainment: Boolean(config.entertainment),
        sports: Boolean(config.sports),
        technology: Boolean(config.technology),
        keywords: config.keywords || "",
      });
    } catch (err) {
      setError("Failed to load preferences.");
    }
  };

  const handleSave = async () => {
    try {
      await savePreferences(preferences);
      setToastMessage("Preferences saved successfully.");
    } catch {
      setToastMessage("Failed to save preferences.");
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setPreferences((prev) => ({ ...prev, [name]: checked }));
  };

  const handleKeywordsChange = (keywords: string) => {
    setPreferences((prev) => ({ ...prev, keywords }));
  };

  return {
    preferences,
    error,
    toastMessage,
    setToastMessage,
    handleSave,
    handleCheckboxChange,
    handleKeywordsChange,
    userName: getUserNameFromToken(),
  };
};
