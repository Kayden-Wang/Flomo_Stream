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
  });

  useEffect(() => {
    // Load settings from Chrome storage
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
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Flomo Stream Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Configure your API keys and preferences for Flomo Stream.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Flomo API Configuration</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Flomo User ID
              </label>
              <input
                type="text"
                value={settings.flomoUserId}
                onChange={(e) =>
                  setSettings({ ...settings, flomoUserId: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Flomo API Key
              </label>
              <input
                type="password"
                value={settings.flomoApiKey}
                onChange={(e) =>
                  setSettings({ ...settings, flomoApiKey: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">OpenAI Configuration</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                OpenAI API Key
              </label>
              <input
                type="password"
                value={settings.openaiApiKey}
                onChange={(e) =>
                  setSettings({ ...settings, openaiApiKey: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                OpenAI Base URL
              </label>
              <input
                type="text"
                value={settings.openaiBaseUrl}
                onChange={(e) =>
                  setSettings({ ...settings, openaiBaseUrl: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                OpenAI Model
              </label>
              <input
                type="text"
                value={settings.openaiModel}
                onChange={(e) =>
                  setSettings({ ...settings, openaiModel: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Summary Prompt
              </label>
              <textarea
                value={settings.openaiPrompt}
                onChange={(e) =>
                  setSettings({ ...settings, openaiPrompt: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </button>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  );
};