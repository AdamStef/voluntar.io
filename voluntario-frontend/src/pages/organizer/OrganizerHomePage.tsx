import '@/components/organizer/ParticipantList.tsx';
import { EventListOrganizer } from '@/components/events/organizer/EventListOrganizer.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';
import { Participants } from '@/components/organizer/Participants.tsx';
import { useQuery } from '@tanstack/react-query';
import { getOrganizerEvents } from '@/utils/api/api';
import { Spinner } from '@/components/ui/Spinner';
import { EventStatus, EventType } from '@/utils/types/types';

export interface GroupedEventsType {
  [key: string]: EventType[];
}

const order = [
  EventStatus.NOT_COMPLETED,
  EventStatus.COMPLETED,
  EventStatus.EVALUATED,
  EventStatus.CANCELED,
];

export const OrganizerHomePage = () => {
  const {
    data: events,
    isError,
    isPending,
    isSuccess,
  } = useQuery({
    queryKey: ['organizer', 'events'],
    queryFn: getOrganizerEvents,
  });

  if (isPending) return <Spinner className="h-16 w-16" />;
  if (isError)
    return (
      <div className="mx-auto mt-5 w-fit">
        Wystąpił błąd podczas pobierania wydarzeń
      </div>
    );
  if (!events || events.length == 0)
    return <p className="mx-auto mt-5 w-fit">Brak wydarzeń</p>;

  // console.log(events);

  const eventsGroupedByStatus: GroupedEventsType = events
    .sort((a, b) => a.startDate.getDate() - b.startDate.getDate())
    .reduce((acc, event) => {
      const key =
        EventStatus[event.status.toString() as keyof typeof EventStatus];
      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(event);

      return acc;
    }, {} as GroupedEventsType);

  console.log(events);

  return (
    <div className="container mt-5 flex flex-col gap-3 md:flex-row">
      {isPending && <Spinner className="h-16 w-16" />}
      {isError && (
        <div className="mx-auto mt-5 w-fit">
          Wystąpił błąd podczas pobierania wydarzeń
        </div>
      )}
      {(!events || events.length == 0) && (
        <p className="mx-auto mt-5 w-fit">Brak wydarzeń</p>
      )}
      {isSuccess && (
        <>
          <div className="m-4 flex flex-col md:w-2/3">
            <div className="flex items-center justify-between gap-2">
              <p className="my-3 text-left text-2xl font-bold">
                Twoje wydarzenia
              </p>
              <Button variant={'default'} className="w-40">
                <Link to={'/addevent'} className="">
                  {' '}
                  Dodaj wydarzenie{' '}
                </Link>
              </Button>
            </div>
            <div className="mt-4 items-center">
              <EventListOrganizer
                eventsGroupedByStatus={eventsGroupedByStatus}
              />
            </div>
          </div>
          <div className="m-4 md:w-1/3">
            <p className="my-2 text-center text-xl font-bold">
              Zapisani wolontariusze
            </p>
            <Participants
              events={order
                .filter((status) => eventsGroupedByStatus[status])
                .map((status) => eventsGroupedByStatus[status])
                .flat()}
            />
          </div>
        </>
      )}
    </div>
  );
};
