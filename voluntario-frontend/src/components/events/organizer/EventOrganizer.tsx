import { cn } from '@/lib/utils.ts';
import { EventType } from '@/utils/types/types.ts';
import React from 'react';
import { H3 } from '../../ui/typography/heading.tsx';
import { Calendar, MapPin, Info } from 'lucide-react';
import { Button } from '../../ui/button.tsx';
import { Link } from 'react-router-dom';
import { getLocationString } from '@/utils/helpers.ts';
import { Progress } from '../../ui/progress.tsx';
import { removeEvent } from '@/utils/api/api.ts';
import { QueryClient, useMutation } from '@tanstack/react-query';

type EventProps = {
  event: EventType;
  className?: string;
};

export const EventOrganizer: React.FC<EventProps> = ({ event, className }) => {
  const queryClient = new QueryClient();
  const { mutate } = useMutation({
    mutationFn: removeEvent,
    onSuccess: () => {
      console.log('Event removed');
      queryClient.refetchQueries({
        queryKey: ['organizer', 'events'],
      });
    },
  });

  function deleteEvent() {
    mutate(event.id.toString());
    // removeEvent(String(event.id));
    // setDeleted(true);
  }

  return (
    <div
      className={cn(
        'flex min-h-48 w-full flex-col justify-between gap-4 rounded-sm bg-secondary p-4 text-secondary-foreground md:flex-row',
        className,
      )}
    >
      {/* <div className="flex justify-between"> */}
      <div className="flex flex-col gap-2 md:basis-3/5">
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
        {/*description*/}
        <div className="flex items-center">
          <span className="mr-1">
            <Info className="h-4 w-4" />
          </span>
          <p className="line-clamp-3 text-sm">{event.description}</p>
        </div>
        {/* <p>{event.description}</p> */}
      </div>
      <div className="flex flex-col md:basis-1/5">
        Liczba uczestników: {event.participants.length}/
        {event.numberOfVolunteersNeeded}
        <Progress
          className="bg-accent"
          value={
            (event.participants.length / event.numberOfVolunteersNeeded) * 100
          }
        />
      </div>

      {/* <div className="h-24 w-24 bg-primary">map</div> */}
      <div className="flex basis-1/5 flex-col gap-2">
        <Button asChild className="">
          <Link to={`/events/${event.id}`}>Zobacz więcej</Link>
        </Button>
        <Button variant={'destructive'} className="" onClick={deleteEvent}>
          Usuń wydarzenie
        </Button>
      </div>
    </div>
  );
};
