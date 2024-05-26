import React, { useState, useEffect } from 'react';
import { getUserEvents } from '@/utils/api/api';
import { EventType } from '@/utils/types/types';

const UserEventsList: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getUserEvents();
        setEvents(eventsData);
      } catch (error) {
        setError('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <p className="text-center">Ładowanie eventów...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="rounded-lg bg-gray-100 p-4">
      <h2 className="mb-4 text-2xl font-bold">Twoje eventy</h2>
      {events.length === 0 ? (
        <p className="text-center">Nie znaleziono eventów</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event.id}
              className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <h3 className="text-xl font-semibold">{event.name}</h3>
              <p className="mt-2 text-gray-600">{event.description}</p>
              <p className="mt-2 text-gray-500">
                Rozpoczyna się: {new Date(event.startDate).toLocaleDateString()}{' '}
                - Kończy się: {new Date(event.endDate).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserEventsList;
