export function getDefaultWindowSize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // For very small screens (mobile)
  if (width < 640) {
    return {
      width: width - 40,
      height: Math.min(500, height - 40),
    };
  }

  // For small screens (tablets)
  if (width < 1024) {
    return {
      width: Math.min(360, width - 80),
      height: Math.min(480, height - 80),
    };
  }

  // For medium screens
  if (width < 1440) {
    return {
      width: 380,
      height: Math.min(520, height - 100),
    };
  }

  // For large screens
  return {
    width: 400,
    height: Math.min(540, height - 120),
  };
}