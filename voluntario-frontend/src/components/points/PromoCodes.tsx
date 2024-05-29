import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getMyPromoCodes } from '@/utils/api/api';
import { useQuery } from '@tanstack/react-query';

export const PromoCodes = () => {
  const { data: promoCodes } = useQuery({
    queryKey: ['promo-codes'],
    queryFn: getMyPromoCodes,
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Kod</TableHead>
          <TableHead>Oferta</TableHead>
          <TableHead>Rabat</TableHead>
          <TableHead>Max. użycia</TableHead>
          <TableHead>Data ważności</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {promoCodes?.map((promoCode, index) => (
          <TableRow key={index}>
            <TableCell>{promoCode.code}</TableCell>
            <TableCell>{promoCode.offer.name}</TableCell>
            <TableCell>
              {!promoCode.discountPercentage &&
                promoCode.discountValue + ' PLN'}
              {!promoCode.discountValue &&
                promoCode.discountPercentage?.toString() + '%'}
            </TableCell>
            <TableCell>{promoCode.maxUsages}</TableCell>
            <TableCell>
              {promoCode.expirationDate.toLocaleDateString()}
            </TableCell>
            {/* <TableCell>{offer.name}</TableCell>
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
            </TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
