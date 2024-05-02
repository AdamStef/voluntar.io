import { cn } from '@/lib/utils';
import { ImSpinner2 } from 'react-icons/im';

export const Spinner = ({ className }: { className?: string }) => {
  return <ImSpinner2 className={cn('animate-spin text-primary', className)} />;
};
