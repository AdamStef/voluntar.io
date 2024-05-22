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
import { RadioGroup } from '@radix-ui/react-radio-group';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { RadioGroupItem } from '../ui/radio-group';
import React, { HTMLProps } from 'react';
import { cn } from '@/lib/utils';
import { RegisterUserParams } from '@/utils/types/params';
import { Role } from '@/utils/types/types';
import { postRegisterUser } from '@/utils/api/api';
import { Spinner } from '../ui/Spinner';

const validationSchema = z
  .object({
    firstName: z.string({}),
    lastName: z.string(),
    phoneNumber: z.string(),
    email: z.string().email(),
    password: z.string().min(8),
    passwordConfirmation: z.string().min(8),
    gender: z.enum(['MALE', 'FEMALE']),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Passwords do not match',
    path: ['passwordConfirmation'],
  });

type RegisterFormSchema = z.infer<typeof validationSchema>;

type Props = {
  className?: HTMLProps<HTMLElement>['className'];
};

const RegisterVolunteerForm: React.FC<Props> = ({ className }) => {
  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      passwordConfirmation: '',
    },
  });
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormSchema) => {
    const req: RegisterUserParams = { ...data, role: Role.VOLUNTEER };
    console.log('Register user: ' + JSON.stringify(req));
    try {
      await postRegisterUser(req);
      navigate('/login');
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

        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Podaj hasło" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="passwordConfirmation"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Potwierdź hasło</FormLabel>
              <FormControl>
                <Input
                  placeholder="Podaj ponownie hasło"
                  type="password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
          name="role"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Choose account type:</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={Role.VOLUNTEER} />
                    </FormControl>
                    <FormLabel className="font-normal">Wolontariusz</FormLabel>
                  </FormItem>

                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value={Role.ORGANIZATION} />
                    </FormControl>
                    <FormLabel className="font-normal">Organizacja</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <FormField
          name="gender"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wybierz płeć:</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="MALE" />
                    </FormControl>
                    <FormLabel className="font-normal">Mężczyzna</FormLabel>
                  </FormItem>

                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="FEMALE" />
                    </FormControl>
                    <FormLabel className="font-normal">Kobieta</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          {isSubmitting && <Spinner className="mr-1 text-white" />}
          Register
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

export default RegisterVolunteerForm;
