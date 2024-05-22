import { Calendar } from 'lucide-react';
import ManAvatar from '@/assets/man_avatar.png';
import { Button } from '@/components/ui/button.tsx';
import { format } from 'date-fns';
import { removeParticipantFromEvent } from '@/utils/api/api.ts';
import { useState } from 'react';
import { ParticipantType } from '@/utils/types/types.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';

type ParticipantProps = {
  participant: ParticipantType;
};

export const Participant: React.FC<ParticipantProps> = ({ participant }) => {
  const [rejected, setRejected] = useState(false);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: removeParticipantFromEvent,
    onSuccess: () => {
      console.log('Participant removed from event');
      setRejected(true);
      queryClient.refetchQueries({
        queryKey: ['organizer', 'events'],
      });
    },
  });

  function rejectVolunteer() {
    mutate({
      eventId: String(participant.eventId),
      participantId: participant.id,
    });
    // removeParticipantFromEvent({
    //   eventId: String(participant.eventId),
    //   participantId: participant.id,
    // });
    // setRejected(true);
  }

  return (
    <>
      {!rejected && (
        <div className="relative my-2 h-80 w-80 bg-green-400">
          <div className="flex">
            <Calendar className="ml-2 mt-2 h-11 w-11" />
            <div>
              <p className="ml-2 mt-1.5 line-clamp-1 text-lg font-bold">
                {participant.eventName}
              </p>
              <p className="ml-2 text-sm">
                {format(participant.eventStartDate, 'dd.MM.yyyy')} -{' '}
                {format(participant.eventEndDate, 'dd.MM.yyyy')}
              </p>
            </div>
          </div>
          <div className="relative mx-4 mt-3 h-48 w-72 bg-gray-400">
            <div className="h-28">
              <img
                className="float-left ml-2 mt-2 rounded-sm border bg-white"
                src={ManAvatar}
                width={95}
                height={95}
                alt="Avatar"
              />
              <div className="flex h-28 flex-col justify-evenly pl-2">
                <p className="text-lg font-bold">
                  {participant.firstName} {participant.lastName}
                </p>
                <p className="">Telefon: {participant.phoneNumber}</p>
                <p className="">E-mail: {participant.email}</p>
              </div>
            </div>
            {/*TODO: co jak nie informacje o nim*/}
            <p className="ml-2 line-clamp-3">Informacje: -</p>
          </div>
          <div className="absolute bottom-2.5 flex w-full justify-evenly">
            <Button variant={'destructive'} onClick={rejectVolunteer}>
              Usuń z wydarzenia
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
