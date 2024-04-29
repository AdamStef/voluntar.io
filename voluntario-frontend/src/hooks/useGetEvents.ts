import { getEvent } from '@/utils/api/api';
import { EventType } from '@/utils/types/types';
import { useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetEvent = (eventId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['events', eventId],
    queryFn: async () => {
      try {
        const res = await getEvent(eventId);
        return res.data;
      } catch (error) {
        throw new Error('Nie znaleziono wydarzenia');
      }
    },
    placeholderData: () => {
      return queryClient
        .getQueryData<EventType[]>(['events'])
        ?.find((d) => d.id.toString() === eventId);
    },
    // getEvent(eventId)
    //   .then((res) => res.data)
    //   // .then(() => new Promise((resolve) => setTimeout(resolve, 5000)))
    //   .catch(() => {
    //     // navigate('/not-found');
    //     throw new Error('Nie znaleziono wydarzenia');
    //   }),
    // initialData: {
    //   id: 0,
    //   name: '',
    //   description: '',
    //   startDate: new Date(),
    //   endDate: new Date(),
    //   location: {
    //     id: 0,
    //     name: '',
    //     city: '',
    //     postalCode: '',
    //     street: '',
    //     number: '',
    //   },
    // } as EventType,
  });

  return query;
};
