import { EventType } from '@/utils/types/types';
import { CalendarCheck } from 'lucide-react';
import React, { ReactNode } from 'react';
import { H1 } from '../ui/typography/heading';
import { getLocationString } from '@/utils/helpers';
import { Button } from '../ui/button';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Panel } from '../ui/Panel';
import { useAuthContext } from '@/hooks/useAuthContext';
import { addParticipantToEvent } from '@/utils/api/api';

const tabButtonVariants = cva('font-semibold p-2', {
  variants: {
    variant: {
      default: 'hover:bg-accent rounded-md',
      active: 'text-primary',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({
  isActive,
  onClick,
  children,
}) => {
  const variant = isActive ? 'active' : 'default';

  return (
    <button className={cn(tabButtonVariants({ variant }))} onClick={onClick}>
      {children}
      {isActive && <hr className="translate-y-3 border-t-2 border-primary" />}
    </button>
  );
};

type EventDetailsHeaderProps = {
  event: EventType;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
};

export const EventDetailsHeader: React.FC<EventDetailsHeaderProps> = ({
  event,
  activeIndex,
  setActiveIndex,
}) => {
  const { user } = useAuthContext();

  const handleAddParticipant = () => {
    if (!user) return;
    console.log('Adding participant');
    addParticipantToEvent(event.id.toString(), user.id);
  };

  return (
    <Panel className="flex flex-col justify-between gap-4 pb-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <CalendarCheck className="h-24 w-24" />
          <div className="flex flex-col gap-2">
            <H1>{event.name}</H1>
            <p className="font-semibold text-destructive">
              {event.startDate.toLocaleDateString()} o{' '}
              {event.startDate.toLocaleTimeString()}
            </p>
            <p>{getLocationString(event.location)}</p>
          </div>
        </div>
        {/* <Button className="justify-self-end">Dołącz</Button> */}
      </div>

      <hr className="border-panel-foreground" />

      <div className="mb-1 flex justify-between">
        <div>
          <TabButton
            isActive={activeIndex === 0}
            onClick={() => setActiveIndex(0)}
          >
            Informacje
          </TabButton>
          <TabButton
            isActive={activeIndex === 1}
            onClick={() => setActiveIndex(1)}
          >
            Dyskusja
          </TabButton>
          <Button className="ml-10" onClick={handleAddParticipant}>
            Dołącz
          </Button>
        </div>
        {/* <Button className="">Dołącz</Button> */}
      </div>
    </Panel>
  );
};
