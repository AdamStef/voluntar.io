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
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import React, { HTMLProps } from 'react';
import { cn } from '@/lib/utils';
import { updateOrganizationData } from '@/utils/api/api';
import { Spinner } from '../ui/Spinner';

const validationSchema = z.object({
  name: z.string().nonempty({ message: 'Nazwa jest wymagana' }),
  website: z.string().url({ message: 'Podaj prawidłowy URL' }),
});

type ChangeOrganizationDataSchema = z.infer<typeof validationSchema>;

type Props = {
  className?: HTMLProps<HTMLElement>['className'];
  organizationId: number;
};

const ChangeOrganizationDataForm: React.FC<Props> = ({
  className,
  organizationId,
}) => {
  const form = useForm<ChangeOrganizationDataSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: '',
      website: '',
    },
  });

  const onSubmit = async (data: ChangeOrganizationDataSchema) => {
    try {
      await updateOrganizationData(organizationId, data);
      window.location.reload(); // Refresh the page after successful update
    } catch (error) {
      console.error(error);
      form.setError('root.serverError', {
        type: 'manual',
        message: 'Coś poszło nie tak, spróbuj ponownie.',
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
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nazwa organizacji</FormLabel>
              <FormControl>
                <Input
                  placeholder="Podaj nazwę organizacji"
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="website"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Strona internetowa</FormLabel>
              <FormControl>
                <Input
                  placeholder="Podaj URL strony internetowej"
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
          Zaktualizuj dane
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

export default ChangeOrganizationDataForm;
