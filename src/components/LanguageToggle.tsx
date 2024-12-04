import React from "react";
import { useFlomoStore } from "../store";

export const LanguageToggle: React.FC = () => {
  const { settings, setSettings } = useFlomoStore();

  const toggleLanguage = () => {
    const newLanguage = settings.language === "en" ? "zh" : "en";
    setSettings({ language: newLanguage });
    chrome.storage.sync.set({
      settings: { ...settings, language: newLanguage },
    });
  };

  return (
    <button
      onClick={toggleLanguage}
      className="px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
    >
      {settings.language === "en" ? "中文" : "English"}
    </button>
  );
};
