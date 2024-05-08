import { useState, useEffect } from 'react';
import { getEvents, getOrganizerEvents } from '@/utils/api/api';
import { Participant } from './Participant.tsx'
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '../ui/Spinner';
import { eventType } from '@/utils/types/types.ts'
import Select from 'react-select';
import { useAppDispatch, useAppSelector } from '@/utils/context/store';
import {
    PagingSlice,
    selectCurrentPage,
} from '@/utils/context/paging/pagingSlice';
import {SearchSlice, selectSearch} from '@/utils/context/searchSlice';
import {format} from "date-fns";
import axios from "axios";
import { getAllEvents} from '@/utils/api/api.ts'

export const ParticipantList = () => {

    const [eventData, setEventData] = useState([])

    const fetchData = async () => {
        try {
            const events = await getOrganizerEvents();
            setEventData(events);
            console.log(events);
            // Do something with the events data
        } catch (error) {
            console.error('Failed to fetch events:', error);
            // Handle the error
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // const dispatch = useAppDispatch();
    // const page = selectCurrentPage(useAppSelector((state) => state)) - 1;
    // const search = selectSearch(useAppSelector((state) => state));
    // const { data, isError, isPending, isSuccess } = useQuery({
    //     queryKey: ['events', { page, search }],
    //     queryFn: () => getEvents(page, search),
    //     // initialData: {},
    // });

    const [selectedOption, setSelectedOption] = useState(null);

    // if (isPending)
    //     return (
    //         <div className="flex justify-center">
    //             <Spinner className="h-24 w-24" />
    //         </div>
    //     );
    //
    // if (isError || data.content.length === 0)
    //     return <div>Nie znaleziono żadnych wydarzeń.</div>;
    //
    // if (isSuccess) {
    //     dispatch({
    //         type: PagingSlice.actions.setCurrentPage.type,
    //         payload: data.number + 1,
    //     });
    //     dispatch({
    //         type: PagingSlice.actions.setTotalPages.type,
    //         payload: data.totalPages,
    //     });
    //     dispatch({
    //         type: PagingSlice.actions.setIsFirstPage.type,
    //         payload: data.first,
    //     });
    //     dispatch({
    //         type: PagingSlice.actions.setIsLastPage.type,
    //         payload: data.last,
    //     });
    // }

    const combineParticipants = () => {
        let combinedParticipants = [];

        // Iterate through each event
        if (eventData && eventData.length > 0) {
            eventData.forEach(event => {
                // Iterate through each participant of the current event
                event.participants.forEach(participant => {
                    const participantWithEventInfo = {
                        ...participant,
                        eventId: event.id,
                        eventName: event.name,
                        eventStartDate: event.startDate,
                        eventEndDate: event.endDate,

                    };
                    combinedParticipants.push(participantWithEventInfo);
                });
            });
        }
        return combinedParticipants;
    };

    const combinedParticipants = combineParticipants();

    const filterParticipants = (selectedOption) => {
        return selectedOption === null ?
            combinedParticipants :
            combinedParticipants.filter(participant => participant.eventId === selectedOption.value);
    };

    const filteredParticipants = filterParticipants(selectedOption);

    return (
        <>
            <div>
                <Select
                    placeholder="Filtruj po wydarzeniu..."
                    onChange={setSelectedOption}
                    options={eventData.map(event => ({
                        value: event.id,
                        label: event.name
                    }))}
                    className="my-2"
                />
                {selectedOption != null ?
                    filteredParticipants.map(participant => (
                        <Participant key={`${participant.id}_${participant.eventId}`} participant={participant}/>
                    )) :
                    combinedParticipants.map(participant => (
                        <Participant key={`${participant.id}_${participant.eventId}`} participant={participant}/>
                    ))
                }
                {/*{*/}
                {/*    combinedParticipants.map(participant => (*/}
                {/*        <Participant key={`${participant.id}_${participant.eventId}`} participant={participant}/>*/}
                {/*    ))*/}
                {/*}*/}
            </div>
        </>
    );
};
