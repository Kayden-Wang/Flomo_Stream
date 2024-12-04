import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { FloatingBall } from "../components/FloatingBall";
import { NoteEditor } from "../components/NoteEditor";
import { useFlomoStore } from "../store";
import { initializeTextSelection } from "../utils/selection";
import "../index.css";

// 主应用组件
const App: React.FC = () => {
  const { setNote } = useFlomoStore();  // 获取更新笔记的方法

  useEffect(() => {
    // 初始化文本选择功能
    initializeTextSelection();

    // 等待页面完全加载后获取标题
    const observer = new MutationObserver((mutations) => {
      if (document.readyState === "complete") {
        // 设置当前页面的标题和URL
        setNote({
          title: document.title,
          url: window.location.href,
        });
        observer.disconnect();
      }
    });

    // 观察文档变化
    observer.observe(document, {
      childList: true,
      subtree: true,
    });

    // 监听来自后台脚本的消息
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === "PAGE_INFO") {
        setNote(message.payload);  // 更新笔记信息
      }
    });

    // 清理函数
    return () => {
      observer.disconnect();
      chrome.runtime.onMessage.removeListener(() => {});
    };
  }, [setNote]);

  return (
    // 创建一个不影响页面交互的容器
    <div
      id="flomo-stream-container"
      className="fixed inset-0 pointer-events-none"
    >
      {/* 启用事件交互的内容区域 */}
      <div className="pointer-events-auto">
        <FloatingBall />  {/* 浮动球组件 */}
        <NoteEditor />    {/* 笔记编辑器组件 */}
        <Toaster position="top-right" />       {/* 消息提示组件 */}
      </div>
    </div>
  );
};

// 初始化函数
const init = () => {
  // 创建根容器
  const container = document.createElement("div");
  container.id = "flomo-stream-root";
  document.body.appendChild(container);

  // 渲染React应用
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// 检查是否已经注入，避免重复注入
if (!document.getElementById("flomo-stream-root")) {
  init();
}
