import { DateTime } from 'luxon';
import { LocationType, EventType, EventStatus } from './types/types';
import { LatLngTuple } from 'leaflet';
// export function isValidDateString(dateString: unknown): boolean {
//   // return typeof dateString === 'string' && !isNaN(Date.parse(dateString));
//   return (
//     typeof dateString === 'string' &&
//     Object.prototype.toString.call(dateString) === '[object Date]' // &&
//     // !isNaN(dateString)
//   );
// }

// export function isValidDateString(dateString: unknown): boolean {
//   return dateString instanceof Date && !isNaN(dateString);
// }

export function isValidDateString(dateString: unknown): boolean {
  if (typeof dateString !== 'string') return false;
  const parsedDate = DateTime.fromISO(dateString);
  return parsedDate.isValid;
}

export function getLocationString(location?: LocationType): string {
  if (!location) return 'Nieznana lokalizacja';
  return `${location.name}, ul ${location.street} ${location.number} ${location.city}`;
}

export const getEventPosition = (event: EventType) => {
  if (!event.location || !event.location.latitude || !event.location.longitude)
    return null;
  return [event.location.latitude, event.location.longitude] as LatLngTuple;
};

export const isEventActive = (status: EventStatus): boolean => {
  return status === EventStatus.NOT_COMPLETED;
};

export const isEventFinished = (status: EventStatus): boolean => {
  // console.log(
  //   status,
  //   EventStatus.COMPLETED,
  //   EventStatus.EVALUATED,
  //   EventStatus.CANCELED,
  // );
  if (
    status === EventStatus.COMPLETED ||
    status === EventStatus.EVALUATED ||
    status === EventStatus.CANCELED
  )
    return true;
  else return false;
  // switch (status) {
  //   case EventStatus.COMPLETED:
  //   case EventStatus.EVALUATED:
  //   case EventStatus.CANCELED:
  //     return true;
  //   default:
  //     return false;
  // }
};

export function getEnumValue<T>(enumObj: T, key: string): T[keyof T] {
  return enumObj[key as keyof T];
  // if (key typeof ) return null;
  // return enumObj[key];
}

// export function getEventStatus<T>(status: EventStatus): T[keyof T] {
//   return T[status];
// }
