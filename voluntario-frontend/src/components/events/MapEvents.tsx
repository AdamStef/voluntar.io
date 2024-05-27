import { getUserEvents } from '@/utils/api/api';
import { EventType } from '@/utils/types/types';
import { getEventPosition } from '@/utils/helpers';
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon, LatLngTuple } from 'leaflet';
import { Spinner } from '../ui/Spinner';
import { EventMini } from '@/components/events/EventMini.tsx';
import EventIcon from '@/assets/icons/event-marker-icon.svg';

const customMarkerIcon = new Icon({
  iconUrl: EventIcon,
  iconSize: [48, 48],
});

const findCenter = (events: EventType[]): LatLngTuple => {
  if (events.length === 0) {
    return [0, 0];
  }
  const lat =
    events
      .map((event) =>
        event.location && event.location.latitude ? event.location.latitude : 0,
      )
      .reduce((a, b) => a + b) / events.length;
  const lng =
    events
      .map((event) =>
        event.location && event.location.longitude
          ? event.location.longitude
          : 0,
      )
      .reduce((a, b) => a + b) / events.length;
  return [lat, lng];
};

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

  const mapCenter = findCenter(events);

  return (
    <div className="flex h-full flex-col gap-3">
      <MapContainer
        center={mapCenter}
        zoom={4}
        scrollWheelZoom={true}
        className="z-10 h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {events.map((event) => {
          const eventPosition: LatLngTuple | null = getEventPosition(event);
          if (!eventPosition) return null;
          return (
            <Marker
              key={event.id}
              position={eventPosition}
              icon={customMarkerIcon}
            >
              <Popup>
                <EventMini event={event} />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default MapEvents;
