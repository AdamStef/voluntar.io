import '@/components/organizer/UnconfirmedList.tsx';
import { EventList } from '@/components/events/EventList.tsx';

import {UnconfirmedList} from "@/components/organizer/UnconfirmedList.tsx";

export const OrganizerHomePage = () => {
    return (

        <div className="container flex flex-col gap-3 md:flex-row">
            <div className="flex w-3/4 flex-col">
                <p className="my-3 text-2xl text-left font-bold">Twoje wydarzenia</p>
                <div className="items-center gap-6">
                    <EventList/>
                </div>
            </div>
            <div className="w-1/4">
                <UnconfirmedList/>
            </div>
        </div>

    );
};
