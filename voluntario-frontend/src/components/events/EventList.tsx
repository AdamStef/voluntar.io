import { getEvents } from '@/utils/api/api';
import { Event } from './Event';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '../ui/Spinner';

export const EventList = () => {
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
      {data.map((event) => (
        <Event key={event.id} event={event} />
      ))}
    </div>
  );
};
