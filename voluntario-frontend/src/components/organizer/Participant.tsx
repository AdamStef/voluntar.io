import ManAvatar from '@/assets/man_avatar.png';
import WomanAvatar from '@/assets/woman_avatar.png';
import { Button } from '@/components/ui/button.tsx';
import { removeParticipantFromEvent } from '@/utils/api/api.ts';
import {
  EventStatus,
  EventType,
  ParticipantType,
} from '@/utils/types/types.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Panel } from '../ui/Panel';
import { getEnumValue } from '@/utils/helpers';
import { Separator } from '../ui/separator';
import { UserEvaluation } from './UserEvaluation';

type ParticipantProps = {
  participant: ParticipantType;
  event: EventType;
};

export const Participant: React.FC<ParticipantProps> = ({
  participant,
  event,
}) => {
  const queryClient = useQueryClient();
  const avatarSrc = participant.gender == 'MALE' ? ManAvatar : WomanAvatar;

  const { mutate } = useMutation({
    mutationFn: removeParticipantFromEvent,
    onSuccess: () => {
      console.log('Participant removed from event');
      queryClient.refetchQueries({
        queryKey: ['organizer', 'participants', event.id],
      });
      queryClient.refetchQueries({
        queryKey: ['organizer', 'events'],
      });
    },
  });

  function rejectVolunteer() {
    mutate({
      eventId: String(event.id),
      participantId: participant.userId,
    });
  }

  return (
    <Panel className="flex h-full min-h-48 flex-col justify-between gap-2 bg-green-400">
      <div className="flex h-full flex-col gap-2 bg-panel p-2">
        <div className="flex gap-2 md:flex-col lg:flex-row">
          <img
            className="aspect-square h-16 w-16 rounded-sm border bg-white"
            src={avatarSrc}
            alt="Avatar"
          />
          <div className="flex flex-col">
            <p className="text-lg font-bold">{participant.name}</p>
            <p className="">Telefon: {participant.phoneNumber}</p>
            <p className="">E-mail: {participant.email}</p>
          </div>
        </div>
        {getEnumValue(EventStatus, event.status) === EventStatus.COMPLETED && (
          <>
            <Separator className="bg-secondary" />
            <UserEvaluation participant={participant} />
          </>
        )}
      </div>
      {getEnumValue(EventStatus, event.status) ===
        EventStatus.NOT_COMPLETED && (
        <Button
          className="mx-auto w-fit"
          variant={'destructive'}
          onClick={rejectVolunteer}
        >
          Usuń z wydarzenia
        </Button>
      )}
    </Panel>
  );
};
