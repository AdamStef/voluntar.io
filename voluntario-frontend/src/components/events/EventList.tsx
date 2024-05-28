import { useState } from 'react';
import { getEvents } from '@/utils/api/api';
import { Event } from './Event';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '../ui/Spinner';
import { useAppSelector } from '@/utils/context/store';
import { selectSearch } from '@/utils/context/searchSlice';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { EventMini } from '@/components/events/EventMini.tsx';
import { Icon, LatLngExpression } from 'leaflet';
import { getEventPosition } from '@/utils/helpers';
import EventIcon from '@/assets/icons/event-marker-icon.svg';
import { EventType } from '@/utils/types/types';
import PaginatedList from '../PaginatedList';
import { useSearchParams } from 'react-router-dom';

const customMarkerIcon = new Icon({
  iconUrl: EventIcon,
  iconSize: [48, 48], // Rozmiar ikony
});

export const EventList = () => {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState<number>(
    Number(searchParams.get('page')) || 0,
  );
  const [showMap, setShowMap] = useState(false);
  const search = selectSearch(useAppSelector((state) => state));
  const { data, isError, isPending } = useQuery({
    queryKey: ['events', { page, search }],
    queryFn: () => getEvents(page, search),
    // initialData: {},
  });

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const toggleView = () => {
    setShowMap((prev) => !prev);
  };

  if (isPending) {
    return (
      <div className="flex justify-center">
        <Spinner className="h-24 w-24" />
      </div>
    );
  }

  if (isError || data.content.length === 0)
    return <div>Nie znaleziono żadnych wydarzeń.</div>;

  const findCenter = (events: EventType[]): LatLngExpression => {
    if (events.length === 0) {
      return [0, 0];
    }
    const lat = events
      .map((event) =>
        event.location && event.location.latitude ? event.location.latitude : 0,
      )
      .reduce((a, b) => a + b);
    const lng = events
      .map((event) =>
        event.location && event.location.longitude
          ? event.location.longitude
          : 0,
      )
      .reduce((a, b) => a + b);
    return [lat / events.length, lng / events.length];
  };

  const mapCenter = findCenter(data.content);

  return (
    <>
      <button onClick={toggleView}>
        {showMap ? 'Pokaż listę' : 'Pokaż mapę'}
      </button>
      {showMap && (
        <MapContainer
          center={mapCenter}
          zoom={6}
          scrollWheelZoom={false}
          className="z-10 h-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {/* Renderowanie markerów dla wydarzeń */}
          {data.content.map((event) => {
            const position = getEventPosition(event);
            console.log(position);
            if (position) {
              return (
                <Marker
                  key={event.id}
                  position={position}
                  icon={customMarkerIcon}
                >
                  <Popup>
                    <EventMini event={event} />
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}
        </MapContainer>
      )}
      {!showMap && (
        <div className="flex flex-col gap-5">
          {data.content.map((event) => (
            <Event key={event.id} event={event} />
          ))}
          <PaginatedList page={data} changePage={handleChangePage} />
        </div>
      )}
    </>
  );
};
