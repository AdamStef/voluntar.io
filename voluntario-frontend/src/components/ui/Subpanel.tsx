import { cn } from '@/lib/utils';

interface SubpanelProps {
  children: React.ReactNode;
  className?: string;
}

export const Subpanel = ({ children, className }: SubpanelProps) => {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-300 bg-white p-4 shadow-sm',
        className,
      )}
    >
      {children}
    </div>
  );
};
