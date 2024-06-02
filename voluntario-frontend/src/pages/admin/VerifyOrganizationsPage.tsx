import {useQuery} from "@tanstack/react-query";
import {getUnverifiedOrganizations} from "@/utils/api/api.ts";

import {OrganizationToVerify} from "@/components/admin/OrganizationToVerify.tsx";

export const VerifyOrganizationsPage = () => {

    const {
        data: organizations,
        isError,
        isPending,
    } = useQuery({
        queryKey: ['organizations'],
        queryFn: getUnverifiedOrganizations,
    });

    console.log(organizations);

    return (
    <div className="flex flex-row justify-evenly">
        <div className="flex w-full flex-col gap-4 md:w-2/3">
            <p className="mt-2 text-xl font-bold">Organizacje do zweryfikowania:</p>
        {organizations && organizations.map((organization, index: number) => (
            <div>
                <OrganizationToVerify key={organization.id} organization={organization}/>
            </div>
        ))}
        {organizations && organizations.length === 0 &&
            <p>Brak organizacji do zweryfikowania.</p>
        }
        </div>
    </div>
    )
}