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
  const { setNote } = useFlomoStore();

  useEffect(() => {
    // 初始化文本选择功能 - 用于捕获用户选中的文本
    initializeTextSelection();

    // 监听页面加载完成
    const observer = new MutationObserver((mutations) => {
      if (document.readyState === "complete") {
        // 设置初始笔记信息 - 包含页面标题和URL
        setNote({
          title: document.title,
          url: window.location.href,
        });
        observer.disconnect();
      }
    });

    observer.observe(document, {
      childList: true,
      subtree: true,
    });

    // Listen for page info from background script
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === "PAGE_INFO") {
        // 更新笔记信息
        setNote(message.payload);
      }
    });

    return () => {
      // 清理监听器
      observer.disconnect();
      chrome.runtime.onMessage.removeListener(() => {});
    };
  }, [setNote]);

  // 渲染浮动球和笔记编辑器
  return (
    <div
      id="flomo-stream-container"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 2147483647 }}
    >
      <div className="pointer-events-auto">
        <FloatingBall />
        <NoteEditor />
        <Toaster
          position="top-right"
          containerStyle={{
            zIndex: 2147483647,
            top: 20,
            right: 20,
          }}
          toastOptions={{
            style: {
              background: "#1e2433",
              color: "#fff",
              borderRadius: "8px",
              border: "1px solid rgba(107, 114, 128, 0.3)",
              zIndex: 2147483647,
            },
            success: {
              iconTheme: {
                primary: "#10B981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#EF4444",
                secondary: "#fff",
              },
            },
            loading: {
              iconTheme: {
                primary: "#3B82F6",
                secondary: "#fff",
              },
            },
          }}
        />
      </div>
    </div>
  );
};

// 初始化应用
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

// 检查是否已经注入,避免重复注入
if (!document.getElementById("flomo-stream-root")) {
  init();
}
