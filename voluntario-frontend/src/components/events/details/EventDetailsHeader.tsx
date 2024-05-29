import { EventStatus, EventType, Role } from '@/utils/types/types';
import { CalendarCheck } from 'lucide-react';
import React, { ReactNode, useEffect, useState } from 'react';
import { H1 } from '../../ui/typography/heading';
import { getEnumValue, getLocationString } from '@/utils/helpers';
import { Button } from '../../ui/button';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Panel } from '../../ui/Panel';
import { useAuthContext } from '@/hooks/useAuthContext';
import {
  addParticipantToEvent,
  removeParticipantFromEvent,
} from '@/utils/api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export const EventDetailsHeader: React.FC<EventDetailsHeaderProps> = ({
  event,
  activeTab,
  setActiveTab,
}) => {
  if (!event.participants) {
    event.participants = [];
  }

  const queryClient = useQueryClient();
  const { user } = useAuthContext();
  const [canJoin, setCanJoin] = useState<boolean>(checkIfCanJoin());
  const [canLeave, setCanLeave] = useState<boolean>(checkIfCanLeave());

  const { mutate: addParticipantMutate } = useMutation({
    mutationFn: addParticipantToEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', event.id] });
    },
  });

  const { mutate: removeParticipantMutate } = useMutation({
    mutationFn: removeParticipantFromEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', event.id] });
    },
  });

  function checkIfCanJoin() {
    if (event.participants) {
      return (
        event.participants.every((p) => p.userId !== user?.id) &&
        event.participants.length < event.numberOfVolunteersNeeded &&
        event.startDate > new Date()
      );
    }
    return true;
  }

  function checkIfCanLeave() {
    if (event.participants) {
      return (
        event.participants.some((p) => p.userId === user?.id) &&
        event.startDate > new Date()
      );
    }
    return false;
  }

  useEffect(() => {
    setCanJoin(checkIfCanJoin());
    setCanLeave(checkIfCanLeave());
  }, [event, user]);

  const handleAddParticipant = () => {
    if (!user || !canJoin) return;
    addParticipantMutate({
      eventId: event.id.toString(),
      participantId: user.id,
    });
    console.log(event.id.toString(), user.id);
  };

  const handleLeaveEvent = () => {
    if (!user || !canLeave) return;
    removeParticipantMutate({
      eventId: event.id.toString(),
      participantId: user.id,
    });
  };

  console.log(event);

  return (
    <Panel className="flex flex-col justify-between gap-4 pb-0">
      <div className="flex items-center gap-4">
        <CalendarCheck className="hidden h-24 w-24 md:block" />
        <div className="flex flex-col gap-2">
          <H1>{event.name}</H1>
          <p className="font-semibold text-destructive">
            {event.startDate.toLocaleDateString()} o{' '}
            {event.startDate.toLocaleTimeString()}
          </p>
          <p>{getLocationString(event.location)}</p>
        </div>
      </div>

      <hr className="border-panel-foreground" />

      <div className="mb-1 flex justify-between">
        <div>
          <TabButton
            isActive={activeTab === 'information'}
            onClick={() => setActiveTab('information')}
          >
            Informacje
          </TabButton>
          <TabButton
            isActive={activeTab === 'discussion'}
            onClick={() => setActiveTab('discussion')}
          >
            Dyskusja
          </TabButton>

          {user?.role === Role.VOLUNTEER &&
            getEnumValue(EventStatus, event.status) ==
              EventStatus.NOT_COMPLETED && (
              <>
                {canJoin && (
                  <Button className="ml-10" onClick={handleAddParticipant}>
                    Dołącz
                  </Button>
                )}
                {canLeave && (
                  <Button
                    className="ml-10"
                    variant={'destructive'}
                    onClick={handleLeaveEvent}
                  >
                    Opuść
                  </Button>
                )}
              </>
            )}
        </div>
      </div>
    </Panel>
  );
};
