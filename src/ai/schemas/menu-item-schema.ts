import { z } from 'genkit';

export const MenuItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  category: z.string(),
  // The image object is not needed for the AI, so we can omit it.
});
