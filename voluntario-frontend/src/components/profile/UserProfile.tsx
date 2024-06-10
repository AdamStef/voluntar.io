import React from 'react';
import ManAvatar from '@/assets/man_avatar.png';
import WomanAvatar from '@/assets/woman_avatar.png';
import { Subpanel } from '../ui/Subpanel';

type UserProfileProps = {
  name: string;
  phoneNumber: string;
  email: string;
  gender: string;
};

export const UserProfile: React.FC<UserProfileProps> = ({
  name,
  phoneNumber,
  email,
  gender
}) => {
  const avatarSrc = gender == 'MALE' ? ManAvatar : WomanAvatar;

  return (
    <Subpanel className="flex h-full flex-col gap-2 p-2">
      <div className="flex gap-2 md:flex-col lg:flex-row">
        <img
          className="aspect-square h-16 w-16 rounded-sm border bg-white"
          src={avatarSrc}
          alt="Avatar"
        />
        <div className="flex flex-col">
          <p className="text-lg font-bold">{name}</p>
          <p className="">Telefon: {phoneNumber}</p>
          <p className="">E-mail: {email}</p>
        </div>
      </div>
    </Subpanel>
  );
};
