import { EventDetailsHeader } from './EventDetailsHeader';
import { EventDetailsInformation } from './EventDetailsInformation';
import { useEffect } from 'react';
import { EventDetailsDiscussion } from './EventDetailsDiscussion';
import { Panel } from '../../ui/Panel';
import { useGetEvent } from '@/hooks/useGetEvents';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Spinner } from '../../ui/Spinner';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import { getEventPosition } from '@/utils/helpers';
import { H3 } from '../../ui/typography/heading';

type EventDetailsParams = {
  eventId: string;
};

export const EventDetails = () => {
  const { eventId } = useParams() as EventDetailsParams;
  const { data: event, isError, error, isPending } = useGetEvent(eventId);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const setTab = (tab: string) => {
    setSearchParams({ tab: tab });
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tab !== 'information' && tab !== 'discussion') {
      navigate('/events/' + eventId, { replace: true });
    }
  }, [eventId, searchParams, navigate]);

  if (isPending)
    return (
      <div className="flex items-center justify-center">
        <Spinner className="h-24 w-24" />
      </div>
    );

  if (isError) return <div>{error.message}</div>;

  if (!event) return null;

  const eventPosition: LatLngTuple | null = getEventPosition(event);

  return (
    <div className="flex flex-col gap-4">
      <EventDetailsHeader
        event={event}
        activeTab={searchParams.get('tab') ?? 'information'}
        setActiveTab={setTab}
      />
      <div className="flex w-full flex-col-reverse gap-2 md:flex-row md:items-start">
        <div className="md:w-2/3">
          {(searchParams.get('tab') === 'information' ||
            !searchParams.get('tab')) && (
            <EventDetailsInformation event={event} />
          )}
          {searchParams.get('tab') === 'discussion' && (
            <EventDetailsDiscussion />
          )}
        </div>
        <Panel className="z-10 md:w-1/3">
          <H3 className="border-b border-secondary pb-2">
            Dokładna lokalizacja
          </H3>
          <MapContainer
            center={eventPosition ?? [0, 0]}
            zoom={15}
            scrollWheelZoom={false}
            className="mt-2 h-[250px] border shadow-lg"
          >
            {eventPosition && (
              <>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={eventPosition} />
              </>
            )}
          </MapContainer>
        </Panel>
      </div>
    </div>
  );
};
