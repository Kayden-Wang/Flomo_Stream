import React, { useEffect } from 'react';
import { BookMarked } from 'lucide-react';
import { useFlomoStore } from '../store';

export const FloatingBall: React.FC = () => {
  const { toggleOpen, showBall } = useFlomoStore();

  useEffect(() => {
    const handleResize = () => {
      const ball = document.getElementById('flomo-floating-ball');
      if (ball) {
        ball.style.right = '20px';
        ball.style.bottom = '20px';
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!showBall) return null;

  return (
    <button
      id="flomo-floating-ball"
      onClick={toggleOpen}
      className="fixed z-[9999] w-12 h-12 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
      style={{ right: '20px', bottom: '20px' }}
      aria-label="Open Flomo Stream"
    >
      <BookMarked className="w-6 h-6" />
    </button>
  );
};