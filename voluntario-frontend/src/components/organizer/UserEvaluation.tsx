import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../ui/button';
import { H4 } from '../ui/typography/heading';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postUserEvaluation } from '@/utils/api/api';
import { ParticipantType } from '@/utils/types/types';
import React from 'react';
import { AxiosError } from 'axios';

const formSchema = z.object({
  rating: z
    .number()
    .min(1, {
      message: 'Ocena musi być między 1 a 5.',
    })
    .max(5, {
      message: 'Ocena musi być między 1 a 5.',
    }),
  comment: z.string(),
});

export const UserEvaluation: React.FC<{ participant: ParticipantType }> = ({
  participant,
}) => {
  const queryClient = useQueryClient();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 1,
      comment: '',
    },
  });

  const { mutate: evaluateUserMutate } = useMutation({
    mutationFn: postUserEvaluation,
    onSuccess: (_, variable) => {
      console.log('User evaluated', variable);
      queryClient.refetchQueries({
        queryKey: ['organizer', 'participants', participant.eventId],
      });
    },
    onError: (error) => {
      const e = error as AxiosError;
      console.error('Error evaluating user', e.response?.data);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    evaluateUserMutate({
      userId: participant.userId,
      eventId: participant.eventId,
      ...values,
    });
  }

  return (
    <Form {...form}>
      <H4 className="text-center">Oceń wolontariusza:</H4>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col space-y-4"
      >
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2">
                <FormLabel htmlFor="rating">Ocena:</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    id="rating"
                    min={1}
                    max={5}
                    className="w-16"
                    onChange={(e) => {
                      if (isNaN(parseInt(e.target.value))) return;
                      field.onChange(parseInt(e.target.value));
                    }}
                  />
                </FormControl>
              </div>
              {form.formState.errors.rating && (
                <FormDescription className="text-destructive">
                  {form.formState.errors.rating.message}
                </FormDescription>
              )}
              <FormDescription>Wpisz ocenę od 1 do 5</FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="comment">Komentarz:</FormLabel>
              <FormControl>
                <Textarea id="comment" {...field} />
              </FormControl>
              {form.formState.errors.comment && (
                <FormDescription className="text-destructive">
                  {form.formState.errors.comment.message}
                </FormDescription>
              )}
              <FormDescription>Wpisz komentarz o wolontariuszu</FormDescription>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mx-auto w-1/2 min-w-fit"
          variant={'secondary'}
        >
          Oceń
        </Button>
      </form>
    </Form>
  );
};
