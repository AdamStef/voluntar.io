import { Complaint } from '@/components/admin/Complaint.tsx';
import { useQuery } from '@tanstack/react-query';
import { getComplaints } from '@/utils/api/api.ts';
import { Spinner } from '@/components/ui/Spinner.tsx';
import { H3 } from '@/components/ui/typography/heading';

export const ComplaintsPage = () => {
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
    <div className="container mt-5 flex flex-row justify-evenly">
      <div className="flex w-full flex-col gap-4 md:w-2/3">
        {/*complainty*/}
        <div className="mx-4">
          <H3 className="mb-5"> Skargi od organizatorów: </H3>
          <div className="flex flex-col gap-4">
            {complaints
              .sort((a, b) => b.reportDate.getTime() - a.reportDate.getTime())
              .map((complaint) => (
                <Complaint key={complaint.id} complaint={complaint} />
              ))}
          </div>
        </div>
      </div>
      {/*<UnconfirmedOrganizationsList/>*/}
    </div>
  );
};
