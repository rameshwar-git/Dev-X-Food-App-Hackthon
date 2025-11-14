'use server';
/**
 * @fileOverview Summarizes order details including customizations and special requests.
 *
 * - summarizeOrderDetails - A function that takes order details as input and returns a summarized version.
 * - SummarizeOrderDetailsInput - The input type for the summarizeOrderDetails function.
 * - SummarizeOrderDetailsOutput - The return type for the summarizeOrderDetails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeOrderDetailsInputSchema = z.object({
  orderItems: z.array(
    z.object({
      name: z.string().describe('The name of the item.'),
      quantity: z.number().describe('The quantity of the item.'),
      customizations: z.array(z.string()).optional().describe('A list of customizations for the item.'),
      specialRequests: z.string().optional().describe('Any special requests for the item.'),
    })
  ).describe('The items in the order.'),
  allergyInformation: z.string().optional().describe('Any allergy information provided by the user.'),
});
export type SummarizeOrderDetailsInput = z.infer<typeof SummarizeOrderDetailsInputSchema>;

const SummarizeOrderDetailsOutputSchema = z.object({
  summary: z.string().describe('A summary of the order details, including items, customizations, special requests, and allergy information.'),
});
export type SummarizeOrderDetailsOutput = z.infer<typeof SummarizeOrderDetailsOutputSchema>;

export async function summarizeOrderDetails(input: SummarizeOrderDetailsInput): Promise<SummarizeOrderDetailsOutput> {
  return summarizeOrderDetailsFlow(input);
}

const summarizeOrderDetailsPrompt = ai.definePrompt({
  name: 'summarizeOrderDetailsPrompt',
  input: {schema: SummarizeOrderDetailsInputSchema},
  output: {schema: SummarizeOrderDetailsOutputSchema},
  prompt: `You are an AI assistant designed to summarize food order details for customers to review before submitting.

  Summarize the order details below, including all items, quantities, customizations, special requests, and allergy information. Ensure the summary is clear, concise, and easy to understand.

  Order Items:
  {{#each orderItems}}
  - {{quantity}} x {{name}}
  {{#if customizations}}
    (Customizations: {{#each customizations}}{{this}}{{#unless @last}}, {{/unless}}{{/each}})
  {{/if}}
  {{#if specialRequests}}
    (Special Requests: {{specialRequests}})
  {{/if}}
  {{/each}}

  {{#if allergyInformation}}
  Allergy Information: {{allergyInformation}}
  {{/if}}

  Summary:`,
});

const summarizeOrderDetailsFlow = ai.defineFlow(
  {
    name: 'summarizeOrderDetailsFlow',
    inputSchema: SummarizeOrderDetailsInputSchema,
    outputSchema: SummarizeOrderDetailsOutputSchema,
  },
  async input => {
    const {output} = await summarizeOrderDetailsPrompt(input);
    return output!;
  }
);
