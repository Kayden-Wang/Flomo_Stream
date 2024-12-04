export interface FlomoNote {
  title: string;
  excerpt: string;
  thoughts: string;
  aiSummary: string;
  url: string;
  tags: string[];
}

export interface Settings {
  flomoUserId: string;
  flomoApiKey: string;
  openaiApiKey: string;
  openaiBaseUrl: string;
  openaiModel: string;
  openaiPrompt: string;
  savedTags: string[];
  language: "en" | "zh";
}

export interface FlomoApiResponse {
  code: number;
  message: string;
}

export interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export interface Translations {
  [key: string]: {
    en: string;
    zh: string;
  };
}
