import { DateTime } from 'luxon';
import { EventLocationType } from './types/types';
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
  return location
    ? `${location.name}, ul ${location.street} ${location.number} ${location.city}`
    : 'Nieznana lokalizacja';
}
