import {EventLocationType, Role, UserType} from './types';

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

export type AddParticipantParams = {
  eventId: string;
  participantId: string;
};
