import { DateTime } from 'luxon';
import { EventLocationType, EventType } from './types/types';
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

export function getLocationString(location: EventLocationType): string {
  if (!location) return 'Nieznana';
  return `${location.name}, ul ${location.street} ${location.number} ${location.city}`;
}

export const getEventPosition = (event: EventType) => {
  if (!event.location || !event.location.latitude || !event.location.longitude)
    return null;
  return [event.location.latitude, event.location.longitude] as LatLngTuple;
};
