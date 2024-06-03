import ManAvatar from '@/assets/man_avatar.png';
import WomanAvatar from '@/assets/woman_avatar.png';
import { Flag, SquareCheckBig, PenLine, Send } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  resolveComplaint,
  claimComplaint,
  getUserOrganization,
} from '@/utils/api/api.ts';
import React, { ChangeEvent, useState } from 'react';
import { ComplaintStatusType, ComplaintType } from '@/utils/types/types.ts';
import { format } from 'date-fns';

type ComplaintProps = {
  complaint: ComplaintType;
};

export const Complaint: React.FC<ComplaintProps> = ({ complaint }) => {
  const queryClient = useQueryClient();
  const avatarSrc = complaint.reported.gender == 'MALE' ? ManAvatar : WomanAvatar;
  const { data: organization } = useQuery({
    queryKey: ['complaint', 'organizer', complaint.reporter.id],
    queryFn: () => getUserOrganization(complaint.reporter.id),
  });

  const [showInput, setShowInput] = useState(false);
  const [responseToSend, setResponseToSend] = useState('');
  const [responseSent, setResponseSent] = useState(
    complaint.status === ComplaintStatusType.RESOLVED,
  );
  const [claimed, setClaimed] = useState(
    complaint.status !== ComplaintStatusType.TO_REVIEW,
  );

  const { mutate: claimComplaintMutate } = useMutation({
    mutationFn: claimComplaint,
    onSuccess: () => {
      console.log('claimed');
      queryClient.refetchQueries({ queryKey: ['complaints'] });
    },
  });

  const { mutate: resolveComplaintMutate } = useMutation({
    mutationFn: resolveComplaint,
    onSuccess: () => {
      console.log('resolved');
      queryClient.refetchQueries({ queryKey: ['complaints'] });
    },
  });

  const submitClaimComplaint = () => {
    setClaimed(true);
    claimComplaintMutate(complaint.id.toString());
  };

  const submitResolveComplaint = () => {
    const newComplaint = {
      ...complaint,
      response: responseToSend,
      resolveDate: Date(),
    };
    console.log(complaint.id, newComplaint);
    resolveComplaintMutate({
      complaintId: complaint.id,
      response: {
        ...complaint,
        response: responseToSend,
        resolveDate: new Date(),
      },
    });
    setShowInput(false);
    setResponseSent(true);
  };

  const openResponse = () => {
    setShowInput(true);
  };

  const closeResponse = () => {
    setShowInput(false);
  };

  const handleResponseChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setResponseToSend(e.target.value);
  };

  console.log(organization);

  return (
    <div className="relative my-4 flex h-auto flex-col bg-gray-400 lg:flex-row">
      {/* volunteer */}
      <div className="mx-2 my-2 flex w-full flex-col items-center lg:w-1/4">
        <img
          className="my-2 rounded-sm border bg-white"
          src={avatarSrc}
          width={95}
          height={95}
          alt="Avatar"
        />
        <div className="font-bold">
          {complaint.reported.firstName} {complaint.reported.lastName}
        </div>
        {/*<div className="w-20 mx-auto">Wiek: {complaint.volunteer.age}</div>*/}
      </div>
      {/* right */}
      <div className="mx-4 my-2 flex flex-1 flex-col justify-between">
        {/*center*/}
        <div>
          <div className="mb-4 flex flex-col">
            <div className="flex flex-row">
              <Flag className="h-8 w-8" />
              <div className="ml-3 flex w-full justify-between text-xl">
                <div className="flex flex-col">
                  <span>
                    <span className="font-normal">Od: </span>
                    <span className="font-bold">
                      {complaint.reporter.firstName}{' '}
                      {complaint.reporter.lastName}
                    </span>
                  </span>
                  {organization && (
                    <div className="flex flex-row">
                      <p className="w-fit text-sm">
                        <span className="font-normal">Organizacja: </span>
                        <span className="font-bold">{organization.name}</span>
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="flex flex-row">
                    <PenLine className="mx-2 h-5 w-5" />
                    <span className="text-sm">
                      {format(complaint.reportDate, 'dd.MM.yyyy HH:mm')}
                    </span>
                  </div>
                  {claimed && complaint.claimDate && (
                    <div className="flex flex-row">
                      <SquareCheckBig className="mx-2 h-5 w-5" />
                      <span className="text-sm">
                        {format(complaint.claimDate, 'dd.MM.yyyy HH:mm')}
                      </span>
                    </div>
                  )}
                  {responseSent && complaint.resolveDate && (
                    <div className="flex flex-row">
                      <Send className="mx-2 h-5 w-5" />
                      <span className="text-sm">
                        {format(complaint.resolveDate, 'dd.MM.yyyy HH:mm')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            <p className="font-bold">Uwagi:</p>
            <p>{complaint.textComplaint}</p>
          </div>
          {/*wyslana odpowiedz??*/}
          {responseSent && (
            <div>
              <br />
              <p className="font-bold">Wysłana odpowiedź:</p>
              <p>{complaint.response}</p>
            </div>
          )}
        </div>

        {/* buttons */}
        <div className="mt-4 flex justify-end">
          {responseSent && (
            <>
              <Button className="mx-3 w-40 bg-gray-600 hover:bg-green-800">
                Wysłano odpowiedź
              </Button>
              <Button className="mx-3 w-48 bg-gray-600 hover:bg-gray-600">
                Potwierdzono otrzymanie
              </Button>
            </>
          )}
          {!responseSent && !showInput && (
            <>
              {!claimed && (
                <>
                  {/*<Button className="mx-3 w-40 bg-gray-600 hover:bg-gray-600">*/}
                  {/*  /!*Wyślij odpowiedź*!/*/}
                  {/*</Button>*/}
                  <Button
                    className="mx-3 w-48 bg-green-600 hover:bg-green-800"
                    onClick={submitClaimComplaint}
                  >
                    Potwierdź otrzymanie
                  </Button>
                </>
              )}
              {claimed && (
                <>
                  <Button
                    className="mx-3 w-40 bg-green-600 hover:bg-green-800"
                    onClick={openResponse}
                  >
                    Wyślij odpowiedź
                  </Button>
                  <Button className="mx-3 w-48 bg-gray-600 hover:bg-gray-600">
                    Potwierdzono otrzymanie
                  </Button>
                </>
              )}
            </>
          )}

          {!responseSent && showInput && (
            <Button
              className="mx-3 w-12 bg-red-600 hover:bg-red-800"
              onClick={closeResponse}
            >
              &lt;
            </Button>
          )}
          {/*<Button className="mx-3 w-24 bg-gray-600 hover:bg-gray-800" onClick={banVolunteer}>*/}
          {/*    Banuj*/}
          {/*</Button>*/}
        </div>
        {showInput && (
          <form className="my-2" onSubmit={(e) => e.preventDefault()}>
            <label>
              Odpowiedź na skargę:
              <br />
              <textarea
                value={responseToSend}
                onChange={handleResponseChange}
                className="my-3 h-32 w-80 border-2 p-1"
              />
              <br />
            </label>
            <Button onClick={submitResolveComplaint}>Wyślij</Button>
          </form>
        )}
      </div>
    </div>
  );
};
