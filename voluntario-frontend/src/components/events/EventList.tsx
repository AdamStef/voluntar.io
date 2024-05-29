import { getEventsByStatus } from '@/utils/api/api';
import { Event } from './Event';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '../ui/Spinner';
import { useAppSelector } from '@/utils/context/store';
import { selectSearch } from '@/utils/context/searchSlice';
import { EventStatus } from '@/utils/types/types';
import PaginatedList from '../PaginatedList';

export const EventList = () => {
  const page = useAppSelector((state) => state.paging.currentPage);
  const search = selectSearch(useAppSelector((state) => state));
  const { data, isError, isPending } = useQuery({
    queryKey: ['events', { page }, { search }],
    queryFn: () => getEventsByStatus(page, search, EventStatus.NOT_COMPLETED),
  });

  if (isPending) {
    return (
      <div className="flex justify-center">
        <Spinner className="h-24 w-24" />
      </div>
    );
  }

  if (isError || data.content.length === 0)
    return <div>Nie znaleziono żadnych wydarzeń.</div>;

  return (
    <div className="flex flex-col gap-5">
      {data.content.map((event) => (
        <Event key={event.id} event={event} />
      ))}
      <PaginatedList page={data} />
    </div>
  );
};
