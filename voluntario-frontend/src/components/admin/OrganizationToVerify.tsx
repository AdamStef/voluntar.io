import React, {useState} from "react";
import axios from "axios";
import {Button} from "@/components/ui/button.tsx"
import {OrganizationType} from "@/utils/types/types.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {claimComplaint, verifyOrganization} from "@/utils/api/api.ts";

type OrganizationProps = {
    organization: OrganizationType;
};

export const OrganizationToVerify: React.FC<OrganizationProps> = ({ organization }) => {
    const queryClient = useQueryClient();
    const [data, setData] = useState({
        odpis: undefined
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [krsCorrect, setKrsCorrect] = useState(false);
    const [krsWasVerified, setKrsWasVerified] = useState(false);

    const verifyKrsSubmit = async (event) => {
        event.preventDefault(); // Prevent form from submitting the default way
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`https://api-krs.ms.gov.pl/api/krs/OdpisAktualny/${organization.krs}?rejestr=S&format=json`);
            setData(response.data);
            setLoading(false);
            console.log(response.data);
            setKrsCorrect(true);
        } catch (err) {
            if (err.response.status == 404) {
                setKrsCorrect(false);
            }
        }
        setKrsWasVerified(true);
    };

    const { mutate: verifyOrganizationMutate } = useMutation({
        mutationFn: verifyOrganization,
        onSuccess: () => {
            console.log('verified');
            queryClient.refetchQueries({ queryKey: ['organizations'] });
        },
    });

    const approveOrganization = () => {
        verifyOrganizationMutate(organization.id);
    }

    const rejectOrganization = () => {
        console.log("todo");
    }

    return (
        <div className="relative flex h-auto flex-col bg-gray-400">
            <div className="mx-2 my-2 w-full flex flex-col xl:flex-row justify-between">
                {/*dane z rejestracji*/}
                <div className="w-1/2">
                    <p className="font-bold mb-2">Dane podane przy rejestracji:</p>
                    <span>
                        <span className="font-normal">Nazwa organizacji: </span>
                        <span className="font-bold">{organization.name}</span>
                    </span>
                    <p>Adres: {organization.address}</p>
                    {organization.website && (
                        <p>
                            Strona internetowa:
                            <a href={organization.website} target="_blank" rel="noopener noreferrer" className="ml-1 text-blue-900 hover:text-blue-700">
                                {organization.website}
                            </a>
                        </p>
                    )}
                    <p>KRS: {organization.krs} </p>
                </div>
                {/*dane z krs*/}
                <div className="w-1/2">
                    <div className="font-bold mb-2">Dane z KRS:

                    </div>
                    {krsWasVerified && krsCorrect && <div>
                        <p>
                            Nazwa organizacji:
                            {data.odpis.dane.dzial1.danePodmiotu.nazwa}
                        </p>
                        <p>Adres: {data.odpis.dane.dzial1.siedzibaIAdres.adres.miejscowosc}, ul. {data.odpis.dane.dzial1.siedzibaIAdres.adres.ulica} {data.odpis.dane.dzial1.siedzibaIAdres.adres.nrDomu} {data.odpis.dane.dzial1.siedzibaIAdres.adres.nrLokalu}</p>
                    </div>
                    }
                    {krsWasVerified && !krsCorrect && <div>
                        Nie znaleziono organizacji o danym numerze KRS.
                    </div>
                    }
                    {!krsWasVerified &&
                        <Button className="w-36" onClick={verifyKrsSubmit}>
                            Weryfikuj z KRS
                        </Button>
                    }
                    {/*{krsWasVerified &&*/}
                    {/*    <Button className="w-36 bg-gray-600 hover:bg-gray-600">*/}
                    {/*        Weryfikowano z KRS*/}
                    {/*    </Button>*/}
                    {/*}*/}
                </div>
            </div>
            <div className="ml-2 mb-2">
                {/*buttons*/}
                <Button className="w-20 h-8 hover:bg-green-900" onClick={approveOrganization}>
                    Akceptuj
                </Button>
                <Button className="w-20 h-8 ml-2 bg-red-600 hover:bg-red-800" onClick={rejectOrganization}>
                    Odrzuć
                </Button>
            </div>
        </div>
    )
}