import { useState } from 'react';
import { Participant } from './Participant.tsx'
import Select from 'react-select';

export const ParticipantList = (props) => {

    const [selectedOption, setSelectedOption] = useState(null);

    const combineParticipants = () => {
        let combinedParticipants = [];

        if (props.eventData && props.eventData.length > 0) {
            props.eventData.forEach(event => {
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

    const filterParticipants = (selectedOption) => {
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
                    onChange={setSelectedOption}
                    options={props.eventData.map(event => ({
                        value: event.id,
                        label: event.name
                    }))}
                    className="my-2"
                />
                {selectedOption != null ?
                    filteredParticipants.map(participant => (
                        <Participant key={`${participant.id}_${participant.eventId}`} participant={participant}/>
                    )) :
                    combinedParticipants.map(participant => (
                        <Participant key={`${participant.id}_${participant.eventId}`} participant={participant}/>
                    ))
                }
            </div>
        </>
    );
};
