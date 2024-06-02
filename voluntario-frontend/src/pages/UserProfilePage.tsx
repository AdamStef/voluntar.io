import React, { useEffect, useState } from 'react';
import { UserProfile } from '@/components/UserProfile';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import ChangeUserDataForm from '@/components/ChangeUserDataForm';
import { getAuthUser, getLeaderboard } from '@/utils/api/api';
import { Button } from '@/components/ui/button';
import { FaStar } from 'react-icons/fa';
import UserCommentsList from '@/components/events/UserCommentsList';

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

  if (!user) {
    return <div>Ładowanie</div>;
  }

  return (
    <div>
      <div className="mx-auto w-1/2 border-2 border-black p-4">
        <div className="mb-4 flex items-center">
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
        <div className="mb-6">
          <Button
            variant="outline"
            className="mr-2"
            onClick={handleTogglePasswordForm}
            // disabled={showUserDataForm}
          >
            Zmień hasło
          </Button>
          <Button
            variant="outline"
            className="mr-2"
            onClick={handleToggleUserDataForm}
            // disabled={showPasswordForm}
          >
            Zmień dane
          </Button>
          <Button
            variant="outline"
            onClick={handleToggleComments}
            // disabled={showPasswordForm || showUserDataForm}
          >
            {!showComments ? 'Pokaż komentarze' : 'Ukryj komentarze'}
          </Button>
        </div>
        {/* <div className="mb-4">
          <Button
            variant="outline"
            onClick={handleToggleComments}
            disabled={showPasswordForm || showUserDataForm}
          >
            {!showComments ? 'Pokaż komentarze' : 'Ukryj komentarze'}
          </Button>
        </div> */}
      </div>
      {showPasswordForm && <ChangePasswordForm />}
      {showUserDataForm && <ChangeUserDataForm />}
      {showComments && (
        <div className="border-1 mx-auto w-1/2 p-4">
          <UserCommentsList userId={user.id} />
        </div>
      )}
    </div>
  );
};
