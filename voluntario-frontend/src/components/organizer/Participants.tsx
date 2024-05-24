import { useState } from 'react';
import Select from 'react-select';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { getOrganizerEvents } from '@/utils/api/api.ts';
import { ParticipantList } from './ParticipantList.tsx';

type Option = {
  value: number;
  label: string;
};

export const Participants = () => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const { data: events, isError } = useQuery({
    queryKey: ['organizer', 'events'],
    queryFn: getOrganizerEvents,
  });

  const handleChange = (e: Option | null) => {
    setSelectedOption(e);
  };

  if (isError) {
    return <div>Wystąpił błąd podczas pobierania wydarzeń</div>;
  }

  if (!events) return null;

  return (
    <div>
      <Select
        placeholder="Filtruj po wydarzeniu..."
        onChange={handleChange}
        options={events.map((event) => ({
          value: event.id,
          label: `${event.name} - ${format(event.startDate, 'dd.MM.yyyy')}`,
        }))}
        className="my-2"
      />
      {selectedOption != null ? (
        <ParticipantList eventId={selectedOption.value} />
      ) : (
        <p>Nie wybrano wydarzenia</p>
      )}
    </div>
  );
};
