import { cn } from '@/lib/utils';
import { EventType } from '@/utils/types/types';
import React from 'react';
import { H3 } from '../ui/typography/heading';
import { Calendar, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { getLocationString } from '@/utils/helpers';
import { Progress } from '../ui/progress';

type EventProps = {
  event: EventType;
  className?: string;
};

export const Event: React.FC<EventProps> = ({ event, className }) => {
  return (
    <div
      className={cn(
        'flex h-48 max-h-64 w-full justify-between gap-4 rounded-sm bg-secondary p-4 text-secondary-foreground',
        className,
      )}
    >
      {/* <div className="flex justify-between"> */}
      <div className="flex basis-3/5 flex-col gap-2">
        <H3>{event.name}</H3>

        {/* Date */}
        <div className="flex items-center">
          <span className="mr-1">
            <Calendar className="h-4 w-4" />
          </span>
          <p className="text-sm">
            {event.startDate.toLocaleDateString()}
            {event.startDate.getDate() !== event.endDate.getDate() && (
              <span> - {event.endDate.toLocaleDateString()}</span>
            )}
          </p>
        </div>

        {/* Location */}
        <div className="flex items-center">
          <span className="mr-1">
            <MapPin className="h-4 w-4" />
          </span>
          <p className="text-sm">{getLocationString(event.location)}</p>
        </div>
        {/* <p>{event.description}</p> */}
      </div>
      <div className="flex basis-1/5 flex-col">
        Liczba uczestników: {event.participants.length}/
        {event.numberOfVolunteersNeeded}
        <Progress
          className=" bg-accent"
          value={
            (event.participants.length / event.numberOfVolunteersNeeded) * 100
          }
        />
      </div>

      {/* <div className="h-24 w-24 bg-primary">map</div> */}
      <Button asChild className="basis-1/5">
        <Link to={`/events/${event.id}`}>Zobacz więcej</Link>
      </Button>
    </div>
    // </div>
  );
};
