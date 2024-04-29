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
      className={cn('rounded-sm bg-panel p-4 text-panel-foreground', className)}
      {...props}
    >
      {children}
    </div>
  );
};
