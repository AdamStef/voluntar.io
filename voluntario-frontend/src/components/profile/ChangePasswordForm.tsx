import React, { HTMLProps } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { changeUserPassword } from '@/utils/api/api';
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

const validationSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ChangePasswordFormSchema = z.infer<typeof validationSchema>;

type Props = {
  className?: HTMLProps<HTMLElement>['className'];
  onClose: () => void;
};

const ChangePasswordForm: React.FC<Props> = ({ className, onClose }) => {
  const form = useForm<ChangePasswordFormSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { toast } = useToast();

  const onSubmit = async (data: ChangePasswordFormSchema) => {
    try {
      await changeUserPassword(data.newPassword);
      toast({
        title: 'Sukces!',
        description: 'Hasło zostało zmienione.',
      });
      onClose();
    } catch (error) {
      form.setError('root.serverError', {
        type: 'manual',
        message: 'Nie udało się zmienić hasła. Spróbuj ponownie później',
      });
      toast({
        title: 'Błąd',
        description: 'Nie udało się zmienić hasła. Spróbuj ponownie później.',
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
          name="newPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nowe hasło</FormLabel>
              <FormControl>
                <Input
                  placeholder="Podaj nowe hasło"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="confirmPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Potwierdź hasło</FormLabel>
              <FormControl>
                <Input
                  placeholder="Potwierdź nowe hasło"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit">
          {isSubmitting && <Spinner className="mr-1 text-white" />}
          Zmień hasło
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

export default ChangePasswordForm;
