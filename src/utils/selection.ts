import { useFlomoStore } from '../store';

export function initializeTextSelection() {
  document.addEventListener('mouseup', () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    const { setNote } = useFlomoStore.getState();
    setNote({ excerpt: selectedText });
  });
}