'use server';
/**
 * @fileOverview Recommends menu items based on user preferences.
 *
 * - recommendMenuItems - A function that takes a user preference and a menu, and returns recommended items.
 * - RecommendMenuItemsInput - The input type for the recommendMenuItems function.
 * - RecommendMenuItemsOutput - The return type for the recommendMenuItems function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { MenuItemSchema } from '../schemas/menu-item-schema';


const RecommendMenuItemsInputSchema = z.object({
  userPreference: z.string().describe('The user\'s preference for food, e.g., "something spicy", "vegetarian options".'),
  menuItems: z.array(MenuItemSchema).describe('The list of available menu items.'),
});
export type RecommendMenuItemsInput = z.infer<typeof RecommendMenuItemsInputSchema>;

const RecommendMenuItemsOutputSchema = z.object({
  recommendedItemIds: z.array(z.string()).describe('An array of menu item IDs that match the user\'s preference.'),
});
export type RecommendMenuItemsOutput = z.infer<typeof RecommendMenuItemsOutputSchema>;


export async function recommendMenuItems(
  input: RecommendMenuItemsInput
): Promise<RecommendMenuItemsOutput> {
  return recommendMenuItemsFlow(input);
}


const prompt = ai.definePrompt({
  name: 'recommendMenuItemsPrompt',
  input: {schema: RecommendMenuItemsInputSchema},
  output: {schema: RecommendMenuItemsOutputSchema},
  prompt: `You are a helpful restaurant assistant. A user wants a recommendation from the menu.

Analyze the user's preference and the provided menu items. Return a list of item IDs that are a good match.

If the user asks for a category, return all items in that category.
If nothing on the menu matches the user's preference, return an empty array.

User Preference: "{{userPreference}}"

Menu Items:
{{#each menuItems}}
- ID: {{id}}, Name: {{name}}, Description: {{description}}, Category: {{category}}
{{/each}}

Return only the JSON output.
`,
});


const recommendMenuItemsFlow = ai.defineFlow(
  {
    name: 'recommendMenuItemsFlow',
    inputSchema: RecommendMenuItemsInputSchema,
    outputSchema: RecommendMenuItemsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
