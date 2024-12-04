import React from "react";
import { useFlomoStore } from "../store";

// 语言切换组件 - 用于切换界面语言(中英文)
export const LanguageToggle: React.FC = () => {
  const { settings, setSettings } = useFlomoStore();

  // 切换语言方法
  const toggleLanguage = () => {
    // 在中英文之间切换
    const newLanguage = settings.language === "en" ? "zh" : "en";
    // 更新store中的语言设置
    setSettings({ language: newLanguage });
    // 同步到Chrome存储
    chrome.storage.sync.set({
      settings: { ...settings, language: newLanguage },
    });
  };

  // 渲染切换按钮
  return (
    <button
      onClick={toggleLanguage}
      className="px-2 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
    >
      {settings.language === "en" ? "中文" : "English"}
    </button>
  );
};
