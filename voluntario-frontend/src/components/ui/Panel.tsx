import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

type PanelProps = {
  children: React.ReactNode;
  className?: string;
};

export const Panel: React.FC<PanelProps & HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        // 'rounded-sm bg-panel p-4 text-panel-foreground shadow-sm',
        'rounded-sm bg-gray-200 p-4 text-gray-800 shadow-sm',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
