import React, { useEffect, useState } from 'react';
import { UserProfile } from '@/components/profile/UserProfile';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm';
import ChangeUserDataForm from '@/components/profile/ChangeUserDataForm';
import { getAuthUser } from '@/utils/api/api';
import { Button } from '@/components/ui/button';
import { Panel } from '@/components/ui/Panel';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { H3 } from '@/components/ui/typography/heading';

type UserType = {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
};

type User = {
  id: number;
  name: string;
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
};

export const OrganizationProfilePage: React.FC = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showUserDataForm, setShowUserDataForm] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getAuthUser();
        const userData: UserType = response.data;
        const userWithFullName: User = {
          ...userData,
          name: `${userData.firstName} ${userData.lastName}`,
        };
        setUser(userWithFullName);
      } catch (error) {
        console.error(
          'Nie udało się pobrać danych. Spróbuj ponownie później',
          error,
        );
      }
    };

    fetchUserData();
  }, []);

  const handleTogglePasswordForm = () => {
    setShowPasswordForm(!showPasswordForm);
    setShowUserDataForm(false);
  };

  const handleToggleUserDataForm = () => {
    setShowUserDataForm(!showUserDataForm);
    setShowPasswordForm(false);
  };

  const handleCloseAndRefresh = () => {
    setShowUserDataForm(false);
    // window.location.reload();
  };

  if (!user) {
    return <div>Ładowanie</div>;
  }

  return (
    <div className="container mt-5 max-w-4xl">
      <H3 className="mb-5">Profil użytkownika</H3>
      <Panel>
        <div className="mb-4">
          <UserProfile
            name={user.name}
            phoneNumber={user.phoneNumber}
            email={user.email}
          />
        </div>
        <div className="mb-6 flex flex-wrap gap-4">
          <Button variant="outline" onClick={handleTogglePasswordForm}>
            Zmień hasło
          </Button>
          <Button variant="outline" onClick={handleToggleUserDataForm}>
            Zmień dane
          </Button>
        </div>
      </Panel>

      {showPasswordForm && (
        <Dialog open={showPasswordForm} onOpenChange={handleTogglePasswordForm}>
          <DialogContent>
            <ChangePasswordForm onClose={handleTogglePasswordForm} />
          </DialogContent>
        </Dialog>
      )}

      {showUserDataForm && (
        <Dialog open={showUserDataForm} onOpenChange={handleCloseAndRefresh}>
          <DialogContent>
            <ChangeUserDataForm onClose={handleCloseAndRefresh} user={user} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
