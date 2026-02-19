import type { MarketCategory } from './market-data';

/**
 * Format question with category prefix: [CATEGORY] Question
 */
export function formatQuestionWithCategory(
  question: string,
  category: MarketCategory
): string {
  const categoryUpper = category.toUpperCase();
  return `[${categoryUpper}] ${question}`;
}
