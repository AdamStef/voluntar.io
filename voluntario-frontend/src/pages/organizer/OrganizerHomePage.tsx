import '@/components/organizer/ParticipantList.tsx';
import { EventListOrganizer } from '@/components/events/organizer/EventListOrganizer.tsx';
import { EventList } from '@/components/events/EventList.tsx';
import { Button } from '@/components/ui/button.tsx'
import { Link } from "react-router-dom";
import {ParticipantList} from "@/components/organizer/ParticipantList.tsx";

export const OrganizerHomePage = () => {
    return (

        <div className="container flex flex-col gap-3 md:flex-row">
            <div className="flex w-3/4 flex-col">
                <div className="relative flex">
                    <p className="my-3 text-2xl text-left font-bold">Twoje wydarzenia</p>
                    <Button className="my-3 absolute right-0 w-40 bg-blue-500">
                        <Link to={'/addevent'} className="">
                            Dodaj wydarzenie
                        </Link>
                    </Button>
                </div>
                <div className="mt-2 items-center gap-6">
                    <EventListOrganizer/>
                </div>
            </div>
            <div className="w-1/4">
                <p className="text-center font-bold my-2 text-xl">Zapisani wolontariusze</p>
                <ParticipantList/>
            </div>
        </div>

    );
};
