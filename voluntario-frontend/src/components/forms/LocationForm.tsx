import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import Map from "@/components/forms/Map.tsx"
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
import { RegisterUserParams } from '@/utils/types/params';
import {EventLocationType, EventType, Role} from '@/utils/types/types';
import {postEvent, postLocation, postRegisterUser} from '@/utils/api/api';
import { Spinner } from '../ui/Spinner';
import {useMutation} from "@tanstack/react-query/build/modern";
import {MapContainer, TileLayer, Marker, Popup} from 'react-leaflet';
import { useMapEvents } from 'react-leaflet/hooks';
import 'leaflet/dist/leaflet.css';


const locationSchema = z.object(
    {

    }
)

const eventSchema = z
    .object({
        name: z.string(),
        postalCode: z.string(),
        city: z.string(),
        street: z.string(),
        number: z.string(),
        flatNumber: z.string(), // może być np. 2A więc lepiej string
        // todo: mapka
        latitude: z.number(),
        longitude: z.number(),
        additionalInformation: z.string()
    });

type LocationFormSchema = z.infer<typeof eventSchema>;

type Props = {
    className?: HTMLProps<HTMLElement>['className'];
};

function LocationMarker() {
    const [position, setPosition] = useState(null)
    const map = useMapEvents({
        click() {
            map.locate()
        },
        locationfound(e) {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
        },
    })

    return position === null ? null : (
        <Marker position={position}>
            <Popup>You are here</Popup>
        </Marker>
    )
}

const LocationForm: React.FC<Props> = ({ className }) => {

    const form = useForm<LocationFormSchema>({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            latitude: 0,
            longitude: 0,
        },
    });

    const navigate = useNavigate();

    const onSubmit = async (data: LocationFormSchema) => {
        console.log(data);

        const req: EventLocationType = { data };
        console.log('Add event: ' + JSON.stringify(req));
        try {
            await postLocation(req);
            navigate('/organizer');
        } catch (error) {
            console.error(error);
            form.setError('root.serverError', {
                type: 'manual',
                message: 'Something went wrong',
            });
        }
    };

    function MapClick() {
        const map = useMapEvents({
            click: () => {
                map.locate()
            },
            locationfound: (location) => {
                console.log('location found:', location)
            },
        })
        return null
    }

    const {
        formState: { errors, isSubmitting },
    } = form;

    // const [startDate, setStartDate] = useState(new Date());
    const [location, setLocation] = useState([0, 0]);
    // const [endDate, setEndDate] = useState(new Date());

    return (
        <Form {...form}>
            <form
                className={cn('mx-auto max-w-sm space-y-3', className)}
                onSubmit={form.handleSubmit(onSubmit)}
            >
                <FormField
                    name="locationName"
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
                    name="postalCode"
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
                    name="city"
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
                    name="street"
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
                    name="number"
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
                    name="flatNumber"
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
                    name="additionalInformation"
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
                            <MapClick />
                        </>
                    <LocationMarker/>
                </MapContainer>


                <Button className="w-40 col-span-2" type="submit">
                    {isSubmitting && <Spinner className="mr-1 text-white" />}
                    Zapisz lokalizację
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

export default LocationForm;
