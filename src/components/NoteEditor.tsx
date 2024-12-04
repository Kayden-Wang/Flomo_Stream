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

// 笔记编辑器组件 - 主要的笔记编辑界面
export const NoteEditor: React.FC = () => {
  const { note, settings, setNote, toggleOpen, isOpen } = useFlomoStore();
  // 获取当前语言的翻译
  const t = (key: keyof typeof translations) =>
    translations[key][settings.language];
  // 窗口大小状态
  const [windowSize, setWindowSize] = useState(getDefaultWindowSize());
  // 组件挂载状态(用于动画)
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 设置挂载状态,触发淡入动画
    setMounted(true);
    // 监听窗口大小变化
    const handleResize = () => {
      setWindowSize(getDefaultWindowSize());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 生成AI摘要
  const handleGenerateAISummary = async () => {
    try {
      // 检查API密钥是否配置
      if (!settings.openaiApiKey) {
        toast.error("Please configure OpenAI API key in settings");
        return;
      }

      // 提取文章内容
      toast.loading("Extracting article content...", { id: "ai-summary" });
      const articleContent = extractArticleContent();

      if (!articleContent) {
        toast.error("Could not extract article content", { id: "ai-summary" });
        return;
      }

      // 生成摘要
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

  // 发布笔记到Flomo
  const handlePublish = async () => {
    try {
      // 检查Flomo API凭证是否配置
      if (!settings.flomoApiKey || !settings.flomoUserId) {
        toast.error("Please configure Flomo API credentials in settings");
        return;
      }

      // 发布笔记
      toast.loading("Publishing to Flomo...", { id: "publish" });
      // 构建笔记内容
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

      // 发送到Flomo
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

  // 如果编辑器未打开则不渲染
  if (!isOpen) return null;

  // 渲染编辑器界面
  return (
    <div
      className={`transition-opacity duration-300 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <Rnd
        default={{
          x: window.innerWidth - windowSize.width - 20,
          y: window.innerHeight - windowSize.height - 20,
          width: windowSize.width,
          height: windowSize.height,
        }}
        minWidth={350}
        minHeight={400}
        maxWidth={Math.min(800, window.innerWidth - 40)}
        maxHeight={window.innerHeight - 40}
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
        resizeHandleStyles={{
          bottom: { height: "10px", bottom: "-5px" },
          bottomRight: {
            width: "20px",
            height: "20px",
            bottom: "-10px",
            right: "-10px",
          },
          bottomLeft: {
            width: "20px",
            height: "20px",
            bottom: "-10px",
            left: "-10px",
          },
          right: { width: "10px", right: "-5px" },
          left: { width: "10px", left: "-5px" },
          top: { height: "10px", top: "-5px" },
          topRight: {
            width: "20px",
            height: "20px",
            top: "-10px",
            right: "-10px",
          },
          topLeft: {
            width: "20px",
            height: "20px",
            top: "-10px",
            left: "-10px",
          },
        }}
        className="z-[9999]"
      >
        {/* 编辑器主体内容 */}
        <div className="bg-white dark:bg-[#1e2433] rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 h-full flex flex-col transition-colors duration-200">
          {/* 标题栏 */}
          <div className="handle flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 cursor-move rounded-t-lg bg-white dark:bg-[#1e2433] transition-colors duration-200">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("createNote")}
            </h2>
            <div className="flex items-center gap-4">
              <LanguageToggle />
              <button
                onClick={toggleOpen}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 编辑区域 */}
          <div className="p-4 space-y-4 overflow-y-auto flex-grow">
            {/* 标题输入 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("title")}
              </label>
              <input
                type="text"
                value={note.title}
                onChange={(e) => setNote({ title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#262b3d] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder={t("title")}
              />
            </div>

            {/* 摘录输入 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("excerpt")}
              </label>
              <textarea
                value={note.excerpt}
                onChange={(e) => setNote({ excerpt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#262b3d] text-gray-900 dark:text-white h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder={t("enterExcerpt")}
              />
            </div>

            {/* 思考输入 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("thoughts")}
              </label>
              <textarea
                value={note.thoughts}
                onChange={(e) => setNote({ thoughts: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#262b3d] text-gray-900 dark:text-white h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder={t("enterThoughts")}
              />
            </div>

            {/* AI摘要区域 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("aiSummary")}
                </label>
                <button
                  onClick={handleGenerateAISummary}
                  className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                >
                  <Wand2 className="w-4 h-4 mr-1" />
                  {t("generate")}
                </button>
              </div>
              <textarea
                value={note.aiSummary}
                onChange={(e) => setNote({ aiSummary: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-[#262b3d] text-gray-900 dark:text-white h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder={t("aiSummaryPlaceholder")}
                readOnly
              />
            </div>

            {/* 标签输入 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("tags")}
              </label>
              <TagInput />
            </div>
          </div>

          {/* 发布按钮 */}
          <div className="px-4 pb-4">
            <button
              onClick={handlePublish}
              className="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-all duration-200"
            >
              <Send className="w-5 h-5 mr-2" />
              {t("publish")}
            </button>
          </div>
        </div>
      </Rnd>
    </div>
  );
};
