import { getEvents } from '@/utils/api/api';
import { EventOrganizer } from './EventOrganizer';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '../ui/Spinner';
import React from "react";

export const EventListOrganizer = () => {
  const { data, isError, isPending } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
    initialData: [],
  });

  if (isPending)
    return (
      <div className="flex justify-center">
        <Spinner className="h-24 w-24" />
      </div>
    );

  if (isError) return <div>Nie znaleziono żadnych wydarzeń.</div>;

  return (
    <div className="flex flex-col gap-5">
      {data.map((event) => (<div>
        <EventOrganizer key={event.id} event={event} />

          </div>
      ))}
    </div>
  );
};
