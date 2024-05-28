import { Complaint } from '@/components/admin/Complaint.tsx'
import {UserType, Role, ComplaintType, StatusType} from '@/utils/types/types.ts'
import { UnconfirmedOrganizationsList } from "@/components/admin/UnconfirmedOrganizationsList.tsx";
import { useQuery } from "@tanstack/react-query";
import {getComplaints, getOrganizerEvents, getToReviewComplaints} from "@/utils/api/api.ts";
import {Spinner} from "@/components/ui/Spinner.tsx";


// TODO: change it after backend is done
type ComplaintTestType = {
    id: string,
    event: string,
    description: string,
    volunteer: UserType,
    status: StatusType
}

const volunteer1: UserType = {
    id: 1,
    email: "a@d.com",
    role: Role.VOLUNTEER,
    firstName: 'Antoni',
    lastName: 'Holownia',
    phoneNumber: '1920310930',
    gender: 'male'
}

const complaint1: ComplaintTestType = {
    id: '199',
    event: 'Pomaganie powodzianom powodzianonom nononom nonom nom nom',
    description: 'Zjadl wszystkie ciasteczka. wsztstkie tak ze nic nie zostalo nie podzielil sie i poszedl wgl nwm co robic i dlatego jest ta skarga panie  a co jak bedzie dluzsza np 3 linijki to co wtedy mordooo jhahha',
    volunteer: volunteer1,
    status: StatusType.TO_REVIEW
}

const complaint2: ComplaintTestType = {
    id: '200',
    event: 'siema',
    description: 'Zjadl wszystkie ciasteczka itd',
    volunteer: volunteer1,
    status: StatusType.UNDER_REVIEW
}

const complaints = [
    complaint1, complaint2
]

export const AdminPage = () => {
    // const {
    //     data: complaints,
    //     isError,
    //     isPending,
    // } = useQuery({
    //     queryKey: ['complaints'],
    //     queryFn: getToReviewComplaints,
    // });
    //
    // if (isError) {
    //     return <div>Wystąpił błąd podczas pobierania skarg</div>;
    // }
    //
    // if (isPending) return <Spinner className="h-16 w-16" />;
    //
    // if (!complaints) return null;

    return (
        <div className="flex flex-row justify-evenly">
            <div className="flex flex-col gap-4">
                {/*complainty*/}
                <div className="mx-4">
                    <p className="text-xl font-bold mt-4"> Skargi do rozpatrzenia: </p>
                    {complaints.map((complaint, index: number) => (
                        <Complaint key={index} complaint={complaint}></Complaint>
                    ))}
                </div>
            </div>
            <UnconfirmedOrganizationsList/>
        </div>
    )
}