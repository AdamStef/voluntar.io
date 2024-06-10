import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { OrganizationType } from '@/utils/types/types.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { verifyOrganization } from '@/utils/api/api.ts';
import { Spinner } from '@/components/ui/Spinner.tsx';
import { Panel } from '../ui/Panel';

type OrganizationProps = {
  organization: OrganizationType;
};

export const OrganizationToVerify: React.FC<OrganizationProps> = ({
  organization,
}) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [address, setAddress] = useState({
    kodPocztowy: '',
    miejscowosc: '',
    ulica: '',
    nrDomu: '',
    nrLokalu: '',
  });
  const [isError, setIsError] = useState(false);
  const [krsCorrect, setKrsCorrect] = useState(false);
  const [krsWasVerified, setKrsWasVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const verifyKrsSubmit = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault(); // Prevent form from submitting the default way
    setIsError(false);
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api-krs.ms.gov.pl/api/krs/OdpisAktualny/${organization.krs}?rejestr=S&format=json`,
      );
      setName(response.data.odpis.dane.dzial1.danePodmiotu.nazwa);
      setAddress({
        kodPocztowy:
          response.data.odpis.dane.dzial1.siedzibaIAdres.adres.kodPocztowy,
        miejscowosc:
          response.data.odpis.dane.dzial1.siedzibaIAdres.adres.miejscowosc,
        ulica: response.data.odpis.dane.dzial1.siedzibaIAdres.adres.ulica,
        nrDomu: response.data.odpis.dane.dzial1.siedzibaIAdres.nrDomu,
        nrLokalu: response.data.odpis.dane.dzial1.siedzibaIAdres.adres.nrLokalu,
      });
      setLoading(false);
      console.log(response.data);
      setKrsCorrect(true);
    } catch (error) {
      const err = error as AxiosError;
      setLoading(false);
      if (err.response?.status == 404) {
        setKrsCorrect(false);
      } else {
        setIsError(true);
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
  };

  if (loading) return <Spinner className="h-16 w-16" />;

  return (
    <div className="relative flex h-auto flex-col">
      <Panel className="w-full">
        <div className="mx-2 my-2 flex w-full flex-col justify-between xl:flex-row">
          {/*dane z rejestracji*/}
          <div className="w-1/2">
            <p className="mb-2 font-bold">Dane podane przy rejestracji:</p>
            <span>
              <span className="font-normal">Nazwa organizacji: </span>
              <span className="font-bold">{organization.name}</span>
            </span>
            <p>Adres: {organization.address}</p>
            {organization.website && (
              <p>
                Strona internetowa:
                <a
                  href={organization.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 text-blue-900 hover:text-blue-700"
                >
                  {organization.website}
                </a>
              </p>
            )}
            <p>Telefon: {organization.owner.phoneNumber} </p>
            <p>E-mail: {organization.owner.email} </p>
            <p>KRS: {organization.krs} </p>
          </div>
          {/*dane z krs*/}
          <div className="w-1/2">
            <div className="mb-2 mt-2 font-bold xl:mt-0">Dane z KRS:</div>
            {krsWasVerified && krsCorrect && (
              <div>
                <p>Nazwa organizacji: {name}</p>
                <p>
                  Adres: {address.kodPocztowy} {address.miejscowosc}, ul.{' '}
                  {address.ulica} {address.nrDomu} {address.nrLokalu}
                </p>
              </div>
            )}
            {krsWasVerified && !krsCorrect && (
              <div>Nie znaleziono organizacji o danym numerze KRS.</div>
            )}
            {!krsWasVerified && (
              <Button className="w-44" onClick={verifyKrsSubmit}>
                <Download className="mr-2 h-6 w-6" />
                Weryfikuj z KRS
              </Button>
            )}
            {krsWasVerified && isError && (
              <div>Wyszukanie informacji z KRS się nie powiodło.</div>
            )}
          </div>
        </div>
        <div className="mb-2 ml-2">
          <Button
            className="w-20 hover:bg-green-900"
            onClick={approveOrganization}
          >
            Akceptuj
          </Button>
        </div>
      </Panel>
    </div>
  );
};
