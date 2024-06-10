import { useAuthContext } from '@/hooks/useAuthContext';
import { Role } from '@/utils/types/types';
import HomePage from './HomePage';
import { OrganizerHomePage } from './organizer/OrganizerHomePage';
import { ComplaintsPage } from './admin/ComplaintsPage';
import { LandingPage } from './LandingPage';

export const WhichHomePage = () => {
  const { user } = useAuthContext();

  const getHomePageForRole = () => {
    console.log(user?.role);
    switch (user?.role) {
      case Role.VOLUNTEER:
        return <HomePage />;
      case Role.ORGANIZATION:
        return <OrganizerHomePage />;
      case Role.ADMIN:
        return <ComplaintsPage />;
      default:
        return <LandingPage />;
    }
  };
  return getHomePageForRole();
};
