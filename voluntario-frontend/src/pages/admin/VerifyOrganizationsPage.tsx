import { useQuery } from '@tanstack/react-query';
import { getUnverifiedOrganizations } from '@/utils/api/api.ts';
import { OrganizationType } from '@/utils/types/types.ts';
import { OrganizationToVerify } from '@/components/admin/OrganizationToVerify.tsx';
import { Spinner } from '@/components/ui/Spinner.tsx';

export const VerifyOrganizationsPage = () => {
  const {
    data: organizations,
    isError,
    isPending,
  } = useQuery({
    queryKey: ['organizations'],
    queryFn: getUnverifiedOrganizations,
  });

  if (isPending) {
    return (
      <div className="flex justify-center">
        <Spinner className="h-24 w-24" />
      </div>
    );
  }

  if (isError) return <div>Nie znaleziono organizacji do zweryfikowania.</div>;

  return (
    <div className="flex flex-row justify-evenly">
      <div className="flex w-full flex-col gap-4 md:w-2/3">
        <p className="mt-2 text-xl font-bold">Organizacje do zweryfikowania:</p>
        {organizations &&
          organizations.map((organization: OrganizationType) => (
            <div id="verify-org-list">
              <OrganizationToVerify
                key={organization.id}
                organization={organization}
              />
            </div>
          ))}
        {organizations && organizations.length === 0 && (
          <p>Brak organizacji do zweryfikowania.</p>
        )}
      </div>
    </div>
  );
};
