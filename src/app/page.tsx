"use client";

import { useState, useEffect, useRef } from 'react';
import { AppHeader } from '@/components/app-header';
import { MenuSection } from '@/components/menu-section';
import { OrderPanel } from '@/components/order-panel';
import { OrderSummaryDialog } from '@/components/order-summary-dialog';
import { menuCategories, menuItems as allMenuItems } from '@/lib/data';
import type { MenuItem, OrderItem, MenuCategory } from '@/lib/types';
import { processOrder, type ProcessOrderResult, processVoiceCommand, getRecommendations } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, PanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecommendationBar } from '@/components/recommendation-bar';
import { Accordion } from '@/components/ui/accordion';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// For SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function Home() {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [allergyNotes, setAllergyNotes] = useState('');
  const [aiResult, setAiResult] = useState<ProcessOrderResult | null>(null);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isSummaryOpen, setSummaryOpen] = useState(false);
  const [recommendedItemIds, setRecommendedItemIds] = useState<string[]>([]);
  const [isRecommending, setIsRecommending] = useState(false);
  const { toast } = useToast();

  const [isListening, setIsListening] = useState(false);
  const [activeCategory, setActiveCategory] = useState<MenuCategory>(menuCategories[0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        console.log('Voice transcript:', transcript);
        toast({ title: 'Processing your command...', description: transcript });
        try {
          const result = await processVoiceCommand(transcript, orderItems);
          handleVoiceCommand(result);
        } catch (error) {
          console.error('Error processing voice command:', error);
          toast({ variant: 'destructive', title: 'AI Error', description: 'Could not understand your command.' });
        } finally {
          setIsListening(false);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'no-speech') {
            setIsListening(false);
            return;
        }
        console.error('Speech recognition error', event.error);
        toast({ variant: 'destructive', title: 'Voice Error', description: 'Could not recognize speech.' });
        setIsListening(false);
      };

      recognition.onend = () => {
        if (isListening) {
          setIsListening(false);
        }
      };
      
      recognitionRef.current = recognition;
    }
  }, [isListening, orderItems, toast]); // Re-create if orderItems changes, so the latest order is available in onresult

  const handleVoiceCommand = (command: any) => {
    console.log("Handling command", command);
    if (!command || !command.action) {
      toast({ variant: 'destructive', title: 'AI Error', description: 'Did not understand the command.' });
      return;
    }
    
    switch (command.action) {
      case 'add_item':
        const itemToAdd = allMenuItems.find(item => item.name.toLowerCase() === command.itemName.toLowerCase());
        if (itemToAdd) {
          for(let i = 0; i < command.quantity; i++) {
            handleAddItem(itemToAdd);
          }
          toast({ title: 'Item Added', description: `${command.quantity} x ${command.itemName} added to your order.` });
        } else {
          toast({ variant: 'destructive', title: 'Item not found', description: `Could not find ${command.itemName}.` });
        }
        break;
      case 'remove_item':
        const itemToRemove = orderItems.find(item => item.name.toLowerCase() === command.itemName.toLowerCase());
        if(itemToRemove) {
          handleRemoveItem(itemToRemove.id);
          toast({ title: 'Item Removed', description: `${command.itemName} removed from your order.` });
        } else {
            toast({ variant: 'destructive', title: 'Item not in order', description: `Could not find ${command.itemName} in your order.` });
        }
        break;
      case 'update_quantity':
         const itemToUpdate = orderItems.find(item => item.name.toLowerCase() === command.itemName.toLowerCase());
        if(itemToUpdate) {
            handleUpdateQuantity(itemToUpdate.id, command.quantity);
            toast({ title: 'Quantity Updated', description: `${command.itemName} quantity set to ${command.quantity}.` });
        } else {
            toast({ variant: 'destructive', title: 'Item not in order', description: `Could not find ${command.itemName} in your order.` });
        }
        break;
      case 'add_special_request':
        const itemForRequest = orderItems.find(item => item.name.toLowerCase() === command.itemName.toLowerCase());
        if (itemForRequest) {
          handleUpdateSpecialRequests(itemForRequest.id, itemForRequest.specialRequests ? `${itemForRequest.specialRequests}, ${command.request}`: command.request);
          toast({ title: 'Note Added', description: `Note added to ${command.itemName}.` });
        } else {
           toast({ variant: 'destructive', title: 'Item not in order', description: `Could not find ${command.itemName} in your order.` });
        }
        break;
      case 'add_allergy_notes':
        setAllergyNotes(allergyNotes ? `${allergyNotes}, ${command.notes}`: command.notes);
        toast({ title: 'Allergy Note Added'});
        break;
      case 'review_order':
        handleReviewOrder();
        break;
      case 'cancel_order':
        handleConfirmOrder(); // Re-using confirm order as it resets everything.
        toast({ title: 'Order Cancelled' });
        break;
      case 'search_menu':
        const query = command.query.toLowerCase();
        const foundCategory = menuCategories.find(cat => cat.name.toLowerCase().includes(query));
        if (foundCategory) {
          setActiveCategory(foundCategory);
        } else {
          const foundItems = allMenuItems.filter(item => item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query));
          if(foundItems.length > 0) {
            const categoryOfFirstItem = menuCategories.find(cat => cat.items.some(item => item.id === foundItems[0].id));
            if(categoryOfFirstItem) {
              setActiveCategory(categoryOfFirstItem);
            }
          }
        }
        toast({ title: 'Menu Searched', description: `Showing results for "${command.query}".` });
        break;
      default:
        toast({ variant: 'destructive', title: 'Unknown Command', description: 'The AI returned an unknown command.' });
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      toast({ variant: 'destructive', title: 'Not Supported', description: 'Speech recognition is not supported in your browser.' });
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast({ title: "Listening...", description: "Please state your command." });
    }
  };


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
              onVoiceCommand={toggleListening}
              isListening={isListening}
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
