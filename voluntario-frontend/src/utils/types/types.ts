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
