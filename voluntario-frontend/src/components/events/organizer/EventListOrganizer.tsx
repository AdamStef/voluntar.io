import { EventOrganizer } from './EventOrganizer.tsx';
import {Spinner} from "@/components/ui/Spinner.tsx";

export const EventListOrganizer = (props) => {
    console.log(props.loading)
  return (
      <>
          {props.loading ? (
              <Spinner className="h-16 w-16" />
          ) : props.eventData.length > 0 ? (
              <div className="flex flex-col gap-5">
                  {props.eventData.map((event) => (
                      <EventOrganizer key={event.id} event={event} />
                  ))}
              </div>
          ) : (
              <div>Nie masz żadnych wydarzeń</div>
          )}
      </>
  );
};
