import { Calendar } from "lucide-react";
import ManAvatar from '@/assets/man_avatar.png'
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button.tsx";

const unconfirmedSignup =
    {
        id: 1,
        eventName: 'Pomaganie',
        date: '2024-05-08',
        volunteerName: 'Michał Sumatowski',
        age: 22,
        rate: 4,
        info: 'Lorem ipzum adsfdaLorem ipzum adsfdaLorem ipzum adsfdaLorem ipzum adsfdaLorem ipzum adsfda'
    }
;

function acceptVolunteer() {
    console.log('accepted');
}

function rejectVolunteer() {
    console.log('rejected');
}

export const Unconfirmed = () => {
    return (
    <div className="relative w-80 h-80 bg-green-400">
        <div className="flex">
            <Calendar className="h-11 w-11 ml-2 mt-2" />
            <div>
                <p className="ml-2 mt-1.5 text-lg font-bold">{unconfirmedSignup.eventName}</p>
                <p className="ml-2 text-sm">{unconfirmedSignup.date}</p>
            </div>
        </div>
        {/*gray*/}
        <div className="relative bg-gray-400 w-72 mx-4 mt-3 h-48">
            <div className="h-28">
                <img className="float-left border ml-2 mt-2" src={ManAvatar} width={95} height={95}/>
                <div className="pl-2 h-28 flex flex-col justify-evenly">
                    <p className="text-lg font-bold">{unconfirmedSignup.volunteerName}</p>
                    <p className="">Wiek: {unconfirmedSignup.age}</p>
                    <p className="">Ocena: {unconfirmedSignup.rate}</p>
                </div>
            </div>
            <p className="ml-2 line-clamp-3">Informacje: {unconfirmedSignup.info}</p>

        </div>
        <div className="flex w-full absolute bottom-2.5 justify-evenly">
            <Button className="bg-green-600" onClick={acceptVolunteer}>Przyjmij</Button>
            <Button className="bg-red-600" onClick={rejectVolunteer}>Odrzuć</Button>
            <Button asChild className="bg-blue-600">
                <Link to={`/volunteer`}>Więcej</Link>
            </Button>
        </div>
    </div>
    );
};