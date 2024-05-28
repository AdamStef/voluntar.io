import { getEventParticipants } from '@/utils/api/api';
import { useQuery } from '@tanstack/react-query';
import { Participant } from './Participant';
import { EventType } from '@/utils/types/types';

export const ParticipantList = ({ event }: { event: EventType }) => {
  const { data: participants } = useQuery({
    queryKey: ['organizer', 'participants', event.id],
    queryFn: async () => getEventParticipants(event.id),
  });

  if (participants?.length === 0) {
    return <div>Brak uczestników</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {participants?.map((participant) => (
        <Participant
          key={participant.userId}
          participant={participant}
          event={event}
        />
      ))}
    </div>
  );
};
