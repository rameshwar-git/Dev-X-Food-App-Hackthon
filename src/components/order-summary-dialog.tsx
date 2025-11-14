import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrderSummaryDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  summary: string | null;
  restrictions: string[] | null;
  onConfirm: () => void;
}

export function OrderSummaryDialog({
  isOpen,
  onOpenChange,
  summary,
  restrictions,
  onConfirm,
}: OrderSummaryDialogProps) {
  const { toast } = useToast();

  const handleConfirm = () => {
    onConfirm();
    toast({
      title: "Order Sent!",
      description: "Your order has been sent to the kitchen.",
      action: <CheckCircle className="text-green-500" />,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Confirm Your Order</DialogTitle>
          <DialogDescription>
            Our AI has summarized your order. Please review carefully before confirming.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {restrictions && restrictions.length > 0 ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Critical Information Detected!</AlertTitle>
              <AlertDescription>
                <p className="mb-2">Our AI flagged the following. Please ensure they are correct:</p>
                <ul className="list-disc pl-5 space-y-1">
                  {restrictions.map((r, i) => (
                    <li key={i} className="font-medium">{r}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>No Critical Allergies Detected</AlertTitle>
                <AlertDescription>
                    Our AI did not detect any critical dietary restrictions. If you have any, please go back and add them.
                </AlertDescription>
            </Alert>
          )}

          <div className="p-4 bg-secondary/50 rounded-md border">
            <h3 className="font-semibold mb-2">Order Summary</h3>
            <p className="text-sm text-secondary-foreground whitespace-pre-wrap">{summary}</p>
          </div>
        </div>
        <DialogFooter className="sm:justify-between">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Go Back & Edit
            </Button>
          <Button type="button" onClick={handleConfirm}>
            Confirm & Send to Kitchen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
