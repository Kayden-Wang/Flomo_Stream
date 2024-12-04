import React, { useEffect, useState } from "react";
import { X, Send, Wand2 } from "lucide-react";
import { useFlomoStore } from "../store";
import { generateAISummary, sendToFlomo } from "../services/api";
import { toast } from "react-hot-toast";
import { Rnd } from "react-rnd";
import { extractArticleContent } from "../utils/article";
import { TagInput } from "./TagInput";
import { LanguageToggle } from "./LanguageToggle";
import { translations } from "../utils/i18n";
import { getDefaultWindowSize } from "../utils/window";

export const NoteEditor: React.FC = () => {
  const { note, settings, setNote, toggleOpen, isOpen } = useFlomoStore();
  const t = (key: keyof typeof translations) =>
    translations[key][settings.language];
  const [windowSize, setWindowSize] = useState(getDefaultWindowSize());

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(getDefaultWindowSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleGenerateAISummary = async () => {
    try {
      if (!settings.openaiApiKey) {
        toast.error("Please configure OpenAI API key in settings");
        return;
      }

      toast.loading("Extracting article content...", { id: "ai-summary" });
      const articleContent = extractArticleContent();

      if (!articleContent) {
        toast.error("Could not extract article content", { id: "ai-summary" });
        return;
      }

      toast.loading("Generating summary...", { id: "ai-summary" });
      const summary = await generateAISummary(articleContent, settings);
      setNote({ aiSummary: summary });
      toast.success("AI summary generated successfully!", { id: "ai-summary" });
    } catch (error) {
      console.error("AI Summary Error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate AI summary",
        { id: "ai-summary" }
      );
    }
  };

  const handlePublish = async () => {
    try {
      if (!settings.flomoApiKey || !settings.flomoUserId) {
        toast.error("Please configure Flomo API credentials in settings");
        return;
      }

      toast.loading("Publishing to Flomo...", { id: "publish" });
      const content = `[标题] 
${note.title}

[摘录]
${note.excerpt}

[我的思考]
${note.thoughts}

[AI Summary]
${note.aiSummary}

[文章链接]
${note.url}

${note.tags.map((tag) => `#${tag}`).join(" ")}`;

      await sendToFlomo(content, settings);
      toast.success("Note published to Flomo!", { id: "publish" });
      toggleOpen();
    } catch (error) {
      console.error("Publish Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to publish note",
        { id: "publish" }
      );
    }
  };

  if (!isOpen) return null;

  return (
    <Rnd
      default={{
        x: window.innerWidth - windowSize.width - 40,
        y: 20,
        width: windowSize.width,
        height: "auto",
      }}
      minWidth={350}
      maxWidth={Math.min(800, window.innerWidth - 80)}
      bounds="window"
      dragHandleClassName="handle"
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
      className="z-[9999]"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 h-full flex flex-col">
        <div className="handle flex items-center justify-between p-4 border-b dark:border-gray-700 cursor-move rounded-t-lg bg-white dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("createNote")}
          </h2>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <button
              onClick={toggleOpen}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-grow">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("title")}
            </label>
            <input
              type="text"
              value={note.title}
              onChange={(e) => setNote({ title: e.target.value })}
              className="w-full px-3 py-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder={t("title")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("excerpt")}
            </label>
            <textarea
              value={note.excerpt}
              onChange={(e) => setNote({ excerpt: e.target.value })}
              className="w-full px-3 py-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-28 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder={t("enterExcerpt")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("thoughts")}
            </label>
            <textarea
              value={note.thoughts}
              onChange={(e) => setNote({ thoughts: e.target.value })}
              className="w-full px-3 py-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-28 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder={t("enterThoughts")}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t("aiSummary")}
              </label>
              <button
                onClick={handleGenerateAISummary}
                className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                <Wand2 className="w-4 h-4 mr-1" />
                {t("generate")}
              </button>
            </div>
            <textarea
              value={note.aiSummary}
              onChange={(e) => setNote({ aiSummary: e.target.value })}
              className="w-full px-3 py-2 border dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-28 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
              placeholder={t("aiSummaryPlaceholder")}
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("tags")}
            </label>
            <TagInput />
          </div>
        </div>

        <div className="px-4 pb-4">
          <button
            onClick={handlePublish}
            className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
          >
            <Send className="w-5 h-5 mr-2" />
            {t("publish")}
          </button>
        </div>
      </div>
    </Rnd>
  );
};