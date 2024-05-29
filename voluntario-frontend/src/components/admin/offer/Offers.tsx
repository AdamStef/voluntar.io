import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { H3 } from '@/components/ui/typography/heading';
import { getAllOffers } from '@/utils/api/api';
import { useQuery } from '@tanstack/react-query';
import { AddOfferDialog } from './AddOfferDialog';

export const Offers = () => {
  const { data: offers } = useQuery({
    queryKey: ['offers'],
    queryFn: getAllOffers,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <H3>Oferty</H3>
        <AddOfferDialog />
      </div>
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
                <Button variant={'destructive'}>Usuń</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
