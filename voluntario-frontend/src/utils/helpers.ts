import moment from 'moment';
import { LocationType, EventType, EventStatus } from './types/types';
import { LatLngTuple } from 'leaflet';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isIsoDateString = (value: any): boolean => {
  if (typeof value !== 'string') return false;
  const momentDate = moment(value, moment.ISO_8601, true);
  return momentDate.isValid();
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertDates = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map(convertDates);
  } else if (typeof obj === 'object') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newObj: any = {};
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (isIsoDateString(value)) {
        newObj[key] = new Date(value);
      } else if (typeof value === 'object') {
        newObj[key] = convertDates(value);
      } else {
        newObj[key] = value;
      }
    });
    return newObj;
  }
  return obj;
};

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
