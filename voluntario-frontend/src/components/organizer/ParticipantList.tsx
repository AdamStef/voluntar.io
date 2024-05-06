import { useState } from 'react';
import { getEvents } from '@/utils/api/api';
import { Participant } from './Participant.tsx'
import { Event } from '@/components/events/Event';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '../ui/Spinner';
import { useAppDispatch, useAppSelector } from '@/utils/context/store';
import {
    PagingSlice,
    selectCurrentPage,
} from '@/utils/context/paging/pagingSlice';
import { selectSearch } from '@/utils/context/searchSlice';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { EventMini } from '@/components/events/EventMini.tsx';
import { Icon, LatLngExpression } from 'leaflet';
import { PaginationComponent } from '@/components/events/PaginationComponent.tsx';
import { getEventPosition } from '@/utils/helpers';
import EventIcon from '@/assets/icons/event-marker-icon.svg';
import { EventType } from '@/utils/types/types';

const customMarkerIcon = new Icon({
    iconUrl: EventIcon,
    iconSize: [48, 48], // Rozmiar ikony
});

export const ParticipantList = () => {
    const dispatch = useAppDispatch();
    const page = selectCurrentPage(useAppSelector((state) => state)) - 1;
    const search = selectSearch(useAppSelector((state) => state));
    const { data, isError, isPending, isSuccess } = useQuery({
        queryKey: ['events', { page, search }],
        queryFn: () => getEvents(page, search),
        // initialData: {},
    });

    // const [showMap, setShowMap] = useState(false);
    //
    // const toggleView = () => {
    //     setShowMap((prev) => !prev);
    // };

    if (isPending)
        return (
            <div className="flex justify-center">
                <Spinner className="h-24 w-24" />
            </div>
        );

    if (isError || data.content.length === 0)
        return <div>Nie znaleziono żadnych wydarzeń.</div>;

    if (isSuccess) {
        dispatch({
            type: PagingSlice.actions.setCurrentPage.type,
            payload: data.number + 1,
        });
        dispatch({
            type: PagingSlice.actions.setTotalPages.type,
            payload: data.totalPages,
        });
        dispatch({
            type: PagingSlice.actions.setIsFirstPage.type,
            payload: data.first,
        });
        dispatch({
            type: PagingSlice.actions.setIsLastPage.type,
            payload: data.last,
        });
    }

    const combineParticipants = () => {
        let combinedParticipants = [];

        // Iterate through each event
        data.content.forEach(event => {
            // Iterate through each participant of the current event
            event.participants.forEach(participant => {
                // Create a new object representing the participant along with event details
                const participantWithEventInfo = {
                    ...participant,
                    eventId: event.id, // Assuming each event has an 'id' property
                    eventStartDate: event.startDate, // Assuming each event has an 'id' property
                    eventEndDate: event.endDate, // Assuming each event has an 'id' property
                    // eventName: event.name // Assuming each event has a 'name' property
                };
                // Push the participant object with event information to the combinedParticipants array
                combinedParticipants.push(participantWithEventInfo);
            });
        });

        return combinedParticipants;
    };

    const combinedParticipants = combineParticipants();

    return (
        <>
            <div>
                {combinedParticipants.map(participant => (
                    <Participant participant={participant}/>
                ))}
            </div>
        </>
    );
};
