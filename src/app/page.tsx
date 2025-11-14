"use client";

import { useState, useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { MenuSection } from '@/components/menu-section';
import { OrderPanel } from '@/components/order-panel';
import { OrderSummaryDialog } from '@/components/order-summary-dialog';
import { menuCategories, menuItems as allMenuItems } from '@/lib/data';
import type { MenuItem, OrderItem, MenuCategory } from '@/lib/types';
import { processOrder, type ProcessOrderResult, getRecommendations } from './actions';
import { useToast } from '@/hooks/use-toast';
import { PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecommendationBar } from '@/components/recommendation-bar';
import { Accordion } from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function Home() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [allergyNotes, setAllergyNotes] = useState('');
  const [aiResult, setAiResult] = useState<ProcessOrderResult | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isSummaryOpen, setSummaryOpen] = useState(false);
  const [recommendedItemIds, setRecommendedItemIds] = useState<string[]>([]);
  const [isRecommending, setIsRecommending] = useState(false);
  const { toast } = useToast();

  const [activeCategory, setActiveCategory] = useState<MenuCategory>(menuCategories[0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  

  const handleAddItem = (menuItem: MenuItem) => {
    const existingItem = orderItems.find(item => item.menuItemId === menuItem.id && item.specialRequests === '');
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
    if (orderItems.length === 0) {
      toast({ variant: 'destructive', title: 'Empty Order', description: 'Please add items to your order before reviewing.' });
      return;
    }
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
    setOrderItems([]);
    setAllergyNotes('');
    setAiResult(null);
    setRecommendedItemIds([]);
  }

  const handleGetRecommendations = async (preference: string) => {
    if (!preference) {
      setRecommendedItemIds([]);
      return;
    }
    setIsRecommending(true);
    try {
      const ids = await getRecommendations(preference, allMenuItems);
      setRecommendedItemIds(ids);
      if (ids.length === 0) {
        toast({ title: 'No matches found', description: "Our AI couldn't find any items matching your preference." });
      } else {
        toast({ title: 'Recommendations updated!', description: 'We\'ve highlighted some items for you.' });
      }
    } catch (error) {
      console.error("Failed to get recommendations:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not get recommendations. Please try again.",
      });
    } finally {
      setIsRecommending(false);
    }
  };

  const recommendedCategories = menuCategories.map(category => ({
    ...category,
    items: category.items.filter(item => recommendedItemIds.includes(item.id))
  })).filter(category => category.items.length > 0);

  const CategorySidebar = ({ inSheet = false }: { inSheet?: boolean }) => (
    <aside className="lg:col-span-1 lg:sticky top-6">
      <h2 className="text-xl font-bold font-headline mb-4">Categories</h2>
      <div className="flex flex-col gap-2">
        {menuCategories.map(category => (
          <Button
            key={category.id}
            variant={activeCategory.id === category.id && recommendedItemIds.length === 0 ? 'default' : 'ghost'}
            onClick={() => {
              setActiveCategory(category);
              setRecommendedItemIds([]);
              if (inSheet) setMobileMenuOpen(false);
            }}
            className="justify-start"
          >
            {category.name}
          </Button>
        ))}
      </div>
    </aside>
  );


  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <AppHeader />

        <div className="flex items-center justify-between md:hidden mb-4">
            <h2 className="text-xl font-bold">Menu</h2>
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <PanelLeft className="h-5 w-5" />
                  <span className="sr-only">Open Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                  <CategorySidebar inSheet={true} />
              </SheetContent>
            </Sheet>
        </div>


        <RecommendationBar 
          onGetRecommendations={handleGetRecommendations}
          isRecommending={isRecommending}
          hasRecommendations={recommendedItemIds.length > 0}
          onClear={() => setRecommendedItemIds([])}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 items-start mt-8">
          <div className="hidden md:block md:col-span-1">
            <CategorySidebar />
          </div>

          <div className="md:col-span-2 lg:col-span-2">
             {recommendedItemIds.length > 0 ? (
                <Accordion type="multiple" defaultValue={recommendedCategories.map(c => c.id)} className="w-full space-y-4">
                    {recommendedCategories.map(category => (
                        <MenuSection 
                            key={category.id}
                            category={category}
                            onAddItem={handleAddItem}
                            recommendedItemIds={recommendedItemIds}
                            isCollapsible={true}
                        />
                    ))}
              </Accordion>
            ) : (
                <MenuSection 
                    category={activeCategory}
                    onAddItem={handleAddItem}
                    recommendedItemIds={[]}
                    isCollapsible={false}
                />
            )}
          </div>
          
          <div className="md:col-span-3 lg:col-span-1">
            <OrderPanel
              orderItems={orderItems}
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
