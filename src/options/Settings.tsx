import React, { useEffect, useState } from 'react';
import { Settings as SettingsType } from '../types';
import { Save } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

export const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsType>({
    flomoUserId: '',
    flomoApiKey: '',
    openaiApiKey: '',
    openaiBaseUrl: 'https://api.openai.com/v1',
    openaiModel: 'gpt-3.5-turbo',
    openaiPrompt: 'Please summarize this article concisely:',
    savedTags: ['公众号', 'Thinking/科技思考', 'Reading/文章', 'Learning/AI', 'Project/研究', 'Daily/记录'],
    language: 'zh',
  });

  useEffect(() => {
    chrome.storage.sync.get(['settings'], (result) => {
      if (result.settings) {
        setSettings(result.settings);
      }
    });
  }, []);

  const handleSave = async () => {
    try {
      await chrome.storage.sync.set({ settings });
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1a1f2e] p-6 transition-colors duration-200">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-[#1e2433] rounded-lg shadow-xl transition-colors duration-200">
          <div className="space-y-8 p-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-200">
                Flomo Stream Settings
              </h1>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-200">
                Configure your API keys and preferences for Flomo Stream.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors duration-200">
                Flomo API Configuration
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                    Flomo User ID
                  </label>
                  <input
                    type="text"
                    value={settings.flomoUserId}
                    onChange={(e) =>
                      setSettings({ ...settings, flomoUserId: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#262b3d] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                    Flomo API Key
                  </label>
                  <input
                    type="password"
                    value={settings.flomoApiKey}
                    onChange={(e) =>
                      setSettings({ ...settings, flomoApiKey: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#262b3d] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 transition-colors duration-200">
                OpenAI Configuration
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                    OpenAI API Key
                  </label>
                  <input
                    type="password"
                    value={settings.openaiApiKey}
                    onChange={(e) =>
                      setSettings({ ...settings, openaiApiKey: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#262b3d] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                    OpenAI Base URL
                  </label>
                  <input
                    type="text"
                    value={settings.openaiBaseUrl}
                    onChange={(e) =>
                      setSettings({ ...settings, openaiBaseUrl: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#262b3d] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                    OpenAI Model
                  </label>
                  <input
                    type="text"
                    value={settings.openaiModel}
                    onChange={(e) =>
                      setSettings({ ...settings, openaiModel: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#262b3d] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors duration-200">
                    Summary Prompt
                  </label>
                  <textarea
                    value={settings.openaiPrompt}
                    onChange={(e) =>
                      setSettings({ ...settings, openaiPrompt: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#262b3d] text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                onClick={handleSave}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e2433',
            color: '#fff',
            borderRadius: '8px',
            border: '1px solid rgba(107, 114, 128, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </div>
  );
};