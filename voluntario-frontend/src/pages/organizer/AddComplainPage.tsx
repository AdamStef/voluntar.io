import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getEventParticipants,
  getOrganizerEvents,
  postComplaint,
} from '@/utils/api/api.ts';
import { Spinner } from '@/components/ui/Spinner.tsx';
import Select from 'react-select';
import { format } from 'date-fns';
import { ChangeEvent, useState } from 'react';
import { Button } from '@/components/ui/button.tsx';
import { ComplaintPostType } from '@/utils/types/types.ts';
import { useNavigate } from 'react-router-dom';

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

  const { data: participants } = useQuery({
    queryKey: ['organizer', 'events', selectedEvent?.value],
    queryFn: () => {
      if (!selectedEvent?.value) {
        return Promise.reject(new Error('Event not selected'));
      }
      return getEventParticipants(selectedEvent.value);
    },
    enabled: !!selectedEvent?.value, // Only run this query if an organizer is selected
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
    <div className="flex flex-col">
      <p className="mx-auto my-2 text-center text-xl font-bold">
        Dodawanie skargi
      </p>
      <div className="flex flex-col justify-evenly md:flex-row">
        <div className="flex flex-col">
          <p className="mx-auto my-2 text-center text-xl">Wybierz wydarzenie</p>
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
      <div className="mx-auto">
        <form onSubmit={(e) => e.preventDefault()}>
          <label>
            Opis skargi:
            <br />
            <textarea
              value={description}
              onChange={handleDescriptionChange}
              className="my-3 h-32 w-80 border-2 p-1"
            />
            <br />
          </label>
          <Button onClick={handleSubmit}>Dodaj skargę</Button>
        </form>
      </div>
    </div>
import {useMutation, useQuery} from "@tanstack/react-query";
import {getEventParticipants, getOrganizerEvents, postComplaint} from "@/utils/api/api.ts";
import {Spinner} from "@/components/ui/Spinner.tsx";
import Select from "react-select";
import {format} from "date-fns";
import {ChangeEvent, useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {ComplaintPostType} from "@/utils/types/types.ts";
import {useNavigate} from "react-router-dom";

type Option = {
    value: number;
    label: string;
};

export const AddComplainPage = () => {

    const navigate = useNavigate();
    const [description, setDescription] = useState('');
    const [selectedEvent, setSelectedEvent] = useState<Option | null>(null);
    const [selectedParticipant, setSelectedParticipant] = useState<Option | null>(null);

    const {
        data: participants,
    } = useQuery({
        queryKey: ['organizer', 'events', selectedEvent?.value],
        queryFn: () => {
            if (!selectedEvent?.value) {
                return Promise.reject(new Error('Event not selected'));
            }
            return getEventParticipants(selectedEvent.value);
        },
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
                text: description
            }
            postComplaintMutate(complaintToSend);
            if (selectedEvent) {
                navigate(`/events/${selectedEvent.value}`);
            }
            else {
                navigate('/organizer');
            }
        }
        else {
            alert("Nie wybrałeś wolontariusza.");
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
          <div className="flex flex-col md:flex-row justify-evenly">
              <div className="flex flex-col">
                  <p className="my-2 mx-auto text-center text-xl">Wybierz wydarzenie</p>
                  <Select
                      placeholder="Wybierz wydarzenie..."
                      onChange={handleEventChange}
                      options={events.map((event) => ({
                          value: event.id,
                          label: `${event.name} - ${format(event.startDate, 'dd.MM.yyyy')}`,
                      }))}
                      noOptionsMessage={() => "Brak wydarzeń"}
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
                      noOptionsMessage={() => "Brak wolontariuszy"}
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
          <Button onClick={handleSubmit}>
              Dodaj skargę
          </Button>
      </form>
  </div>
      </div>
  );
};
