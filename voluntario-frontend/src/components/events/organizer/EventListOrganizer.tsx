import { EventOrganizer } from './EventOrganizer.tsx';

export const EventListOrganizer = (props) => {
  return (
      <>
          {!props.eventData || props.eventData.length > 0 ? (
              <div className="flex flex-col gap-5">
                  {props.eventData.map((event) => (
                      <EventOrganizer key={event.id} event={event} />
                  ))}
              </div>
          ) : (
              <div>Nie znaleziono wydarzeń</div>
          )}
      </>
  );
};
