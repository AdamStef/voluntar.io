import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { useState } from 'react';

export const RealizeCouponDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleConfirm = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Realizuj</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Potwierdź kupon</DialogTitle>
        </DialogHeader>
        <p className="text-accent-foreground">
          Czy na pewno potwierdzasz realizację tego kuponu? Jeśli potwierdzisz,
          kupon zostanie usunięty.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Anuluj</Button>
          </DialogClose>
          <Button type="submit" onClick={handleConfirm}>
            Potwierdź
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
