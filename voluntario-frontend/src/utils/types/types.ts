export enum Role {
  ADMIN = 'admin',
  ORGANIZATION = 'organization',
  VOLUNTEER = 'volunteer',
}

export type UserType = {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: 'male' | 'female';
};

export type NavbarItemType = {
  name: string;
  path: string;
};

export type EventType = {
  id: number;
  name: string;
  description: string;
  organizer: UserType;
  numberOfVolunteersNeeded: number;
  participants: UserType[];
  startDate: Date;
  endDate: Date;
  location: EventLocationType;
};

export type EventLocationType = {
  id: number;
  name: string;
  city: string;
  postalCode: string;
  street: string;
  number: string;
  flatNumber?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  additionalInformation?: string | null;
};
