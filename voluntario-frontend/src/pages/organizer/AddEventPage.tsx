import { LogoLink } from '@/components/icons/Logo';
import { Link, Outlet } from 'react-router-dom';
import { useScreenSize } from '@/hooks/useScreenSize';
import AddEventForm from "@/components/forms/AddEventForm.tsx";
import LocationForm from "@/components/forms/LocationForm.tsx";
import {useMutation} from "@tanstack/react-query";
import { postEvent } from "@/utils/api/api.ts"
import { EventType } from "@/utils/types/types.ts"
import axios from "axios";
import {LocationsList} from "@/pages/organizer/LocationsList.tsx";



export const AddEventPage = () => {


    return (

        <div className="relative">
            <p className="text-center font-bold my-2 text-xl">Dodawanie wydarzenia</p>
            <div className="flex">
                <div className="inline-block w-1/2">
                    <LocationForm/>
                </div>
                <div className="inline-block w-1/2 ">
                    <AddEventForm/>
                </div>
            </div>
            <LocationsList></LocationsList>
        </div>
    );
};
