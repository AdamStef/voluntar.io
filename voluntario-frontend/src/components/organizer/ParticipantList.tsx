import { useState } from 'react';
import { Participant } from './Participant.tsx';
import Select from 'react-select';
import { format } from 'date-fns';
import { ParticipantType } from '@/utils/types/types.ts';
import { useQuery } from '@tanstack/react-query';
import { getOrganizerEvents } from '@/utils/api/api.ts';

// type ParticipantListProps = {
//   eventData: EventType[];
// };

type Option = {
  value: number;
  label: string;
};

export const ParticipantList = () => {
  const [selectedOption, setSelectedOption] = useState<Option | null>({
    value: 0,
    label: '',
  });

  const { data: events, isError } = useQuery({
    queryKey: ['organizer', 'events'],
    queryFn: getOrganizerEvents,
  });

  const handleChange = (e: Option | null) => {
    setSelectedOption(e);
  };

  const combineParticipants = () => {
    const combinedParticipants: ParticipantType[] = [];

    if (events && events.length > 0) {
      events.forEach((event) => {
        event.participants.forEach((participant) => {
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

  const filterParticipants = (selectedOption: Option | null) => {
    return selectedOption === null
      ? combinedParticipants
      : combinedParticipants.filter(
          (participant) => participant.eventId === selectedOption.value,
        );
  };

  const filteredParticipants = filterParticipants(selectedOption);

  if (isError) {
    return <div>Wystąpił błąd podczas pobierania wydarzeń</div>;
  }

  if (!events) return null;

  return (
    <>
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
          filteredParticipants.length > 0 ? (
            filteredParticipants.map((participant) => (
              <Participant
                key={`${participant.id}_${participant.eventId}`}
                participant={participant}
              />
            ))
          ) : (
            <div>Nie znaleziono wolontariuszy</div>
          )
        ) : combinedParticipants.length > 0 ? (
          combinedParticipants.map((participant) => (
            <Participant
              key={`${participant.id}_${participant.eventId}`}
              participant={participant}
            />
          ))
        ) : (
          <div>Nie znaleziono wolontariuszy</div>
        )}
      </div>
    </>
  );
};
