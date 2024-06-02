import React, { useEffect, useState } from 'react';
import { UserProfile } from '@/components/profile/UserProfile';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm';
import ChangeUserDataForm from '@/components/profile/ChangeUserDataForm';
import { getAuthUser, getLeaderboard } from '@/utils/api/api';
import { Button } from '@/components/ui/button';
import { FaStar } from 'react-icons/fa';
import UserCommentsList from '@/components/events/UserCommentsList';
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
  rating?: number;
  points?: number;
};

export const UserProfilePage: React.FC = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showUserDataForm, setShowUserDataForm] = useState(false);
  const [showComments, setShowComments] = useState(false);
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

        const leaderboardResponse = await getLeaderboard();
        const userInLeaderboard = leaderboardResponse.content.find(
          (u) => u.userId === userData.id,
        );

        if (userInLeaderboard) {
          userWithFullName.rating = userInLeaderboard.rating;
          userWithFullName.points = userInLeaderboard.points;
        }

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
    setShowComments(false);
  };

  const handleToggleUserDataForm = () => {
    setShowUserDataForm(!showUserDataForm);
    setShowPasswordForm(false);
    setShowComments(false);
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
    setShowPasswordForm(false);
    setShowUserDataForm(false);
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
        <div className="mb-4 flex flex-wrap items-center justify-between">
          <div className="flex items-center gap-2">
            <h2>Punkty użytkownika:</h2>
            <div className="flex items-center gap-2">
              <p>{user.points !== undefined ? user.points : '0'}</p>
            </div>
          </div>
          {user.rating !== undefined && (
            <div className="ml-4 flex items-center gap-2">
              <FaStar color="gold" size={24} />
              <p>{user.rating}</p>
            </div>
          )}
        </div>
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
          <Button variant="outline" onClick={handleToggleComments}>
            {!showComments ? 'Pokaż komentarze' : 'Ukryj komentarze'}
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

      {showComments && (
        <Dialog
          open={showComments}
          onClose={handleToggleComments}
          className="fixed inset-0 z-10 flex items-center justify-center"
        >
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative z-20 mx-4 w-full max-w-3xl rounded-lg bg-white p-8 shadow-lg">
            <button
              onClick={handleToggleComments}
              className="absolute right-4 top-4 p-2 text-gray-600 hover:text-gray-900"
            >
              <FaTimes size={24} />
            </button>
            <UserCommentsList userId={user.id} />
          </div>
        </Dialog>
      )}
    </div>
  );
};
