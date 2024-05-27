import axios, { AxiosRequestConfig } from 'axios';
import {
  AddParticipantParams as EventParticipantParams,
  LoginCredentialsParams,
  RegisterUserParams,
  RegisterOrganizationParams,
} from '../types/params';
import {
  EventPostType,
  Page,
  EventType,
  UserType,
  EventFormType,
  LocationType,
  ParticipantType,
  ScoreType,
  // eventSchema,
} from '../types/types';
import { isValidDateString } from '../helpers';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// const isIsoDateString = (value: unknown): value is string => {
//   return typeof value === 'string' && ISODateFormat.test(value);
// };

const handleDates = (data: unknown) => {
  if (isValidDateString(data)) return new Date(data as string);
  if (data === null || data === undefined || typeof data !== 'object')
    return data;

  for (const [key, val] of Object.entries(data)) {
    // @ts-expect-error this is a hack to make the type checker happy
    if (isValidDateString(val)) data[key] = new Date(val);
    else if (typeof val === 'object') handleDates(val);
  }

  return data;
};

// Interceptors
axiosClient.interceptors.response.use((rep) => {
  handleDates(rep.data);
  return rep;
});

// Auth
export const postLoginUser = async (data: LoginCredentialsParams) =>
  axiosClient.post('/auth/login', data);

export const postLogoutUser = async () => axiosClient.post('/auth/logout');

export const getAuthUser = async (config?: AxiosRequestConfig) =>
  axiosClient.get<UserType>('/auth/me', config);

export const postRegisterUser = async (data: RegisterUserParams) =>
  axiosClient.post('/auth/register', data);

export const postRegisterOrganization = async (
  data: RegisterOrganizationParams,
  userID: number,
) => axiosClient.post(`/organizations/registerOrganization/${userID}`, data);

// Events
export const postEvent = async (data: EventFormType) =>
  axiosClient.post('/events', data);

export const postLocation = async (data: LocationType) =>
  axiosClient.post('/locations', data);

export const getLocations = async () =>
  axiosClient.get<LocationType[]>('/locations').then((res) => res.data);

export const getEvents = async (page: number, search: string) =>
  axiosClient
    .get<Page<EventType>>(`/events?page=${page}&search=${search}`)
    .then((res) => res.data);
// .then((res) => res.data.content.map((event) => eventSchema.parse(event)));

export const getAllEvents = async () =>
  axiosClient.get(`/events/all`).then((res) => res.data);

export const getOrganizerEvents = async () =>
  axiosClient.get<EventType[]>(`/events/organization`).then((res) => res.data);

export const getEvent = async (id: string) =>
  axiosClient.get<EventType>(`/events/${id}`);

export const addParticipantToEvent = async ({
  eventId,
  participantId,
}: EventParticipantParams) =>
  axiosClient.post(`/events/${eventId}/participants/${participantId}`);

export const removeParticipantFromEvent = async ({
  eventId,
  participantId,
}: EventParticipantParams) =>
  axiosClient.delete(`/events/${eventId}/participants/${participantId}`);

export const getEventParticipants = async (eventId: number) =>
  axiosClient
    .get<ParticipantType[]>(`/events/${eventId}/participants`)
    .then((res) => res.data);

export const removeEvent = async (id: string) =>
  axiosClient.delete<EventType>(`/events/${id}`);

export const getEventPosts = async (eventId: string) =>
  axiosClient.get<EventPostType[]>(`/events/${eventId}/posts`);

export const getUser = async (userId: string) =>
  axiosClient.get<UserType>(`/users/${userId}`);

export const postEventPost = async ({
  eventId,
  content,
}: {
  eventId: string;
  content: string;
}) => axiosClient.post<EventPostType>(`/events/${eventId}/posts`, { content });

export const deletePost = async (postId: number) =>
  axiosClient.delete(`/posts/${postId}`);

// Leaderboard
export const getLeaderboard = async (): Promise<Page<ScoreType>> =>
  axiosClient.get<Page<ScoreType>>('/scores').then((res) => res.data);
