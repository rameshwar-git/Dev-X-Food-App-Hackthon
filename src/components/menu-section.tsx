import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { MenuItem } from '@/lib/types';
import { PlusCircle } from 'lucide-react';

interface MenuSectionProps {
  menuItems: MenuItem[];
  onAddItem: (item: MenuItem) => void;
}

export function MenuSection({ menuItems, onAddItem }: MenuSectionProps) {
  return (
    <section>
      <h2 className="text-2xl font-bold font-headline mb-4">Menu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuItems.map((item) => (
          <Card key={item.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="relative w-full h-48">
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                className="object-cover"
                data-ai-hint={item.image.hint}
              />
            </div>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription className="text-muted-foreground">{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <p className="text-lg font-semibold text-primary">${item.price.toFixed(2)}</p>
              <Button onClick={() => onAddItem(item)}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add to Order
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
