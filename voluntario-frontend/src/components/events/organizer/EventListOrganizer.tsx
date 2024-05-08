import { EventOrganizer } from './EventOrganizer.tsx';
import { PaginationComponent } from '@/components/events/PaginationComponent.tsx';

export const EventListOrganizer = (props) => {
  return (
      <>
          <div className="flex flex-col gap-5">
            {props.eventData.map((event) => (
                <EventOrganizer key={event.id} event={event} />
            ))}
            <PaginationComponent />
          </div>
      </>
  );
};
