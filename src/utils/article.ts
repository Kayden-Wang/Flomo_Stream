import { Readability } from "@mozilla/readability";

// 提取文章内容
// 使用Readability库解析页面,提取主要文章内容
export function extractArticleContent(): string {
  // 克隆文档以避免修改原始DOM
  const documentClone = document.cloneNode(true) as Document;

  // 创建Readability解析器实例
  const reader = new Readability(documentClone);

  // 解析文章内容
  const article = reader.parse();

  // 返回文章文本内容,如果解析失败则返回空字符串
  return article ? article.textContent : "";
}
