import { AvailableOffers } from '@/components/points/AvailableOffers';
import { CurrentPoints } from '@/components/points/CurrentPoints';
import { PromoCodes } from '@/components/points/PromoCodes';
import { H3 } from '@/components/ui/typography/heading';
import { getCurrentPoints } from '@/utils/api/api';
import { useQuery } from '@tanstack/react-query';

export const PointExchangePage = () => {
  const { data: points } = useQuery({
    queryKey: ['current-points'],
    queryFn: getCurrentPoints,
  });

  return (
    <div className="container mt-5 flex max-w-4xl flex-col gap-10">
      <H3>Wymiana punktów</H3>
      <div className="flex items-center justify-center gap-5">
        <p>Twoje punkty:</p>
        <CurrentPoints points={points ?? 0} />
      </div>
      <div>
        <p>Moje kody promocyjne:</p>
        <PromoCodes />
      </div>
      <div>
        <p>Dostępne oferty:</p>
        <AvailableOffers currentPoints={points ?? 0} />
      </div>
    </div>
  );
};
