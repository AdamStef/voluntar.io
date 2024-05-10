import { useState } from 'react';
import { Participant } from './Participant.tsx'
import Select from 'react-select';
import { format } from "date-fns";
import { EventType, ParticipantType } from "@/utils/types/types.ts"

type ParticipantListProps = {
    eventData: EventType[];
};

type Option = {
    value: number;
    label: string;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({eventData}) => {

    const [selectedOption, setSelectedOption] = useState<Option | null>({value: 0, label: ''});

    const handleChange = (e: Option | null) => {
        setSelectedOption(e);
    }

    const combineParticipants = () => {
        let combinedParticipants: ParticipantType[] = [];

        if (eventData && eventData.length > 0) {
            eventData.forEach(event => {
                event.participants.forEach(participant => {
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
        return selectedOption === null ?
            combinedParticipants :
            combinedParticipants.filter(participant => participant.eventId === selectedOption.value);
    };

    const filteredParticipants = filterParticipants(selectedOption);

    return (
        <>
            <div>
                <Select
                    placeholder="Filtruj po wydarzeniu..."
                    onChange={handleChange}
                    options={eventData.map(event => ({
                        value: event.id,
                        label: `${event.name} - ${format(event.startDate, "dd.MM.yyyy")}`
                    }))}
                    className="my-2"
                />
                {selectedOption != null ? (
                    filteredParticipants.length > 0 ? (
                        filteredParticipants.map(participant => (
                            <Participant key={`${participant.id}_${participant.eventId}`} participant={participant}/>
                        ))
                    ) : (
                        <div>Nie znaleziono wolontariuszy</div>
                    )
                ) : (
                    combinedParticipants.length > 0 ? (
                        combinedParticipants.map(participant => (
                            <Participant key={`${participant.id}_${participant.eventId}`} participant={participant}/>
                        ))
                    ) : (
                        <div>Nie znaleziono wolontariuszy</div>
                    )
                )}
            </div>
        </>
    );
};
