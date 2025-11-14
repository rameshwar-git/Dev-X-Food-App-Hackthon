import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-order-details.ts';
import '@/ai/flows/extract-dietary-restrictions.ts';
import '@/ai/flows/recommend-menu-items.ts';
// The process-voice-command flow is not defined with ai.defineFlow, so we don't need to import it here.
