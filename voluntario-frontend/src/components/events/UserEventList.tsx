import React, { useState, useEffect } from 'react';
import { getUserEvents } from '@/utils/api/api';
import { EventType } from '@/utils/types/types';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

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
    return <p className="text-center">Ładowanie wydarzeń...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="rounded-lg bg-gray-100 p-4">
      {events.length === 0 ? (
        <p className="text-center">Nie znaleziono wydarzeń</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event.id}
              className="flex items-start justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div>
                <h3 className="text-xl font-semibold">{event.name}</h3>
                <p className="mt-2 text-gray-600">{event.description}</p>
                <p className="mt-2 text-gray-500">
                  Rozpoczyna się: {new Date(event.startDate).toLocaleString()}
                  <br />
                  Kończy się: {new Date(event.endDate).toLocaleString()}
                </p>
              </div>
              <Button asChild>
                <Link
                  to={`/events/${event.id}`}
                  style={{ color: 'white', textDecoration: 'none' }}
                >
                  Zobacz więcej
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserEventsList;
