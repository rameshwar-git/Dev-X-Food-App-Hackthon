'use server';

import { summarizeOrderDetails, SummarizeOrderDetailsInput } from '@/ai/flows/summarize-order-details';
import { extractDietaryRestrictions } from '@/ai/flows/extract-dietary-restrictions';
import { recommendMenuItems } from '@/ai/flows/recommend-menu-items';
import type { OrderItem, MenuItem } from '@/lib/types';

export interface ProcessOrderResult {
  summary: string;
  restrictions: string[];
}

export async function processOrder(
  items: OrderItem[],
  allergyInfo: string
): Promise<ProcessOrderResult> {
  if (items.length === 0) {
    return { summary: '', restrictions: [] };
  }

  // Prepare input for summarization
  const summarizeInput: SummarizeOrderDetailsInput = {
    orderItems: items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      specialRequests: item.specialRequests || undefined,
    })),
    allergyInformation: allergyInfo || undefined,
  };

  // Prepare input for restriction extraction
  const allNotes = items.map(item => item.specialRequests).filter(Boolean).join(' ') + ' ' + allergyInfo;
  const restrictionsInput = { orderText: allNotes.trim() };

  // Run AI flows in parallel
  const [summaryResult, restrictionsResult] = await Promise.all([
    summarizeOrderDetails(summarizeInput),
    extractDietaryRestrictions(restrictionsInput),
  ]);

  return {
    summary: summaryResult.summary,
    restrictions: restrictionsResult.extractedRestrictions,
  };
}


export async function getRecommendations(
  userPreference: string,
  menuItems: MenuItem[]
): Promise<string[]> {
  if (!userPreference) {
    return [];
  }
  const result = await recommendMenuItems({
    userPreference,
    menuItems: menuItems.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
    })),
  });
  return result.recommendedItemIds;
}
