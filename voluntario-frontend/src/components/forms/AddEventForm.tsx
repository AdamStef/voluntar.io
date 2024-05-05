import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import 'react-datepicker/dist/react-datepicker.css'
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { RadioGroup } from '@radix-ui/react-radio-group';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import {date, z} from 'zod';
import { RadioGroupItem } from '../ui/radio-group';
import React, {HTMLProps, useState} from 'react';
import { cn } from '@/lib/utils';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useMapEvents } from 'react-leaflet/hooks';
import 'leaflet/dist/leaflet.css';
import { RegisterUserParams } from '@/utils/types/params';
import {EventType, Role} from '@/utils/types/types';
import {postEvent, postLocation, postRegisterUser} from '@/utils/api/api';
import { Spinner } from '../ui/Spinner';
import {useMutation} from "@tanstack/react-query/build/modern";
import axios from "axios";

const locationSchema = z.object(
    {
        name: z.string(),
        postalCode: z.string(),
        city: z.string(),
        street: z.string(),
        number: z.string(),
        flatNumber: z.string(), // może być np. 2A więc lepiej string
        latitude: z.number(),
        longitude: z.number(),
        additionalInformation: z.string(),
    }
)

const eventSchema = z
    .object({
        name: z.string(),
        description: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        // TODO: mapka a nie wspolrzedne xD
        numberOfVolunteersNeeded: z.number(),
        location: locationSchema
    });

type EventFormSchema = z.infer<typeof eventSchema>;

type Props = {
    className?: HTMLProps<HTMLElement>['className'];
};

const AddEventForm: React.FC<Props> = ({ className }) => {

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

     const form = useForm<EventFormSchema>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            name: 'a',
            description: 'b',
            startDate: new Date(),
            endDate: new Date(),
            numberOfVolunteersNeeded: 5,
            location: {
                additionalInformation: 'd',
                name: 'e',
                postalCode: 'f',
                latitude: 52,
                longitude: 20,
                city: 'g',
                street: 'h',
                number: 'i',
                flatNumber: 'j' // może być np. 2A więc lepiej string
            }
        },
    });

    const { register,
            handleSubmit,
            formState: { errors, isSubmitting } } = form;

    const navigate = useNavigate();

    const onSubmit = async (data: EventType) => {
        const req: EventType = { ...data};
        console.log('Add event:  ' + JSON.stringify(req));
        try {
            await postEvent(req);
            // navigate('/login');
        } catch (error) {
            console.error(error);
            form.setError('root.serverError', {
                type: 'manual',
                message: 'Something went wrong',
            });
        }
    };

    return (
        <Form {...form}>
            <form
                className={cn('mx-auto max-w-sm space-y-3', className)}
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    name="location.name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nazwa miejsca</FormLabel>
                            <FormControl>
                                <Input placeholder="Nazwa miejsca" type="text" {...field} />
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
                                <Input placeholder="Kod pocztowy" type="text" {...field} />
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
                                <Input placeholder="Miasto" type="text" {...field} />
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
                        <FormItem>
                            <FormLabel>Numer budynku</FormLabel>
                            <FormControl>
                                <Input placeholder="" type="text" {...field} />
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
                                <Input placeholder="" type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="location.latitude"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem >
                            <FormLabel >Szerokość geograficzna</FormLabel>
                            <FormControl>
                                <Input placeholder="" type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="location.longitude"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem >
                            <FormLabel >Długość geograficzna</FormLabel>
                            <FormControl>
                                <Input placeholder="" type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="location.additionalInformation"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem >
                            <FormLabel >Dodatkowe informacje</FormLabel>
                            <FormControl>
                                <Input placeholder="Opisz coś..." type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/*<Map/>*/}
                <MapContainer
                    center={[0,0]}
                    zoom={15}
                    scrollWheelZoom={false}
                    style={{ width: '100%', height: '205px' }}>
                    <>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[0,0]} />
                    </>
                    {/*<LocationMarker/>*/}
                </MapContainer>

                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nazwa</FormLabel>
                            <FormControl>
                                <Input placeholder="Podaj nazwę wydarzenia" type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Opis</FormLabel>
                            <FormControl>
                                <Input placeholder="Opis wydarzenia" type="text" {...field} />
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
                            <FormLabel>Data rozpoczęcia<br/></FormLabel>
                            <FormControl>
                                <DatePicker selected={startDate} onChange={field.onChange} />
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
                            <FormLabel>Data zakończenia<br/></FormLabel>
                            <FormControl>
                                <DatePicker selected={endDate} onChange={field.onChange} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/*TODO: mapka*/}

                <FormField
                    name="numberOfVolunteersNeeded"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Liczba wolontariuszy</FormLabel>
                            <FormControl>
                                <Input placeholder="Liczba wolontariuszy" type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button className="w-40 col-span-2" type="submit">
                    {isSubmitting && <Spinner className="mr-1 text-white" />}
                    Dodaj wydarzenie
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

export default AddEventForm;
