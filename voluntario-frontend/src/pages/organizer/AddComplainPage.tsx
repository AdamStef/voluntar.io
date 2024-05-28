import AddComplainForm from '@/components/forms/AddComplainForm.tsx';
import { ComplaintPostType } from "@/utils/types/types.ts";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {addParticipantToEvent, getEventParticipants, getOrganizerEvents, postComplaint} from "@/utils/api/api.ts";
import {Spinner} from "@/components/ui/Spinner.tsx";
import {EventOrganizer} from "@/components/events/organizer/EventOrganizer.tsx";
import Select from "react-select";
import {format} from "date-fns";
import {ParticipantList} from "@/components/organizer/ParticipantList.tsx";
import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";

type Option = {
    value: number;
    label: string;
};

export const AddComplainPage = () => {

    const queryClient = useQueryClient();
    const [description, setDescription] = useState('');
    const [selectedEvent, setSelectedEvent] = useState<Option | null>(null);
    const [selectedParticipant, setSelectedParticipant] = useState<Option | null>(null);

    const {
        data: participants,
        isError: isErrorEvents,
        isLoading: isLoadingEvents,
    } = useQuery({
        queryKey: ['organizer', 'events', selectedEvent?.value],
        queryFn: () => getEventParticipants(selectedEvent.value),
        enabled: !!selectedEvent, // Only run this query if an organizer is selected
    });

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
            console.log('udalo sie xdd');
        },
    });

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = (e) => {
        if (selectedParticipant) {
            const complaint = {
                reportedID: selectedParticipant.value,
                text: description
            }
            console.log(complaint);
            postComplaintMutate(complaint);
        }
        else {
            console.log('wywal blad');
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
      <div className="flex flex-col">
          <p className="my-2 mx-auto text-center text-xl font-bold">Dodawanie skargi</p>
          <div className="flex flex-row justify-evenly">
              <div className="flex flex-col">
                  <p className="my-2 mx-auto text-center text-xl">Wybierz wydarzenie</p>
                  <Select
                      placeholder="Wybierz wydarzenie..."
                      onChange={handleEventChange}
                      options={events.map((event) => ({
                          value: event.id,
                          label: `${event.name} - ${format(event.startDate, 'dd.MM.yyyy')}`,
                      }))}
                      className="my-2 mx-auto w-80"
                  />
              </div>
              <div className="flex flex-col">
                  <p className="my-2 mx-auto text-center text-xl">Wybierz wolontariusza</p>
                  <Select
                      placeholder="Wybierz wolontariusza..."
                      onChange={handleParticipantChange}
                      options={
                          participants ?
                              participants.map((participant) => ({
                                  value: participant.userId,
                                  label: participant.name
                              }))
                              : []
                      }
                      className="my-2 mx-auto w-80"
                  />
              </div>
          </div>
  <div className="mx-auto">
      <form onSubmit={(e) => e.preventDefault()}>
          <label>
              Opis skargi:
              <br/>
              <textarea value={description} onChange={handleDescriptionChange}
                     className="border-2 my-3 w-80 h-32 p-1"/>
              <br/>
          </label>
          <Button onClick={handleSubmit}>Submit</Button>
      </form>
  </div>
      </div>
  );
};
