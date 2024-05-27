import { getUserEvents } from '@/utils/api/api';
import { EventType } from '@/utils/types/types';
import { getEventPosition } from '@/utils/helpers';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import { Spinner } from '../ui/Spinner';

const MapEvents: React.FC = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await getUserEvents();
        setEvents(eventsData);
      } catch (err) {
        setError('Error fetching events');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Spinner className="h-24 w-24" />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <MapContainer
        center={[52.2297, 21.0122]}
        zoom={12}
        scrollWheelZoom={true}
        className="h-[500px] w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {events.map((event) => {
          const eventPosition: LatLngTuple | null = getEventPosition(event);
          if (!eventPosition) return null;
          return (
            <Marker key={event.id} position={eventPosition}>
              <Popup>
                <div>
                  <h3>
                    <strong>Wydarzenie: </strong>
                    {event.name}
                  </h3>
                  <p>
                    <strong>Opis: </strong>
                    {event.description}
                  </p>
                  <p>
                    <strong>Rozpoczęcie:</strong>{' '}
                    {new Date(event.startDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Zakończenie:</strong>{' '}
                    {new Date(event.endDate).toLocaleDateString()}
                  </p>{' '}
                  //TODO: Think about adding a button to redirect to the event
                  details page
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapEvents;
