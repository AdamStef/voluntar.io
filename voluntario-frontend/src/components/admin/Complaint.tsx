import ManAvatar from "@/assets/man_avatar.png";
import {CalendarCheck} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import {useMutation} from "@tanstack/react-query/build/modern";
import {removeEvent, removeParticipantFromEvent, resolveComplaint, claimComplaint} from "@/utils/api/api.ts";
import {UserType} from "@/utils/types/types.ts";
import {useState} from "react";
import {StatusType} from "@/utils/types/types.ts";
// import {useQueryClient} from "@tanstack/react-query/build/modern/index";

type ComplaintProps = {
    complaint: ComplaintTestType;
};

type ComplaintTestType = {
    id: string,
    event: string,
    description: string,
    volunteer: UserType,
    status: StatusType
}


export const Complaint: React.FC<ComplaintProps> = ({ complaint }) => {

    const [showInput, setShowInput] = useState(false);
    const [response, setResponse] = useState('');
    const [responseSent, setResponseSent] = useState(false);
    const [claimed, setClaimed] = useState(complaint.status !== StatusType.TO_REVIEW);

    const { mutate: claimComplaintMutate } = useMutation({
        mutationFn: claimComplaint,
        onSuccess: () => {
            console.log('claimed');
            // TODO: co tu?
        },
    });

    const { mutate: resolveComplaintMutate } = useMutation({
        mutationFn: resolveComplaint,
        onSuccess: () => {
            console.log('claimed');
            // TODO: co tu?
        },
    });

    const submitClaimComplaint = () => {
        setClaimed(true);
        claimComplaintMutate(complaint.id);
    }

    const submitResolveComplaint = () => {
        setShowInput(false);
        setResponseSent(true);
        const response: string = "xd";
        resolveComplaintMutate({complaintId: complaint.id, response: response});
    }

    const openResponse = () => {
        setShowInput(true);
    }

    const closeResponse = () => {
        setShowInput(false);
    }

    const handleResponseChange = (e) => {
        setResponse(e.target.value);
    };

    return (
        <div className="relative flex flex-col md:flex-row h-auto md:w-2/3 w-full bg-gray-400 my-4">
            {/* volunteer */}
            <div className="w-full md:w-1/4 my-2 mx-2 flex flex-col items-center">
                <img
                    className="my-2 rounded-sm border bg-white"
                    src={ManAvatar}
                    width={95}
                    height={95}
                    alt="Avatar"
                />
                <div className="font-bold">{complaint.volunteer.firstName} {complaint.volunteer.lastName}</div>
                {/* <div className="w-20 mx-auto">Wiek: {complaint.volunteer.age}</div> */}
            </div>
            {/* right */}
            <div className="flex-1 my-2 mx-4 flex flex-col justify-between">
                <div>
                    <div className="flex items-center mb-4">
                        <CalendarCheck className="h-10 w-10"/>
                        <p className="font-bold text-xl ml-3">{complaint.event}</p>
                    </div>
                    <div>
                        <p>Uwagi:</p>
                        <p>{complaint.description}</p>
                    </div>
                </div>
                {/* buttons */}
                <div className="flex justify-end mt-4">
                    {
                        // todo: onclick
                        responseSent &&
                            <Button className="mx-3 w-40 bg-gray-600 hover:bg-green-800">
                                Wysłano odpowiedź
                            </Button>
                    }

                    {
                        !responseSent && !showInput && (<>
                        { !claimed &&
                        <Button className="mx-3 w-40 bg-green-600 hover:bg-green-800" onClick={submitClaimComplaint}>
                            Potwierdź otrzymanie
                        </Button>
                        }
                        { claimed &&
                        <Button className="mx-3 w-48 bg-gray-600 hover:bg-gray-600">
                            Potwierdzono otrzymanie
                        </Button>
                        }
                        <Button className="mx-3 w-32 bg-green-600 hover:bg-red-800" onClick={openResponse}>
                            Wyślij odpowiedź
                        </Button>
                        </>)
                    }

                    {
                        !responseSent && showInput &&
                        <Button className="mx-3 w-12 bg-red-600 hover:bg-red-800" onClick={closeResponse}>
                            &lt;
                        </Button>
                    }


                    {/*<Button className="mx-3 w-24 bg-gray-600 hover:bg-gray-800" onClick={banVolunteer}>*/}
                    {/*    Banuj*/}
                    {/*</Button>*/}
                </div>
                {
                    showInput &&
                    <form className="my-2" onSubmit={(e) => e.preventDefault()}>
                        <label>
                            Odpowiedź na skargę:
                            <br/>
                            <textarea value={response} onChange={handleResponseChange}
                                      className="border-2 my-3 w-80 h-32 p-1"/>
                            <br/>
                        </label>
                        <Button onClick={submitResolveComplaint}>Submit</Button>
                    </form>
                }
            </div>
        </div>

    )
}