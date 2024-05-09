import { Calendar } from "lucide-react";
import ManAvatar from '@/assets/man_avatar.png'
import { Button } from "@/components/ui/button.tsx";
import { format } from "date-fns";
import {removeParticipantFromEvent} from "@/utils/api/api.ts";
import {useState} from "react";
import { ParticipantType } from "@/utils/types/types.ts";

type ParticipantProps = {
    participant: ParticipantType;
};


export const Participant: React.FC<ParticipantProps> = ({participant}) => {
    const [rejected, setRejected] = useState(false)

    function rejectVolunteer() {
        removeParticipantFromEvent(
            {eventId: String(participant.eventId), participantId: participant.id}
        )
        setRejected(true);
    }

    return (
    <>
        {!rejected && (
        <div className="relative w-80 h-80 my-2 bg-green-400">
        <div className="flex">
            <Calendar className="h-11 w-11 ml-2 mt-2" />
            <div>
                <p className="line-clamp-1 ml-2 mt-1.5 text-lg font-bold">{participant.eventName}</p>
                <p className="ml-2 text-sm">{format(participant.eventStartDate, "dd.MM.yyyy")} - {format(participant.eventEndDate, "dd.MM.yyyy")}</p>
            </div>
        </div>
        <div className="relative bg-gray-400 w-72 mx-4 mt-3 h-48">
            <div className="h-28">
                <img className="float-left border ml-2 mt-2" src={ManAvatar} width={95} height={95}/>
                <div className="pl-2 h-28 flex flex-col justify-evenly">
                    <p className="text-lg font-bold">{participant.firstName} {participant.lastName}</p>
                    <p className="">Telefon: {participant.phoneNumber}</p>
                    <p className="">E-mail: {participant.email}</p>
                </div>
            </div>
            {/*TODO: co jak nie informacje o nim*/}
            <p className="ml-2 line-clamp-3">Informacje: -</p>

        </div>
        <div className="flex w-full absolute bottom-2.5 justify-evenly">
            <Button className="bg-red-600" onClick={rejectVolunteer} >Usuń z wydarzenia</Button>
        </div>
    </div>)
        }
    </>
    );
};