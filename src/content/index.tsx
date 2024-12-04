import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { FloatingBall } from "../components/FloatingBall";
import { NoteEditor } from "../components/NoteEditor";
import { useFlomoStore } from "../store";
import { initializeTextSelection } from "../utils/selection";
import "../index.css";

const App: React.FC = () => {
  const { setNote } = useFlomoStore();

  useEffect(() => {
    // Initialize text selection
    initializeTextSelection();

    // Wait for page to be fully loaded before getting title
    const observer = new MutationObserver((mutations) => {
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
        setNote(message.payload);
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
    >
      <div className="pointer-events-auto">
        <FloatingBall />
        <NoteEditor />
        <Toaster position="top-right" />
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
