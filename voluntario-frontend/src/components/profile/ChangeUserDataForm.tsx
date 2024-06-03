import React, { HTMLProps, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { changeUserData } from '@/utils/api/api';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/Spinner';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const validationSchema = z.object({
  firstName: z.string().min(1, 'Imię jest wymagane'),
  lastName: z.string().min(1, 'Nazwisko jest wymagane'),
  email: z.string().email('Nieprawidłowy adres email'),
  phoneNumber: z.string().min(1, 'Numer telefonu jest wymagany'),
});

type ChangeUserDataFormSchema = z.infer<typeof validationSchema>;

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
};

type Props = {
  className?: HTMLProps<HTMLElement>['className'];
  onClose: () => void;
  user: User;
};

const ChangeUserDataForm: React.FC<Props> = ({ className, onClose, user }) => {
  const form = useForm<ChangeUserDataFormSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
  });

  const { toast } = useToast();

  useEffect(() => {
    form.reset({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  }, [form, user]);

  const onSubmit = async (data: ChangeUserDataFormSchema) => {
    try {
      await changeUserData(data);
      toast({
        title: 'Sukces!',
        description: 'Dane użytkownika zostały zmienione.',
      });
      onClose();
    } catch (error) {
      form.setError('root.serverError', {
        type: 'manual',
        message: 'Nie udało się zmienić danych. Spróbuj ponownie później.',
      });
      toast({
        title: 'Błąd',
        description: 'Nie udało się zmienić danych. Spróbuj ponownie później.',
      });
    }
  };

  const {
    formState: { errors, isSubmitting },
  } = form;

  return (
    <Form {...form}>
      <form
        className={cn('mx-auto max-w-sm space-y-3', className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          name="firstName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Imię</FormLabel>
              <FormControl>
                <Input placeholder="Podaj imię" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="lastName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwisko</FormLabel>
              <FormControl>
                <Input placeholder="Podaj nazwisko" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Podaj email" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="phoneNumber"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numer telefonu</FormLabel>
              <FormControl>
                <Input
                  placeholder="Podaj numer telefonu"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit">
          {isSubmitting && <Spinner className="mr-1 text-white" />}
          Zmień dane
        </Button>
        {errors.root?.serverError && (
          <p className="text-center text-sm text-destructive">
            {errors.root.serverError.message}
          </p>
        )}
      </form>
    </Form>
  );
};

export default ChangeUserDataForm;
