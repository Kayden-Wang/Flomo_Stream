// 笔记数据接口
export interface FlomoNote {
  title: string; // 笔记标题
  excerpt: string; // 摘录内容
  thoughts: string; // 个人思考
  aiSummary: string; // AI生成的摘要
  url: string; // 文章URL
  tags: string[]; // 标签列表
}

// 用户设置接口
export interface Settings {
  flomoUserId: string; // Flomo用户ID
  flomoApiKey: string; // Flomo API密钥
  openaiApiKey: string; // OpenAI API密钥
  openaiBaseUrl: string; // OpenAI API地址
  openaiModel: string; // 使用的AI模型
  openaiPrompt: string; // AI提示词
  savedTags: string[]; // 保存的标签列表
  language: "en" | "zh"; // 界面语言
}

// Flomo API响应接口
export interface FlomoApiResponse {
  code: number; // 响应状态码
  message: string; // 响应消息
}

// OpenAI API响应接口
export interface OpenAIResponse {
  choices: {
    message: {
      content: string; // AI生成的内容
    };
  }[];
}

// 翻译配置接口
export interface Translations {
  [key: string]: {
    en: string; // 英文翻译
    zh: string; // 中文翻译
  };
}
