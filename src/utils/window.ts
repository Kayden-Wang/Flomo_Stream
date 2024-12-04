// 获取默认窗口大小
// 根据屏幕尺寸返回合适的编辑器窗口大小
export function getDefaultWindowSize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // 移动设备屏幕
  if (width < 640) {
    return {
      width: width - 40,
      height: Math.min(500, height - 40),
    };
  }

  // 平板设备屏幕
  if (width < 1024) {
    return {
      width: Math.min(360, width - 80),
      height: Math.min(480, height - 80),
    };
  }

  // 中等尺寸屏幕
  if (width < 1440) {
    return {
      width: 380,
      height: Math.min(520, height - 100),
    };
  }

  // 大尺寸屏幕
  return {
    width: 400,
    height: Math.min(540, height - 120),
  };
}
