import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getAllOffers } from '@/utils/api/api';
import { useQuery } from '@tanstack/react-query';
import { AddOfferDialog } from './AddOfferDialog';
import { Panel } from '@/components/ui/Panel';
import { Subpanel } from '@/components/ui/Subpanel';
import { H4 } from '@/components/ui/typography/heading';

export const Offers = () => {
  const { data: offers } = useQuery({
    queryKey: ['offers'],
    queryFn: getAllOffers,
  });

  return (
    <Panel className="flex flex-col gap-4 bg-gray-200">
      <div className="flex items-center justify-between">
        <H4>Lista twoich ofert:</H4>
        <AddOfferDialog />
      </div>
      <Subpanel>
        <Table className="">
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
      </Subpanel>
    </Panel>
  );
};
