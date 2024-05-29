import { Offers } from '@/components/admin/offer/Offers';
import { Sponsors } from '@/components/admin/sponsor/Sponsors';

export const ShopManagementPage = () => {
  return (
    <div className="container mt-5 max-w-4xl">
      <div className="flex flex-col gap-5">
        <Sponsors />
        <Offers />
      </div>
    </div>
  );
};
