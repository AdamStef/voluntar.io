import {getEvents, getLocations} from '@/utils/api/api';
import { useQuery } from '@tanstack/react-query';
// import { Spinner } from '../ui/Spinner';

export const LocationsList = () => {
    const { data, isError, isPending } = useQuery({
        queryKey: ['locations'],
        queryFn: getLocations,
        initialData: [],
    });

    if (isPending)
        return (
            <div className="flex justify-center">
                d
                {/*<Spinner className="h-24 w-24" />*/}
            </div>
        );

    if (isError) return <div>Nie znaleziono żadnych wydarzeń.</div>;

    return (
        <div className="flex flex-col gap-5">
            {data.map((event) => (
                <p>{event.street}</p>
            ))}
        </div>
    );
};