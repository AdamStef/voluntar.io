export enum Role {
  ADMIN = 'ADMIN',
  ORGANIZATION = 'ORGANIZATION',
  VOLUNTEER = 'VOLUNTEER',
}

export type UserType = {
  id: number;
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
  organizer?: UserType;
  numberOfVolunteersNeeded: number;
  participants: UserType[];
  startDate: Date;
  endDate: Date;
  location: EventLocationType;
};

export type OrganisationType = {
  id: number;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  krs: string;
  organisationName: string;
  organisationDescription: string;
  website: string;
};

export type ParticipantType = {
  id: number;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  gender: 'male' | 'female';
  eventId: number;
  eventName: string;
  eventStartDate: Date;
  eventEndDate: Date;
};

export type EventFormType = {
  name: string;
  description: string;
  numberOfVolunteersNeeded: number;
  startDate: Date;
  endDate: Date;
  location: {
    name: string;
    city: string;
    postalCode: string;
    street: string;
    number: string;
    flatNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    additionalInformation?: string | null;
  };
};

export type EventLocationType = {
  id: number;
  name: string;
  city: string;
  postalCode: string;
  street: string;
  number: string;
  flatNumber?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  additionalInformation?: string | null;
};

export type EventPostType = {
  id: number;
  content: string;
  organizer: OrganisationType;
  event: EventType;
  wasEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type Page<T> = {
  content: T[]; // Array of items in the current page
  pageable: Pageable; // Information about pagination
  totalPages: number; // Total number of pages
  totalElements: number; // Total number of elements across all pages
  last: boolean; // Whether this is the last page
  first: boolean; // Whether this is the first page
  size: number; // Number of items in the current page
  number: number; // Current page number
  sort: Sort; // Information about sorting
  numberOfElements: number; // Number of items in the current page
  empty: boolean; // Whether the page is empty
};

export type Pageable = {
  sort: Sort;
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
};

export type Sort = {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
};
