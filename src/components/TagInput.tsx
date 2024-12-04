import React, { useState } from "react";
import { X } from "lucide-react";
import { useFlomoStore } from "../store";

export const TagInput: React.FC = () => {
  const { note, setNote, settings, setSettings } = useFlomoStore();
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = (tag: string) => {
    const newTag = tag.trim();
    if (newTag && !note.tags.includes(newTag)) {
      const updatedTags = [...note.tags, newTag];
      setNote({ tags: updatedTags });

      // Save to saved tags if not already present
      if (!settings.savedTags?.includes(newTag)) {
        const updatedSavedTags = [...(settings.savedTags || []), newTag];
        setSettings({ savedTags: updatedSavedTags });
        chrome.storage.sync.set({
          settings: { ...settings, savedTags: updatedSavedTags },
        });
      }
    }
    setInputValue("");
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setNote({ tags: note.tags.filter((tag) => tag !== tagToRemove) });
  };

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
            className="inline-flex items-center px-2.5 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
          >
            #{tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="ml-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-100"
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
              className="px-2.5 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
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
        className="w-full px-3 py-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
        placeholder="Type tag and press Enter or Space"
      />
    </div>
  );
};
