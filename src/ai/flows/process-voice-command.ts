'use server';
/**
 * @fileOverview Processes a voice command to manage a food order.
 *
 * - processVoiceCommandFlow - A function that processes a voice command.
 */

import {ai} from '@/ai/genkit';
import { ProcessVoiceCommandInputSchema, VoiceCommandActionSchema, type ProcessVoiceCommandInput, type VoiceCommandAction } from '@/ai/schemas/voice-command-schemas';


export async function processVoiceCommandFlow(
  input: ProcessVoiceCommandInput
): Promise<VoiceCommandAction> {
  const {output} = await commandRouter(input);
  return output!;
}


const commandRouter = ai.definePrompt({
    name: 'commandRouter',
    input: { schema: ProcessVoiceCommandInputSchema },
    output: { schema: VoiceCommandActionSchema },
    prompt: `You are a voice command processor for a food ordering app.
Analyze the user's command and determine the correct action to take.

Available menu items: Gourmet Burger, Crispy Fries, Garden Salad, Fizzy Soda.
You must only use these item names. Do not hallucinate other items.

Current Order:
{{#if currentOrder}}
{{#each currentOrder}}
- {{quantity}}x {{name}}
{{/each}}
{{else}}
The order is empty.
{{/if}}

User command: "{{command}}"

Based on the command, determine the action and the required parameters.

Examples:
- "add two burgers and some fries" -> { action: 'add_item', itemName: 'Gourmet Burger', quantity: 2 }, then another { action: 'add_item', itemName: 'Crispy Fries', quantity: 1 } (Note: LLM can only return one action at a time, so it will pick the first one).
- "remove the salad" -> { action: 'remove_item', itemName: 'Garden Salad' }
- "make it three burgers" -> { action: 'update_quantity', itemName: 'Gourmet Burger', quantity: 3 }
- "for the burger, make it extra well done" -> { action: 'add_special_request', itemName: 'Gourmet Burger', request: 'extra well done' }
- "I'm allergic to peanuts" -> { action: 'add_allergy_notes', notes: 'peanut allergy' }
- "let me review my order" -> { action: 'review_order' }
- "cancel everything" -> { action: 'cancel_order' }
- "show me things with beef" -> { action: 'search_menu', query: 'beef' }

If the user asks to add an item not on the menu, you can try to find the closest match.
If the quantity is not specified for adding an item, assume 1.
If a user is adding a note and does not specify an item, and there's only one item in the cart, apply it to that item. If there are multiple, you can ask for clarification (though the model cannot do this, so just apply to the first item or make a best guess).

Now, process the command.
`,
});
