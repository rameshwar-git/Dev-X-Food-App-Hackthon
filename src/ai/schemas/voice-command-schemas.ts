import {z} from 'genkit';

export const ProcessVoiceCommandInputSchema = z.object({
  command: z.string().describe('The voice command from the user.'),
  currentOrder: z
    .array(
      z.object({
        name: z.string(),
        quantity: z.number(),
        specialRequests: z.string().optional(),
      })
    )
    .describe('The current list of items in the order.'),
});
export type ProcessVoiceCommandInput = z.infer<typeof ProcessVoiceCommandInputSchema>;

const AddItemActionSchema = z.object({
  action: z.literal('add_item').describe("The action to perform. Must be 'add_item'"),
  itemName: z.string().describe('The name of the item to add. Must be one of the available menu items: Gourmet Burger, Crispy Fries, Garden Salad, Fizzy Soda.'),
  quantity: z.number().describe('The quantity of the item to add.'),
});

const RemoveItemActionSchema = z.object({
  action: z.literal('remove_item').describe("The action to perform. Must be 'remove_item'"),
  itemName: z.string().describe('The name of the item to remove from the current order.'),
});

const UpdateQuantityActionSchema = z.object({
  action: z.literal('update_quantity').describe("The action to perform. Must be 'update_quantity'"),
  itemName: z.string().describe('The name of the item in the order to update.'),
  quantity: z.number().describe('The new quantity for the item.'),
});

const AddSpecialRequestActionSchema = z.object({
  action: z.literal('add_special_request').describe("The action to perform. Must be 'add_special_request'"),
  itemName: z.string().describe('The name of the item in the order to add a special request to.'),
  request: z.string().describe('The special request text.'),
});

const AddAllergyNotesActionSchema = z.object({
  action: z.literal('add_allergy_notes').describe("The action to perform. Must be 'add_allergy_notes'"),
  notes: z.string().describe('The allergy notes to add to the order.'),
});

const ReviewOrderActionSchema = z.object({
  action: z.literal('review_order').describe("The action to perform. Must be 'review_order'"),
});

const CancelOrderActionSchema = z.object({
  action: z.literal('cancel_order').describe("The action to perform. Must be 'cancel_order'"),
});

const SearchMenuActionSchema = z.object({
  action: z.literal('search_menu').describe("The action to perform. Must be 'search_menu'"),
  query: z.string().describe('The search query for the menu.'),
});

export const VoiceCommandActionSchema = z.discriminatedUnion('action', [
  AddItemActionSchema,
  RemoveItemActionSchema,
  UpdateQuantityActionSchema,
  AddSpecialRequestActionSchema,
  AddAllergyNotesActionSchema,
  ReviewOrderActionSchema,
  CancelOrderActionSchema,
  SearchMenuActionSchema,
]);

export type VoiceCommandAction = z.infer<typeof VoiceCommandActionSchema>;
