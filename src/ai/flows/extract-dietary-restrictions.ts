'use server';
/**
 * @fileOverview Extracts dietary restrictions and allergies from an order.
 *
 * - extractDietaryRestrictions - A function that extracts dietary restrictions from an order.
 * - ExtractDietaryRestrictionsInput - The input type for the extractDietaryRestrictions function.
 * - ExtractDietaryRestrictionsOutput - The return type for the extractDietaryRestrictions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractDietaryRestrictionsInputSchema = z.object({
  orderText: z
    .string()
    .describe('The text of the order, which may contain dietary restrictions or allergies.'),
});
export type ExtractDietaryRestrictionsInput = z.infer<
  typeof ExtractDietaryRestrictionsInputSchema
>;

const ExtractDietaryRestrictionsOutputSchema = z.object({
  extractedRestrictions: z
    .array(z.string())
    .describe(
      'An array of strings, each representing a dietary restriction or allergy found in the order.'
    ),
});
export type ExtractDietaryRestrictionsOutput = z.infer<
  typeof ExtractDietaryRestrictionsOutputSchema
>;

export async function extractDietaryRestrictions(
  input: ExtractDietaryRestrictionsInput
): Promise<ExtractDietaryRestrictionsOutput> {
  return extractDietaryRestrictionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractDietaryRestrictionsPrompt',
  input: {schema: ExtractDietaryRestrictionsInputSchema},
  output: {schema: ExtractDietaryRestrictionsOutputSchema},
  prompt: `You are an AI assistant designed to extract dietary restrictions and allergies from customer orders.

  Given the following order text, identify and extract any specific dietary restrictions, allergies, or other critical information related to food sensitivities or intolerances.  Return them as a list of strings.

  Order Text: {{{orderText}}}

  Example:
  Input: "I want a pizza with no cheese and also I am allergic to peanuts."
  Output: {extractedRestrictions: ["no cheese", "peanut allergy"]}

  Input: "I want the burger, but I have celiac disease so I cannot have gluten."
  Output: {extractedRestrictions: ["gluten allergy"]}

  Input: "I want the salad, but make sure there are no nuts, I am also lactose intolerant."
  Output: {extractedRestrictions: ["nut allergy", "lactose intolerance"]}

  Output in JSON format:
  `,
});

const extractDietaryRestrictionsFlow = ai.defineFlow(
  {
    name: 'extractDietaryRestrictionsFlow',
    inputSchema: ExtractDietaryRestrictionsInputSchema,
    outputSchema: ExtractDietaryRestrictionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
