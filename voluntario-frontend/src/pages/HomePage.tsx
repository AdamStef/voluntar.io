import UserEventsList from '@/components/events/UserEventList';
import MapEvents from '@/components/events/MapEvents';
import React from 'react';
import CalendarComponent from '@/components/events/CalendarComponent';

export const HomePage: React.FC = () => {
  return (
    <div className="container mt-5 flex flex-col gap-3">
      <div className="flex flex-row">
        <div className="m-4 flex-1">
          <p className="text-left text-2xl font-bold">Kalendarz</p>
          <div className="mt-4 h-[300px]">
            <CalendarComponent />
          </div>
        </div>
        <div className="m-4 flex-1">
          <p className="text-left text-2xl font-bold">Mapa</p>
          <div className="mt-4 h-[300px]">
            <MapEvents />
          </div>
        </div>
      </div>
      <div className="m-4">
        <p className="text-left text-2xl font-bold">Twoje wydarzenia</p>
        <div className="mt-4">
          <UserEventsList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
