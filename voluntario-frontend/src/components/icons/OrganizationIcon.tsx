import { cn } from '@/lib/utils';
import Organization from '../../assets/icons/organization-icon.svg';

type Props = {
  className?: string;
};

export const OrganizationIcon: React.FC<Props> = ({ className }) => {
  return (
    <img
      src={Organization}
      alt="organization"
      className={cn('h-64 w-64', className)}
    />
  );
};
