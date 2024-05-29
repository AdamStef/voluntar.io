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

export type EvaluateUserParams = {
  userId: number;
  eventId: number;
  rating: number;
  comment: string;
};

export type AddOfferParams = {
  offer: {
    name: string;
    description: string;
    sponsorID: number;
    endDate: Date;
    pointsCost: number;
  };
  promoCode: {
    offerID: number;
    promoCodeType: 'percentage' | 'value';
    discount: number;
    maxUsages: number;
    expirationDate: Date;
  };
  numberOfPromoCodes: number;
};
