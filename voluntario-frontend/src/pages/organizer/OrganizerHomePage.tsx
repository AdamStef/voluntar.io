import '@/components/organizer/ParticipantList.tsx';
import { EventListOrganizer } from '@/components/events/organizer/EventListOrganizer.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Link } from 'react-router-dom';
import { ParticipantList } from '@/components/organizer/ParticipantList.tsx';
import { getOrganizerEvents } from '@/utils/api/api.ts';
import { useEffect, useState } from 'react';

export const OrganizerHomePage = () => {
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState([]);

  const fetchData = async () => {
    try {
      const events = await getOrganizerEvents();
      setEventData(events);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false); // Set loading to false regardless of success or failure
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mt-5 flex flex-col gap-3 md:flex-row">
      <div className="m-4 flex w-3/4 flex-col">
        <div className="relative flex items-center justify-between">
          <p className="my-3 text-left text-2xl font-bold">Twoje wydarzenia</p>
          <Button variant={'default'} className="w-40">
            <Link to={'/addevent'} className="">
              {' '}
              Dodaj wydarzenie{' '}
            </Link>
          </Button>
        </div>
        <div className="mt-4 items-center gap-6">
          <EventListOrganizer eventData={eventData} loading={loading} />
        </div>
      </div>
      <div className="m-4 w-1/4">
        <p className="my-2 text-center text-xl font-bold">
          Zapisani wolontariusze
        </p>
        <ParticipantList eventData={eventData} />
      </div>
    </div>
  );
};
