import { Readability } from "@mozilla/readability";

export function extractArticleContent(): string {
  // Clone the document to avoid modifying the original
  const documentClone = document.cloneNode(true) as Document;

  // Create a new Readability object
  const reader = new Readability(documentClone);

  // Parse the content
  const article = reader.parse();

  return article ? article.textContent : "";
}
