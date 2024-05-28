import {useQuery} from "@tanstack/react-query";
import {getOrganizations, getOrganizerEvents, getUsers} from "@/utils/api/api.ts";
import {Spinner} from "@/components/ui/Spinner.tsx";
import {format} from "date-fns/index";

export const UnconfirmedOrganizationsList = () => {
    const {
        data: users,
        isError,
        isPending,
    } = useQuery({
        queryKey: ['users'],
        queryFn: getOrganizations,
    });

    if (isPending) return <Spinner className="h-16 w-16" />;
    if (isError) return <div>Wystąpił błąd podczas pobierania wydarzeń</div>;
    if (!users || users.length == 0) return <p>Brak wydarzeń</p>;

    console.log(users);

    return (
        <div>
            {users.map((user) => (
                <div className="mx-4 h-8 my-4 bg-gray-600">
                    <p key={user.id}>{user.firstName}</p>
                </div>
            ))}
        </div>
    )
}