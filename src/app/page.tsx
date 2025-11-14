"use client";

import { useState, useEffect, useRef } from 'react';
import { AppHeader } from '@/components/app-header';
import { MenuSection } from '@/components/menu-section';
import { OrderPanel } from '@/components/order-panel';
import { OrderSummaryDialog } from '@/components/order-summary-dialog';
import { menuItems as allMenuItems } from '@/lib/data';
import type { MenuItem, OrderItem } from '@/lib/types';
import { processOrder, type ProcessOrderResult, processVoiceCommand } from './actions';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff } from 'lucide-react';

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
  const { toast } = useToast();

  const [isListening, setIsListening] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(allMenuItems);
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
  }, [isListening, orderItems]); // Re-create if orderItems changes, so the latest order is available in onresult

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
        setMenuItems(allMenuItems.filter(item => item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)));
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
