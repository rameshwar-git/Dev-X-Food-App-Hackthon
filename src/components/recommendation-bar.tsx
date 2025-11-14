'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, X } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface RecommendationBarProps {
  onGetRecommendations: (preference: string) => void;
  isRecommending: boolean;
  hasRecommendations: boolean;
  onClear: () => void;
}

export function RecommendationBar({
  onGetRecommendations,
  isRecommending,
  hasRecommendations,
  onClear,
}: RecommendationBarProps) {
  const [preference, setPreference] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGetRecommendations(preference);
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
        <CardContent className="p-4">
            <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                 <Sparkles className="text-yellow-400 w-6 h-6 mr-2 hidden sm:block" />
                <Input
                    type="text"
                    value={preference}
                    onChange={(e) => setPreference(e.target.value)}
                    placeholder="Tell me what you're craving... (e.g. 'something spicy')"
                    className="flex-grow"
                    disabled={isRecommending}
                />
                {hasRecommendations ? (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                            setPreference('');
                            onClear();
                        }}
                    >
                        <X className="mr-2" /> Clear
                    </Button>
                ) : (
                    <Button type="submit" disabled={isRecommending || !preference}>
                        {isRecommending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Thinking...
                        </>
                        ) : (
                        <>
                            <Sparkles className="mr-2" />
                            Get Recs
                        </>
                        )}
                    </Button>
                )}
            </form>
        </CardContent>
    </Card>
  );
}
