import '@/components/organizer/ParticipantList.tsx';
import { EventListOrganizer } from '@/components/events/organizer/EventListOrganizer.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';
import { ParticipantList } from '@/components/organizer/ParticipantList.tsx';

export const OrganizerHomePage = () => {
  return (
    <div className="container mt-5 flex flex-col gap-3 md:flex-row">
      <div className="m-4 flex flex-col md:w-3/4">
        <div className="flex items-center justify-between gap-2">
          <p className="my-3 text-left text-2xl font-bold">Twoje wydarzenia</p>
          <Button variant={'default'} className="w-40">
            <Link to={'/addevent'} className="">
              {' '}
              Dodaj wydarzenie{' '}
            </Link>
          </Button>
        </div>
        <div className="mt-4 items-center">
          <EventListOrganizer />
        </div>
      </div>
      <div className="m-4 md:w-1/4">
        <p className="my-2 text-center text-xl font-bold">
          Zapisani wolontariusze
        </p>
        <ParticipantList />
      </div>
    </div>
  );
};
