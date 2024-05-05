import '@/components/organizer/UnconfirmedList.tsx';
import { EventListOrganizer } from '@/components/events/EventListOrganizer.tsx';

import {UnconfirmedList} from "@/components/organizer/UnconfirmedList.tsx";

export const OrganizerHomePage = () => {
    return (

        <div className="container flex flex-col gap-3 md:flex-row">
            <div className="flex w-3/4 flex-col">
                <p className="my-3 text-2xl text-left font-bold">Twoje wydarzenia</p>
                <div className="items-center gap-6">
                    <EventListOrganizer/>
                </div>
            </div>
            <div className="w-1/4">
                <p className="text-center font-bold my-2 text-xl">Zapisani wolontariusze</p>
                <UnconfirmedList/>
            </div>
        </div>

    );
};
