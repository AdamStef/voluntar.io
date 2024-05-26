import UserEventsList from '@/components/events/UserEventList';
import React from 'react';
import CalendarComponent from '@/components/events/CalendarComponent';
// import { EventList } from '@/components/events/EventList.tsx';
import '@/components/organizer/ParticipantList.tsx';
// import { EventListOrganizer } from '@/components/events/organizer/EventListOrganizer.tsx';

export const HomePage: React.FC = () => {
  return (
    <div className="container mt-5 flex flex-col gap-3 md:flex-row">
      <div className="m-4 flex flex-col md:w-3/4">
        <div className="flex items-center justify-between gap-2">
          <p className="my-3 text-left text-2xl font-bold">Kalendarz</p>
        </div>
        <div className="mt-4 items-center">
          <CalendarComponent />
        </div>
        <div className="app-container p-4">
          <UserEventsList />
        </div>
        {/* <div className="items-right mt-4">
          <EventList />
        </div> */}
        {/* <div className="mt-4 items-center">
          <EventListOrganizer />
        </div> */}
      </div>
    </div>
  );
};
