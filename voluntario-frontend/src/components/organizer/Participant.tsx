import { Calendar } from "lucide-react";
import ManAvatar from '@/assets/man_avatar.png'
import { Button } from "@/components/ui/button.tsx";
import { format } from "date-fns";
import {removeParticipantFromEvent} from "@/utils/api/api.ts";
import {useState} from "react";

export const Participant = (props) => {
    const [rejected, setRejected] = useState(false)

    function rejectVolunteer() {
        removeParticipantFromEvent(
            {eventId: props.participant.eventId, participantId: props.participant.id}
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
                <p className="line-clamp-1 ml-2 mt-1.5 text-lg font-bold">{props.participant.eventName}</p>
                <p className="ml-2 text-sm">{format(props.participant.eventStartDate, "dd.MM.yyyy")} - {format(props.participant.eventEndDate, "dd.MM.yyyy")}</p>
            </div>
        </div>
        <div className="relative bg-gray-400 w-72 mx-4 mt-3 h-48">
            <div className="h-28">
                <img className="float-left border ml-2 mt-2" src={ManAvatar} width={95} height={95}/>
                <div className="pl-2 h-28 flex flex-col justify-evenly">
                    <p className="text-lg font-bold">{props.participant.firstName} {props.participant.lastName}</p>
                    <p className="">Telefon: {props.participant.phoneNumber}</p>
                    <p className="">E-mail: {props.participant.email}</p>
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