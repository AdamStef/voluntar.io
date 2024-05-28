import { EventOrganizer } from './EventOrganizer.tsx';
import { EventStatus } from '@/utils/types/types.ts';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion.tsx';
import { GroupedEventsType } from '@/pages/organizer/OrganizerHomePage.tsx';

const order = [
  EventStatus.NOT_COMPLETED,
  EventStatus.COMPLETED,
  EventStatus.EVALUATED,
  EventStatus.CANCELED,
];

export const EventListOrganizer = ({
  eventsGroupedByStatus,
}: {
  eventsGroupedByStatus: GroupedEventsType;
}) => {
  return (
    <Accordion type="multiple" defaultValue={[EventStatus.NOT_COMPLETED]}>
      {order.map((status) => {
        const events = eventsGroupedByStatus[status];
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
