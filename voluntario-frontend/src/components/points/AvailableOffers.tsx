import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { claimOffer, getActiveOffers } from '@/utils/api/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '../ui/use-toast';
import { AxiosError } from 'axios';
import { BackendErrorResponse } from '@/utils/types/types';

export const AvailableOffers = ({
  currentPoints,
}: {
  currentPoints: number;
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: offers } = useQuery({
    queryKey: ['offers'],
    queryFn: getActiveOffers,
  });

  const { mutate: claimOfferMutate } = useMutation({
    mutationFn: claimOffer,
    onSuccess: () => {
      console.log('Offer claimed');
      queryClient.refetchQueries({ queryKey: ['offers'] });
      queryClient.refetchQueries({ queryKey: ['current-points'] });
      queryClient.refetchQueries({ queryKey: ['promo-codes'] });
    },
    onError: (error) => {
      const err = error as AxiosError;
      console.error('Error claiming offer', error);
      toast({
        title: 'Błąd',
        description:
          (err.response?.data as BackendErrorResponse).message ||
          'Nie udało się zrealizować oferty',
        variant: 'destructive',
      });
    },
  });

  const handleClaimOffer = (offerId: number) => {
    console.log('Claiming offer', offerId);
    claimOfferMutate(offerId);
  };

  console.log(offers);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nazwa</TableHead>
          <TableHead>Opis</TableHead>
          <TableHead>Zniżka</TableHead>
          <TableHead>Organizator</TableHead>
          <TableHead>Data końcowa</TableHead>
          <TableHead>Potrzebne punkty</TableHead>
          <TableHead>Dostępne do odebrania</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {offers?.map((offer, index) => (
          <TableRow key={index}>
            <TableCell>{offer.name}</TableCell>
            <TableCell>{offer.description}</TableCell>
            <TableCell>
              {offer.promoCodes.length !== 0 &&
                (offer.promoCodes[0].discountPercentage
                  ? `${offer.promoCodes[0].discountPercentage}%`
                  : `${offer.promoCodes[0].discountValue} zł`)}
            </TableCell>
            <TableCell>{offer.organization.name}</TableCell>
            <TableCell>{offer.endDate.toLocaleDateString()}</TableCell>
            <TableCell>{offer.pointsCost}</TableCell>
            <TableCell>{offer.availablePromoCodes}</TableCell>
            <TableCell>
              <Button
                disabled={
                  currentPoints < offer.pointsCost ||
                  offer.availablePromoCodes === 0
                }
                onClick={() => handleClaimOffer(offer.id)}
              >
                Odbierz
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
