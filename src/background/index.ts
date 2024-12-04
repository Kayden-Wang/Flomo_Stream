// 导入笔记类型定义
import { FlomoNote } from '../types';

// 监听标签页更新事件
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // 只在页面完全加载完成且有URL时处理
  if (changeInfo.status === 'complete' && tab.url) {
    // 创建一个新的笔记对象，包含页面标题和URL
    const note: Partial<FlomoNote> = {
      title: tab.title || '',  // 获取页面标题，如果没有则使用空字符串
      url: tab.url,           // 获取页面URL
    };

    // 向内容脚本发送消息，传递页面信息
    // 这将触发内容脚本中的相应处理逻辑
    chrome.tabs.sendMessage(tabId, {
      type: 'PAGE_INFO',      // 消息类型
      payload: note,          // 消息内容
    });
  }
});