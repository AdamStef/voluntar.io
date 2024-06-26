import { cn } from '@/lib/utils';
import { EventType } from '@/utils/types/types';
import React from 'react';
import { H3 } from '../ui/typography/heading';
import { Calendar, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { getLocationString } from '@/utils/helpers';
import { Progress } from '../ui/progress';

type EventMiniProps = {
  event: EventType;
  className?: string;
  isPopup?: boolean;
};

export const EventMini: React.FC<EventMiniProps> = ({
  event,
  className,
  isPopup = false,
}) => {
  const numberOfParticipants = event.participants.length ?? 0;

  return (
    <div
      className={cn(
        'flex flex-col gap-1 rounded-sm bg-secondary text-secondary-foreground',
        isPopup ? 'p-2 text-xs' : 'p-4 text-sm',
        className,
      )}
    >
      <H3 className={cn(isPopup ? 'text-sm' : 'text-lg font-bold')}>
        {event.name}
      </H3>{' '}
      <div className="flex items-center">
        <span className="mr-1">
          <Calendar className={cn(isPopup ? 'h-3 w-3' : 'h-4 w-4')} />{' '}
        </span>
        <p className={cn(isPopup ? 'text-xs' : 'text-sm')}>
          {event.startDate.toLocaleDateString()}
          {event.startDate.getDate() !== event.endDate.getDate() && (
            <span> - {event.endDate.toLocaleDateString()}</span>
          )}
        </p>
      </div>
      <div className="flex items-center">
        <span className="mr-1">
          <MapPin className={cn(isPopup ? 'h-3 w-3' : 'h-4 w-4')} />{' '}
        </span>
        <p className={cn(isPopup ? 'text-xs' : 'text-sm')}>
          {getLocationString(event.location)}
        </p>
      </div>
      <div className="flex flex-col">
        <p className={cn(isPopup ? 'text-xs' : 'text-sm')}>
          Liczba uczestników: {numberOfParticipants}/
          {event.numberOfVolunteersNeeded}
        </p>
        <Progress
          className="bg-accent"
          value={(numberOfParticipants / event.numberOfVolunteersNeeded) * 100}
        />
      </div>
      <Button asChild>
        <Link
          to={`/events/${event.id}`}
          style={{ color: 'white', textDecoration: 'none' }}
        >
          Zobacz więcej
        </Link>
      </Button>
    </div>
  );
};
