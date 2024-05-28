import { Button } from '../../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addSponsor } from '@/utils/api/api';
import { useState } from 'react';

export const AddSponsorDialog = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');

  const { mutate: addSponsorMutate } = useMutation({
    mutationFn: addSponsor,
    onSuccess: () => {
      console.log('Sponsor added');
      queryClient.refetchQueries({ queryKey: ['sponsors'] });
    },
  });

  const handleAddSponsor = () => {
    addSponsorMutate({ name });
    setName('');
    setIsOpen(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={'secondary'}>Dodaj sponsora</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodaj sponsora</DialogTitle>
          {/* <DialogDescription>
                Dodaj sponsora, który będzie mógł wystawiać oferty dla
                wolontariuszy.
              </DialogDescription> */}
        </DialogHeader>
        <div>
          <Label htmlFor="sponsor-name">Nazwa sponsora</Label>
          {
            // TODO: Add validation}
          }
          <Input
            value={name}
            id="sponsor-name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <DialogFooter className="flex">
          <DialogClose asChild>
            <Button variant="secondary">Anuluj</Button>
          </DialogClose>
          <Button type="submit" onClick={handleAddSponsor}>
            Dodaj
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
