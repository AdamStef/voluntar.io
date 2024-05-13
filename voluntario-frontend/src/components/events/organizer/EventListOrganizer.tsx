import { EventOrganizer } from './EventOrganizer.tsx';
import { Spinner } from '@/components/ui/Spinner.tsx';
import { EventType } from '@/utils/types/types.ts';

type EventListOrganizerProps = {
  loading: boolean;
  eventData: EventType[];
};

export const EventListOrganizer: React.FC<EventListOrganizerProps> = ({
  loading,
  eventData,
}) => {
  return (
    <>
      {loading ? (
        <Spinner className="h-16 w-16" />
      ) : eventData.length > 0 ? (
        <div className="flex flex-col gap-5">
          {eventData.map((event) => (
            <EventOrganizer key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div>Nie masz żadnych wydarzeń</div>
      )}
    </>
  );
};
