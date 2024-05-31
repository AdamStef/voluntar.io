import { Panel } from '@/components/ui/Panel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { H3, H4 } from '@/components/ui/typography/heading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { RealizeCouponDialog } from '@/components/organizer/RealizeCouponDialog';
import { Subpanel } from '@/components/ui/Subpanel';

export const RealizeCouponPage = () => {
  return (
    <div className="container mt-5 flex max-w-4xl flex-col gap-5">
      <H3>Wyszukaj kupon</H3>
      <Panel className="flex flex-col gap-5 bg-gray-200 p-5">
        <div className="flex grow-0 justify-center gap-2">
          <Input className="w-2/3" placeholder="Wpisz kod kuponu" />
          <Button>Wyszukaj</Button>
        </div>
        <Subpanel>
          <H4 className="mb-2">Dane kuponu</H4>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kod kuponu</TableHead>
                <TableHead>Oferta</TableHead>
                <TableHead>Rodzaj kuponu</TableHead>
                <TableHead>Zniżka</TableHead>
                <TableHead>Data wygaśnięcia</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* {sponsors?.map((sponsor, index) => ( */}
              <TableRow>
                <TableCell>123456</TableCell>
                <TableCell>Zniżka na karmę dla psów</TableCell>
                <TableCell>Procentowe</TableCell>
                <TableCell>10%</TableCell>
                <TableCell>2021-12-31</TableCell>
                <TableCell>
                  {/* <Button>Realizuj</Button> */}
                  <RealizeCouponDialog />
                </TableCell>
              </TableRow>
              {/* ))} */}
            </TableBody>
          </Table>
        </Subpanel>
      </Panel>
    </div>
  );
};
