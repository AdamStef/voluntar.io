import { EventOrganizer } from './EventOrganizer.tsx';
import { Spinner } from '@/components/ui/Spinner.tsx';
import { getOrganizerEvents } from '@/utils/api/api.ts';
import { EventType } from '@/utils/types/types.ts';
import { useQuery } from '@tanstack/react-query';

interface GroupedEventsType {
  [key: string]: EventType[];
}

enum Completed {
  completed = 'completed',
  notCompleted = 'not completed',
}

export const EventListOrganizer = () => {
  const {
    data: events,
    isError,
    isPending,
  } = useQuery({
    queryKey: ['organizer', 'events'],
    queryFn: getOrganizerEvents,
  });

  if (isPending) return <Spinner className="h-16 w-16" />;
  if (isError) return <div>Wystąpił błąd podczas pobierania wydarzeń</div>;
  if (!events || events.length == 0) return <p>Brak wydarzeń</p>;

  const groupedEventsByCompleted: GroupedEventsType = events.reduce(
    (acc, event) => {
      const key = event.isCompleted
        ? Completed.completed
        : Completed.notCompleted;
      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(event);

      return acc;
    },
    {} as GroupedEventsType,
  );

  console.log(groupedEventsByCompleted);

  return (
    <div className="flex flex-col gap-5">
      {groupedEventsByCompleted[Completed.notCompleted] && (
        <>
          <h2 className="text-xl">Niezakończone</h2>
          {groupedEventsByCompleted[Completed.notCompleted].map((event) => (
            <EventOrganizer key={event.id} event={event} />
          ))}
        </>
      )}
      <hr />
      {groupedEventsByCompleted[Completed.completed] && (
        <>
          <h2 className="text-xl">Zakończone</h2>
          {groupedEventsByCompleted[Completed.completed].map((event) => (
            <EventOrganizer key={event.id} event={event} />
          ))}
        </>
      )}
    </div>
  );
};
