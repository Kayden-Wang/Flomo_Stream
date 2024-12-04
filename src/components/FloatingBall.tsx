import React, { useEffect } from "react";
import { BookMarked } from "lucide-react";
import { useFlomoStore } from "../store";

// 浮动球组件 - 作为插件的主要入口点
export const FloatingBall: React.FC = () => {
  const { toggleOpen, showBall } = useFlomoStore();

  useEffect(() => {
    // 处理窗口大小变化时浮动球的位置
    const handleResize = () => {
      const ball = document.getElementById("flomo-floating-ball");
      if (ball) {
        // 保持在右下角固定位置
        ball.style.right = "20px";
        ball.style.bottom = "20px";
      }
    };

    // 初始化位置并监听窗口大小变化
    handleResize();
    window.addEventListener("resize", handleResize);

    // 清理监听器
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 如果不显示浮动球则返回null
  if (!showBall) return null;

  return (
    <button
      id="flomo-floating-ball"
      onClick={toggleOpen}
      className="fixed z-[9999] w-12 h-12 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
      style={{ right: "20px", bottom: "20px" }}
      aria-label="Open Flomo Stream"
    >
      <BookMarked className="w-6 h-6" />
    </button>
  );
};
