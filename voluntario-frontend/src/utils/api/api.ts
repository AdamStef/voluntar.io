import axios, { AxiosRequestConfig } from 'axios';
import {
  AddParticipantParams as EventParticipantParams,
  LoginCredentialsParams,
  RegisterUserParams,
  RegisterOrganizationParams,
  EvaluateUserParams,
  AddOfferParams,
} from '../types/params';
import {
  EventPostType,
  Page,
  EventType,
  UserType,
  EventFormType,
  ComplaintType,
  LocationType,
  ParticipantType,
  ScoreType,
  EventStatus,
  ComplaintPostType,
  SponsorType,
  OfferType,
  PromoCodeType,
  PromoCodePossessionType,
} from '../types/types';
import { convertDates } from '../helpers';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptors
axiosClient.interceptors.response.use(
  (response) => {
    response.data = convertDates(response.data);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

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

// export const getEvents = async (page: number, search: string) =>
//   axiosClient
//     .get<Page<EventType>>(`/events?page=${page}&search=${search}`)
//     .then((res) => res.data);
// .then((res) => res.data.content.map((event) => eventSchema.parse(event)));

export const getEvents = async (
  page: number,
  search: string,
  // status?: EventStatus,
) =>
  axiosClient
    .get<Page<EventType>>(`/events?page=${page}&search=${search}`)
    .then((res) => res.data);
// ${status != undefined && '&status=' + status}

export const getEventsByStatus = async (
  page: number,
  search: string,
  status: EventStatus,
) =>
  axiosClient
    .get<
      Page<EventType>
    >(`/events?page=${page}&search=${search}&status=${status}`)
    .then((res) => res.data);

export const getAllEvents = async (search: string, status: EventStatus) =>
  axiosClient
    .get<EventType[]>(`/events/all?search=${search}&status=${status}`)
    .then((res) => res.data);

export const getOrganizerEvents = async () =>
  axiosClient.get<EventType[]>(`/events/organization`).then((res) => res.data);

export const getUserEvents = async () =>
  axiosClient.get<EventType[]>(`/events/user`).then((res) => res.data);

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

export const postCompleteEvent = async (id: string) =>
  axiosClient.post(`/events/${id}/complete`);

export const postUserEvaluation = async ({
  userId,
  eventId,
  rating,
  comment,
}: EvaluateUserParams) =>
  axiosClient.post(`/events/${eventId}/evaluation`, {
    userId,
    rating,
    comment,
  });

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

export const getComplaints = async () =>
  axiosClient.get<ComplaintType[]>('/complaints/').then((res) => res.data);

export const getUnderReviewComplaints = async () =>
  axiosClient
    .get<ComplaintType[]>('/complaints/underReview')
    .then((res) => res.data);

export const getToReviewComplaints = async () =>
  axiosClient
    .get<ComplaintType[]>('/complaints/toReview')
    .then((res) => res.data);

export const getResolvedComplaints = async () =>
  axiosClient
    .get<ComplaintType[]>('/complaints/resolved')
    .then((res) => res.data);

export const postComplaint = async (data: ComplaintPostType) =>
  axiosClient.post('/complaints/', data);

export const resolveComplaint = async ({
  complaintId,
  response,
}: {
  complaintId: number;
  response: ComplaintType;
}) => axiosClient.post(`/complaints/resolve/${complaintId}`, response);

export const claimComplaint = async (complaintId: string) =>
  axiosClient.post(`/complaints/claim/${complaintId}`);

export const getUsers = async () =>
  axiosClient.get(`/users/all`).then((res) => res.data);

export const getOrganizations = async () =>
  axiosClient.get(`/organizations`).then((res) => res.data);

export const getUnverifiedOrganizations = async () =>
  axiosClient.get(`/organizations/unverified`).then((res) => res.data);

export const getUserOrganization = async (userId: number) =>
  axiosClient.get(`/organizations/user/${userId}`).then((res) => res.data);

export const verifyOrganization = async (organizationId: number) =>
  axiosClient.post(`/organizations/verify/${organizationId}`);

//sponsors

export const getAllSponsors = async () =>
  axiosClient
    .get<SponsorType[]>(`/points-shop/sponsors`)
    .then((res) => res.data);

export const addSponsor = async ({ name }: { name: string }) =>
  axiosClient.post(`/points-shop/sponsors`, { name });

//offers
export const getAllOffers = async () =>
  axiosClient.get<OfferType[]>(`/points-shop/offers`).then((res) => res.data);

export const getActiveOffers = async () =>
  axiosClient
    .get<OfferType[]>(`/points-shop/offers/active`)
    .then((res) => res.data);

export const addOffer = async (request: AddOfferParams) =>
  axiosClient.post<AddOfferParams>(`/points-shop/offers`, request);

export const claimOffer = async (offerId: number) =>
  axiosClient.post(`/points-shop/offers/${offerId}/assign`);

export const deleteOffer = async (offerId: number) =>
  axiosClient.delete(`/points-shop/offers/${offerId}`);

//points
export const getCurrentPoints = async () =>
  axiosClient
    .get<number>(`/points-shop/current-points`)
    .then((res) => res.data);

//promo codes
export const getMyPromoCodes = async () =>
  axiosClient
    .get<PromoCodeType[]>(`/points-shop/my-promo-codes?active=true`)
    .then((res) => res.data);

// export const usePromoCode = async (code: string) =>
//   axiosClient.post(`/points-shop/promo-codes/${code}/use`);

export const checkPromoCodePossession = async (code: string) =>
  axiosClient.get<PromoCodePossessionType>(
    `/points-shop/promo-codes/${code}/check`,
  );

export const getPromoCode = async (code: string) =>
  axiosClient.get<PromoCodeType>(`/points-shop/promo-codes/${code}`);

export const redeemPromoCode = async (code: string) =>
  axiosClient.post(`/points-shop/promo-codes/${code}/redeem`);
