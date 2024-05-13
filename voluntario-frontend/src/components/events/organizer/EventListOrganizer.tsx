import { EventOrganizer } from './EventOrganizer.tsx';
import { Spinner } from '@/components/ui/Spinner.tsx';
import { getOrganizerEvents } from '@/utils/api/api.ts';
import { useQuery } from '@tanstack/react-query';

export const EventListOrganizer = () => {
  const {
    data: events,
    isError,
    isPending,
  } = useQuery({
    queryKey: ['organizer', 'events'],
    queryFn: getOrganizerEvents,
  });

  if (isError) {
    return <div>Wystąpił błąd podczas pobierania wydarzeń</div>;
  }

  if (!events) return null;

  return (
    <>
      {isPending ? (
        <Spinner className="h-16 w-16" />
      ) : events.length > 0 ? (
        <div className="flex flex-col gap-5">
          {events.map((event) => (
            <EventOrganizer key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div>Nie masz żadnych wydarzeń</div>
      )}
    </>
  );
};
