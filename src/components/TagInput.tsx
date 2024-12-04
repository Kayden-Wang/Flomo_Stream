import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useFlomoStore } from "../store";

// 标签输入组件 - 用于管理笔记标签
export const TagInput: React.FC = () => {
  const { note, setNote, settings, setSettings } = useFlomoStore();
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    // 初始化笔记标签 - 如果没有标签则使用默认标签
    if (note.tags.length === 0 && settings.savedTags?.length > 0) {
      setNote({ tags: [settings.savedTags[0]] });
    }
  }, [settings.savedTags]);

  // 添加新标签
  const handleAddTag = (tag: string) => {
    const newTag = tag.trim();
    if (newTag && !note.tags.includes(newTag)) {
      // 更新笔记标签
      const updatedTags = [...note.tags, newTag];
      setNote({ tags: updatedTags });

      // 保存到已保存的标签列表中
      if (!settings.savedTags?.includes(newTag)) {
        const updatedSavedTags = [...(settings.savedTags || []), newTag];
        setSettings({ savedTags: updatedSavedTags });
        // 同步到Chrome存储
        chrome.storage.sync.set({
          settings: {
            ...settings,
            savedTags: updatedSavedTags,
          },
        });
      }
    }
    setInputValue("");
  };

  // 移除标签
  const handleRemoveTag = (tagToRemove: string) => {
    setNote({ tags: note.tags.filter((tag) => tag !== tagToRemove) });
  };

  // 处理键盘事件 - 回车或空格添加标签
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleAddTag(inputValue);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {note.tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center px-2.5 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 transition-colors duration-200"
          >
            #{tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="ml-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-100 transition-colors duration-200"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-2">
        {settings.savedTags
          ?.filter((tag) => !note.tags.includes(tag))
          .map((tag) => (
            <button
              key={tag}
              onClick={() => handleAddTag(tag)}
              className="px-2.5 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200"
            >
              #{tag}
            </button>
          ))}
      </div>

      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#262b3d] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
        placeholder="Type tag and press Enter or Space"
      />
    </div>
  );
};
