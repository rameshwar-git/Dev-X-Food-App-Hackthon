import { UtensilsCrossed } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="py-6 mb-8 text-center">
      <div className="flex items-center justify-center gap-3 mb-2">
        <UtensilsCrossed className="w-8 h-8 text-primary" />
        <h1 className="text-4xl font-bold tracking-tighter font-headline text-primary">
          Dev-X-Restro
        </h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Customize your order with conversational AI. Your meal, exactly your way.
      </p>
    </header>
  );
}
