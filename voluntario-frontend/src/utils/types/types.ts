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

export enum EventStatus {
  NOT_COMPLETED = 'Niezakończone',
  COMPLETED = 'Zakończone',
  EVALUATED = 'Ocenione',
  CANCELED = 'Anulowane',
}

export type EventType = {
  id: number;
  name: string;
  description: string;
  organization: OrganizationType;
  participants: ParticipantType[];
  numberOfVolunteersNeeded: number;
  startDate: Date;
  endDate: Date;
  location: LocationType;
  status: EventStatus;
};

export type UserParticipationType = {
  userId: number;
  eventId: number;
  rating: number;
  comment: string;
};

export interface OrganizationType {
  id: number;
  name: string;
  description: string;
  krs: string;
  address: string;
  website: string;
}

export type ParticipantType = {
  userId: number;
  eventId: number;
  email: string;
  name: string;
  phoneNumber: string;
  gender: 'male' | 'female';
};

export enum ComplaintStatusType {
  RESOLVED = "RESOLVED", TO_REVIEW = "TO_REVIEW", UNDER_REVIEW = "UNDER_REVIEW"
}

export type ComplaintType = {
  id: number,
  reporter: UserType,
  textComplaint: string,
  reported: UserType,
  reportDate: Date,
  claimDate: Date,
  resolveDate: Date,
  status: ComplaintStatusType,
  response: string,
  adminID?: number,
  version?: number
}

// export type ComplaintPostType = {
//   reportedID: number,
//   text: string,
// }

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

export type LocationType = {
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
  organization: OrganizationType;
  event: EventType;
  wasEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type ScoreType = {
  userId: number;
  fullName: string;
  points: number;
  rating: number;
  numberOfCompletedEvents: number;
};

export type UserEvaluationType = {
  userId: number;
  rating: number;
  comment: string;
};

export type Page<T = null> = {
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
