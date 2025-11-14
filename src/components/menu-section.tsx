import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { MenuItem, MenuCategory } from '@/lib/types';
import { PlusCircle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MenuSectionProps {
  category: MenuCategory;
  onAddItem: (item: MenuItem) => void;
  recommendedItemIds: string[];
}

export function MenuSection({ category, onAddItem, recommendedItemIds }: MenuSectionProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold font-headline mb-4">{category.name}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {category.items.map((item) => {
          const isRecommended = recommendedItemIds.includes(item.id);
          return (
            <Card 
              key={item.id} 
              className={cn(
                "flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300",
                isRecommended && "ring-2 ring-yellow-400 border-yellow-400"
              )}
            >
              <div className="relative w-full h-48">
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  fill
                  className="object-cover"
                  data-ai-hint={item.image.hint}
                />
                 {isRecommended && (
                  <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 rounded-full p-2 shadow-lg">
                    <Star className="w-5 h-5" />
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle>{item.name}</CardTitle>
                <CardDescription className="text-muted-foreground">{item.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <p className="text-lg font-semibold text-primary">₹{item.price.toFixed(2)}</p>
                <Button onClick={() => onAddItem(item)}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add to Order
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </section>
  );
}
