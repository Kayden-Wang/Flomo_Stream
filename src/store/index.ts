// 导入状态管理库和类型定义
import { create } from "zustand";
import { FlomoNote, Settings } from "../types";

// 定义状态接口
interface FlomoState {
  note: FlomoNote;           // 当前笔记数据
  settings: Settings;        // 用户设置
  isOpen: boolean;          // 编辑器是否打开
  showBall: boolean;        // 是否显示浮动球
  setNote: (note: Partial<FlomoNote>) => void;     // 更新笔记方法
  setSettings: (settings: Partial<Settings>) => void; // 更新设置方法
  toggleOpen: () => void;   // 切换编辑器显示状态
}

// 创建状态存储
export const useFlomoStore = create<FlomoState>((set) => ({
  // 初始笔记状态
  note: {
    title: "",              // 文章标题
    excerpt: "",            // 选中的文本摘录
    thoughts: "",           // 用户思考
    aiSummary: "",          // AI 生成的摘要
    url: "",                // 文章URL
    tags: ["公众号"],        // 默认标签
  },
  
  // 初始设置状态
  settings: {
    flomoUserId: "",        // Flomo 用户ID
    flomoApiKey: "",        // Flomo API密钥
    openaiApiKey: "",       // OpenAI API密钥
    openaiBaseUrl: "https://api.openai.com/v1",  // OpenAI API地址
    openaiModel: "gpt-3.5-turbo",               // 使用的模型
    openaiPrompt: "Please summarize this article concisely:", // 摘要提示词
    savedTags: [           // 预设标签列表
      "公众号",
      "Thinking/科技思考",
      "Reading/文章",
      "Learning/AI",
      "Project/研究",
      "Daily/记录",
    ],
    language: "zh",        // 界面语言
  },
  
  // UI状态
  isOpen: false,           // 编辑器初始关闭
  showBall: true,          // 默认显示浮动球
  
  // 更新笔记的方法
  setNote: (note) =>
    set((state) => ({
      note: { ...state.note, ...note },  // 合并新旧笔记数据
    })),
    
  // 更新设置的方法
  setSettings: (settings) =>
    set((state) => ({
      settings: { ...state.settings, ...settings },  // 合并新旧设置
    })),
    
  // 切换编辑器显示状态的方法
  toggleOpen: () =>
    set((state) => ({ 
      isOpen: !state.isOpen,           // 切换开关状态
      showBall: state.isOpen           // 编辑器打开时隐藏浮动球
    })),
}));

// 从 Chrome 存储中加载设置
chrome.storage.sync.get(["settings"], (result) => {
  if (result.settings) {
    useFlomoStore.setState({ settings: result.settings });
  }
});
