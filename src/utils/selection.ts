import { useFlomoStore } from "../store";

// 初始化文本选择功能
// 监听用户选中文本的事件,并更新到笔记中
export function initializeTextSelection() {
  document.addEventListener("mouseup", () => {
    // 获取当前选中的文本
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    // 获取选中的文本内容并去除首尾空格
    const selectedText = selection.toString().trim();
    if (!selectedText) return;

    // 更新到store中的笔记excerpt字段
    const { setNote } = useFlomoStore.getState();
    setNote({ excerpt: selectedText });
  });
}
