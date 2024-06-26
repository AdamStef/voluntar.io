import { useMutation, useQuery } from '@tanstack/react-query';
import {
  // getEventParticipants,s
  getOrganizerEvents,
  postComplaint,
} from '@/utils/api/api.ts';
import { Spinner } from '@/components/ui/Spinner.tsx';
import Select from 'react-select';
import { format } from 'date-fns';
import { ChangeEvent, useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { ComplaintPostType, ParticipantType } from '@/utils/types/types.ts';
import { useNavigate } from 'react-router-dom';
import { Panel } from '@/components/ui/Panel';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { H3 } from '@/components/ui/typography/heading';

type Option = {
  value: number;
  label: string;
};

export const AddComplainPage = () => {
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Option | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<Option | null>(
    null,
  );

  // const { data: participants } = useQuery({
  //   queryKey: ['organizer', 'events', selectedEvent?.value],
  //   queryFn: () => {
  //     if (!selectedEvent?.value) {
  //       return Promise.reject(new Error('Event not selected'));
  //     }
  //     return getEventParticipants(selectedEvent.value);
  //   },
  //   enabled: !!selectedEvent?.value, // Only run this query if an organizer is selected
  // });

  const participants = [] as ParticipantType[];

  const {
    data: events,
    isError,
    isPending,
  } = useQuery({
    queryKey: ['organizer', 'events'],
    queryFn: getOrganizerEvents,
  });

  const { mutate: postComplaintMutate } = useMutation({
    mutationFn: postComplaint,
    onSuccess: () => {
      // TODO: co tu?
    },
  });

  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = () => {
    if (selectedParticipant) {
      const complaintToSend: ComplaintPostType = {
        reportedID: selectedParticipant.value,
        text: description,
      };
      postComplaintMutate(complaintToSend);
      if (selectedEvent) {
        navigate(`/events/${selectedEvent.value}`);
      } else {
        navigate('/organizer');
      }
    } else {
      alert('Nie wybrałeś wolontariusza.');
    }
  };

  const handleEventChange = (e: Option | null) => {
    setSelectedEvent(e);
  };

  const handleParticipantChange = (e: Option | null) => {
    setSelectedParticipant(e);
  };

  if (isPending) return <Spinner className="h-16 w-16" />;
  if (isError) return <div>Wystąpił błąd podczas pobierania wydarzeń</div>;
  if (!events || events.length == 0) return <p>Brak wydarzeń</p>;

  return (
    <div className="container mt-5 max-w-4xl">
      <H3 className="mb-5">Dodawanie skargi</H3>
      <Panel className="flex flex-col gap-2">
        <div className="flex flex-col justify-evenly md:flex-row">
          <div className="flex flex-col">
            <p className="mx-auto my-2 text-center text-xl">
              Wybierz wydarzenie
            </p>
            <Select
              placeholder="Wybierz wydarzenie..."
              onChange={handleEventChange}
              options={events.map((event) => ({
                value: event.id,
                label: `${event.name} - ${format(event.startDate, 'dd.MM.yyyy')}`,
              }))}
              noOptionsMessage={() => 'Brak wydarzeń'}
              className="mx-auto my-2 w-80"
            />
          </div>
          <div className="flex flex-col">
            <p className="mx-auto my-2 text-center text-xl">
              Wybierz wolontariusza
            </p>
            <Select
              placeholder="Wybierz wolontariusza..."
              onChange={handleParticipantChange}
              options={
                participants
                  ? participants.map((participant) => ({
                      value: participant.userId,
                      label: participant.name,
                    }))
                  : []
              }
              noOptionsMessage={() => 'Brak wolontariuszy'}
              className="mx-auto my-2 w-80"
            />
          </div>
        </div>
        <div className="mx-auto flex flex-col items-center">
          <Label>Opis skargi:</Label>
          <Textarea
            value={description}
            onChange={handleDescriptionChange}
            className="my-3 h-32 w-80 border-2 p-1"
          />

          <Button className="mx-auto" onClick={handleSubmit}>
            Dodaj skargę
          </Button>
        </div>
      </Panel>
    </div>
  );
};
