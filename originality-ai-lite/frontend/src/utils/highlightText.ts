/**
 * Highlights suspicious sentences within text by wrapping them
 * with a special span class.
 */
export function highlightSuspicious(text: string, sentences: string[]): string {
  if (!sentences || sentences.length === 0) return escapeHtml(text);

  // Sort by length descending so longer matches are replaced first
  const sorted = [...sentences].sort((a, b) => b.length - a.length);

  let result = escapeHtml(text);

  sorted.forEach((sentence) => {
    const escaped = escapeHtml(sentence.trim());
    if (!escaped) return;
    // Case-insensitive match
    const regex = new RegExp(escaped.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    result = result.replace(
      regex,
      `<span class="highlight-suspicious">$&</span>`
    );
  });

  return result;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function countWords(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

export function countChars(text: string): number {
  return text.length;
}
