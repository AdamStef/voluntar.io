import { Role } from './types';

export type LoginCredentialsParams = {
  email: string;
  password: string;
};

export type RegisterUserParams = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: 'MALE' | 'FEMALE';
  email: string;
  password: string;
  role: Role;
};

export type RegisterOrganizationParams = {
  krs: string;
  name: string;
  description: string;
  address: string;
  website: string;
};

export type AddParticipantParams = {
  eventId: string;
  participantId: number;
};
