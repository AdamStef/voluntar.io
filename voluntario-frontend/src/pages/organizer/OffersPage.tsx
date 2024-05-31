import { Offers } from '@/components/organizer/offer/Offers';
import { H3 } from '@/components/ui/typography/heading';

export const OffersPage = () => {
  return (
    <div className="container mt-5 flex max-w-4xl flex-col gap-5">
      <H3>Oferty</H3>
      <Offers />
    </div>
  );
};
