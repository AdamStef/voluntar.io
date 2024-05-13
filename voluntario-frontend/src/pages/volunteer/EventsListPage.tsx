import { useState } from 'react';
import { EventFilters } from '@/components/events/EventFilters';
import { EventList } from '@/components/events/EventList';
// import { PaginationComponent } from '@/components/events/PaginationComponent';
import { EventSearchBox } from '@/components/events/EventSearchBox';
import { Button } from '@/components/ui/button';
import { useScreenSize } from '@/hooks/useScreenSize';
import { Filter } from 'lucide-react';

export const EventsListPage = () => {
  const { isSmall } = useScreenSize();
  const [showMap, setShowMap] = useState(false);

  const toggleView = () => {
    setShowMap((prev) => !prev);
  };

  return (
    <div className="mb-8 h-full w-full">
      <EventSearchBox />
      <div className="container mt-6 flex flex-col gap-3 md:flex-row">
        {isSmall ? (
          <Button variant={'outline'} asChild onClick={toggleView}>
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
          {showMap ? (
            <EventList />
          ) : (
            <>
              <EventList />
              {/*<PaginationComponent />*/}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
