import { useState } from 'react';
import Select from 'react-select';
import { format } from 'date-fns';
import { ParticipantList } from './ParticipantList.tsx';
import { EventType } from '@/utils/types/types.ts';

type Option = {
  value: number;
  label: string;
};

export const Participants = ({ events }: { events: EventType[] }) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const handleChange = (e: Option | null) => {
    setSelectedOption(e);
  };

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
        <ParticipantList
          event={events.find((event) => event.id === selectedOption.value)!}
        />
      ) : (
        <p>Nie wybrano wydarzenia</p>
      )}
    </div>
  );
};
