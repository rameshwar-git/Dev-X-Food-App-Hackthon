'use server';

import { summarizeOrderDetails, SummarizeOrderDetailsInput } from '@/ai/flows/summarize-order-details';
import { extractDietaryRestrictions } from '@/ai/flows/extract-dietary-restrictions';
import { processVoiceCommandFlow } from '@/ai/flows/process-voice-command';
import { ProcessVoiceCommandInput } from '@/ai/schemas/voice-command-schemas';
import type { OrderItem } from '@/lib/types';

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
  const allNotes = items.map(item => item.specialRequests).join(' ') + ' ' + allergyInfo;
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

export async function processVoiceCommand(
  command: string,
  currentOrder: OrderItem[]
) {
  const input: ProcessVoiceCommandInput = {
    command,
    currentOrder: currentOrder.map(item => ({
        name: item.name,
        quantity: item.quantity,
        specialRequests: item.specialRequests || undefined,
    }))
  };
  return processVoiceCommandFlow(input);
}
