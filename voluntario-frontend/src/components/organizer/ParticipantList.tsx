import { useState } from 'react';
import { getEvents } from '@/utils/api/api';
import { Participant } from './Participant.tsx'
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '../ui/Spinner';
import { useAppDispatch, useAppSelector } from '@/utils/context/store';
import {
    PagingSlice,
    selectCurrentPage,
} from '@/utils/context/paging/pagingSlice';
import { selectSearch } from '@/utils/context/searchSlice';

export const ParticipantList = () => {
    const dispatch = useAppDispatch();
    const page = selectCurrentPage(useAppSelector((state) => state)) - 1;
    const search = selectSearch(useAppSelector((state) => state));
    const { data, isError, isPending, isSuccess } = useQuery({
        queryKey: ['events', { page, search }],
        queryFn: () => getEvents(page, search),
        // initialData: {},
    });

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
