import { FlomoApiResponse, OpenAIResponse, Settings } from "../types";

// API服务 - 处理与外部API的通信
export async function sendToFlomo(
  content: string,
  settings: Pick<Settings, "flomoUserId" | "flomoApiKey">
): Promise<FlomoApiResponse> {
  // 实现发送到Flomo的逻辑
  const url = `https://flomoapp.com/iwh/${settings.flomoUserId}/${settings.flomoApiKey}/`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function generateAISummary(
  text: string,
  settings: Pick<
    Settings,
    "openaiApiKey" | "openaiBaseUrl" | "openaiModel" | "openaiPrompt"
  >
): Promise<string> {
  try {
    const response = await fetch(`${settings.openaiBaseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${settings.openaiApiKey}`,
      },
      body: JSON.stringify({
        model: settings.openaiModel,
        messages: [
          { role: "system", content: settings.openaiPrompt },
          { role: "user", content: text },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Failed to generate summary");
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("AI Summary Error:", error);
    throw error;
  }
}
