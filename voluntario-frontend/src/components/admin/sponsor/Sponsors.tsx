import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { getAllSponsors } from '@/utils/api/api';
import { H3 } from '../../ui/typography/heading';
import { Button } from '../../ui/button';
import { AddSponsorDialog } from './AddSponsorDialog';

export const Sponsors = () => {
  const { data: sponsors } = useQuery({
    queryKey: ['sponsors'],
    queryFn: getAllSponsors,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <H3>Sponsorzy</H3>
        <AddSponsorDialog />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nazwa</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sponsors?.map((sponsor, index) => (
            <TableRow key={index}>
              <TableCell>{sponsor.name}</TableCell>
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
