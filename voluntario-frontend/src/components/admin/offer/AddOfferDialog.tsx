import { Button } from '../../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';
import { Input } from '../../ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addOffer } from '@/utils/api/api';
import { useState } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import DatePicker from 'react-datepicker';

const AddOfferForm = z.object({
  offer: z.object({
    name: z.string(),
    description: z.string(),
    sponsorID: z.number(),
    endDate: z.date(),
    pointsCost: z.number().positive(),
  }),
  promoCode: z.object({
    offerID: z.number(),
    promoCodeType: z.enum(['percentage', 'value']),
    discount: z.number().positive(),
    maxUsages: z.number().min(1),
    expirationDate: z.date(),
  }),
  numberOfPromoCodes: z.number().min(1),
});

type AddOfferFormType = z.infer<typeof AddOfferForm>;

export const AddOfferDialog = () => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<AddOfferFormType>({
    resolver: zodResolver(AddOfferForm),
    defaultValues: {
      offer: {
        name: '',
        description: '',
        sponsorID: 0,
        endDate: new Date(),
        pointsCost: 0,
      },
      promoCode: {
        offerID: 0,
        promoCodeType: 'percentage',
        discount: 0,
        maxUsages: 1,
        expirationDate: new Date(),
      },
      numberOfPromoCodes: 1,
    },
  });

  const { mutate: addOfferMutate } = useMutation({
    mutationFn: addOffer,
    onSuccess: () => {
      console.log('Offer added');
      queryClient.refetchQueries({ queryKey: ['offers'] });
    },
  });

  const handleAddOffer = (values: AddOfferFormType) => {
    console.log('Add offer: ' + JSON.stringify(values));
    addOfferMutate({
      ...values,
      offer: {
        ...values.offer,
        sponsorID: Number(values.offer.sponsorID),
        pointsCost: Number(values.offer.pointsCost),
      },
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Form {...form}>
        <form
          id="add-offer-form"
          className="space-y-3"
          onSubmit={form.handleSubmit(handleAddOffer)}
        >
          <DialogTrigger asChild>
            <Button variant={'secondary'}>Dodaj ofertę</Button>
          </DialogTrigger>
          <DialogContent className="h-3/4 overflow-auto">
            <DialogHeader>
              <DialogTitle>Dodaj ofertę</DialogTitle>
            </DialogHeader>
            <FormField
              name="offer.name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nazwa oferty</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription className="text-destructive">
                    {form.formState.errors.offer?.name?.message}
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              name="offer.description"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opis</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription className="text-destructive">
                    {form.formState.errors.offer?.description?.message}
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              name="offer.sponsorID"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  {/* TODO: Add sponsor select */}
                  <FormLabel>Sponsor</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) => {
                        if (isNaN(parseInt(e.target.value))) return;
                        field.onChange(parseInt(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormDescription className="text-destructive">
                    {form.formState.errors.offer?.sponsorID?.message}
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              name="offer.endDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data końcowa</FormLabel>
                  <FormControl>
                    <DatePicker
                      selected={field.value}
                      onChange={field.onChange}
                      showTimeSelect
                      dateFormat="dd.MM.yyyy hh:mm"
                      className="rounded-lg border p-2"
                    />
                  </FormControl>
                  <FormDescription className="text-destructive">
                    {form.formState.errors.offer?.endDate?.message}
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              name="offer.pointsCost"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Potrzebne punkty</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) => {
                        if (isNaN(parseInt(e.target.value))) return;
                        field.onChange(parseInt(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormDescription className="text-destructive">
                    {form.formState.errors.offer?.pointsCost?.message}
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              name="promoCode.promoCodeType"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  {/* TODO: Add radio buttons */}
                  <FormLabel>Typ kodu promocyjnego</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription className="text-destructive">
                    {form.formState.errors.promoCode?.promoCodeType?.message}
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              name="promoCode.discount"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zniżka</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) => {
                        if (isNaN(parseInt(e.target.value))) return;
                        field.onChange(parseInt(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormDescription className="text-destructive">
                    {form.formState.errors.promoCode?.discount?.message}
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              name="promoCode.maxUsages"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maksymalne użycia</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) => {
                        if (isNaN(parseInt(e.target.value))) return;
                        field.onChange(parseInt(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormDescription className="text-destructive">
                    {form.formState.errors.promoCode?.maxUsages?.message}
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              name="promoCode.expirationDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data ważności</FormLabel>
                  <FormControl>
                    <DatePicker
                      selected={field.value}
                      onChange={field.onChange}
                      showTimeSelect
                      dateFormat="dd.MM.yyyy hh:mm"
                      className="rounded-lg border p-2"
                    />
                  </FormControl>
                  <FormDescription className="text-destructive">
                    {form.formState.errors.promoCode?.expirationDate?.message}
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              name="numberOfPromoCodes"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ilość kodów promocyjnych</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) => {
                        if (isNaN(parseInt(e.target.value))) return;
                        field.onChange(parseInt(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormDescription className="text-destructive">
                    {form.formState.errors.numberOfPromoCodes?.message}
                  </FormDescription>
                </FormItem>
              )}
            />
            <DialogFooter className="flex">
              <DialogClose asChild>
                <Button variant="secondary">Anuluj</Button>
              </DialogClose>
              <Button form="add-offer-form" type="submit">
                Dodaj
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Form>
    </Dialog>
  );
};
