import React, { useEffect, useState } from 'react';
import { UserProfile } from '@/components/UserProfile';
import ChangePasswordForm from '@/components/ChangePasswordForm';
import ChangeUserDataForm from '@/components/ChangeUserDataForm';
import { getAuthUser, getUserScores } from '@/utils/api/api';

type UserType = {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
};

type User = {
  name: string;
  phoneNumber: string;
  email: string;
  firstName: string;
  lastName: string;
};

export const UserProfilePage: React.FC = () => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showUserDataForm, setShowUserDataForm] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userScores, setUserScores] = useState<number | null>(null);

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

        const scoresResponse = await getUserScores(userData.id);
        const totalScore = scoresResponse.reduce(
          (acc, score) => acc + score.score,
          0,
        );
        setUserScores(totalScore);
      } catch (error) {
        console.error(
          'Nie udało się pobrać danych użytkownika. Spróbuj ponownie później',
          error,
        );
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="border-2 border-black p-4">
      <div className="mb-4">
        <h2>Punkty użytkownika: {userScores !== null ? userScores : '0'}</h2>
      </div>
      <div className="mb-4">
        <UserProfile
          name={user.name}
          phoneNumber={user.phoneNumber}
          email={user.email}
        />
      </div>
      <div className="mb-4">
        <button
          className="mr-2 border-2 border-red-600 p-2"
          onClick={() => setShowPasswordForm(!showPasswordForm)}
        >
          Zmień hasło
        </button>
        <button
          className="border-2 border-green-600 p-2"
          onClick={() => setShowUserDataForm(!showUserDataForm)}
        >
          Zmień dane
        </button>
      </div>
      {showPasswordForm && <ChangePasswordForm />}
      {showUserDataForm && <ChangeUserDataForm />}
    </div>
  );
};
