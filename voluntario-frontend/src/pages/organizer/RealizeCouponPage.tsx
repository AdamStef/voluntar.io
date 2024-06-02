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
import { useState } from 'react';
import { getPromoCode, redeemPromoCode } from '@/utils/api/api';
import { useToast } from '@/components/ui/use-toast';
import { PromoCodeType } from '@/utils/types/types';

export const RealizeCouponPage = () => {
  // const { data: promoCodes } = useQuery({
  //   queryKey: ['promo-codes'],
  //   queryFn: getMyPromoCodes,
  // });

  const [searchPromoCode, setSearchPromoCode] = useState('');
  const [promoCode, setPromoCode] = useState<PromoCodeType | null>(null);
  const { toast } = useToast();

  const handleSearch = async () => {
    try {
      const response = await getPromoCode(searchPromoCode);
      console.log(response);
      setPromoCode(response.data);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się znaleźć kuponu',
        variant: 'destructive',
      });
    }
  };

  const handleRedeem = async (code: string) => {
    try {
      console.log('preredeemed');
      await redeemPromoCode(code);
      console.log('redeemed');
      toast({
        title: 'Sukces',
        description: 'Kupon został zrealizowany',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Błąd',
        description: 'Nie udało się zrealizować kuponu',
        variant: 'destructive',
      });
    } finally {
      setSearchPromoCode(promoCode?.code || '');
      handleSearch();
    }
  };

  return (
    <div className="container mt-5 flex max-w-4xl flex-col gap-5">
      <H3>Wyszukaj kupon</H3>
      <Panel className="flex flex-col gap-5 bg-gray-200 p-5">
        <div className="flex grow-0 justify-center gap-2">
          <Input
            className="w-2/3"
            onChange={(e) => setSearchPromoCode(e.target.value)}
            placeholder="Wpisz kod kuponu"
          />
          <Button onClick={handleSearch}>Wyszukaj</Button>
        </div>
        {promoCode && (
          <Subpanel>
            <H4 className="mb-2">Dane kuponu</H4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kod kuponu</TableHead>
                  <TableHead>Oferta</TableHead>
                  {/* <TableHead>Rodzaj kuponu</TableHead> */}
                  <TableHead>Zniżka</TableHead>
                  <TableHead>Data wygaśnięcia</TableHead>
                  <TableHead>Może być użyte?</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>{promoCode.code}</TableCell>
                  <TableCell>{promoCode.offer.name}</TableCell>
                  {/* <TableCell>{promoCode.promoCodeType}</TableCell> */}
                  <TableCell>
                    {promoCode.discountPercentage &&
                      promoCode.discountPercentage + '%'}
                    {promoCode.discountValue && promoCode.discountValue + 'zł'}
                  </TableCell>
                  <TableCell>
                    {promoCode.expirationDate.toLocaleDateString()}
                  </TableCell>
                  <TableCell>{promoCode.canBeUsed ? 'Tak' : 'Nie'}</TableCell>
                  <TableCell>
                    <RealizeCouponDialog
                      onClick={() => handleRedeem(promoCode.code)}
                      disabled={!promoCode.canBeUsed}
                    />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Subpanel>
        )}
      </Panel>
    </div>
  );
};
