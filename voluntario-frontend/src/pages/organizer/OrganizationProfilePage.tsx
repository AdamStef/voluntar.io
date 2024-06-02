import React, { useEffect, useState } from 'react';
import { UserProfile } from '@/components/profile/UserProfile';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm';
import ChangeUserDataForm from '@/components/profile/ChangeUserDataForm';
import { getAuthUser } from '@/utils/api/api';
import { Button } from '@/components/ui/button';
import { Dialog } from '@headlessui/react';
import { FaTimes } from 'react-icons/fa';

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
    window.location.reload();
  };

  if (!user) {
    return <div>Ładowanie</div>;
  }

  return (
    <div>
      <div className="mx-auto w-full max-w-4xl border-2 border-black p-4">
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
      </div>

      {showPasswordForm && (
        <Dialog
          open={showPasswordForm}
          onClose={handleTogglePasswordForm}
          className="fixed inset-0 z-10 flex items-center justify-center"
        >
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative z-20 mx-4 w-full max-w-3xl rounded-lg bg-white p-8 shadow-lg">
            <button
              onClick={handleTogglePasswordForm}
              className="absolute right-4 top-4 text-gray-600 hover:text-gray-900"
            >
              <FaTimes size={24} />
            </button>
            <ChangePasswordForm />
          </div>
        </Dialog>
      )}

      {showUserDataForm && (
        <Dialog
          open={showUserDataForm}
          onClose={handleCloseAndRefresh}
          className="fixed inset-0 z-10 flex items-center justify-center"
        >
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative z-20 mx-4 w-full max-w-3xl rounded-lg bg-white p-8 shadow-lg">
            <button
              onClick={handleCloseAndRefresh}
              className="absolute right-4 top-4 text-gray-600 hover:text-gray-900"
            >
              <FaTimes size={24} />
            </button>
            <ChangeUserDataForm />
          </div>
        </Dialog>
      )}
    </div>
  );
};
