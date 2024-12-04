export function getDefaultWindowSize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  // For very small screens (mobile)
  if (width < 640) {
    return {
      width: width - 40,
      height: height - 40,
    };
  }

  // For small screens (tablets)
  if (width < 1024) {
    return {
      width: Math.min(400, width - 80),
      height: height - 80,
    };
  }

  // For medium screens
  if (width < 1440) {
    return {
      width: 450,
      height: height - 100,
    };
  }

  // For large screens
  return {
    width: 480,
    height: height - 120,
  };
}
