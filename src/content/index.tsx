import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { FloatingBall } from "../components/FloatingBall";
import { NoteEditor } from "../components/NoteEditor";
import { useFlomoStore } from "../store";
import "../index.css";

const App: React.FC = () => {
  const { setNote } = useFlomoStore();

  useEffect(() => {
    // Wait for page to be fully loaded before getting title
    const observer = new MutationObserver(() => {
      if (document.readyState === "complete") {
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
        setNote({
          title: message.payload.title,
          url: message.payload.url,
        });
      }
    });

    return () => {
      observer.disconnect();
      chrome.runtime.onMessage.removeListener(() => {});
    };
  }, [setNote]);

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

// Wait for DOM to be ready
const init = () => {
  const container = document.createElement("div");
  container.id = "flomo-stream-root";
  document.body.appendChild(container);

  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// Check if the script has already been injected
if (!document.getElementById("flomo-stream-root")) {
  init();
}
