import { create } from 'zustand';
import { FlomoNote, Settings } from '../types';

interface FlomoState {
  note: FlomoNote;
  settings: Settings;
  isOpen: boolean;
  showBall: boolean;
  setNote: (note: Partial<FlomoNote>) => void;
  setSettings: (settings: Partial<Settings>) => void;
  toggleOpen: () => void;
}

const defaultSettings: Settings = {
  flomoUserId: '',
  flomoApiKey: '',
  openaiApiKey: '',
  openaiBaseUrl: 'https://api.openai.com/v1',
  openaiModel: 'gpt-3.5-turbo',
  openaiPrompt: 'Please summarize this article concisely:',
  savedTags: ['公众号', 'Thinking/科技思考', 'Reading/文章', 'Learning/AI', 'Project/研究', 'Daily/记录'],
  language: 'zh',
};

export const useFlomoStore = create<FlomoState>((set) => ({
  note: {
    title: '',
    excerpt: '',
    thoughts: '',
    aiSummary: '',
    url: '',
    tags: ["公众号"],
  },
  settings: defaultSettings,
  isOpen: false,
  showBall: true,
  setNote: (note) =>
    set((state) => ({
      note: { ...state.note, ...note },
    })),
  setSettings: (settings) =>
    set((state) => ({
      settings: { ...state.settings, ...settings },
    })),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen, showBall: state.isOpen })),
}));

// Initialize settings from Chrome storage
chrome.storage.sync.get(['settings'], (result) => {
  if (result.settings) {
    // Merge default settings with stored settings to ensure all fields exist
    const mergedSettings = { ...defaultSettings, ...result.settings };
    useFlomoStore.setState({ settings: mergedSettings });
  } else {
    // If no settings exist in storage, save the default settings
    chrome.storage.sync.set({ settings: defaultSettings });
  }
});