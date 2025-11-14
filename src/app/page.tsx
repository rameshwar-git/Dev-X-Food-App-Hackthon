"use client";

import { useState } from 'react';
import { AppHeader } from '@/components/app-header';
import { MenuSection } from '@/components/menu-section';
import { OrderPanel } from '@/components/order-panel';
import { OrderSummaryDialog } from '@/components/order-summary-dialog';
import { menuItems } from '@/lib/data';
import type { MenuItem, OrderItem } from '@/lib/types';
import { processOrder, type ProcessOrderResult } from './actions';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [allergyNotes, setAllergyNotes] = useState('');
  const [aiResult, setAiResult] = useState<ProcessOrderResult | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isSummaryOpen, setSummaryOpen] = useState(false);
  const { toast } = useToast();

  const handleAddItem = (menuItem: MenuItem) => {
    const existingItem = orderItems.find(item => item.menuItemId === menuItem.id);
    if (existingItem) {
      handleUpdateQuantity(existingItem.id, existingItem.quantity + 1);
    } else {
      const newOrderItem: OrderItem = {
        id: crypto.randomUUID(),
        menuItemId: menuItem.id,
        name: menuItem.name,
        quantity: 1,
        price: menuItem.price,
        specialRequests: '',
      };
      setOrderItems([...orderItems, newOrderItem]);
    }
  };

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(itemId);
    } else {
      setOrderItems(orderItems.map(item => item.id === itemId ? { ...item, quantity } : item));
    }
  };

  const handleRemoveItem = (itemId: string) => {
    setOrderItems(orderItems.filter(item => item.id !== itemId));
  };

  const handleUpdateSpecialRequests = (itemId: string, requests: string) => {
    setOrderItems(orderItems.map(item => item.id === itemId ? { ...item, specialRequests: requests } : item));
  };

  const handleReviewOrder = async () => {
    setIsReviewing(true);
    try {
      const result = await processOrder(orderItems, allergyNotes);
      setAiResult(result);
      setSummaryOpen(true);
    } catch (error) {
      console.error("Failed to process order with AI:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not process the order summary. Please try again.",
      });
    } finally {
      setIsReviewing(false);
    }
  };
  
  const handleConfirmOrder = () => {
    setSummaryOpen(false);
    // Reset order state after confirmation
    setOrderItems([]);
    setAllergyNotes('');
    setAiResult(null);
  }

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <AppHeader />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <MenuSection menuItems={menuItems} onAddItem={handleAddItem} />
          </div>
          <div>
            <OrderPanel
              orderItems={orderItems}
              allergyNotes={allergyNotes}
              onAllergyNotesChange={setAllergyNotes}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onUpdateSpecialRequests={handleUpdateSpecialRequests}
              onReviewOrder={handleReviewOrder}
              isReviewing={isReviewing}
            />
          </div>
        </div>
      </main>
      
      <OrderSummaryDialog
        isOpen={isSummaryOpen}
        onOpenChange={setSummaryOpen}
        summary={aiResult?.summary ?? null}
        restrictions={aiResult?.restrictions ?? null}
        onConfirm={handleConfirmOrder}
      />
    </>
  );
}
