import { Icon, LatLngExpression } from 'leaflet';
import EventIcon from '@/assets/icons/event-marker-icon.svg';
import { EventStatus, EventType } from '@/utils/types/types';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { getEventPosition } from '@/utils/helpers';
import { EventMini } from './EventMini';
import { useQuery } from '@tanstack/react-query';
import { getAllEvents } from '@/utils/api/api';
import { selectSearch } from '@/utils/context/searchSlice';
import { useAppSelector } from '@/utils/context/store';

const customMarkerIcon = new Icon({
  iconUrl: EventIcon,
  iconSize: [48, 48], // Rozmiar ikony
});

export const EventListMap = () => {
  const search = selectSearch(useAppSelector((state) => state));
  const {
    data: events,
    isError,
    isPending,
  } = useQuery({
    queryKey: ['events', { search }],
    queryFn: () => getAllEvents(search, EventStatus.NOT_COMPLETED),
    // initialData: {},
  });

  if (!events) return null;

  if (isPending) {
    return <div>Ładowanie...</div>;
  }

  if (isError || events.length === 0) return <div>Nie znaleziono eventów.</div>;

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

  return (
    <div className="h-[500px] w-full">
      <MapContainer
        center={findCenter(events)}
        zoom={6}
        scrollWheelZoom={false}
        className="z-10 h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Renderowanie markerów dla wydarzeń */}
        {events.map((event) => {
          const position = getEventPosition(event);
          // console.log(position);
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
    </div>
  );
};
