import { Complaint } from '@/components/admin/Complaint.tsx'
import { useQuery } from "@tanstack/react-query";
import {getComplaints} from "@/utils/api/api.ts";
import {Spinner} from "@/components/ui/Spinner.tsx";

export const AdminPage = () => {
    const {
        data: complaints,
        isError,
        isPending,
    } = useQuery({
        queryKey: ['complaints'],
        queryFn: getComplaints,
    });

    if (isError) {
        return <div>Wystąpił błąd podczas pobierania skarg</div>;
    }

    if (isPending) return <Spinner className="h-16 w-16" />;

    if (!complaints) return null;

    return (
        <div className="flex flex-row justify-evenly">
            <div className="flex flex-col gap-4 w-full md:w-2/3">
                {/*complainty*/}
                <div className="mx-4">
                    <p className="text-xl font-bold mt-4"> Skargi od organizatorów: </p>
                    {complaints.map((complaint, index: number) => (
                        <Complaint key={index} complaint={complaint}></Complaint>
                    ))}
                </div>
            </div>
        </div>
    )
}