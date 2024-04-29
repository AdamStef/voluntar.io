import { cn } from '@/lib/utils';
import Volunteer from '../../assets/icons/volunteer-icon.svg';

type Props = {
  className?: string;
};

export const VolunteerIcon: React.FC<Props> = ({ className }) => {
  return (
    <img
      src={Volunteer}
      alt="volunteer"
      className={cn('h-64 w-64', className)}
    />
  );
};
