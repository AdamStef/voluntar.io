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
  children: React.ReactNode;
}> = ({ icon, children }) => {
  return (
    <p className="flex items-center gap-2">
      {icon}
      {children}
    </p>
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
      <Info icon={<FaPeopleGroup size={24} />}>
        Liczba uczestników: {event.participants.length}/
        {event.numberOfVolunteersNeeded}
        <Progress
          className="w-1/5"
          value={
            (event.participants.length / event.numberOfVolunteersNeeded) * 100
          }
        />
      </Info>
      <Info icon={<RiOrganizationChart size={24} />}>
        Organizator: Fundacja Lorem Ipsum {/* TODO: put organization */}
      </Info>
      <Info icon={<MapPin size={24} />}>
        Localizacja: {getLocationString(event.location)}
      </Info>
      <Info icon={<ClockIcon size={24} />}>Czas trwania: 50h</Info>
      <div className="mt-4">
        <H4>Opis</H4>
        <p>{event.description}</p>
      </div>
    </Panel>
  );
};
