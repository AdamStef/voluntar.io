import React, { useEffect, useState } from 'react';
import { UserProfile } from '@/components/profile/UserProfile';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm';
import ChangeUserDataForm from '@/components/profile/ChangeUserDataForm';
import { getAuthUser, getLeaderboard } from '@/utils/api/api';
import { Button } from '@/components/ui/button';
import { FaStar } from 'react-icons/fa';
import UserCommentsList from '@/components/events/UserCommentsList';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { FaTimes } from 'react-icons/fa';
import { Panel } from '@/components/ui/Panel';

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

const UserProfilePage: React.FC = () => {
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
    setShowPasswordForm((prev) => !prev);
    setShowUserDataForm(false);
    setShowComments(false);
  };

  const handleToggleUserDataForm = () => {
    setShowUserDataForm((prev) => !prev);
    setShowPasswordForm(false);
    setShowComments(false);
  };

  const handleToggleComments = () => {
    setShowComments((prev) => !prev);
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
    <>
      <Panel className="container mt-5 max-w-4xl">
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
      </Panel>

      {showPasswordForm && (
        <Dialog open={showPasswordForm} onOpenChange={handleTogglePasswordForm}>
          <DialogContent className="bg-white p-6">
            <ChangePasswordForm onClose={handleTogglePasswordForm} />
            <button
              onClick={handleTogglePasswordForm}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </DialogContent>
        </Dialog>
      )}

      {showUserDataForm && (
        <Dialog open={showUserDataForm} onOpenChange={handleToggleUserDataForm}>
          <DialogContent className="bg-white p-6">
            <ChangeUserDataForm
              onClose={handleCloseAndRefresh}
              user={{
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
              }}
            />
            <button
              onClick={handleToggleUserDataForm}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </DialogContent>
        </Dialog>
      )}

      {showComments && (
        <Dialog open={showComments} onOpenChange={handleToggleComments}>
          <DialogContent className="bg-white p-6">
            <UserCommentsList userId={user.id} />
            <button
              onClick={handleToggleComments}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default UserProfilePage;
