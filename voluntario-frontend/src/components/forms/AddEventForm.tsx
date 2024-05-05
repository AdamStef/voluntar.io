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
        latitude: z.coerce.number(),
        longitude: z.coerce.number(),
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
        numberOfVolunteersNeeded: z.coerce.number(),
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
            name: '',
            description: '',
            startDate: new Date(),
            endDate: new Date(),
            numberOfVolunteersNeeded: 5,
            location: {
                additionalInformation: '',
                name: '',
                postalCode: '',
                latitude: 52,
                longitude: 20,
                city: '',
                street: '',
                number: '',
                flatNumber: ''
            }
        },
    });

    const { register,
            handleSubmit,
            formState: { errors, isSubmitting } } = form;

    const navigate = useNavigate();

    const onSubmit = async (data: EventType) => {
        const req: EventType = { ...data};
        req.location.latitude = currentPos[0];
        req.location.longitude = currentPos[1];
        console.log('Add event:  ' + JSON.stringify(req));
        try {
            await postEvent(req);
        } catch (error) {
            console.error(error);
            form.setError('root.serverError', {
                type: 'manual',
                message: 'Something went wrong',
            });
        }
    };

    const [currentPos, setCurrentPos] = useState([52, 20]);
    const LocationFinder = () => {
        const map = useMapEvents({
            click(e) {
                setCurrentPos([e.latlng.lat, e.latlng.lng])
                console.log(currentPos);
            },
        });
        return null;
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
                            <FormLabel>Miejsce wydarzenia</FormLabel>
                            <FormControl>
                                <Input type="text" {...field} />
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
                    name="location.flatNumber"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Wybierz punkt na mapie</FormLabel>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/*<Map/>*/}
                <MapContainer
                    center={currentPos}
                    zoom={15}
                    scrollWheelZoom={true}
                    style={{ width: '100%', height: '205px' }}>
                    <>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={currentPos} />
                    </>
                    <LocationFinder />
                </MapContainer>

                <FormField
                    name="location.latitude"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem >
                            <FormLabel >Szerokość geograficzna</FormLabel>
                            <FormControl>
                                <Input placeholder="" type="text" {...field} value={currentPos[1]}  />
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
                                <Input placeholder="" type="number" {...field} value={currentPos[0]} />
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
                                <Input placeholder="np. wskazówki jak dotrzeć..." type="text" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
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
                        <FormItem>
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
                            <FormLabel>Data rozpoczęcia<br/></FormLabel>
                            <FormControl>
                                <DatePicker selected={field.value} onChange={field.onChange} showTimeSelect
                                            dateFormat="dd.MM.yyyy hh:mm"/>
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
                                <DatePicker selected={field.value} onChange={field.onChange} showTimeSelect
                                            dateFormat="dd.MM.yyyy hh:mm"/>
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
