import { Link } from 'react-router-dom';
import { VolunteerIcon } from './icons/VolunteerIcon';
import { OrganizationIcon } from './icons/OrganizationIcon';

export const AccountType = () => {
  return (
    <>
      <h1 className="w-full text-center align-middle text-2xl font-bold md:text-4xl">
        Wybierz typ konta
      </h1>
      <div className="mx-auto mt-8 flex flex-col items-center gap-2 md:flex-row md:justify-evenly">
        <Link
          to="/register/volunteer"
          className="aspect-square rounded-sm border-2 bg-white"
        >
          <VolunteerIcon className="h-48 w-48 md:h-64 md:w-64" />
        </Link>
        <Link
          to="/register/organization"
          className="aspect-square rounded-sm border-2 bg-white"
        >
          <OrganizationIcon className="h-48 w-48 md:h-64 md:w-64" />
        </Link>
      </div>
    </>
  );
};
