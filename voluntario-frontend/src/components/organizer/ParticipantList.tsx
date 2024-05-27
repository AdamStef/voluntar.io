import { getEventParticipants } from '@/utils/api/api';
import { useQuery } from '@tanstack/react-query';
import { Participant } from './Participant';

export const ParticipantList = ({ eventId }: { eventId: number }) => {
  const { data: participants } = useQuery({
    queryKey: ['organizer', 'participants', eventId],
    queryFn: async () => getEventParticipants(eventId),
  });

  if (participants?.length === 0) {
    return <div>Brak uczestników</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {participants?.map((participant) => (
        <Participant key={participant.userId} participant={participant} />
      ))}
    </div>
  );
};
