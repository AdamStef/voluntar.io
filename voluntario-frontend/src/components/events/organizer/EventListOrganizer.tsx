import { EventOrganizer } from './EventOrganizer.tsx';
import { Spinner } from '@/components/ui/Spinner.tsx';
import { getOrganizerEvents } from '@/utils/api/api.ts';
import { EventStatus, EventType } from '@/utils/types/types.ts';
import { useQuery } from '@tanstack/react-query';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion.tsx';

interface GroupedEventsType {
  [key: string]: EventType[];
}

const order = [
  EventStatus.NOT_COMPLETED,
  EventStatus.COMPLETED,
  EventStatus.EVALUATED,
  EventStatus.CANCELED,
];

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
      const key =
        EventStatus[event.status.toString() as keyof typeof EventStatus];
      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(event);

      return acc;
    },
    {} as GroupedEventsType,
  );

  return (
    <Accordion
      type="multiple"
      defaultValue={[EventStatus.NOT_COMPLETED]}
      // collapsible
    >
      {order.map((status) => {
        const events = groupedEventsByCompleted[status];
        if (!events || events.length === 0) return null;
        return (
          <AccordionItem key={status} value={status}>
            <AccordionTrigger className="text-lg font-medium">
              {status}
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-5">
              {events &&
                events.map((event) => (
                  <EventOrganizer key={event.id} event={event} />
                ))}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
