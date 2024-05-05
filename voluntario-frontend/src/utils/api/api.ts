import axios, { AxiosRequestConfig } from 'axios';
import {
  AddParticipantParams as EventParticipantParams,
  LoginCredentialsParams,
  RegisterUserParams,
} from '../types/params';
import {EventLocationType, EventType, UserType} from '../types/types';
import { isValidDateString } from '../helpers';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // baseURL: "http://localhost:8080",
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

// Events
export const postEvent = async (data: EventType)=>
  axiosClient.post('/events', data);

export const postLocation = async (data: EventLocationType)=>
    axiosClient.post('/locations', data);

export const getLocations = async () =>
    axiosClient.get<EventLocationType[]>('/locations').then((res) => res.data);

export const getEvents = async () =>
  axiosClient.get<EventType[]>('/events').then((res) => res.data);

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
