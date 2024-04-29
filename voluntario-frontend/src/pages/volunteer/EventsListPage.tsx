import { EventFilters } from '@/components/events/EventFilters';
import { EventList } from '@/components/events/EventList';
import { EventSearchBox } from '@/components/events/EventSearchBox';
import { Button } from '@/components/ui/button';
// import { Dialog } from '@/components/ui/dialog';
import { Filter } from 'lucide-react';
import { useMediaQuery } from 'react-responsive';

export const EventsListPage = () => {
  const isSmallScreen = useMediaQuery({ query: '(max-width: 768px)' });

  return (
    <div className="mb-8 h-full w-full">
      {/* <Dialog>
        <div className="flex justify-between">
          <h1 className="text-2xl font-semibold">Wydarzenia</h1>
          <Button variant={'outline'}>Dodaj wydarzenie</Button>
        </div>
      </Dialog> */}
      <EventSearchBox />
      <div className="container mt-6 flex flex-col gap-3 md:flex-row">
        {isSmallScreen ? (
          <Button variant={'outline'} asChild>
            <div className="flex justify-center gap-1">
              Filtry
              <Filter />
            </div>
          </Button>
        ) : (
          <div className="flex basis-1/4 flex-col items-center gap-6">
            <EventFilters />
            <EventFilters />
            <EventFilters />
          </div>
        )}
        <div className="basis-3/4">
          <EventList />
        </div>
      </div>
      {/* {isSmallScreen ? (
        <div className="mx-2 my-3 flex justify-center">
          <Button variant={'outline'} className="w-full max-w-sm">
            Filtry
            <Filter />
          </Button>
        </div>
      ) : (
        <div className="container mt-6 flex gap-3">
          <div className="flex basis-1/4 flex-col items-center gap-6">
            <EventFilters />
            <EventFilters />
            <EventFilters />
          </div>
          <div className="basis-3/4">
            <EventList />
          </div>
        </div>
      )} */}
    </div>
  );
};
