import ManAvatar from '@/assets/man_avatar.png';
import { Button } from '@/components/ui/button.tsx';
import { removeParticipantFromEvent } from '@/utils/api/api.ts';
import { ParticipantType } from '@/utils/types/types.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Panel } from '../ui/Panel';

type ParticipantProps = {
  participant: ParticipantType;
};

export const Participant: React.FC<ParticipantProps> = ({ participant }) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: removeParticipantFromEvent,
    onSuccess: () => {
      console.log('Participant removed from event');
      queryClient.refetchQueries({
        queryKey: ['organizer', 'participants', participant.eventId],
      });
    },
  });

  function rejectVolunteer() {
    mutate({
      eventId: String(participant.eventId),
      participantId: participant.userId,
    });
  }

  return (
    <Panel className="flex h-fit min-h-48 flex-col justify-between gap-2 bg-green-400">
      <div className="flex h-full gap-2 bg-panel p-2 md:flex-col lg:flex-row">
        <img
          className="aspect-square h-16 w-16 rounded-sm border bg-white"
          src={ManAvatar}
          alt="Avatar"
        />
        <div className="flex flex-col">
          <p className="text-lg font-bold">{participant.name}</p>
          <p className="">Telefon: {participant.phoneNumber}</p>
          <p className="">E-mail: {participant.email}</p>
        </div>
      </div>
      <Button
        className="mx-auto w-fit"
        variant={'destructive'}
        onClick={rejectVolunteer}
      >
        Usuń z wydarzenia
      </Button>
    </Panel>
  );
};
