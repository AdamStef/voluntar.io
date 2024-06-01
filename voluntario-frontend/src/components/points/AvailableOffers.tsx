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

export const AvailableOffers = ({
  currentPoints,
}: {
  currentPoints: number;
}) => {
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
    },
  });

  const handleClaimOffer = (offerId: number) => {
    console.log('Claiming offer', offerId);
    claimOfferMutate(offerId);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nazwa</TableHead>
          <TableHead>Opis</TableHead>
          <TableHead>Sponsor</TableHead>
          <TableHead>Data końcowa</TableHead>
          <TableHead>Potrzebne punkty</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {offers?.map((offer, index) => (
          <TableRow key={index}>
            <TableCell>{offer.name}</TableCell>
            <TableCell>{offer.description}</TableCell>
            <TableCell>{offer.sponsor.name}</TableCell>
            <TableCell>{offer.endDate.toLocaleDateString()}</TableCell>
            <TableCell>{offer.pointsCost}</TableCell>
            <TableCell>
              <Button
                disabled={currentPoints < offer.pointsCost}
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
