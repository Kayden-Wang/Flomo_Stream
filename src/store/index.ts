import { create } from "zustand";
import { FlomoNote, Settings } from "../types";

// 定义状态管理接口
interface FlomoState {
  note: FlomoNote; // 当前笔记数据
  settings: Settings; // 用户设置
  isOpen: boolean; // 编辑器是否打开
  showBall: boolean; // 是否显示悬浮球
  setNote: (note: Partial<FlomoNote>) => void; // 更新笔记方法
  setSettings: (settings: Partial<Settings>) => void; // 更新设置方法
  toggleOpen: () => void; // 切换编辑器显示状态
}

// 默认设置配置
const defaultSettings: Settings = {
  flomoUserId: "", // Flomo用户ID
  flomoApiKey: "", // Flomo API密钥
  openaiApiKey: "", // OpenAI API密钥
  openaiBaseUrl: "https://api.openai.com/v1", // OpenAI API地址
  openaiModel: "gpt-3.5-turbo", // 使用的AI模型
  openaiPrompt: "Please summarize this article concisely:", // AI提示词
  savedTags: [
    "公众号",
    "Thinking/科技思考",
    "Reading/文章",
    "Learning/AI",
    "Project/研究",
    "Daily/记录",
  ], // 默认标签
  language: "zh", // 默认语言
};

// 创建状态管理store
export const useFlomoStore = create<FlomoState>((set) => ({
  // 初始笔记状态
  note: {
    title: "",
    excerpt: "",
    thoughts: "",
    aiSummary: "",
    url: "",
    tags: ["公众号"],
  },
  settings: defaultSettings, // 使用默认设置
  isOpen: false, // 初始关闭编辑器
  showBall: true, // 初始显示悬浮球

  // 更新笔记方法
  setNote: (note) =>
    set((state) => ({
      note: { ...state.note, ...note },
    })),

  // 更新设置方法
  setSettings: (settings) =>
    set((state) => ({
      settings: { ...state.settings, ...settings },
    })),

  // 切换编辑器显示状态方法
  toggleOpen: () =>
    set((state) => ({
      isOpen: !state.isOpen,
      showBall: state.isOpen,
    })),
}));

// 从Chrome存储初始化设置
chrome.storage.sync.get(["settings"], (result) => {
  if (result.settings) {
    // 合并默认设置和存储的设置
    const mergedSettings = { ...defaultSettings, ...result.settings };
    useFlomoStore.setState({ settings: mergedSettings });
  } else {
    // 如果没有存储的设置，保存默认设置
    chrome.storage.sync.set({ settings: defaultSettings });
  }
});
