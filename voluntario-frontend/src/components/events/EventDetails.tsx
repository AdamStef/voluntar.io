import { EventDetailsHeader } from './EventDetailsHeader';
import { EventDetailsInformation } from './EventDetailsInformation';
import { useState } from 'react';
import { EventDetailsDiscussion } from './EventDetailsDiscussion';
import { Panel } from '../ui/Panel';
import { useGetEvent } from '@/hooks/useGetEvents';
import { useParams } from 'react-router-dom';
import { Spinner } from '../ui/Spinner';

type EventDetailsParams = {
  eventId: string;
};

export const EventDetails = () => {
  const { eventId } = useParams() as EventDetailsParams;
  const { data: event, isError, error, isPending } = useGetEvent(eventId);
  const [activeIndex, setActiveIndex] = useState(0);

  if (isPending)
    return (
      <div className="flex items-center justify-center">
        <Spinner className="h-24 w-24" />
      </div>
    );

  if (isError) return <div>{error.message}</div>;

  if (!event) return null;
  return (
    <div className="flex flex-col gap-4">
      <EventDetailsHeader
        event={event}
        activeIndex={activeIndex}
        setActiveIndex={setActiveIndex}
      />
      <div className="flex w-full flex-col gap-2 md:flex-row md:items-start">
        <div className="md:w-2/3">
          {activeIndex === 0 && <EventDetailsInformation event={event} />}
          {activeIndex === 1 && <EventDetailsDiscussion />}
        </div>
        <Panel className="md:w-1/3">Map</Panel>
      </div>
    </div>
  );
};
