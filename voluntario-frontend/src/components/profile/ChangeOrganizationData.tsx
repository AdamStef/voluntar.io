import React, { HTMLProps, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateOrganizationData, getOrganizationData } from '@/utils/api/api';
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
  name: z.string().min(1, 'Nazwa organizacji jest wymagana'),
  website: z.string().url('Nieprawidłowy adres URL'),
});

type ChangeOrganizationDataFormSchema = z.infer<typeof validationSchema>;

type Props = {
  className?: HTMLProps<HTMLElement>['className'];
  organizationId: number;
};

const ChangeOrganizationDataForm: React.FC<Props> = ({
  className,
  organizationId,
}) => {
  const [initialData, setInitialData] =
    useState<ChangeOrganizationDataFormSchema | null>(null);
  console.log(initialData);
  const form = useForm<ChangeOrganizationDataFormSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: '',
      website: '',
    },
  });

  const { toast } = useToast();

  useEffect(() => {
    const fetchOrganizationData = async () => {
      try {
        const response = await getOrganizationData(organizationId);
        const organizationData = response.data;
        setInitialData({
          name: organizationData.name,
          website: organizationData.website,
        });
        form.reset({
          name: organizationData.name,
          website: organizationData.website,
        });
      } catch (error) {
        console.error(
          'Nie udało się pobrać danych organizacji. Spróbuj ponownie później.',
          error,
        );
        toast({
          title: 'Błąd',
          description:
            'Nie udało się pobrać danych organizacji. Spróbuj ponownie później.',
        });
      }
    };

    fetchOrganizationData();
  }, [form, toast, organizationId]);

  const onSubmit = async (data: ChangeOrganizationDataFormSchema) => {
    try {
      await updateOrganizationData(organizationId, data);
      toast({
        title: 'Sukces!',
        description: 'Dane organizacji zostały zmienione.',
      });
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
                  placeholder="Podaj stronę internetową"
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

export default ChangeOrganizationDataForm;
