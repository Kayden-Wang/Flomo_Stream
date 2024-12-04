// 后台脚本 - 负责监听浏览器事件和页面信息收集
import { FlomoNote } from "../types";

// 监听标签页更新事件
// 当标签页状态发生变化时触发(如加载完成)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // 当页面完全加载完成且存在URL时
  if (changeInfo.status === "complete" && tab.url) {
    // 创建笔记对象,包含页面基本信息
    const note: Partial<FlomoNote> = {
      title: tab.title || "", // 页面标题,如果不存在则为空字符串
      url: tab.url, // 页面URL
    };

    // 向content script发送页面信息
    // 这将触发content script中的消息监听器
    chrome.tabs.sendMessage(tabId, {
      type: "PAGE_INFO", // 消息类型标识
      payload: note, // 传递笔记数据
    });
  }
});
