import {Button} from '@/components/ui/button';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form';
import {fromAddress, OutputFormat, setDefaults} from "react-geocode";
import 'react-datepicker/dist/react-datepicker.css';
import {Input} from '@/components/ui/input';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import DatePicker from 'react-datepicker';
import {z} from 'zod';
import React, {HTMLProps} from 'react';
import {cn} from '@/lib/utils';
import 'leaflet/dist/leaflet.css';
import {EventFormType} from '@/utils/types/types';
import {postEvent} from '@/utils/api/api';
import {Spinner} from '../ui/Spinner';
import 'react-toastify/dist/ReactToastify.css';

setDefaults({
    key: "AIzaSyB6ePRA6ILkM7mjRbQ-9OoPYZiKUQz-ZB8",
    language: "pl",
    region: "pl",
    outputFormat: OutputFormat.JSON,
})

const locationSchema = z.object({
  name: z.string().min(1, "Nazwa lokalizacji jest wymagana"),
  postalCode: z.string(),
  city: z.string().min(1, "Nazwa miasta jest wymagana"),
  street: z.string().min(1, "Nazwa ulicy jest wymagana"),
  number: z.string().min(1, "Numer ulicy jest wymagany"),
  flatNumber: z.string(), // może być np. 2A więc lepiej string
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  additionalInformation: z.string(),
});

const eventSchema = z
  .object({
    name: z.string().min(1, "Nazwa wydarzenia jest wymagana"),
    description: z.string().min(1, "Opis wydarzenia jest wymagany"),
    startDate: z.date(),
    endDate: z.date(),
    numberOfVolunteersNeeded: z.coerce.number().min(1, "Liczba wolontariuszy musi być większa od 0"),
    location: locationSchema,
  })
  .refine((data) => data.startDate < data.endDate, {
    message: 'Data zakończenia musi być później',
    path: ['endDate'],
  });

type EventFormSchema = z.infer<typeof eventSchema>;

type Props = {
  className?: HTMLProps<HTMLElement>['className'];
};

const AddEventForm: React.FC<Props> = ({ className }) => {
  const form = useForm<EventFormSchema>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(),
      numberOfVolunteersNeeded: 0,
      location: {
        additionalInformation: '',
        name: '',
        postalCode: '',
        latitude: 52,
        longitude: 20,
        city: '',
        street: '',
        number: '',
        flatNumber: '',
      },
    },
  });

  const {
    formState: { errors, isSubmitting },
  } = form;

  const navigate = useNavigate();

    const onSubmit = async (data: EventFormType) => {
        const req: EventFormType = { ...data };

        console.log(`location to find: ${req.location.city}, ${req.location.street} ${req.location.number}`);

        try {
            try {
                const { results } = await fromAddress(`${req.location.city}, ${req.location.street} ${req.location.number}`);
                const { lat, lng } = results[0].geometry.location;
                console.log(lat, lng);
                req.location.latitude = lat;
                req.location.longitude = lng;
            } catch (error) {
                console.error('Error fetching address:', error);
                form.setError('root.serverError', {
                    type: 'manual',
                    message: 'Failed to fetch address coordinates',
                });
                // return;
            }

            console.log('Add event: ' + JSON.stringify(req));
            await postEvent(req);
            navigate('/organizer');
        } catch (error) {
            console.error('Error posting event:', error);
            form.setError('root.serverError', {
                type: 'manual',
                message: 'Something went wrong',
            });
        }
    };

  return (
    <Form {...form}>
      <form
        className={cn('gap-2 md:grid md:grid-cols-2', className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
          <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                  <FormItem className="col-span-2">
                      <FormLabel>Nazwa wydarzenia</FormLabel>
                      <FormControl>
                          <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              )}
          />

          <FormField
              name="description"
              control={form.control}
              render={({ field }) => (
                  <FormItem className="col-span-2">
                      <FormLabel>Opis wydarzenia</FormLabel>
                      <FormControl>
                          <Input type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              )}
          />

          <FormField
              name="startDate"
              control={form.control}
              render={({ field }) => (
                  <FormItem>
                      <FormLabel>
                          Data rozpoczęcia
                          <br />
                      </FormLabel>
                      <FormControl>
                          <DatePicker
                              selected={field.value}
                              onChange={field.onChange}
                              showTimeSelect
                              timeFormat="HH:mm"
                              dateFormat="dd.MM.yyyy HH:mm"
                              className="rounded-lg border p-2"
                          />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              )}
          />

          <FormField
              name="endDate"
              control={form.control}
              render={({ field }) => (
                  <FormItem>
                      <FormLabel>
                          Data zakończenia
                          <br />
                      </FormLabel>
                      <FormControl>
                          <DatePicker
                              selected={field.value}
                              onChange={field.onChange}
                              showTimeSelect
                              timeFormat="HH:mm"
                              dateFormat="dd.MM.yyyy HH:mm"
                              className="rounded-lg border p-2"
                          />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              )}
          />

          <FormField
              name="numberOfVolunteersNeeded"
              control={form.control}
              render={({ field }) => (
                  <FormItem>
                      <FormLabel>Liczba wolontariuszy</FormLabel>
                      <FormControl>
                          <Input className="w-1/3" type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                  </FormItem>
              )}
          />
          <p></p>
          <p className="font-bold">Informacje dotyczące miejsca: </p>

        <FormField
          name="location.name"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Miejsce wydarzenia</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Nazwa miejsca, nie adres..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="location.postalCode"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kod pocztowy</FormLabel>
              <FormControl>
                <Input placeholder="np. 90-100" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="location.city"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Miasto</FormLabel>
              <FormControl>
                <Input placeholder="" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="location.street"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ulica</FormLabel>
              <FormControl>
                <Input placeholder="" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="location.number"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-start-1">
              <FormLabel>Numer budynku</FormLabel>
              <FormControl>
                <Input
                  className="w-1/3"
                  placeholder=""
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="location.flatNumber"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numer lokalu</FormLabel>
              <FormControl>
                <Input
                  className="w-1/3"
                  placeholder=""
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/*hidden bo bez nich nie działało a po co to pokazywać*/}
        {/*<FormField*/}
        {/*  name="location.latitude"*/}
        {/*  control={form.control}*/}
        {/*  render={({ field }) => (*/}
        {/*    <FormItem className="hidden">*/}
        {/*      <FormLabel>Szerokość geograficzna</FormLabel>*/}
        {/*      <FormControl>*/}
        {/*        <Input*/}
        {/*          disabled*/}
        {/*          placeholder=""*/}
        {/*          type="text"*/}
        {/*          {...field}*/}
        {/*          value={currentPos.lat}*/}
        {/*        />*/}
        {/*      </FormControl>*/}
        {/*      <FormMessage />*/}
        {/*    </FormItem>*/}
        {/*  )}*/}
        {/*/>*/}

        {/*<FormField*/}
        {/*  name="location.longitude"*/}
        {/*  control={form.control}*/}
        {/*  render={({ field }) => (*/}
        {/*    <FormItem className="hidden">*/}
        {/*      <FormLabel>Długość geograficzna</FormLabel>*/}
        {/*      <FormControl>*/}
        {/*        <Input*/}
        {/*          disabled*/}
        {/*          placeholder=""*/}
        {/*          type="number"*/}
        {/*          {...field}*/}
        {/*          value={currentPos.lng}*/}
        {/*        />*/}
        {/*      </FormControl>*/}
        {/*      <FormMessage />*/}
        {/*    </FormItem>*/}
        {/*  )}*/}
        {/*/>*/}

        {/*<FormField*/}
        {/*  name="location.additionalInformation"*/}
        {/*  control={form.control}*/}
        {/*  render={({ field }) => (*/}
        {/*    <FormItem className="col-span-2">*/}
        {/*      <FormLabel>Dodatkowe informacje</FormLabel>*/}
        {/*      <FormControl>*/}
        {/*        <Input*/}
        {/*          placeholder="np. wskazówki jak dotrzeć..."*/}
        {/*          type="text"*/}
        {/*          {...field}*/}
        {/*        />*/}
        {/*      </FormControl>*/}
        {/*      <FormMessage />*/}
        {/*    </FormItem>*/}
        {/*  )}*/}
        {/*/>*/}


        <div className="col-span-2 flex justify-center">
          <Button className="col-span-2 mx-auto my-2 w-40" type="submit">
            {isSubmitting && <Spinner className="mr-1 text-white" />}
            Dodaj wydarzenie
          </Button>
          {errors.root?.serverError && (
            <p className="text-center text-sm text-destructive">
              {errors.root.serverError.message}
            </p>
          )}
        </div>
      </form>
    </Form>
  );
};

export default AddEventForm;
