import {getEvents, getOrganizerEvents} from '@/utils/api/api.ts';
import { EventOrganizer } from './EventOrganizer.tsx';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '../../ui/Spinner.tsx';
import { useAppDispatch, useAppSelector } from '@/utils/context/store.ts';
import {
  PagingSlice,
  selectCurrentPage,
} from '@/utils/context/paging/pagingSlice.ts';
import { selectSearch } from '@/utils/context/searchSlice.ts';
import { PaginationComponent } from '@/components/events/PaginationComponent.tsx';
import {useEffect, useState} from "react";

export const EventListOrganizer = () => {
  // const dispatch = useAppDispatch();
  // const page = selectCurrentPage(useAppSelector((state) => state)) - 1;
  // const search = selectSearch(useAppSelector((state) => state));
  // const { data, isError, isPending, isSuccess } = useQuery({
  //   queryKey: ['events', { page, search }],
  //   queryFn: () => getEvents(page, search),
  //   // initialData: {},
  // });
  //
  // if (isPending)
  //   return (
  //       <div className="flex justify-center">
  //         <Spinner className="h-24 w-24" />
  //       </div>
  //   );
  //
  // if (isError || data.content.length === 0)
  //   return <div>Nie znaleziono żadnych wydarzeń.</div>;
  //
  // if (isSuccess) {
  //   dispatch({
  //     type: PagingSlice.actions.setCurrentPage.type,
  //     payload: data.number + 1,
  //   });
  //   dispatch({
  //     type: PagingSlice.actions.setTotalPages.type,
  //     payload: data.totalPages,
  //   });
  //   dispatch({
  //     type: PagingSlice.actions.setIsFirstPage.type,
  //     payload: data.first,
  //   });
  //   dispatch({
  //     type: PagingSlice.actions.setIsLastPage.type,
  //     payload: data.last,
  //   });
  // }

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

  return (
      <>
          <div className="flex flex-col gap-5">
            {eventData.map((event) => (
                <EventOrganizer key={event.id} event={event} />
            ))}
            <PaginationComponent />
          </div>
      </>
  );
};
