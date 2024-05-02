import { ClockIcon, MapPin } from 'lucide-react';
import { H2, H4 } from '../ui/typography/heading';
import { FaPeopleGroup } from 'react-icons/fa6';
import { RiOrganizationChart } from 'react-icons/ri';
import { EventType } from '@/utils/types/types';
import { getLocationString } from '@/utils/helpers';
import { Panel } from '../ui/Panel';
import { Progress } from '../ui/progress';

const Info: React.FC<{
  icon: React.ReactNode;
  header: string;
  children: React.ReactNode;
}> = ({ icon, children, header }) => {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <p className="hidden md:inline-block">{header}</p>
      {children}
    </div>
  );
};

type EventDetailsInformationProps = {
  event: EventType;
};

export const EventDetailsInformation: React.FC<
  EventDetailsInformationProps
> = ({ event }) => {
  return (
    <Panel className="flex flex-col gap-1">
      <H2>Szczegółowe informacje</H2>
      <Info icon={<FaPeopleGroup size={24} />} header="Liczba uczestników: ">
        {/* Liczba uczestników:{' '} */}
        <p className="font-semibold">
          {event.participants.length}/{event.numberOfVolunteersNeeded}
        </p>
        <Progress
          className="w-1/5"
          value={
            (event.participants.length / event.numberOfVolunteersNeeded) * 100
          }
        />
      </Info>
      <Info icon={<RiOrganizationChart size={24} />} header="Organizator: ">
        <p className="font-semibold">Fundacja Lorem Ipsum</p>{' '}
        {/* TODO: put organization */}
      </Info>
      <Info icon={<MapPin size={24} />} header="Lokalizacja: ">
        {/* Localizacja:{' '} */}
        <p className="font-semibold">{getLocationString(event.location)}</p>
      </Info>
      <Info icon={<ClockIcon size={24} />} header="Czas trwania:">
        <p className="font-semibold">50h</p>
      </Info>
      <div className="mt-4">
        <H4>Opis</H4>
        <p>{event.description}</p>
      </div>
    </Panel>
  );
};
