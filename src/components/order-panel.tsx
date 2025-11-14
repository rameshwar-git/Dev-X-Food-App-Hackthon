import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { OrderItem } from '@/lib/types';
import { Minus, Plus, Trash2, Loader2, Send } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface OrderPanelProps {
  orderItems: OrderItem[];
  allergyNotes: string;
  onAllergyNotesChange: (notes: string) => void;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onUpdateSpecialRequests: (itemId: string, requests: string) => void;
  onReviewOrder: () => void;
  isReviewing: boolean;
}

export function OrderPanel({
  orderItems,
  allergyNotes,
  onAllergyNotesChange,
  onUpdateQuantity,
  onRemoveItem,
  onUpdateSpecialRequests,
  onReviewOrder,
  isReviewing,
}: OrderPanelProps) {
  const subtotal = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <Card className="sticky top-6 shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Your Order</CardTitle>
        <CardDescription>Add items from the menu and customize your order.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {orderItems.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">Your order is empty.</p>
        ) : (
          <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
            {orderItems.map((item) => (
              <div key={item.id} className="flex flex-col gap-3 border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="font-bold w-4 text-center">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/80 hover:text-destructive" onClick={() => onRemoveItem(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Textarea
                  placeholder="e.g. 'extra crispy', 'light ice', 'cut in half'"
                  value={item.specialRequests}
                  onChange={(e) => onUpdateSpecialRequests(item.id, e.target.value)}
                  className="text-sm"
                />
              </div>
            ))}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="allergy-notes" className="font-semibold">Allergies or General Notes</Label>
          <Textarea
            id="allergy-notes"
            placeholder="e.g. 'severe peanut allergy', 'no cross-contamination'"
            value={allergyNotes}
            onChange={(e) => onAllergyNotesChange(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        {orderItems.length > 0 && (
            <div className="w-full space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
            </div>
        )}
        <Button
          size="lg"
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={onReviewOrder}
          disabled={isReviewing || orderItems.length === 0}
        >
          {isReviewing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Review Order with AI
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
