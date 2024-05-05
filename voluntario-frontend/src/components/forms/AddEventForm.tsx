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
import { RegisterUserParams } from '@/utils/types/params';
import {EventType, Role} from '@/utils/types/types';
import {postEvent, postRegisterUser} from '@/utils/api/api';
import { Spinner } from '../ui/Spinner';
import {useMutation} from "@tanstack/react-query/build/modern";

const validationSchema = z
    .object({
        name: z.string(),
        description: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        // TODO: mapka a nie wspolrzedne xD
        numberOfVolunteersNeeded: z.number(),
        additionalInformation: z.string()
    });

type EventFormSchema = z.infer<typeof validationSchema>;

type Props = {
    className?: HTMLProps<HTMLElement>['className'];
};

const AddEventForm: React.FC<Props> = ({ className }) => {

    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const form = useForm<EventFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            name: '',
            description: '',
            startDate: new Date(),
            endDate: new Date(),
            // TODO: mapka a nie wspolrzedne xD
            latitude: 0,
            longitude: 0,
            numberOfVolunteersNeeded: 1
        },
    });

    const navigate = useNavigate();

    const onSubmit = async (data: EventFormSchema) => {
        const req: EventType = {...data};
        console.log('Add event: ' + JSON.stringify(req));
        try {
            await postEvent(req);
            navigate('/organizer');
        } catch (error) {
            console.error(error);
            form.setError('root.serverError', {
                type: 'manual',
                message: 'Something went wrong',
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
                                <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} />
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
                            <FormLabel>Data zakończenia<br/></FormLabel>
                            <FormControl>
                                <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} />
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
