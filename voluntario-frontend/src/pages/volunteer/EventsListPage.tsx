import { useState } from 'react';
import { EventList } from '@/components/events/EventList';
import { EventSearchBox } from '@/components/events/EventSearchBox';
import { EventListMap } from '@/components/events/EventListMap';
import { Switch } from '@/components/ui/switch';

export const EventsListPage = () => {
  const [showMap, setShowMap] = useState(false);
  return (
    <div className="mb-8 h-full w-full">
      <EventSearchBox />
      <div className="container mt-6 flex w-2/3 flex-col gap-3">
        <div className="flex gap-2">
          Pokaż mapę
          <Switch checked={showMap} onCheckedChange={setShowMap} />
        </div>
        {showMap ? <EventListMap /> : <EventList />}
      </div>
    </div>
  );
};

{
  /* <div className="container mt-6 flex flex-col gap-3 md:flex-row">
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
          {showMap ? <EventList /> : <EventList />}
        </div>
      </div>
    </div> */
}
